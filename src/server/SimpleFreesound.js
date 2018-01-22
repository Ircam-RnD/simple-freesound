import http from 'http';
import https from 'https';
import path from 'path';
import fs from 'fs';

import FreesoundQuery from '../common/FreesoundQuery';

const cwd = process.cwd();

/**
 * @memberof module:server
 *
 * @class <b><h5>server.SimpleFreesound</h5></b>
 *
 * Server side class for use in <code>Node.js</code>, allowing to query detailed
 * info on sounds and download them from
 * <a href="http://freesound.org" target="_blank">freesound</a>.
 *
 * - members
 *     - [soundsInfo]{@link module:server.SimpleFreesound#soundsInfo}
 *     - [currentSoundsInfo]{@link module:server.SimpleFreesound#currentSoundsInfo}
 * - methods
 *     - [query]{@link module:server.SimpleFreesound#query}
 *     - [queryFromIds]{@link module:server.SimpleFreesound#queryFromIds}
 *     - [download]{@link module:server.SimpleFreesound#download}
 *     - [queryAndDownload]{@link module:server.SimpleFreesound#queryAndDownload}
 *     - [clear]{@link module:server.SimpleFreesound#clear}
 *     - [readFromFile]{@link module:server.SimpleFreesound#readFromFile}
 *     - [writeToFile]{@link module:server.SimpleFreesound#writeToFile}
 *
 * Powered by
 * <a href="http://freesound.org/docs/api/" target="_blank">freesound api</a>.
 *
 * @param {String} apiKey - Your api key, as generated from your freesound
 * developer account when creating a new application.
 *
 * @param {String} [destination='.'] - The relative path of a folder where to download files.
 *
 * @example
 * import SimpleFreesound from 'simple-freesound';
 *
 * const fs = new SimpleFreesound('myApiKey', './downloads');
 * fs.query({
 *   search: [ 'space', 'insect' ],
 *   duration: [ 1, 20 ],
 * })
 * .then(() => fs.download())
 * .then(() => {
 *   console.log(fs.currentSoundsInfo);
 * });
 */
class SimpleFreesound extends FreesoundQuery {
  /** @constructor */
  constructor(apiKey, destination = '.', publicPath = 'public') {
    super(apiKey);
    this.destination = destination;
    this.publicPath = publicPath;
  }

  /**
   * An object containing every detailed information obtained since
   * instantiation or last call to
   * [<code>clear()</code>]{@link module:server.SimpleFreesound#clear}.
   *
   * @property {Object} soundsInfo
   */
  get soundsInfo() {
    return this._mapToObject(this._soundsInfo);
  }

  set soundsInfo(si) {
    this._soundsInfo = this._objectToMap(si);
  }

  /**
   * An object containing the detailed information obtained from the last call to
   * [<code>query()</code>]{@link module:server.SimpleFreesound#query},
   * [<code>queryFromIds()</code>]{@link module:server.SimpleFreesound#queryFromIds},
   * [<code>download()</code>]{@link module:server.SimpleFreesound#download} or
   * [<code>queryAndDownload()</code>]{@link module:server.SimpleFreesound#queryAndDownload}.
   *
   * @property {Object} currentSoundsInfo
   */
  get currentSoundsInfo() {
    return this._mapToObject(this._currentSoundsInfo);
  }

  set currentSoundsInfo(csi) {
    this._currentSoundsInfo = this._objectToMap(csi);
  }

  /**
   * Get a list of sound ids with detailed information, that correspond to a set of query parameters.
   *
   * @param {Object} queryParams - The parameters used to build the query.
   * @param {Array.String} [queryParams.search] - The search terms that will be used to build the query.
   * @param {Array.String} [queryParams.username] - A list of usernames to search files from.
   * @param {Array} [queryParams.duration] - An array of size 2 : [ minDuration, maxDuration ] (in seconds).
   * If maxDuration is not a number, it will be interpreted as "*" (no maximum duration).
   *
   * @returns {Promise} A Promise object that resolves with the list of new sound ids if the query goes well.
   *
   * @throws {Error} An error if a problem occurs during the query.
   */
  query(queryParams) {
    return super.query(queryParams);
  }

