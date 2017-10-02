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
 * @class <b><h5>server.SimpleFreesound</h5></b>
 *
 * Server side class for use in <code>Node.js</code>, allowing to query detailed
 * info on sounds and download them from
 * <a href="http://freesound.org" target="_blank">freesound</a>.
 *
 * <!--
 * - [constructor]{@link module:server.SimpleFreesound}
 * -->
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
    (0, _classCallCheck3.default)(this, SimpleFreesound);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SimpleFreesound.__proto__ || (0, _getPrototypeOf2.default)(SimpleFreesound)).call(this, apiKey));

    _this.destination = destination;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImN3ZCIsInByb2Nlc3MiLCJTaW1wbGVGcmVlc291bmQiLCJhcGlLZXkiLCJkZXN0aW5hdGlvbiIsInF1ZXJ5UGFyYW1zIiwiaWRzIiwiX2N1cnJlbnRTb3VuZHNJbmZvIiwia2V5cyIsIl9kb3dubG9hZEZpbGVzRnJvbVVybHMiLCJyZXNvbHZlIiwicmVqZWN0IiwidGhlbiIsInVwZGF0ZWRJZHMiLCJwcm9taXNlcyIsImkiLCJsZW5ndGgiLCJwdXNoIiwiX2Rvd25sb2FkRmlsZUZyb21VcmwiLCJhbGwiLCJpZCIsImRzdCIsImpvaW4iLCJmaWxlIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJyZXF1ZXN0IiwiZ2V0IiwiX3NvdW5kc0luZm8iLCJyZXNwb25zZSIsInBpcGUiLCJvbiIsImNsb3NlIiwidW5saW5rIiwiRXJyb3IiLCJlcnIiLCJmaWxlbmFtZSIsInNpIiwiSlNPTiIsInBhcnNlIiwicmVhZEZpbGVTeW5jIiwic2V0Iiwid3JpdGVGaWxlU3luYyIsIl9tYXBUb09iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFFQSxJQUFNQSxNQUFNQyxRQUFRRCxHQUFSLEVBQVo7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE2Q01FLGU7OztBQUNKO0FBQ0EsMkJBQVlDLE1BQVosRUFBdUM7QUFBQSxRQUFuQkMsV0FBbUIsdUVBQUwsR0FBSztBQUFBOztBQUFBLHdKQUMvQkQsTUFEK0I7O0FBRXJDLFVBQUtDLFdBQUwsR0FBbUJBLFdBQW5CO0FBRnFDO0FBR3RDOztBQUVEOzs7Ozs7Ozs7Ozs7O0FBd0JBOzs7Ozs7Ozs7Ozs7OzBCQWFNQyxXLEVBQWE7QUFDakIsMkpBQW1CQSxXQUFuQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7O2lDQVVhQyxH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LGFBQU8sS0FBS2UsWUFBTCxDQUFrQixLQUFLZixXQUF2QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozt3QkFTd0I7QUFDdEIsYUFBTyxLQUFLZSxZQUFMLENBQWtCLEtBQUtuQyxrQkFBdkIsQ0FBUDtBQUNEOzs7OztBQWlKRjs7a0JBRWNMLGUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuaW1wb3J0IEZyZWVzb3VuZFF1ZXJ5IGZyb20gJy4uL2NvbW1vbi9GcmVlc291bmRRdWVyeSc7XG5cbmNvbnN0IGN3ZCA9IHByb2Nlc3MuY3dkKCk7XG5cbi8qKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzZXJ2ZXJcbiAqXG4gKiBAY2xhc3MgPGI+PGg1PnNlcnZlci5TaW1wbGVGcmVlc291bmQ8L2g1PjwvYj5cbiAqXG4gKiBTZXJ2ZXIgc2lkZSBjbGFzcyBmb3IgdXNlIGluIDxjb2RlPk5vZGUuanM8L2NvZGU+LCBhbGxvd2luZyB0byBxdWVyeSBkZXRhaWxlZFxuICogaW5mbyBvbiBzb3VuZHMgYW5kIGRvd25sb2FkIHRoZW0gZnJvbVxuICogPGEgaHJlZj1cImh0dHA6Ly9mcmVlc291bmQub3JnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+ZnJlZXNvdW5kPC9hPi5cbiAqXG4gKiA8IS0tXG4gKiAtIFtjb25zdHJ1Y3Rvcl17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmR9XG4gKiAtLT5cbiAqIC0gbWVtYmVyc1xuICogICAgIC0gW3NvdW5kc0luZm9de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3NvdW5kc0luZm99XG4gKiAgICAgLSBbY3VycmVudFNvdW5kc0luZm9de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI2N1cnJlbnRTb3VuZHNJbmZvfVxuICogLSBtZXRob2RzXG4gKiAgICAgLSBbcXVlcnlde0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5fVxuICogICAgIC0gW3F1ZXJ5RnJvbUlkc117QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjcXVlcnlGcm9tSWRzfVxuICogICAgIC0gW2Rvd25sb2FkXXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNkb3dubG9hZH1cbiAqICAgICAtIFtxdWVyeUFuZERvd25sb2FkXXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNxdWVyeUFuZERvd25sb2FkfVxuICogICAgIC0gW2NsZWFyXXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNjbGVhcn1cbiAqICAgICAtIFtyZWFkRnJvbUZpbGVde0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3JlYWRGcm9tRmlsZX1cbiAqICAgICAtIFt3cml0ZVRvRmlsZV17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjd3JpdGVUb0ZpbGV9XG4gKlxuICogUG93ZXJlZCBieVxuICogPGEgaHJlZj1cImh0dHA6Ly9mcmVlc291bmQub3JnL2RvY3MvYXBpL1wiIHRhcmdldD1cIl9ibGFua1wiPmZyZWVzb3VuZCBhcGk8L2E+LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcGlLZXkgLSBZb3VyIGFwaSBrZXksIGFzIGdlbmVyYXRlZCBmcm9tIHlvdXIgZnJlZXNvdW5kXG4gKiBkZXZlbG9wZXIgYWNjb3VudCB3aGVuIGNyZWF0aW5nIGEgbmV3IGFwcGxpY2F0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZGVzdGluYXRpb249Jy4nXSAtIFRoZSByZWxhdGl2ZSBwYXRoIG9mIGEgZm9sZGVyIHdoZXJlIHRvIGRvd25sb2FkIGZpbGVzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgU2ltcGxlRnJlZXNvdW5kIGZyb20gJ3NpbXBsZS1mcmVlc291bmQnO1xuICpcbiAqIGNvbnN0IGZzID0gbmV3IFNpbXBsZUZyZWVzb3VuZCgnbXlBcGlLZXknLCAnLi9kb3dubG9hZHMnKTtcbiAqIGZzLnF1ZXJ5KHtcbiAqICAgc2VhcmNoOiBbICdzcGFjZScsICdpbnNlY3QnIF0sXG4gKiAgIGR1cmF0aW9uOiBbIDEsIDIwIF0sXG4gKiB9KVxuICogLnRoZW4oKCkgPT4gZnMuZG93bmxvYWQoKSlcbiAqIC50aGVuKCgpID0+IHtcbiAqICAgY29uc29sZS5sb2coZnMuY3VycmVudFNvdW5kc0luZm8pO1xuICogfSk7XG4gKi9cbmNsYXNzIFNpbXBsZUZyZWVzb3VuZCBleHRlbmRzIEZyZWVzb3VuZFF1ZXJ5IHtcbiAgLyoqIEBjb25zdHJ1Y3RvciAqL1xuICBjb25zdHJ1Y3RvcihhcGlLZXksIGRlc3RpbmF0aW9uID0gJy4nKSB7XG4gICAgc3VwZXIoYXBpS2V5KTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gIH1cblxuICAvKipcbiAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgZXZlcnkgZGV0YWlsZWQgaW5mb3JtYXRpb24gb2J0YWluZWQgc2luY2VcbiAgICogaW5zdGFudGlhdGlvbiBvciBsYXN0IGNhbGwgdG9cbiAgICogWzxjb2RlPmNsZWFyKCk8L2NvZGU+XXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNjbGVhcn0uXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBzb3VuZHNJbmZvXG4gICAqL1xuICBnZXQgc291bmRzSW5mbygpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwVG9PYmplY3QodGhpcy5fc291bmRzSW5mbyk7XG4gIH1cblxuICAvKipcbiAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGRldGFpbGVkIGluZm9ybWF0aW9uIG9idGFpbmVkIGZyb20gdGhlIGxhc3QgY2FsbCB0b1xuICAgKiBbPGNvZGU+cXVlcnkoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5fSxcbiAgICogWzxjb2RlPnF1ZXJ5RnJvbUlkcygpPC9jb2RlPl17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjcXVlcnlGcm9tSWRzfSxcbiAgICogWzxjb2RlPmRvd25sb2FkKCk8L2NvZGU+XXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNkb3dubG9hZH0gb3JcbiAgICogWzxjb2RlPnF1ZXJ5QW5kRG93bmxvYWQoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5QW5kRG93bmxvYWR9LlxuICAgKlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gY3VycmVudFNvdW5kc0luZm9cbiAgICovXG4gIGdldCBjdXJyZW50U291bmRzSW5mbygpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwVG9PYmplY3QodGhpcy5fY3VycmVudFNvdW5kc0luZm8pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGxpc3Qgb2Ygc291bmQgaWRzIHdpdGggZGV0YWlsZWQgaW5mb3JtYXRpb24sIHRoYXQgY29ycmVzcG9uZCB0byBhIHNldCBvZiBxdWVyeSBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlQYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy5zZWFyY2hdIC0gVGhlIHNlYXJjaCB0ZXJtcyB0aGF0IHdpbGwgYmUgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMudXNlcm5hbWVdIC0gQSBsaXN0IG9mIHVzZXJuYW1lcyB0byBzZWFyY2ggZmlsZXMgZnJvbS5cbiAgICogQHBhcmFtIHtBcnJheX0gW3F1ZXJ5UGFyYW1zLmR1cmF0aW9uXSAtIEFuIGFycmF5IG9mIHNpemUgMiA6IFsgbWluRHVyYXRpb24sIG1heER1cmF0aW9uIF0gKGluIHNlY29uZHMpLlxuICAgKiBJZiBtYXhEdXJhdGlvbiBpcyBub3QgYSBudW1iZXIsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgXCIqXCIgKG5vIG1heGltdW0gZHVyYXRpb24pLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBQcm9taXNlIG9iamVjdCB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGxpc3Qgb2YgbmV3IHNvdW5kIGlkcyBpZiB0aGUgcXVlcnkgZ29lcyB3ZWxsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIHF1ZXJ5LlxuICAgKi9cbiAgcXVlcnkocXVlcnlQYXJhbXMpIHtcbiAgICByZXR1cm4gc3VwZXIucXVlcnkocXVlcnlQYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBkZXRhaWxlZCBpbmZvcm1hdGlvbiBvZiBzb3VuZHMgZnJvbSB0aGVpciBpZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXkuTnVtYmVyfSBpZHMgLSBUaGUgaWRzIG9mIHRoZSBzb3VuZHMgd2Ugd2FudCB0byBnZXQgdGhlIGRldGFpbGVkIGluZm8gb2YuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCB3aWxsIHJlc29sdmUgd2l0aCBhbiBhcnJheSBvZiB0aGUgc291bmQgaWRzXG4gICAqIHRoZSBkZXRhaWxlZCBpbmZvIG9mIHdoaWNoIG5lZWRlZCB0byBiZSBxdWVyaWVkLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIHF1ZXJ5LlxuICAgKi9cbiAgcXVlcnlGcm9tSWRzKGlkcykge1xuICAgIHJldHVybiBzdXBlci5xdWVyeUZyb21JZHMoaWRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb3dubG9hZCBocSBtcDMgcHJldmlld3MgZnJvbSB0aGVpciBzb3VuZCBpZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXkuTnVtYmVyfSBbaWRzPW51bGxdIC0gVGhlIGlkcyBvZiB0aGUgc291bmRzIHRvIGRvd25sb2FkLlxuICAgKiBJZiA8Y29kZT5udWxsPC9jb2RlPiwgdGhlIGlkcyBmcm9tXG4gICAqIFs8Y29kZT5jdXJyZW50U291bmRzSW5mbzwvY29kZT5de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI2N1cnJlbnRTb3VuZHNJbmZvfVxuICAgKiB3aWxsIGJlIHVzZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCB3aWxsIHJlc29sdmUgaWYgdGhlIGRvd25sb2FkcyBnbyB3ZWxsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIGRvd25sb2Fkcy5cbiAgICovXG4gIGRvd25sb2FkKGlkcyA9IG51bGwpIHtcbiAgICBpZiAoaWRzID09PSBudWxsKVxuICAgICAgaWRzID0gQXJyYXkuZnJvbSh0aGlzLl9jdXJyZW50U291bmRzSW5mby5rZXlzKCkpO1xuXG4gICAgcmV0dXJuIHRoaXMuX2Rvd25sb2FkRmlsZXNGcm9tVXJscyhpZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvd25sb2FkIGhxIG1wMyBwcmV2aWV3cyBmcm9tIHF1ZXJpZWQgc291bmQgaW5mb3JtYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeVBhcmFtcyAtIFRoZSBwYXJhbWV0ZXJzIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnNlYXJjaF0gLSBUaGUgc2VhcmNoIHRlcm1zIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy51c2VybmFtZV0gLSBBIGxpc3Qgb2YgdXNlcm5hbWVzIHRvIHNlYXJjaCBmaWxlcyBmcm9tLlxuICAgKiBAcGFyYW0ge0FycmF5fSBbcXVlcnlQYXJhbXMuZHVyYXRpb25dIC0gQW4gYXJyYXkgb2Ygc2l6ZSAyIDogWyBtaW5EdXJhdGlvbiwgbWF4RHVyYXRpb24gXSAoaW4gc2Vjb25kcykuXG4gICAqIElmIG1heER1cmF0aW9uIGlzIG5vdCBhIG51bWJlciwgaXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBcIipcIiAobm8gbWF4aW11bSBkdXJhdGlvbikuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbZGVzdGluYXRpb249Jy4nXSAtIFRoZSBmb2xkZXIgaW4gd2hpY2ggdG8gc2F2ZSB0aGUgZG93bmxvYWRlZCBmaWxlcy5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgUHJvbWlzZSBvYmplY3QgdGhhdCByZXNvbHZlcyBpZiB0aGUgZG93bmxvYWRzIGdvIHdlbGwuXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbiBlcnJvciBpZiBhIHByb2JsZW0gb2NjdXJzIGR1cmluZyB0aGUgZG93bmxvYWRzLlxuICAgKi9cbiAgcXVlcnlBbmREb3dubG9hZChxdWVyeVBhcmFtcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzdXBlci5xdWVyeShxdWVyeVBhcmFtcylcbiAgICAgICAgLnRoZW4odXBkYXRlZElkcyA9PiB0aGlzLl9kb3dubG9hZEZpbGVzRnJvbVVybHModXBkYXRlZElkcykpXG4gICAgICAgIC50aGVuKHVwZGF0ZWRJZHMgPT4gcmVzb2x2ZSh1cGRhdGVkSWRzKSlcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZG93bmxvYWRGaWxlc0Zyb21VcmxzKGlkcykge1xuICAgIGNvbnN0IHByb21pc2VzID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkcy5sZW5ndGg7IGkrKylcbiAgICAgIHByb21pc2VzLnB1c2godGhpcy5fZG93bmxvYWRGaWxlRnJvbVVybChpZHNbaV0pKTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2Rvd25sb2FkRmlsZUZyb21VcmwoaWQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgZHN0ID0gcGF0aC5qb2luKGN3ZCwgdGhpcy5kZXN0aW5hdGlvbiwgYCR7aWR9Lm1wM2ApXG4gICAgICBjb25zdCBmaWxlID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZHN0KTtcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBodHRwLmdldChcbiAgICAgICAgdGhpcy5fc291bmRzSW5mby5nZXQoaWQpWydwcmV2aWV3cyddWydwcmV2aWV3LWhxLW1wMyddLFxuICAgICAgICByZXNwb25zZSA9PiB7XG4gICAgICAgICAgcmVzcG9uc2UucGlwZShmaWxlKTtcblxuICAgICAgICAgIGZpbGUub24oJ2ZpbmlzaCcsICgpID0+IHtcbiAgICAgICAgICAgIGZpbGUuY2xvc2UoKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGZpbGUub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgICAgICAgIGZzLnVubGluayhkc3QpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciBkb3dubG9hZGluZyBmaWxlICR7aWR9IDogJHtlcnJ9YCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgdGhlIGludGVybmFsIHNvdW5kIGluZm9ybWF0aW9uIGxpc3RzLlxuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5fc291bmRzSW5mbyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mbyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBzb3VuZCBpbmZvcm1hdGlvbiBsaXN0IGZyb20gYSBKU09OIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZSAtIFVybCBvZiB0aGUgZmlsZSB0byByZWFkLlxuICAgKi9cbiAgcmVhZEZyb21GaWxlKGZpbGVuYW1lKSB7XG4gICAgdmFyIHNpID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGYtOCcpKTtcblxuICAgIGlmIChzaSkge1xuICAgICAgdGhpcy5fc291bmRzSW5mbyA9IG5ldyBNYXAoKTtcblxuICAgICAgZm9yIChsZXQgaSBpbiBzaSlcbiAgICAgICAgdGhpcy5fc291bmRzSW5mby5zZXQoc2lbaV1bJ2lkJ10sIHNpW2ldKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRHVtcCBzb3VuZCBpbmZvcm1hdGlvbiBsaXN0IHRvIGEgSlNPTiBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWUgLSBVcmwgb2YgdGhlIGZpbGUgdG8gZHVtcCB0aGUgbGlzdCBvZiBmaWxlIGluZm9ybWF0aW9uIHRvLlxuICAgKi9cbiAgd3JpdGVUb0ZpbGUoZmlsZW5hbWUpIHtcbiAgICBmcy53cml0ZUZpbGVTeW5jKFxuICAgICAgZmlsZW5hbWUsXG4gICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLl9tYXBUb09iamVjdCh0aGlzLl9zb3VuZHNJbmZvKSwgbnVsbCwgMiksXG4gICAgICAndXRmLTgnXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgU2ltcGxlRnJlZXNvdW5kO1xuIl19