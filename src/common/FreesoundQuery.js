import { universalXMLHttpRequest } from './util';

/**
 * Class performing generic queries from search terms, usernames and duration information.
 *
 * @param {String} apiKey - Your api key, as generated from your freesound
 * developer account when creating a new application.
 * @param {Boolean} [storeSoundsInfo=false] - Store all sounds detailed informations,
 * including preview urls, to optimize the number of queries to the API (can be memory consuming).
 */
class FreesoundQuery {
  constructor(apiKey, storeSoundsInfo = false) {
    this.apiKey = apiKey;
    this.storeSoundsInfo = storeSoundsInfo;

    this._soundsInfo = new Map();
    this._currentSoundsInfo = new Map();

    this._getDetailedInfoFromIds = this._getDetailedInfoFromIds.bind(this);
  }

  /**
   * @param {Object} queryParams - The parameters used to build the query.
   * @param {Array.String} [queryParams.search] - The search terms that will be used to build the query.
   * @param {Array.String} [queryParams.username] - A list of usernames to search files from.
   * @param {Array} [queryParams.duration] - An array of size 2 : [ minDuration, maxDuration ] (in seconds).
   * If maxDuration is not a number, it will be interpreted as "*" (no maximum duration).
   *
   * @returns {Promise} - A Promise object that will resolve with an array of the sound ids from the api's response to the query.
   *
   * @throws Will throw an error if a problem occurs during query.
   *
   * @todo
   * - add an option to change "page_size" default value (15)
   * - add an option to change "sort" default value ("score")
   * - add an option to filter using geotagging
   */
  query(queryParams) {
    return this._getSoundListFromParameters(queryParams)
      .then(updatedIds => {
        return this._getDetailedInfoFromIds(Array.from(this._currentSoundsInfo.keys()));
      });
  }

  /**
   * @param {Array.Number} ids - The sound ids we want to get the detailed info of.
   *
   * @returns {Promise} A promise that will resolve with an array of the sound ids
   * the detailed info of which needed to be queried.
   *
   * @throws Will throw an error if a problem occurs during query.
   */
  queryFromIds(ids) {
    return this._getDetailedInfoFromIds(ids);
  }

  /**
   * @private
   * @todo allow to choose between OR and AND to combine usernames in the query.
   */
  _getSoundListFromParameters(params, clear = true) {
    return new Promise((resolve, reject) => {
      if (clear) this._currentSoundsInfo.clear();

      let query = 'http://freesound.org/apiv2/search/text/?';
      const suffix = `&token=${this.apiKey}`;

      if (Object.keys(params).length > 0) {

        if (params.search && Array.isArray(params.search) && params.search.length > 0) {
          query += `query=\"${params.search[0]}\"`;

          for (let i = 1; i < params.search.length; i++)
            if (params.search[i] !== '')
              query += ` \"${params.search[i]}\"`;

          query += '&';
        }

        query += 'filter=';

        if (params.duration && Array.isArray(params.duration) && params.duration.length === 2 &&
            !isNaN(parseFloat(params.duration[0])) && isFinite(params.duration[0])) {
          const minDuration = params.duration[0] < 0 ? 0 : params.duration[0];
          query += `duration:[${minDuration} TO `;

          if (!isNaN(parseFloat(params.duration[1])) && isFinite(params.duration[1])) {
            const maxDuration = params.duration[1] > minDuration ? params.duration[1] : minDuration;
            query += `${maxDuration}] `;
          } else { // === '*'
            query += '*]';
          }
        }

        const options = {
          // search:   [ 'query',    'OR' ],
          users:    [ 'username', 'OR' ],
          packs:    [ 'pack',     'OR' ],
        };

        for (let l in options)
          if (params[l] && Array.isArray(params[l]) && params[l].length > 0) {
            query += `${options[l][0]}:(${params[l][0]}`;

            for (let i = 1; i < params[l].length; i++)
              if (params[l][i] !== '')
                query += ` ${options[l][1]} ${params[l][i]}`;

            query += ') ';
          }
      }

      query = query.trim();
      query += suffix;

      universalXMLHttpRequest(query)
        .then(response => {
            const res = response.results;

            for (let r in res) {
              // console.log(res[r]);
              this._currentSoundsInfo.set(res[r]['id'], res[r]);

              if (!this._soundsInfo.has(res[r]['id']))
                this._soundsInfo.set(res[r]['id'], res[r]);
            }

            resolve();
        })
    });
  }

  /** @private */
  _getDetailedInfoFromIds(ids) {
    if (!this.storeSoundsInfo) {
      this._soundsInfo.clear();
    }

    this._currentSoundsInfo.clear();
    const promises = [];

    ids.forEach(id => {
      const info = this._soundsInfo.get(id);

      if (!info.previews) // detailed information was not previously stored
        promises.push(this._getDetailedInfoFromId(id));
      else
        this._currentSoundsInfo.set(id, info);
    });

    return Promise.all(promises);
  }

  /** @private */
  _getDetailedInfoFromId(id) {
    return new Promise((resolve, reject) => {
      let query = `http://www.freesound.org/apiv2/sounds/${id}/?`;
      const suffix = `&token=${this.apiKey}`;
      query += suffix;

      universalXMLHttpRequest(query)
        .then(response => {
            this._soundsInfo.set(id, response);
            this._currentSoundsInfo.set(id, response);
            resolve(id);
        })
        //.catch(error => console.error(error.stack));
    });
  }

  /**
   * @private
   * Used by both child classes
   */
  _mapToObject(map) {
    const res = {};

    map.forEach((value, key) => {
      res[key] = value;
    });

    return res;
  }

  _objectToMap(obj) {
    const res = new Map();

    for (let key in obj) {
      res.set(key, obj[key]);
    }

    return res;
  }
};

export default FreesoundQuery;