  /**
   * Get detailed information of sounds from their ids.
   *
   * @param {Array.Number} ids - The ids of the sounds we want to get the detailed info of.
   *
   * @returns {Promise} A promise that will resolve with an array of the sound ids
   * the detailed info of which needed to be queried.
   *
   * @throws {Error} An error if a problem occurs during the query.
   */
  queryFromIds(ids) {
    return super.queryFromIds(ids);
  }

  /**
   * Download hq mp3 previews from their sound ids.
   *
   * @param {Array.Number} [ids=null] - The ids of the sounds to download.
   * If <code>null</code>, the ids from
   * [<code>currentSoundsInfo</code>]{@link module:server.SimpleFreesound#currentSoundsInfo}
   * will be used.
   *
   * @returns {Promise} A promise that will resolve if the downloads go well.
   *
   * @throws {Error} An error if a problem occurs during the downloads.
   */
  download(ids = null) {
    if (ids === null) {
      ids = Array.from(this._currentSoundsInfo.keys());
    }

    return this._downloadFilesFromUrls(ids);
  }

  /**
   * Download hq mp3 previews from queried sound information.
   *
   * @param {Object} queryParams - The parameters used to build the query.
   * @param {Array.String} [queryParams.search] - The search terms that will be used to build the query.
   * @param {Array.String} [queryParams.username] - A list of usernames to search files from.
   * @param {Array} [queryParams.duration] - An array of size 2 : [ minDuration, maxDuration ] (in seconds).
   * If maxDuration is not a number, it will be interpreted as "*" (no maximum duration).
   *
   * @param {String} [destination='.'] - The folder in which to save the downloaded files.
   *
   * @returns {Promise} A Promise object that resolves if the downloads go well.
   *
   * @throws {Error} An error if a problem occurs during the downloads.
   */
  queryAndDownload(queryParams) {
    return new Promise((resolve, reject) => {
      super.query(queryParams)
        .then(updatedIds => this._downloadFilesFromUrls(updatedIds))
        .then(updatedIds => resolve(updatedIds))
    });
  }

  /***
   * Cancel all unresolved yet promises (queries and downloads).
   */
  abort() {
    // TODO (no native way to cancel unresolved yet promises)
    // maybe using Promise.race() with a cancellable promise and
    // the result of Promise.all in a same Array / iterable ... ?
  }

  /** @private */
  _downloadFilesFromUrls(ids) {
    const promises = [];

    for (let i = 0; i < ids.length; i++) {
      promises.push(this._downloadFileFromUrl(ids[i]));
    }

    return Promise.all(promises);
  }

  /** @private */
  _downloadFileFromUrl(id) {
    return new Promise((resolve, reject) => {
      const dst = path.join(cwd, this.publicPath, this.destination, `${id}.mp3`)
      const file = fs.createWriteStream(dst);
      let url = this._soundsInfo.get(id).previews['preview-hq-mp3'];
      url = url.split(':');
      url[0] = 'https';
      url = url.join(':');

      const request = https.get(
        url,
        response => {
          response.pipe(file);

          file.on('finish', () => {
            const url = path.join(this.destination, `${id}.mp3`);
            this._soundsInfo.get(id).localUrl = url;
            this._currentSoundsInfo.get(id).localUrl = url;
            file.close();
            resolve();
          });

          file.on('error', err => {
            console.error(err);
            fs.unlink(dst);
            throw new Error(`Error downloading file ${id} : ${err}`);
          });
        }
      );
    });
  }

  /**
   * Clear the internal sound information lists.
   */
  clear() {
    this._soundsInfo = new Map();
    this._currentSoundsInfo = new Map();
  }

  /**
   * Retrieve sound information list from a JSON file.
   *
   * @param {String} filename - Url of the file to read.
   */
  readFromFile(filename) {
    var si = JSON.parse(fs.readFileSync(filename, 'utf-8'));

    if (si) {
      this._soundsInfo = new Map();

      for (let i in si) {
        this._soundsInfo.set(si[i]['id'], si[i]);
      }
    }
  }

  /**
   * Dump sound information list to a JSON file.
   *
   * @param {String} filename - Url of the file to dump the list of file information to.
   */
  writeToFile(filename) {
    fs.writeFileSync(
      filename,
      JSON.stringify(this._mapToObject(this._soundsInfo), null, 2),
      'utf-8'
    );
  }
};

export default SimpleFreesound;
