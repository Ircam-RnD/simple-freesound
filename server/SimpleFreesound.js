'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _FreesoundQuery2 = require('../common/FreesoundQuery');

var _FreesoundQuery3 = _interopRequireDefault(_FreesoundQuery2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

/**
 * @memberof module:server
 *
 * @class
 *
 * Server side class for use in <code>Node.js</code>, allowing to query detailed
 * info on sounds and download them from
 * <a href="http://freesound.org" target="_blank">freesound</a>.
 * Every function call returns a Promise and updates its <code>soundsInfo</code>
 * and <code>currentSoundsInfo</code> variables.
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

var SimpleFreesound = function (_FreesoundQuery) {
  (0, _inherits3.default)(SimpleFreesound, _FreesoundQuery);

  function SimpleFreesound(apiKey) {
    var destination = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';
    (0, _classCallCheck3.default)(this, SimpleFreesound);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SimpleFreesound.__proto__ || (0, _getPrototypeOf2.default)(SimpleFreesound)).call(this, apiKey));

    _this.destination = destination;
    return _this;
  }

  /**
   * An object containing every detailed information obtained since instantiation
   * or last call to <code>clear()</code>.
   *
   * @property {Object} soundsInfo
   */


  (0, _createClass3.default)(SimpleFreesound, [{
    key: 'query',


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
    value: function query(queryParams) {
      return (0, _get3.default)(SimpleFreesound.prototype.__proto__ || (0, _getPrototypeOf2.default)(SimpleFreesound.prototype), 'query', this).call(this, queryParams);
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

  }, {
    key: 'queryFromIds',
    value: function queryFromIds(ids) {
      return (0, _get3.default)(SimpleFreesound.prototype.__proto__ || (0, _getPrototypeOf2.default)(SimpleFreesound.prototype), 'queryFromIds', this).call(this, ids);
    }

    /**
     * Download hq mp3 previews from their sound ids.
     *
     * @param {Array.Number} [ids=null] - The ids of the sounds to download.
     * If <code>null</code>, the ids from <code>currentSoundsInfo</code> will be used.
     *
     * @returns {Promise} A promise that will resolve if the downloads go well.
     *
     * @throws {Error} An error if a problem occurs during the downloads.
     */

  }, {
    key: 'download',
    value: function download() {
      var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (ids === null) ids = (0, _from2.default)(this._currentSoundsInfo.keys());

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

  }, {
    key: 'queryAndDownload',
    value: function queryAndDownload(queryParams) {
      var _this2 = this;

      return new _promise2.default(function (resolve, reject) {
        (0, _get3.default)(SimpleFreesound.prototype.__proto__ || (0, _getPrototypeOf2.default)(SimpleFreesound.prototype), 'query', _this2).call(_this2, queryParams).then(function (updatedIds) {
          return _this2._downloadFilesFromUrls(updatedIds);
        }).then(function (updatedIds) {
          return resolve(updatedIds);
        });
      });
    }

    /** @private */

  }, {
    key: '_downloadFilesFromUrls',
    value: function _downloadFilesFromUrls(ids) {
      var promises = [];

      for (var i = 0; i < ids.length; i++) {
        promises.push(this._downloadFileFromUrl(ids[i]));
      }return _promise2.default.all(promises);
    }

    /** @private */

  }, {
    key: '_downloadFileFromUrl',
    value: function _downloadFileFromUrl(id) {
      var _this3 = this;

      return new _promise2.default(function (resolve, reject) {
        var dst = _path2.default.join(cwd, _this3.destination, id + '.mp3');
        var file = _fs2.default.createWriteStream(dst);
        var request = _http2.default.get(_this3._soundsInfo.get(id)['previews']['preview-hq-mp3'], function (response) {
          response.pipe(file);

          file.on('finish', function () {
            file.close();
            resolve();
          });

          file.on('error', function (err) {
            _fs2.default.unlink(dst);
            throw new Error('Error downloading file ' + id + ' : ' + err);
          });
        });
      });
    }

    /**
     * Clear the internal sound information lists.
     */

  }, {
    key: 'clear',
    value: function clear() {
      this._soundsInfo = new _map2.default();
      this._currentSoundsInfo = new _map2.default();
    }

    /**
     * Retrieve sound information list from a JSON file.
     *
     * @param {String} filename - Url of the file to read.
     */

  }, {
    key: 'readFromFile',
    value: function readFromFile(filename) {
      var si = JSON.parse(_fs2.default.readFileSync(filename, 'utf-8'));

      if (si) {
        this._soundsInfo = new _map2.default();

        for (var i in si) {
          this._soundsInfo.set(si[i]['id'], si[i]);
        }
      }
    }

    /**
     * Dump sound information list to a JSON file.
     *
     * @param {String} filename - Url of the file to dump the list of file information to.
     */

  }, {
    key: 'writeToFile',
    value: function writeToFile(filename) {
      _fs2.default.writeFileSync(filename, (0, _stringify2.default)(this._mapToObject(this._soundsInfo), null, 2), 'utf-8');
    }
  }, {
    key: 'soundsInfo',
    get: function get() {
      return this._mapToObject(this._soundsInfo);
    }

    /**
     * An object containing the detailed information obtained from the last call to
     * <code>query()</code>, <code>queryFromIds()</code>, <code>download()</code>
     * or <code>queryAndDownload()</code>.
     *
     * @property {Object} currentSoundsInfo
     */

  }, {
    key: 'currentSoundsInfo',
    get: function get() {
      return this._mapToObject(this._currentSoundsInfo);
    }
  }]);
  return SimpleFreesound;
}(_FreesoundQuery3.default);

;

exports.default = SimpleFreesound;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImN3ZCIsInByb2Nlc3MiLCJTaW1wbGVGcmVlc291bmQiLCJhcGlLZXkiLCJkZXN0aW5hdGlvbiIsInF1ZXJ5UGFyYW1zIiwiaWRzIiwiX2N1cnJlbnRTb3VuZHNJbmZvIiwia2V5cyIsIl9kb3dubG9hZEZpbGVzRnJvbVVybHMiLCJyZXNvbHZlIiwicmVqZWN0IiwidGhlbiIsInVwZGF0ZWRJZHMiLCJwcm9taXNlcyIsImkiLCJsZW5ndGgiLCJwdXNoIiwiX2Rvd25sb2FkRmlsZUZyb21VcmwiLCJhbGwiLCJpZCIsImRzdCIsImpvaW4iLCJmaWxlIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJyZXF1ZXN0IiwiZ2V0IiwiX3NvdW5kc0luZm8iLCJyZXNwb25zZSIsInBpcGUiLCJvbiIsImNsb3NlIiwidW5saW5rIiwiRXJyb3IiLCJlcnIiLCJmaWxlbmFtZSIsInNpIiwiSlNPTiIsInBhcnNlIiwicmVhZEZpbGVTeW5jIiwic2V0Iiwid3JpdGVGaWxlU3luYyIsIl9tYXBUb09iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFFQSxJQUFNQSxNQUFNQyxRQUFRRCxHQUFSLEVBQVo7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWdDTUUsZTs7O0FBQ0osMkJBQVlDLE1BQVosRUFBdUM7QUFBQSxRQUFuQkMsV0FBbUIsdUVBQUwsR0FBSztBQUFBOztBQUFBLHdKQUMvQkQsTUFEK0I7O0FBRXJDLFVBQUtDLFdBQUwsR0FBbUJBLFdBQW5CO0FBRnFDO0FBR3RDOztBQUVEOzs7Ozs7Ozs7Ozs7QUFxQkE7Ozs7Ozs7Ozs7Ozs7MEJBYU1DLFcsRUFBYTtBQUNqQiwySkFBbUJBLFdBQW5CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7aUNBVWFDLEcsRUFBSztBQUNoQixrS0FBMEJB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QixLQUFLZixXQUF2QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7d0JBT3dCO0FBQ3RCLGFBQU8sS0FBS2UsWUFBTCxDQUFrQixLQUFLbkMsa0JBQXZCLENBQVA7QUFDRDs7Ozs7QUErSUY7O2tCQUVjTCxlIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5cbmltcG9ydCBGcmVlc291bmRRdWVyeSBmcm9tICcuLi9jb21tb24vRnJlZXNvdW5kUXVlcnknO1xuXG5jb25zdCBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xuXG4vKipcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c2VydmVyXG4gKlxuICogQGNsYXNzXG4gKlxuICogU2VydmVyIHNpZGUgY2xhc3MgZm9yIHVzZSBpbiA8Y29kZT5Ob2RlLmpzPC9jb2RlPiwgYWxsb3dpbmcgdG8gcXVlcnkgZGV0YWlsZWRcbiAqIGluZm8gb24gc291bmRzIGFuZCBkb3dubG9hZCB0aGVtIGZyb21cbiAqIDxhIGhyZWY9XCJodHRwOi8vZnJlZXNvdW5kLm9yZ1wiIHRhcmdldD1cIl9ibGFua1wiPmZyZWVzb3VuZDwvYT4uXG4gKiBFdmVyeSBmdW5jdGlvbiBjYWxsIHJldHVybnMgYSBQcm9taXNlIGFuZCB1cGRhdGVzIGl0cyA8Y29kZT5zb3VuZHNJbmZvPC9jb2RlPlxuICogYW5kIDxjb2RlPmN1cnJlbnRTb3VuZHNJbmZvPC9jb2RlPiB2YXJpYWJsZXMuXG4gKlxuICogUG93ZXJlZCBieVxuICogPGEgaHJlZj1cImh0dHA6Ly9mcmVlc291bmQub3JnL2RvY3MvYXBpL1wiIHRhcmdldD1cIl9ibGFua1wiPmZyZWVzb3VuZCBhcGk8L2E+LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcGlLZXkgLSBZb3VyIGFwaSBrZXksIGFzIGdlbmVyYXRlZCBmcm9tIHlvdXIgZnJlZXNvdW5kXG4gKiBkZXZlbG9wZXIgYWNjb3VudCB3aGVuIGNyZWF0aW5nIGEgbmV3IGFwcGxpY2F0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZGVzdGluYXRpb249Jy4nXSAtIFRoZSByZWxhdGl2ZSBwYXRoIG9mIGEgZm9sZGVyIHdoZXJlIHRvIGRvd25sb2FkIGZpbGVzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgU2ltcGxlRnJlZXNvdW5kIGZyb20gJ3NpbXBsZS1mcmVlc291bmQnO1xuICpcbiAqIGNvbnN0IGZzID0gbmV3IFNpbXBsZUZyZWVzb3VuZCgnbXlBcGlLZXknLCAnLi9kb3dubG9hZHMnKTtcbiAqIGZzLnF1ZXJ5KHtcbiAqICAgc2VhcmNoOiBbICdzcGFjZScsICdpbnNlY3QnIF0sXG4gKiAgIGR1cmF0aW9uOiBbIDEsIDIwIF0sXG4gKiB9KVxuICogLnRoZW4oKCkgPT4gZnMuZG93bmxvYWQoKSlcbiAqIC50aGVuKCgpID0+IHtcbiAqICAgY29uc29sZS5sb2coZnMuY3VycmVudFNvdW5kc0luZm8pO1xuICogfSk7XG4gKi9cbmNsYXNzIFNpbXBsZUZyZWVzb3VuZCBleHRlbmRzIEZyZWVzb3VuZFF1ZXJ5IHtcbiAgY29uc3RydWN0b3IoYXBpS2V5LCBkZXN0aW5hdGlvbiA9ICcuJykge1xuICAgIHN1cGVyKGFwaUtleSk7XG4gICAgdGhpcy5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIGV2ZXJ5IGRldGFpbGVkIGluZm9ybWF0aW9uIG9idGFpbmVkIHNpbmNlIGluc3RhbnRpYXRpb25cbiAgICogb3IgbGFzdCBjYWxsIHRvIDxjb2RlPmNsZWFyKCk8L2NvZGU+LlxuICAgKlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gc291bmRzSW5mb1xuICAgKi9cbiAgZ2V0IHNvdW5kc0luZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcFRvT2JqZWN0KHRoaXMuX3NvdW5kc0luZm8pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBkZXRhaWxlZCBpbmZvcm1hdGlvbiBvYnRhaW5lZCBmcm9tIHRoZSBsYXN0IGNhbGwgdG9cbiAgICogPGNvZGU+cXVlcnkoKTwvY29kZT4sIDxjb2RlPnF1ZXJ5RnJvbUlkcygpPC9jb2RlPiwgPGNvZGU+ZG93bmxvYWQoKTwvY29kZT5cbiAgICogb3IgPGNvZGU+cXVlcnlBbmREb3dubG9hZCgpPC9jb2RlPi5cbiAgICpcbiAgICogQHByb3BlcnR5IHtPYmplY3R9IGN1cnJlbnRTb3VuZHNJbmZvXG4gICAqL1xuICBnZXQgY3VycmVudFNvdW5kc0luZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcFRvT2JqZWN0KHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBsaXN0IG9mIHNvdW5kIGlkcyB3aXRoIGRldGFpbGVkIGluZm9ybWF0aW9uLCB0aGF0IGNvcnJlc3BvbmQgdG8gYSBzZXQgb2YgcXVlcnkgcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5UGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMuc2VhcmNoXSAtIFRoZSBzZWFyY2ggdGVybXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnVzZXJuYW1lXSAtIEEgbGlzdCBvZiB1c2VybmFtZXMgdG8gc2VhcmNoIGZpbGVzIGZyb20uXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtxdWVyeVBhcmFtcy5kdXJhdGlvbl0gLSBBbiBhcnJheSBvZiBzaXplIDIgOiBbIG1pbkR1cmF0aW9uLCBtYXhEdXJhdGlvbiBdIChpbiBzZWNvbmRzKS5cbiAgICogSWYgbWF4RHVyYXRpb24gaXMgbm90IGEgbnVtYmVyLCBpdCB3aWxsIGJlIGludGVycHJldGVkIGFzIFwiKlwiIChubyBtYXhpbXVtIGR1cmF0aW9uKS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgUHJvbWlzZSBvYmplY3QgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBsaXN0IG9mIG5ldyBzb3VuZCBpZHMgaWYgdGhlIHF1ZXJ5IGdvZXMgd2VsbC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBxdWVyeS5cbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5UGFyYW1zKSB7XG4gICAgcmV0dXJuIHN1cGVyLnF1ZXJ5KHF1ZXJ5UGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgZGV0YWlsZWQgaW5mb3JtYXRpb24gb2Ygc291bmRzIGZyb20gdGhlaXIgaWRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5Lk51bWJlcn0gaWRzIC0gVGhlIGlkcyBvZiB0aGUgc291bmRzIHdlIHdhbnQgdG8gZ2V0IHRoZSBkZXRhaWxlZCBpbmZvIG9mLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIHdpdGggYW4gYXJyYXkgb2YgdGhlIHNvdW5kIGlkc1xuICAgKiB0aGUgZGV0YWlsZWQgaW5mbyBvZiB3aGljaCBuZWVkZWQgdG8gYmUgcXVlcmllZC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBxdWVyeS5cbiAgICovXG4gIHF1ZXJ5RnJvbUlkcyhpZHMpIHtcbiAgICByZXR1cm4gc3VwZXIucXVlcnlGcm9tSWRzKGlkcyk7XG4gIH1cblxuICAvKipcbiAgICogRG93bmxvYWQgaHEgbXAzIHByZXZpZXdzIGZyb20gdGhlaXIgc291bmQgaWRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5Lk51bWJlcn0gW2lkcz1udWxsXSAtIFRoZSBpZHMgb2YgdGhlIHNvdW5kcyB0byBkb3dubG9hZC5cbiAgICogSWYgPGNvZGU+bnVsbDwvY29kZT4sIHRoZSBpZHMgZnJvbSA8Y29kZT5jdXJyZW50U291bmRzSW5mbzwvY29kZT4gd2lsbCBiZSB1c2VkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIGlmIHRoZSBkb3dubG9hZHMgZ28gd2VsbC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBkb3dubG9hZHMuXG4gICAqL1xuICBkb3dubG9hZChpZHMgPSBudWxsKSB7XG4gICAgaWYgKGlkcyA9PT0gbnVsbClcbiAgICAgIGlkcyA9IEFycmF5LmZyb20odGhpcy5fY3VycmVudFNvdW5kc0luZm8ua2V5cygpKTtcblxuICAgIHJldHVybiB0aGlzLl9kb3dubG9hZEZpbGVzRnJvbVVybHMoaWRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb3dubG9hZCBocSBtcDMgcHJldmlld3MgZnJvbSBxdWVyaWVkIHNvdW5kIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlQYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy5zZWFyY2hdIC0gVGhlIHNlYXJjaCB0ZXJtcyB0aGF0IHdpbGwgYmUgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMudXNlcm5hbWVdIC0gQSBsaXN0IG9mIHVzZXJuYW1lcyB0byBzZWFyY2ggZmlsZXMgZnJvbS5cbiAgICogQHBhcmFtIHtBcnJheX0gW3F1ZXJ5UGFyYW1zLmR1cmF0aW9uXSAtIEFuIGFycmF5IG9mIHNpemUgMiA6IFsgbWluRHVyYXRpb24sIG1heER1cmF0aW9uIF0gKGluIHNlY29uZHMpLlxuICAgKiBJZiBtYXhEdXJhdGlvbiBpcyBub3QgYSBudW1iZXIsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgXCIqXCIgKG5vIG1heGltdW0gZHVyYXRpb24pLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2Rlc3RpbmF0aW9uPScuJ10gLSBUaGUgZm9sZGVyIGluIHdoaWNoIHRvIHNhdmUgdGhlIGRvd25sb2FkZWQgZmlsZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIFByb21pc2Ugb2JqZWN0IHRoYXQgcmVzb2x2ZXMgaWYgdGhlIGRvd25sb2FkcyBnbyB3ZWxsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIGRvd25sb2Fkcy5cbiAgICovXG4gIHF1ZXJ5QW5kRG93bmxvYWQocXVlcnlQYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgc3VwZXIucXVlcnkocXVlcnlQYXJhbXMpXG4gICAgICAgIC50aGVuKHVwZGF0ZWRJZHMgPT4gdGhpcy5fZG93bmxvYWRGaWxlc0Zyb21VcmxzKHVwZGF0ZWRJZHMpKVxuICAgICAgICAudGhlbih1cGRhdGVkSWRzID0+IHJlc29sdmUodXBkYXRlZElkcykpXG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2Rvd25sb2FkRmlsZXNGcm9tVXJscyhpZHMpIHtcbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpZHMubGVuZ3RoOyBpKyspXG4gICAgICBwcm9taXNlcy5wdXNoKHRoaXMuX2Rvd25sb2FkRmlsZUZyb21VcmwoaWRzW2ldKSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9kb3dubG9hZEZpbGVGcm9tVXJsKGlkKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGRzdCA9IHBhdGguam9pbihjd2QsIHRoaXMuZGVzdGluYXRpb24sIGAke2lkfS5tcDNgKVxuICAgICAgY29uc3QgZmlsZSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGRzdCk7XG4gICAgICBjb25zdCByZXF1ZXN0ID0gaHR0cC5nZXQoXG4gICAgICAgIHRoaXMuX3NvdW5kc0luZm8uZ2V0KGlkKVsncHJldmlld3MnXVsncHJldmlldy1ocS1tcDMnXSxcbiAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgIHJlc3BvbnNlLnBpcGUoZmlsZSk7XG5cbiAgICAgICAgICBmaWxlLm9uKCdmaW5pc2gnLCAoKSA9PiB7XG4gICAgICAgICAgICBmaWxlLmNsb3NlKCk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBmaWxlLm9uKCdlcnJvcicsIGVyciA9PiB7XG4gICAgICAgICAgICBmcy51bmxpbmsoZHN0KTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgZG93bmxvYWRpbmcgZmlsZSAke2lkfSA6ICR7ZXJyfWApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIHRoZSBpbnRlcm5hbCBzb3VuZCBpbmZvcm1hdGlvbiBsaXN0cy5cbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX3NvdW5kc0luZm8gPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8gPSBuZXcgTWFwKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgc291bmQgaW5mb3JtYXRpb24gbGlzdCBmcm9tIGEgSlNPTiBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWUgLSBVcmwgb2YgdGhlIGZpbGUgdG8gcmVhZC5cbiAgICovXG4gIHJlYWRGcm9tRmlsZShmaWxlbmFtZSkge1xuICAgIHZhciBzaSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmLTgnKSk7XG5cbiAgICBpZiAoc2kpIHtcbiAgICAgIHRoaXMuX3NvdW5kc0luZm8gPSBuZXcgTWFwKCk7XG5cbiAgICAgIGZvciAobGV0IGkgaW4gc2kpXG4gICAgICAgIHRoaXMuX3NvdW5kc0luZm8uc2V0KHNpW2ldWydpZCddLCBzaVtpXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIER1bXAgc291bmQgaW5mb3JtYXRpb24gbGlzdCB0byBhIEpTT04gZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lIC0gVXJsIG9mIHRoZSBmaWxlIHRvIGR1bXAgdGhlIGxpc3Qgb2YgZmlsZSBpbmZvcm1hdGlvbiB0by5cbiAgICovXG4gIHdyaXRlVG9GaWxlKGZpbGVuYW1lKSB7XG4gICAgZnMud3JpdGVGaWxlU3luYyhcbiAgICAgIGZpbGVuYW1lLFxuICAgICAgSlNPTi5zdHJpbmdpZnkodGhpcy5fbWFwVG9PYmplY3QodGhpcy5fc291bmRzSW5mbyksIG51bGwsIDIpLFxuICAgICAgJ3V0Zi04J1xuICAgICk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNpbXBsZUZyZWVzb3VuZDtcbiJdfQ==