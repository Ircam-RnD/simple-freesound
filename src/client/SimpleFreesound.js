import * as loaders from 'waves-loaders';
import FreesoundQuery from '../common/FreesoundQuery';

const loader = new loaders.AudioBufferLoader();

/**
 * @memberof module:client
 *
 * @class <b><h5>client.SimpleFreesound</h5></b>
 *
 * Client side class allowing to query detailed info on sounds and download them
 * from <a href="http://freesound.org" target="_blank">freesound</a>.
 *
 * - members
 *     - [soundsInfo]{@link module:client.SimpleFreesound#soundsInfo}
 *     - [currentSoundsInfo]{@link module:client.SimpleFreesound#currentSoundsInfo}
 *     - [buffers]{@link module:client.SimpleFreesound#buffers}
 * - methods
 *     - [query]{@link module:client.SimpleFreesound#query}
 *     - [queryFromIds]{@link module:client.SimpleFreesound#queryFromIds}
 *     - [download]{@link module:client.SimpleFreesound#download}
 *     - [queryAndDownload]{@link module:client.SimpleFreesound#queryAndDownload}
 *     - [clear]{@link module:client.SimpleFreesound#clear}
 *
 * Powered by
 * <a href="http://freesound.org/docs/api/" target="_blank">freesound api</a>.
 *
 * @param {String} apiKey - Your api key, as generated from your freesound
 * developer account when creating a new application.
 *
 * @example
 * <script type="text/javascript" src="simple-freesound.min.js"></script>
 *
 * <script type="text/javascript">
 *   var apiKey = "your_freesound_api_key_goes_here";
 *   var sf = new simpleFreesound.SimpleFreesound(apiKey);
 *
 *   sf.query({
 *     search: [ 'drum', 'bass' ],
 *     duration: [ 0.01, 1 ]
 *   });
 * </script>
 */
class SimpleFreesound extends FreesoundQuery {
  constructor(apiKey) {
    super(apiKey);
    this._buffers =[];
  }

  /**
   * An object containing every detailed information obtained since
   * instantiation or last call to
   * [<code>clear()</code>]{@link module:client.SimpleFreesound#clear}.
   *
   * @property {Object} soundsInfo
   */
  get soundsInfo() {
    return this._mapToObject(this._soundsInfo);
  }

  /**
   * An object containing the detailed information obtained from the last call to
   * [<code>query()</code>]{@link module:client.SimpleFreesound#query},
   * [<code>queryFromIds()</code>]{@link module:client.SimpleFreesound#queryFromIds},
   * [<code>download()</code>]{@link module:client.SimpleFreesound#download} or
   * [<code>queryAndDownload()</code>]{@link module:client.SimpleFreesound#queryAndDownload}.
   *
   * @property {Object} currentSoundsInfo
   */
  get currentSoundsInfo() {
    return this._mapToObject(this._currentSoundsInfo);
  }

  /**
   * Array of the buffers stored internally on download success, after call to
   * [<code>download()</code>]{@link module:client.SimpleFreesound#download} or
   * [<code>queryAndDownload()</code>]{@link module:client.SimpleFreesound#queryAndDownload}.
   *
   * @property {Array.AudioBuffer} buffers
   */
  get buffers() {
    return this._buffers;
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
   * [<code>currentSoundsInfo</code>]{@link module:client.SimpleFreesound#currentSoundsInfo}
   * will be used.
   *
   * @returns {Promise} A promise that will resolve if the downloads go well.
   *
   * @throws {Error} An error if a problem occurs during the downloads.
   */
  download(ids = null) {
    if (ids === null)
      ids = Array.from(this._currentSoundsInfo.keys());

    return this._downloadFilesFromUrls(ids);
  }

  /**
   * Download sounds hq mp3 previews from queried sound information.
   *
   * @param {Object} queryParams - The parameters used to build the query.
   * @param {Array.String} [queryParams.search] - The search terms that will be used to build the query.
   * @param {Array.String} [queryParams.username] - A list of usernames to search files from.
   * @param {Array} [queryParams.duration] - An array of size 2 : [ minDuration, maxDuration ] (in seconds).
   * If maxDuration is not a number, it will be interpreted as "*" (no maximum duration).
   *
   * @param {String} [destination='.'] - The folder in which to save the downloaded files.
   *
   * @returns {Promise} A Promise object that resolves with an array of the
   * downloaded <code>AndioBufferif</code>s the downloading go well.
   *
   * @throws {Error} An error if a problem occurs during the downloads.
   */
  queryAndDownload(queryParams) {
    return new Promise((resolve, reject) => {
      super.query(queryParams)
        .then(updatedIds => {
          const ids = Array.from(this._currentSoundsInfo.keys());
          this._downloadFilesFromUrls(ids);
        })
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
    return new Promise((resolve, reject) => {
      const urls = [];

      for (let i = 0; i < ids.length; i++) {
        let url = this._currentSoundsInfo.get(ids[i])['previews']['preview-hq-mp3'];
        url = url.split(':');//.splice(1);
        url[0] = 'https';
        url = url.join(':');

        urls.push(url);
      }

      loader.load(urls)
        .then(buffers => {
          this._buffers = buffers;

          for (let i = 0; i < ids.length; i++) {
            const soundInfo = this._currentSoundsInfo.get(ids[i]);
            soundInfo['buffer'] = buffers[i];
            this._currentSoundsInfo.set(ids[i], soundInfo);
          }

          resolve(this._buffers);
        });
    });
  }

  /**
   * Clear the internal sound information lists.
   */
  clear() {
    this._soundsInfo = new Map();
    this._currentSoundsInfo = new Map();
  }
};

export default SimpleFreesound;
