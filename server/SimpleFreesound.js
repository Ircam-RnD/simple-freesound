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
          console.log(response.statusCode);
          response.pipe(file);

          file.on('finish', function () {
            console.log('finished !');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImN3ZCIsInByb2Nlc3MiLCJTaW1wbGVGcmVlc291bmQiLCJhcGlLZXkiLCJkZXN0aW5hdGlvbiIsInB1YmxpY1BhdGgiLCJxdWVyeVBhcmFtcyIsImlkcyIsIl9jdXJyZW50U291bmRzSW5mbyIsImtleXMiLCJfZG93bmxvYWRGaWxlc0Zyb21VcmxzIiwicmVzb2x2ZSIsInJlamVjdCIsInRoZW4iLCJ1cGRhdGVkSWRzIiwicHJvbWlzZXMiLCJpIiwibGVuZ3RoIiwicHVzaCIsIl9kb3dubG9hZEZpbGVGcm9tVXJsIiwiYWxsIiwiaWQiLCJkc3QiLCJqb2luIiwiZmlsZSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwidXJsIiwiX3NvdW5kc0luZm8iLCJnZXQiLCJwcmV2aWV3cyIsInNwbGl0IiwicmVxdWVzdCIsImNvbnNvbGUiLCJsb2ciLCJyZXNwb25zZSIsInN0YXR1c0NvZGUiLCJwaXBlIiwib24iLCJsb2NhbFVybCIsImNsb3NlIiwiZXJyb3IiLCJlcnIiLCJ1bmxpbmsiLCJFcnJvciIsImZpbGVuYW1lIiwic2kiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJzZXQiLCJ3cml0ZUZpbGVTeW5jIiwiX21hcFRvT2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7O0FBRUEsSUFBTUEsTUFBTUMsUUFBUUQsR0FBUixFQUFaOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMENNRSxlOzs7QUFDSjtBQUNBLDJCQUFZQyxNQUFaLEVBQThEO0FBQUEsUUFBMUNDLFdBQTBDLHVFQUE1QixHQUE0QjtBQUFBLFFBQXZCQyxVQUF1Qix1RUFBVixRQUFVO0FBQUE7O0FBQUEsd0pBQ3RERixNQURzRDs7QUFFNUQsVUFBS0MsV0FBTCxHQUFt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QU0sSUFBSXFCLEtBQUosNkJBQW9DdEIsRUFBcEMsV0FBNENvQixHQUE1QyxDQUFOO0FBQ0QsV0FKRDtBQUtELFNBcEJhLENBQWhCO0FBc0JELE9BOUJNLENBQVA7QUErQkQ7O0FBRUQ7Ozs7Ozs0QkFHUTtBQUNOLFdBQUtkLFdBQUwsR0FBbUIsbUJBQW5CO0FBQ0EsV0FBS25CLGtCQUFMLEdBQTBCLG1CQUExQjtBQUNEOztBQUVEOzs7Ozs7OztpQ0FLYW9DLFEsRUFBVTtBQUNyQixVQUFJQyxLQUFLQyxLQUFLQyxLQUFMLENBQVcsYUFBR0MsWUFBSCxDQUFnQkosUUFBaEIsRUFBMEIsT0FBMUIsQ0FBWCxDQUFUOztBQUVBLFVBQUlDLEVBQUosRUFBUTtBQUNOLGFBQUtsQixXQUFMLEdBQW1CLG1CQUFuQjs7QUFFQSxhQUFLLElBQUlYLENBQVQsSUFBYzZCLEVBQWQ7QUFDRSxlQUFLbEIsV0FBTCxDQUFpQnNCLEdBQWpCLENBQXFCSixHQUFHN0IsQ0FBSCxFQUFNLElBQU4sQ0FBckIsRUFBa0M2QixHQUFHN0IsQ0FBSCxDQUFsQztBQURGO0FBRUQ7QUFDRjs7QUFFRDs7Ozs7Ozs7Z0NBS1k0QixRLEVBQVU7QUFDcEIsbUJBQUdNLGFBQUgsQ0FDRU4sUUFERixFQUVFLHlCQUFlLEtBQUtPLFlBQUwsQ0FBa0IsS0FBS3hCLFdBQXZCLENBQWYsRUFBb0QsSUFBcEQsRUFBMEQsQ0FBMUQsQ0FGRixFQUdFLE9BSEY7QUFLRDs7O3dCQW5MZ0I7QUFDZixhQUFPLEtBQUt3QixZQUFMLENBQWtCLEtBQUt4QixXQUF2QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozt3QkFTd0I7QUFDdEIsYUFBTyxLQUFLd0IsWUFBTCxDQUFrQixLQUFLM0Msa0JBQXZCLENBQVA7QUFDRDs7Ozs7QUFxS0Y7O2tCQUVjTixlIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgaHR0cHMgZnJvbSAnaHR0cHMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG5pbXBvcnQgRnJlZXNvdW5kUXVlcnkgZnJvbSAnLi4vY29tbW9uL0ZyZWVzb3VuZFF1ZXJ5JztcblxuY29uc3QgY3dkID0gcHJvY2Vzcy5jd2QoKTtcblxuLyoqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNlcnZlclxuICpcbiAqIEBjbGFzcyA8Yj48aDU+c2VydmVyLlNpbXBsZUZyZWVzb3VuZDwvaDU+PC9iPlxuICpcbiAqIFNlcnZlciBzaWRlIGNsYXNzIGZvciB1c2UgaW4gPGNvZGU+Tm9kZS5qczwvY29kZT4sIGFsbG93aW5nIHRvIHF1ZXJ5IGRldGFpbGVkXG4gKiBpbmZvIG9uIHNvdW5kcyBhbmQgZG93bmxvYWQgdGhlbSBmcm9tXG4gKiA8YSBocmVmPVwiaHR0cDovL2ZyZWVzb3VuZC5vcmdcIiB0YXJnZXQ9XCJfYmxhbmtcIj5mcmVlc291bmQ8L2E+LlxuICpcbiAqIC0gbWVtYmVyc1xuICogICAgIC0gW3NvdW5kc0luZm9de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3NvdW5kc0luZm99XG4gKiAgICAgLSBbY3VycmVudFNvdW5kc0luZm9de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI2N1cnJlbnRTb3VuZHNJbmZvfVxuICogLSBtZXRob2RzXG4gKiAgICAgLSBbcXVlcnlde0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5fVxuICogICAgIC0gW3F1ZXJ5RnJvbUlkc117QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjcXVlcnlGcm9tSWRzfVxuICogICAgIC0gW2Rvd25sb2FkXXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNkb3dubG9hZH1cbiAqICAgICAtIFtxdWVyeUFuZERvd25sb2FkXXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNxdWVyeUFuZERvd25sb2FkfVxuICogICAgIC0gW2NsZWFyXXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNjbGVhcn1cbiAqICAgICAtIFtyZWFkRnJvbUZpbGVde0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3JlYWRGcm9tRmlsZX1cbiAqICAgICAtIFt3cml0ZVRvRmlsZV17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjd3JpdGVUb0ZpbGV9XG4gKlxuICogUG93ZXJlZCBieVxuICogPGEgaHJlZj1cImh0dHA6Ly9mcmVlc291bmQub3JnL2RvY3MvYXBpL1wiIHRhcmdldD1cIl9ibGFua1wiPmZyZWVzb3VuZCBhcGk8L2E+LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcGlLZXkgLSBZb3VyIGFwaSBrZXksIGFzIGdlbmVyYXRlZCBmcm9tIHlvdXIgZnJlZXNvdW5kXG4gKiBkZXZlbG9wZXIgYWNjb3VudCB3aGVuIGNyZWF0aW5nIGEgbmV3IGFwcGxpY2F0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZGVzdGluYXRpb249Jy4nXSAtIFRoZSByZWxhdGl2ZSBwYXRoIG9mIGEgZm9sZGVyIHdoZXJlIHRvIGRvd25sb2FkIGZpbGVzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgU2ltcGxlRnJlZXNvdW5kIGZyb20gJ3NpbXBsZS1mcmVlc291bmQnO1xuICpcbiAqIGNvbnN0IGZzID0gbmV3IFNpbXBsZUZyZWVzb3VuZCgnbXlBcGlLZXknLCAnLi9kb3dubG9hZHMnKTtcbiAqIGZzLnF1ZXJ5KHtcbiAqICAgc2VhcmNoOiBbICdzcGFjZScsICdpbnNlY3QnIF0sXG4gKiAgIGR1cmF0aW9uOiBbIDEsIDIwIF0sXG4gKiB9KVxuICogLnRoZW4oKCkgPT4gZnMuZG93bmxvYWQoKSlcbiAqIC50aGVuKCgpID0+IHtcbiAqICAgY29uc29sZS5sb2coZnMuY3VycmVudFNvdW5kc0luZm8pO1xuICogfSk7XG4gKi9cbmNsYXNzIFNpbXBsZUZyZWVzb3VuZCBleHRlbmRzIEZyZWVzb3VuZFF1ZXJ5IHtcbiAgLyoqIEBjb25zdHJ1Y3RvciAqL1xuICBjb25zdHJ1Y3RvcihhcGlLZXksIGRlc3RpbmF0aW9uID0gJy4nLCBwdWJsaWNQYXRoID0gJ3B1YmxpYycpIHtcbiAgICBzdXBlcihhcGlLZXkpO1xuICAgIHRoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICB0aGlzLnB1YmxpY1BhdGggPSBwdWJsaWNQYXRoO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIGV2ZXJ5IGRldGFpbGVkIGluZm9ybWF0aW9uIG9idGFpbmVkIHNpbmNlXG4gICAqIGluc3RhbnRpYXRpb24gb3IgbGFzdCBjYWxsIHRvXG4gICAqIFs8Y29kZT5jbGVhcigpPC9jb2RlPl17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjY2xlYXJ9LlxuICAgKlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gc291bmRzSW5mb1xuICAgKi9cbiAgZ2V0IHNvdW5kc0luZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcFRvT2JqZWN0KHRoaXMuX3NvdW5kc0luZm8pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBkZXRhaWxlZCBpbmZvcm1hdGlvbiBvYnRhaW5lZCBmcm9tIHRoZSBsYXN0IGNhbGwgdG9cbiAgICogWzxjb2RlPnF1ZXJ5KCk8L2NvZGU+XXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNxdWVyeX0sXG4gICAqIFs8Y29kZT5xdWVyeUZyb21JZHMoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5RnJvbUlkc30sXG4gICAqIFs8Y29kZT5kb3dubG9hZCgpPC9jb2RlPl17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjZG93bmxvYWR9IG9yXG4gICAqIFs8Y29kZT5xdWVyeUFuZERvd25sb2FkKCk8L2NvZGU+XXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNxdWVyeUFuZERvd25sb2FkfS5cbiAgICpcbiAgICogQHByb3BlcnR5IHtPYmplY3R9IGN1cnJlbnRTb3VuZHNJbmZvXG4gICAqL1xuICBnZXQgY3VycmVudFNvdW5kc0luZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcFRvT2JqZWN0KHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBsaXN0IG9mIHNvdW5kIGlkcyB3aXRoIGRldGFpbGVkIGluZm9ybWF0aW9uLCB0aGF0IGNvcnJlc3BvbmQgdG8gYSBzZXQgb2YgcXVlcnkgcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5UGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMuc2VhcmNoXSAtIFRoZSBzZWFyY2ggdGVybXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnVzZXJuYW1lXSAtIEEgbGlzdCBvZiB1c2VybmFtZXMgdG8gc2VhcmNoIGZpbGVzIGZyb20uXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtxdWVyeVBhcmFtcy5kdXJhdGlvbl0gLSBBbiBhcnJheSBvZiBzaXplIDIgOiBbIG1pbkR1cmF0aW9uLCBtYXhEdXJhdGlvbiBdIChpbiBzZWNvbmRzKS5cbiAgICogSWYgbWF4RHVyYXRpb24gaXMgbm90IGEgbnVtYmVyLCBpdCB3aWxsIGJlIGludGVycHJldGVkIGFzIFwiKlwiIChubyBtYXhpbXVtIGR1cmF0aW9uKS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgUHJvbWlzZSBvYmplY3QgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBsaXN0IG9mIG5ldyBzb3VuZCBpZHMgaWYgdGhlIHF1ZXJ5IGdvZXMgd2VsbC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBxdWVyeS5cbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5UGFyYW1zKSB7XG4gICAgcmV0dXJuIHN1cGVyLnF1ZXJ5KHF1ZXJ5UGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgZGV0YWlsZWQgaW5mb3JtYXRpb24gb2Ygc291bmRzIGZyb20gdGhlaXIgaWRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5Lk51bWJlcn0gaWRzIC0gVGhlIGlkcyBvZiB0aGUgc291bmRzIHdlIHdhbnQgdG8gZ2V0IHRoZSBkZXRhaWxlZCBpbmZvIG9mLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIHdpdGggYW4gYXJyYXkgb2YgdGhlIHNvdW5kIGlkc1xuICAgKiB0aGUgZGV0YWlsZWQgaW5mbyBvZiB3aGljaCBuZWVkZWQgdG8gYmUgcXVlcmllZC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBxdWVyeS5cbiAgICovXG4gIHF1ZXJ5RnJvbUlkcyhpZHMpIHtcbiAgICByZXR1cm4gc3VwZXIucXVlcnlGcm9tSWRzKGlkcyk7XG4gIH1cblxuICAvKipcbiAgICogRG93bmxvYWQgaHEgbXAzIHByZXZpZXdzIGZyb20gdGhlaXIgc291bmQgaWRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5Lk51bWJlcn0gW2lkcz1udWxsXSAtIFRoZSBpZHMgb2YgdGhlIHNvdW5kcyB0byBkb3dubG9hZC5cbiAgICogSWYgPGNvZGU+bnVsbDwvY29kZT4sIHRoZSBpZHMgZnJvbVxuICAgKiBbPGNvZGU+Y3VycmVudFNvdW5kc0luZm88L2NvZGU+XXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNjdXJyZW50U291bmRzSW5mb31cbiAgICogd2lsbCBiZSB1c2VkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIGlmIHRoZSBkb3dubG9hZHMgZ28gd2VsbC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBkb3dubG9hZHMuXG4gICAqL1xuICBkb3dubG9hZChpZHMgPSBudWxsKSB7XG4gICAgaWYgKGlkcyA9PT0gbnVsbClcbiAgICAgIGlkcyA9IEFycmF5LmZyb20odGhpcy5fY3VycmVudFNvdW5kc0luZm8ua2V5cygpKTtcblxuICAgIHJldHVybiB0aGlzLl9kb3dubG9hZEZpbGVzRnJvbVVybHMoaWRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb3dubG9hZCBocSBtcDMgcHJldmlld3MgZnJvbSBxdWVyaWVkIHNvdW5kIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlQYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy5zZWFyY2hdIC0gVGhlIHNlYXJjaCB0ZXJtcyB0aGF0IHdpbGwgYmUgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMudXNlcm5hbWVdIC0gQSBsaXN0IG9mIHVzZXJuYW1lcyB0byBzZWFyY2ggZmlsZXMgZnJvbS5cbiAgICogQHBhcmFtIHtBcnJheX0gW3F1ZXJ5UGFyYW1zLmR1cmF0aW9uXSAtIEFuIGFycmF5IG9mIHNpemUgMiA6IFsgbWluRHVyYXRpb24sIG1heER1cmF0aW9uIF0gKGluIHNlY29uZHMpLlxuICAgKiBJZiBtYXhEdXJhdGlvbiBpcyBub3QgYSBudW1iZXIsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgXCIqXCIgKG5vIG1heGltdW0gZHVyYXRpb24pLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2Rlc3RpbmF0aW9uPScuJ10gLSBUaGUgZm9sZGVyIGluIHdoaWNoIHRvIHNhdmUgdGhlIGRvd25sb2FkZWQgZmlsZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIFByb21pc2Ugb2JqZWN0IHRoYXQgcmVzb2x2ZXMgaWYgdGhlIGRvd25sb2FkcyBnbyB3ZWxsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIGRvd25sb2Fkcy5cbiAgICovXG4gIHF1ZXJ5QW5kRG93bmxvYWQocXVlcnlQYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgc3VwZXIucXVlcnkocXVlcnlQYXJhbXMpXG4gICAgICAgIC50aGVuKHVwZGF0ZWRJZHMgPT4gdGhpcy5fZG93bmxvYWRGaWxlc0Zyb21VcmxzKHVwZGF0ZWRJZHMpKVxuICAgICAgICAudGhlbih1cGRhdGVkSWRzID0+IHJlc29sdmUodXBkYXRlZElkcykpXG4gICAgfSk7XG4gIH1cblxuICAvKioqXG4gICAqIENhbmNlbCBhbGwgdW5yZXNvbHZlZCB5ZXQgcHJvbWlzZXMgKHF1ZXJpZXMgYW5kIGRvd25sb2FkcykuXG4gICAqL1xuICBhYm9ydCgpIHtcbiAgICAvLyBUT0RPIChubyBuYXRpdmUgd2F5IHRvIGNhbmNlbCB1bnJlc29sdmVkIHlldCBwcm9taXNlcylcbiAgICAvLyBtYXliZSB1c2luZyBQcm9taXNlLnJhY2UoKSB3aXRoIGEgY2FuY2VsbGFibGUgcHJvbWlzZSBhbmRcbiAgICAvLyB0aGUgcmVzdWx0IG9mIFByb21pc2UuYWxsIGluIGEgc2FtZSBBcnJheSAvIGl0ZXJhYmxlIC4uLiA/XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2Rvd25sb2FkRmlsZXNGcm9tVXJscyhpZHMpIHtcbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpZHMubGVuZ3RoOyBpKyspXG4gICAgICBwcm9taXNlcy5wdXNoKHRoaXMuX2Rvd25sb2FkRmlsZUZyb21VcmwoaWRzW2ldKSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9kb3dubG9hZEZpbGVGcm9tVXJsKGlkKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGRzdCA9IHBhdGguam9pbihjd2QsIHRoaXMucHVibGljUGF0aCwgdGhpcy5kZXN0aW5hdGlvbiwgYCR7aWR9Lm1wM2ApXG4gICAgICBjb25zdCBmaWxlID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZHN0KTtcbiAgICAgIGxldCB1cmwgPSB0aGlzLl9zb3VuZHNJbmZvLmdldChpZCkucHJldmlld3NbJ3ByZXZpZXctaHEtbXAzJ107XG4gICAgICB1cmwgPSB1cmwuc3BsaXQoJzonKTtcbiAgICAgIHVybFswXSA9ICdodHRwcyc7XG4gICAgICB1cmwgPSB1cmwuam9pbignOicpO1xuXG4gICAgICBjb25zdCByZXF1ZXN0ID0gaHR0cHMuZ2V0KFxuICAgICAgICB1cmwsXG4gICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNDb2RlKTtcbiAgICAgICAgICByZXNwb25zZS5waXBlKGZpbGUpO1xuXG4gICAgICAgICAgZmlsZS5vbignZmluaXNoJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmlzaGVkICEnKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHBhdGguam9pbih0aGlzLmRlc3RpbmF0aW9uLCBgJHtpZH0ubXAzYCk7XG4gICAgICAgICAgICB0aGlzLl9zb3VuZHNJbmZvLmdldChpZCkubG9jYWxVcmwgPSB1cmw7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mby5nZXQoaWQpLmxvY2FsVXJsID0gdXJsO1xuICAgICAgICAgICAgZmlsZS5jbG9zZSgpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgZmlsZS5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgZnMudW5saW5rKGRzdCk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGRvd25sb2FkaW5nIGZpbGUgJHtpZH0gOiAke2Vycn1gKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciB0aGUgaW50ZXJuYWwgc291bmQgaW5mb3JtYXRpb24gbGlzdHMuXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9zb3VuZHNJbmZvID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHNvdW5kIGluZm9ybWF0aW9uIGxpc3QgZnJvbSBhIEpTT04gZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lIC0gVXJsIG9mIHRoZSBmaWxlIHRvIHJlYWQuXG4gICAqL1xuICByZWFkRnJvbUZpbGUoZmlsZW5hbWUpIHtcbiAgICB2YXIgc2kgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0Zi04JykpO1xuXG4gICAgaWYgKHNpKSB7XG4gICAgICB0aGlzLl9zb3VuZHNJbmZvID0gbmV3IE1hcCgpO1xuXG4gICAgICBmb3IgKGxldCBpIGluIHNpKVxuICAgICAgICB0aGlzLl9zb3VuZHNJbmZvLnNldChzaVtpXVsnaWQnXSwgc2lbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEdW1wIHNvdW5kIGluZm9ybWF0aW9uIGxpc3QgdG8gYSBKU09OIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZSAtIFVybCBvZiB0aGUgZmlsZSB0byBkdW1wIHRoZSBsaXN0IG9mIGZpbGUgaW5mb3JtYXRpb24gdG8uXG4gICAqL1xuICB3cml0ZVRvRmlsZShmaWxlbmFtZSkge1xuICAgIGZzLndyaXRlRmlsZVN5bmMoXG4gICAgICBmaWxlbmFtZSxcbiAgICAgIEpTT04uc3RyaW5naWZ5KHRoaXMuX21hcFRvT2JqZWN0KHRoaXMuX3NvdW5kc0luZm8pLCBudWxsLCAyKSxcbiAgICAgICd1dGYtOCdcbiAgICApO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBTaW1wbGVGcmVlc291bmQ7XG4iXX0=