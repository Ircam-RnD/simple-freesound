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

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

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

var SimpleFreesound = function (_FreesoundQuery) {
  (0, _inherits3.default)(SimpleFreesound, _FreesoundQuery);

  /** @constructor */
  function SimpleFreesound(apiKey) {
    var destination = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';
    var publicPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'public';
    (0, _classCallCheck3.default)(this, SimpleFreesound);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SimpleFreesound.__proto__ || (0, _getPrototypeOf2.default)(SimpleFreesound)).call(this, apiKey));

    _this.destination = destination;
    _this.publicPath = publicPath;
    return _this;
  }

  /**
   * An object containing every detailed information obtained since
   * instantiation or last call to
   * [<code>clear()</code>]{@link module:server.SimpleFreesound#clear}.
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
     * If <code>null</code>, the ids from
     * [<code>currentSoundsInfo</code>]{@link module:server.SimpleFreesound#currentSoundsInfo}
     * will be used.
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

    /***
     * Cancel all unresolved yet promises (queries and downloads).
     */

  }, {
    key: 'abort',
    value: function abort() {}
    // TODO (no native way to cancel unresolved yet promises)
    // maybe using Promise.race() with a cancellable promise and
    // the result of Promise.all in a same Array / iterable ... ?


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
        var dst = _path2.default.join(cwd, _this3.publicPath, _this3.destination, id + '.mp3');
        var file = _fs2.default.createWriteStream(dst);
        var url = _this3._soundsInfo.get(id).previews['preview-hq-mp3'];
        url = url.split(':');
        url[0] = 'https';
        url = url.join(':');

        var request = _https2.default.get(url, function (response) {
          response.pipe(file);

          file.on('finish', function () {
            var url = _path2.default.join(_this3.destination, id + '.mp3');
            _this3._soundsInfo.get(id).localUrl = url;
            _this3._currentSoundsInfo.get(id).localUrl = url;
            file.close();
            resolve();
          });

          file.on('error', function (err) {
            console.error(err);
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
     * [<code>query()</code>]{@link module:server.SimpleFreesound#query},
     * [<code>queryFromIds()</code>]{@link module:server.SimpleFreesound#queryFromIds},
     * [<code>download()</code>]{@link module:server.SimpleFreesound#download} or
     * [<code>queryAndDownload()</code>]{@link module:server.SimpleFreesound#queryAndDownload}.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImN3ZCIsInByb2Nlc3MiLCJTaW1wbGVGcmVlc291bmQiLCJhcGlLZXkiLCJkZXN0aW5hdGlvbiIsInB1YmxpY1BhdGgiLCJxdWVyeVBhcmFtcyIsImlkcyIsIl9jdXJyZW50U291bmRzSW5mbyIsImtleXMiLCJfZG93bmxvYWRGaWxlc0Zyb21VcmxzIiwicmVzb2x2ZSIsInJlamVjdCIsInRoZW4iLCJ1cGRhdGVkSWRzIiwicHJvbWlzZXMiLCJpIiwibGVuZ3RoIiwicHVzaCIsIl9kb3dubG9hZEZpbGVGcm9tVXJsIiwiYWxsIiwiaWQiLCJkc3QiLCJqb2luIiwiZmlsZSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwidXJsIiwiX3NvdW5kc0luZm8iLCJnZXQiLCJwcmV2aWV3cyIsInNwbGl0IiwicmVxdWVzdCIsInJlc3BvbnNlIiwicGlwZSIsIm9uIiwibG9jYWxVcmwiLCJjbG9zZSIsImNvbnNvbGUiLCJlcnJvciIsImVyciIsInVubGluayIsIkVycm9yIiwiZmlsZW5hbWUiLCJzaSIsIkpTT04iLCJwYXJzZSIsInJlYWRGaWxlU3luYyIsInNldCIsIndyaXRlRmlsZVN5bmMiLCJfbWFwVG9PYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFFQSxJQUFNQSxNQUFNQyxRQUFRRCxHQUFSLEVBQVo7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwQ01FLGU7OztBQUNKO0FBQ0EsMkJBQVlDLE1BQVosRUFBOEQ7QUFBQSxRQUExQ0MsV0FBMEMsdUVBQTVCLEdBQTRCO0FBQUEsUUFBdkJDLFVBQXVCLHVFQUFWLFFBQVU7QUFBQTs7QUFBQSx3SkFDdERGLE1BRHNEOztBQUU1RCxVQUFLQyxXQUFMLEdBQW1CQSxXQUFuQjtBQUNBLFVBQUtD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Qk0sQ0FBUDtBQTZCRDs7QUFFRDs7Ozs7OzRCQUdRO0FBQ04sV0FBS1osV0FBTCxHQUFtQixtQkFBbkI7QUFDQSxXQUFLbkIsa0JBQUwsR0FBMEIsbUJBQTFCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O2lDQUtha0MsUSxFQUFVO0FBQ3JCLFVBQUlDLEtBQUtDLEtBQUtDLEtBQUwsQ0FBVyxhQUFHQyxZQUFILENBQWdCSixRQUFoQixFQUEwQixPQUExQixDQUFYLENBQVQ7O0FBRUEsVUFBSUMsRUFBSixFQUFRO0FBQ04sYUFBS2hCLFdBQUwsR0FBbUIsbUJBQW5COztBQUVBLGFBQUssSUFBSVgsQ0FBVCxJQUFjMkIsRUFBZDtBQUNFLGVBQUtoQixXQUFMLENBQWlCb0IsR0FBakIsQ0FBcUJKLEdBQUczQixDQUFILEVBQU0sSUFBTixDQUFyQixFQUFrQzJCLEdBQUczQixDQUFILENBQWxDO0FBREY7QUFFRDtBQUNGOztBQUVEOzs7Ozs7OztnQ0FLWTBCLFEsRUFBVTtBQUNwQixtQkFBR00sYUFBSCxDQUNFTixRQURGLEVBRUUseUJBQWUsS0FBS08sWUFBTCxDQUFrQixLQUFLdEIsV0FBdkIsQ0FBZixFQUFvRCxJQUFwRCxFQUEwRCxDQUExRCxDQUZGLEVBR0UsT0FIRjtBQUtEOzs7d0JBakxnQjtBQUNmLGFBQU8sS0FBS3NCLFlBQUwsQ0FBa0IsS0FBS3RCLFdBQXZCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7O3dCQVN3QjtBQUN0QixhQUFPLEtBQUtzQixZQUFMLENBQWtCLEtBQUt6QyxrQkFBdkIsQ0FBUDtBQUNEOzs7OztBQW1LRjs7a0JBRWNOLGUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBodHRwcyBmcm9tICdodHRwcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5cbmltcG9ydCBGcmVlc291bmRRdWVyeSBmcm9tICcuLi9jb21tb24vRnJlZXNvdW5kUXVlcnknO1xuXG5jb25zdCBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xuXG4vKipcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c2VydmVyXG4gKlxuICogQGNsYXNzIDxiPjxoNT5zZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kPC9oNT48L2I+XG4gKlxuICogU2VydmVyIHNpZGUgY2xhc3MgZm9yIHVzZSBpbiA8Y29kZT5Ob2RlLmpzPC9jb2RlPiwgYWxsb3dpbmcgdG8gcXVlcnkgZGV0YWlsZWRcbiAqIGluZm8gb24gc291bmRzIGFuZCBkb3dubG9hZCB0aGVtIGZyb21cbiAqIDxhIGhyZWY9XCJodHRwOi8vZnJlZXNvdW5kLm9yZ1wiIHRhcmdldD1cIl9ibGFua1wiPmZyZWVzb3VuZDwvYT4uXG4gKlxuICogLSBtZW1iZXJzXG4gKiAgICAgLSBbc291bmRzSW5mb117QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjc291bmRzSW5mb31cbiAqICAgICAtIFtjdXJyZW50U291bmRzSW5mb117QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjY3VycmVudFNvdW5kc0luZm99XG4gKiAtIG1ldGhvZHNcbiAqICAgICAtIFtxdWVyeV17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjcXVlcnl9XG4gKiAgICAgLSBbcXVlcnlGcm9tSWRzXXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNxdWVyeUZyb21JZHN9XG4gKiAgICAgLSBbZG93bmxvYWRde0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI2Rvd25sb2FkfVxuICogICAgIC0gW3F1ZXJ5QW5kRG93bmxvYWRde0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5QW5kRG93bmxvYWR9XG4gKiAgICAgLSBbY2xlYXJde0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI2NsZWFyfVxuICogICAgIC0gW3JlYWRGcm9tRmlsZV17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjcmVhZEZyb21GaWxlfVxuICogICAgIC0gW3dyaXRlVG9GaWxlXXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCN3cml0ZVRvRmlsZX1cbiAqXG4gKiBQb3dlcmVkIGJ5XG4gKiA8YSBocmVmPVwiaHR0cDovL2ZyZWVzb3VuZC5vcmcvZG9jcy9hcGkvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+ZnJlZXNvdW5kIGFwaTwvYT4uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFwaUtleSAtIFlvdXIgYXBpIGtleSwgYXMgZ2VuZXJhdGVkIGZyb20geW91ciBmcmVlc291bmRcbiAqIGRldmVsb3BlciBhY2NvdW50IHdoZW4gY3JlYXRpbmcgYSBuZXcgYXBwbGljYXRpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IFtkZXN0aW5hdGlvbj0nLiddIC0gVGhlIHJlbGF0aXZlIHBhdGggb2YgYSBmb2xkZXIgd2hlcmUgdG8gZG93bmxvYWQgZmlsZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCBTaW1wbGVGcmVlc291bmQgZnJvbSAnc2ltcGxlLWZyZWVzb3VuZCc7XG4gKlxuICogY29uc3QgZnMgPSBuZXcgU2ltcGxlRnJlZXNvdW5kKCdteUFwaUtleScsICcuL2Rvd25sb2FkcycpO1xuICogZnMucXVlcnkoe1xuICogICBzZWFyY2g6IFsgJ3NwYWNlJywgJ2luc2VjdCcgXSxcbiAqICAgZHVyYXRpb246IFsgMSwgMjAgXSxcbiAqIH0pXG4gKiAudGhlbigoKSA9PiBmcy5kb3dubG9hZCgpKVxuICogLnRoZW4oKCkgPT4ge1xuICogICBjb25zb2xlLmxvZyhmcy5jdXJyZW50U291bmRzSW5mbyk7XG4gKiB9KTtcbiAqL1xuY2xhc3MgU2ltcGxlRnJlZXNvdW5kIGV4dGVuZHMgRnJlZXNvdW5kUXVlcnkge1xuICAvKiogQGNvbnN0cnVjdG9yICovXG4gIGNvbnN0cnVjdG9yKGFwaUtleSwgZGVzdGluYXRpb24gPSAnLicsIHB1YmxpY1BhdGggPSAncHVibGljJykge1xuICAgIHN1cGVyKGFwaUtleSk7XG4gICAgdGhpcy5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAgIHRoaXMucHVibGljUGF0aCA9IHB1YmxpY1BhdGg7XG4gIH1cblxuICAvKipcbiAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgZXZlcnkgZGV0YWlsZWQgaW5mb3JtYXRpb24gb2J0YWluZWQgc2luY2VcbiAgICogaW5zdGFudGlhdGlvbiBvciBsYXN0IGNhbGwgdG9cbiAgICogWzxjb2RlPmNsZWFyKCk8L2NvZGU+XXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNjbGVhcn0uXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzb3VuZHNJbmZvXG4gICAqL1xuICBnZXQgc291bmRzSW5mbygpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwVG9PYmplY3QodGhpcy5fc291bmRzSW5mbyk7XG4gIH1cblxuICAvKipcbiAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGRldGFpbGVkIGluZm9ybWF0aW9uIG9idGFpbmVkIGZyb20gdGhlIGxhc3QgY2FsbCB0b1xuICAgKiBbPGNvZGU+cXVlcnkoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5fSxcbiAgICogWzxjb2RlPnF1ZXJ5RnJvbUlkcygpPC9jb2RlPl17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjcXVlcnlGcm9tSWRzfSxcbiAgICogWzxjb2RlPmRvd25sb2FkKCk8L2NvZGU+XXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNkb3dubG9hZH0gb3JcbiAgICogWzxjb2RlPnF1ZXJ5QW5kRG93bmxvYWQoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5QW5kRG93bmxvYWR9LlxuICAgKlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gY3VycmVudFNvdW5kc0luZm9cbiAgICovXG4gIGdldCBjdXJyZW50U291bmRzSW5mbygpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwVG9PYmplY3QodGhpcy5fY3VycmVudFNvdW5kc0luZm8pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGxpc3Qgb2Ygc291bmQgaWRzIHdpdGggZGV0YWlsZWQgaW5mb3JtYXRpb24sIHRoYXQgY29ycmVzcG9uZCB0byBhIHNldCBvZiBxdWVyeSBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlQYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy5zZWFyY2hdIC0gVGhlIHNlYXJjaCB0ZXJtcyB0aGF0IHdpbGwgYmUgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMudXNlcm5hbWVdIC0gQSBsaXN0IG9mIHVzZXJuYW1lcyB0byBzZWFyY2ggZmlsZXMgZnJvbS5cbiAgICogQHBhcmFtIHtBcnJheX0gW3F1ZXJ5UGFyYW1zLmR1cmF0aW9uXSAtIEFuIGFycmF5IG9mIHNpemUgMiA6IFsgbWluRHVyYXRpb24sIG1heER1cmF0aW9uIF0gKGluIHNlY29uZHMpLlxuICAgKiBJZiBtYXhEdXJhdGlvbiBpcyBub3QgYSBudW1iZXIsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgXCIqXCIgKG5vIG1heGltdW0gZHVyYXRpb24pLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBQcm9taXNlIG9iamVjdCB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGxpc3Qgb2YgbmV3IHNvdW5kIGlkcyBpZiB0aGUgcXVlcnkgZ29lcyB3ZWxsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIHF1ZXJ5LlxuICAgKi9cbiAgcXVlcnkocXVlcnlQYXJhbXMpIHtcbiAgICByZXR1cm4gc3VwZXIucXVlcnkocXVlcnlQYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBkZXRhaWxlZCBpbmZvcm1hdGlvbiBvZiBzb3VuZHMgZnJvbSB0aGVpciBpZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXkuTnVtYmVyfSBpZHMgLSBUaGUgaWRzIG9mIHRoZSBzb3VuZHMgd2Ugd2FudCB0byBnZXQgdGhlIGRldGFpbGVkIGluZm8gb2YuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCB3aWxsIHJlc29sdmUgd2l0aCBhbiBhcnJheSBvZiB0aGUgc291bmQgaWRzXG4gICAqIHRoZSBkZXRhaWxlZCBpbmZvIG9mIHdoaWNoIG5lZWRlZCB0byBiZSBxdWVyaWVkLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIHF1ZXJ5LlxuICAgKi9cbiAgcXVlcnlGcm9tSWRzKGlkcykge1xuICAgIHJldHVybiBzdXBlci5xdWVyeUZyb21JZHMoaWRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb3dubG9hZCBocSBtcDMgcHJldmlld3MgZnJvbSB0aGVpciBzb3VuZCBpZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXkuTnVtYmVyfSBbaWRzPW51bGxdIC0gVGhlIGlkcyBvZiB0aGUgc291bmRzIHRvIGRvd25sb2FkLlxuICAgKiBJZiA8Y29kZT5udWxsPC9jb2RlPiwgdGhlIGlkcyBmcm9tXG4gICAqIFs8Y29kZT5jdXJyZW50U291bmRzSW5mbzwvY29kZT5de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI2N1cnJlbnRTb3VuZHNJbmZvfVxuICAgKiB3aWxsIGJlIHVzZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCB3aWxsIHJlc29sdmUgaWYgdGhlIGRvd25sb2FkcyBnbyB3ZWxsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIGRvd25sb2Fkcy5cbiAgICovXG4gIGRvd25sb2FkKGlkcyA9IG51bGwpIHtcbiAgICBpZiAoaWRzID09PSBudWxsKVxuICAgICAgaWRzID0gQXJyYXkuZnJvbSh0aGlzLl9jdXJyZW50U291bmRzSW5mby5rZXlzKCkpO1xuXG4gICAgcmV0dXJuIHRoaXMuX2Rvd25sb2FkRmlsZXNGcm9tVXJscyhpZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvd25sb2FkIGhxIG1wMyBwcmV2aWV3cyBmcm9tIHF1ZXJpZWQgc291bmQgaW5mb3JtYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeVBhcmFtcyAtIFRoZSBwYXJhbWV0ZXJzIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnNlYXJjaF0gLSBUaGUgc2VhcmNoIHRlcm1zIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy51c2VybmFtZV0gLSBBIGxpc3Qgb2YgdXNlcm5hbWVzIHRvIHNlYXJjaCBmaWxlcyBmcm9tLlxuICAgKiBAcGFyYW0ge0FycmF5fSBbcXVlcnlQYXJhbXMuZHVyYXRpb25dIC0gQW4gYXJyYXkgb2Ygc2l6ZSAyIDogWyBtaW5EdXJhdGlvbiwgbWF4RHVyYXRpb24gXSAoaW4gc2Vjb25kcykuXG4gICAqIElmIG1heER1cmF0aW9uIGlzIG5vdCBhIG51bWJlciwgaXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBcIipcIiAobm8gbWF4aW11bSBkdXJhdGlvbikuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbZGVzdGluYXRpb249Jy4nXSAtIFRoZSBmb2xkZXIgaW4gd2hpY2ggdG8gc2F2ZSB0aGUgZG93bmxvYWRlZCBmaWxlcy5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgUHJvbWlzZSBvYmplY3QgdGhhdCByZXNvbHZlcyBpZiB0aGUgZG93bmxvYWRzIGdvIHdlbGwuXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbiBlcnJvciBpZiBhIHByb2JsZW0gb2NjdXJzIGR1cmluZyB0aGUgZG93bmxvYWRzLlxuICAgKi9cbiAgcXVlcnlBbmREb3dubG9hZChxdWVyeVBhcmFtcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzdXBlci5xdWVyeShxdWVyeVBhcmFtcylcbiAgICAgICAgLnRoZW4odXBkYXRlZElkcyA9PiB0aGlzLl9kb3dubG9hZEZpbGVzRnJvbVVybHModXBkYXRlZElkcykpXG4gICAgICAgIC50aGVuKHVwZGF0ZWRJZHMgPT4gcmVzb2x2ZSh1cGRhdGVkSWRzKSlcbiAgICB9KTtcbiAgfVxuXG4gIC8qKipcbiAgICogQ2FuY2VsIGFsbCB1bnJlc29sdmVkIHlldCBwcm9taXNlcyAocXVlcmllcyBhbmQgZG93bmxvYWRzKS5cbiAgICovXG4gIGFib3J0KCkge1xuICAgIC8vIFRPRE8gKG5vIG5hdGl2ZSB3YXkgdG8gY2FuY2VsIHVucmVzb2x2ZWQgeWV0IHByb21pc2VzKVxuICAgIC8vIG1heWJlIHVzaW5nIFByb21pc2UucmFjZSgpIHdpdGggYSBjYW5jZWxsYWJsZSBwcm9taXNlIGFuZFxuICAgIC8vIHRoZSByZXN1bHQgb2YgUHJvbWlzZS5hbGwgaW4gYSBzYW1lIEFycmF5IC8gaXRlcmFibGUgLi4uID9cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZG93bmxvYWRGaWxlc0Zyb21VcmxzKGlkcykge1xuICAgIGNvbnN0IHByb21pc2VzID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkcy5sZW5ndGg7IGkrKylcbiAgICAgIHByb21pc2VzLnB1c2godGhpcy5fZG93bmxvYWRGaWxlRnJvbVVybChpZHNbaV0pKTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2Rvd25sb2FkRmlsZUZyb21VcmwoaWQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgZHN0ID0gcGF0aC5qb2luKGN3ZCwgdGhpcy5wdWJsaWNQYXRoLCB0aGlzLmRlc3RpbmF0aW9uLCBgJHtpZH0ubXAzYClcbiAgICAgIGNvbnN0IGZpbGUgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShkc3QpO1xuICAgICAgbGV0IHVybCA9IHRoaXMuX3NvdW5kc0luZm8uZ2V0KGlkKS5wcmV2aWV3c1sncHJldmlldy1ocS1tcDMnXTtcbiAgICAgIHVybCA9IHVybC5zcGxpdCgnOicpO1xuICAgICAgdXJsWzBdID0gJ2h0dHBzJztcbiAgICAgIHVybCA9IHVybC5qb2luKCc6Jyk7XG5cbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBodHRwcy5nZXQoXG4gICAgICAgIHVybCxcbiAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgIHJlc3BvbnNlLnBpcGUoZmlsZSk7XG5cbiAgICAgICAgICBmaWxlLm9uKCdmaW5pc2gnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBwYXRoLmpvaW4odGhpcy5kZXN0aW5hdGlvbiwgYCR7aWR9Lm1wM2ApO1xuICAgICAgICAgICAgdGhpcy5fc291bmRzSW5mby5nZXQoaWQpLmxvY2FsVXJsID0gdXJsO1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8uZ2V0KGlkKS5sb2NhbFVybCA9IHVybDtcbiAgICAgICAgICAgIGZpbGUuY2xvc2UoKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGZpbGUub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIGZzLnVubGluayhkc3QpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciBkb3dubG9hZGluZyBmaWxlICR7aWR9IDogJHtlcnJ9YCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgdGhlIGludGVybmFsIHNvdW5kIGluZm9ybWF0aW9uIGxpc3RzLlxuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5fc291bmRzSW5mbyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mbyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBzb3VuZCBpbmZvcm1hdGlvbiBsaXN0IGZyb20gYSBKU09OIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZSAtIFVybCBvZiB0aGUgZmlsZSB0byByZWFkLlxuICAgKi9cbiAgcmVhZEZyb21GaWxlKGZpbGVuYW1lKSB7XG4gICAgdmFyIHNpID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGYtOCcpKTtcblxuICAgIGlmIChzaSkge1xuICAgICAgdGhpcy5fc291bmRzSW5mbyA9IG5ldyBNYXAoKTtcblxuICAgICAgZm9yIChsZXQgaSBpbiBzaSlcbiAgICAgICAgdGhpcy5fc291bmRzSW5mby5zZXQoc2lbaV1bJ2lkJ10sIHNpW2ldKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRHVtcCBzb3VuZCBpbmZvcm1hdGlvbiBsaXN0IHRvIGEgSlNPTiBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWUgLSBVcmwgb2YgdGhlIGZpbGUgdG8gZHVtcCB0aGUgbGlzdCBvZiBmaWxlIGluZm9ybWF0aW9uIHRvLlxuICAgKi9cbiAgd3JpdGVUb0ZpbGUoZmlsZW5hbWUpIHtcbiAgICBmcy53cml0ZUZpbGVTeW5jKFxuICAgICAgZmlsZW5hbWUsXG4gICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLl9tYXBUb09iamVjdCh0aGlzLl9zb3VuZHNJbmZvKSwgbnVsbCwgMiksXG4gICAgICAndXRmLTgnXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgU2ltcGxlRnJlZXNvdW5kO1xuIl19