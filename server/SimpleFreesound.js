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
        var request = _http2.default.get(_this3._soundsInfo.get(id).previews['preview-hq-mp3'], function (response) {
          response.pipe(file);

          file.on('finish', function () {
            var url = _path2.default.join(_this3.destination, id + '.mp3');
            _this3._soundsInfo.get(id).localUrl = url;
            _this3._currentSoundsInfo.get(id).localUrl = url;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImN3ZCIsInByb2Nlc3MiLCJTaW1wbGVGcmVlc291bmQiLCJhcGlLZXkiLCJkZXN0aW5hdGlvbiIsInB1YmxpY1BhdGgiLCJxdWVyeVBhcmFtcyIsImlkcyIsIl9jdXJyZW50U291bmRzSW5mbyIsImtleXMiLCJfZG93bmxvYWRGaWxlc0Zyb21VcmxzIiwicmVzb2x2ZSIsInJlamVjdCIsInRoZW4iLCJ1cGRhdGVkSWRzIiwicHJvbWlzZXMiLCJpIiwibGVuZ3RoIiwicHVzaCIsIl9kb3dubG9hZEZpbGVGcm9tVXJsIiwiYWxsIiwiaWQiLCJkc3QiLCJqb2luIiwiZmlsZSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwicmVxdWVzdCIsImdldCIsIl9zb3VuZHNJbmZvIiwicHJldmlld3MiLCJyZXNwb25zZSIsInBpcGUiLCJvbiIsInVybCIsImxvY2FsVXJsIiwiY2xvc2UiLCJ1bmxpbmsiLCJFcnJvciIsImVyciIsImZpbGVuYW1lIiwic2kiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJzZXQiLCJ3cml0ZUZpbGVTeW5jIiwiX21hcFRvT2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7OztBQUVBLElBQU1BLE1BQU1DLFFBQVFELEdBQVIsRUFBWjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTBDTUUsZTs7O0FBQ0o7QUFDQSwyQkFBWUMsTUFBWixFQUE4RDtBQUFBLFFBQTFDQyxXQUEwQyx1RUFBNUIsR0FBNEI7QUFBQSxRQUF2QkMsVUFBdUIsdUVBQVYsUUFBVTtBQUFBOztBQUFBLHdKQUN0REYsTUFEc0Q7O0FBRTVELFVBQUtDLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0EsVUFBS0MsVUFBTCxHQUFrQkEsVUFBbEI7QUFINEQ7QUFJN0Q7O0FB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TixhQUFLWixXQUFMLEdBQW1CLG1CQUFuQjs7QUFFQSxhQUFLLElBQUlaLENBQVQsSUFBY3dCLEVBQWQ7QUFDRSxlQUFLWixXQUFMLENBQWlCZ0IsR0FBakIsQ0FBcUJKLEdBQUd4QixDQUFILEVBQU0sSUFBTixDQUFyQixFQUFrQ3dCLEdBQUd4QixDQUFILENBQWxDO0FBREY7QUFFRDtBQUNGOztBQUVEOzs7Ozs7OztnQ0FLWXVCLFEsRUFBVTtBQUNwQixtQkFBR00sYUFBSCxDQUNFTixRQURGLEVBRUUseUJBQWUsS0FBS08sWUFBTCxDQUFrQixLQUFLbEIsV0FBdkIsQ0FBZixFQUFvRCxJQUFwRCxFQUEwRCxDQUExRCxDQUZGLEVBR0UsT0FIRjtBQUtEOzs7d0JBbEtnQjtBQUNmLGFBQU8sS0FBS2tCLFlBQUwsQ0FBa0IsS0FBS2xCLFdBQXZCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7O3dCQVN3QjtBQUN0QixhQUFPLEtBQUtrQixZQUFMLENBQWtCLEtBQUt0QyxrQkFBdkIsQ0FBUDtBQUNEOzs7OztBQW9KRjs7a0JBRWNOLGUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuaW1wb3J0IEZyZWVzb3VuZFF1ZXJ5IGZyb20gJy4uL2NvbW1vbi9GcmVlc291bmRRdWVyeSc7XG5cbmNvbnN0IGN3ZCA9IHByb2Nlc3MuY3dkKCk7XG5cbi8qKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzZXJ2ZXJcbiAqXG4gKiBAY2xhc3MgPGI+PGg1PnNlcnZlci5TaW1wbGVGcmVlc291bmQ8L2g1PjwvYj5cbiAqXG4gKiBTZXJ2ZXIgc2lkZSBjbGFzcyBmb3IgdXNlIGluIDxjb2RlPk5vZGUuanM8L2NvZGU+LCBhbGxvd2luZyB0byBxdWVyeSBkZXRhaWxlZFxuICogaW5mbyBvbiBzb3VuZHMgYW5kIGRvd25sb2FkIHRoZW0gZnJvbVxuICogPGEgaHJlZj1cImh0dHA6Ly9mcmVlc291bmQub3JnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+ZnJlZXNvdW5kPC9hPi5cbiAqXG4gKiAtIG1lbWJlcnNcbiAqICAgICAtIFtzb3VuZHNJbmZvXXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNzb3VuZHNJbmZvfVxuICogICAgIC0gW2N1cnJlbnRTb3VuZHNJbmZvXXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNjdXJyZW50U291bmRzSW5mb31cbiAqIC0gbWV0aG9kc1xuICogICAgIC0gW3F1ZXJ5XXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNxdWVyeX1cbiAqICAgICAtIFtxdWVyeUZyb21JZHNde0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5RnJvbUlkc31cbiAqICAgICAtIFtkb3dubG9hZF17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjZG93bmxvYWR9XG4gKiAgICAgLSBbcXVlcnlBbmREb3dubG9hZF17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjcXVlcnlBbmREb3dubG9hZH1cbiAqICAgICAtIFtjbGVhcl17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjY2xlYXJ9XG4gKiAgICAgLSBbcmVhZEZyb21GaWxlXXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNyZWFkRnJvbUZpbGV9XG4gKiAgICAgLSBbd3JpdGVUb0ZpbGVde0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI3dyaXRlVG9GaWxlfVxuICpcbiAqIFBvd2VyZWQgYnlcbiAqIDxhIGhyZWY9XCJodHRwOi8vZnJlZXNvdW5kLm9yZy9kb2NzL2FwaS9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5mcmVlc291bmQgYXBpPC9hPi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYXBpS2V5IC0gWW91ciBhcGkga2V5LCBhcyBnZW5lcmF0ZWQgZnJvbSB5b3VyIGZyZWVzb3VuZFxuICogZGV2ZWxvcGVyIGFjY291bnQgd2hlbiBjcmVhdGluZyBhIG5ldyBhcHBsaWNhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gW2Rlc3RpbmF0aW9uPScuJ10gLSBUaGUgcmVsYXRpdmUgcGF0aCBvZiBhIGZvbGRlciB3aGVyZSB0byBkb3dubG9hZCBmaWxlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IFNpbXBsZUZyZWVzb3VuZCBmcm9tICdzaW1wbGUtZnJlZXNvdW5kJztcbiAqXG4gKiBjb25zdCBmcyA9IG5ldyBTaW1wbGVGcmVlc291bmQoJ215QXBpS2V5JywgJy4vZG93bmxvYWRzJyk7XG4gKiBmcy5xdWVyeSh7XG4gKiAgIHNlYXJjaDogWyAnc3BhY2UnLCAnaW5zZWN0JyBdLFxuICogICBkdXJhdGlvbjogWyAxLCAyMCBdLFxuICogfSlcbiAqIC50aGVuKCgpID0+IGZzLmRvd25sb2FkKCkpXG4gKiAudGhlbigoKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKGZzLmN1cnJlbnRTb3VuZHNJbmZvKTtcbiAqIH0pO1xuICovXG5jbGFzcyBTaW1wbGVGcmVlc291bmQgZXh0ZW5kcyBGcmVlc291bmRRdWVyeSB7XG4gIC8qKiBAY29uc3RydWN0b3IgKi9cbiAgY29uc3RydWN0b3IoYXBpS2V5LCBkZXN0aW5hdGlvbiA9ICcuJywgcHVibGljUGF0aCA9ICdwdWJsaWMnKSB7XG4gICAgc3VwZXIoYXBpS2V5KTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICAgdGhpcy5wdWJsaWNQYXRoID0gcHVibGljUGF0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgY29udGFpbmluZyBldmVyeSBkZXRhaWxlZCBpbmZvcm1hdGlvbiBvYnRhaW5lZCBzaW5jZVxuICAgKiBpbnN0YW50aWF0aW9uIG9yIGxhc3QgY2FsbCB0b1xuICAgKiBbPGNvZGU+Y2xlYXIoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI2NsZWFyfS5cbiAgICpcbiAgICogQHByb3BlcnR5IHtPYmplY3R9IHNvdW5kc0luZm9cbiAgICovXG4gIGdldCBzb3VuZHNJbmZvKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXBUb09iamVjdCh0aGlzLl9zb3VuZHNJbmZvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgZGV0YWlsZWQgaW5mb3JtYXRpb24gb2J0YWluZWQgZnJvbSB0aGUgbGFzdCBjYWxsIHRvXG4gICAqIFs8Y29kZT5xdWVyeSgpPC9jb2RlPl17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjcXVlcnl9LFxuICAgKiBbPGNvZGU+cXVlcnlGcm9tSWRzKCk8L2NvZGU+XXtAbGluayBtb2R1bGU6c2VydmVyLlNpbXBsZUZyZWVzb3VuZCNxdWVyeUZyb21JZHN9LFxuICAgKiBbPGNvZGU+ZG93bmxvYWQoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpzZXJ2ZXIuU2ltcGxlRnJlZXNvdW5kI2Rvd25sb2FkfSBvclxuICAgKiBbPGNvZGU+cXVlcnlBbmREb3dubG9hZCgpPC9jb2RlPl17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjcXVlcnlBbmREb3dubG9hZH0uXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBjdXJyZW50U291bmRzSW5mb1xuICAgKi9cbiAgZ2V0IGN1cnJlbnRTb3VuZHNJbmZvKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXBUb09iamVjdCh0aGlzLl9jdXJyZW50U291bmRzSW5mbyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbGlzdCBvZiBzb3VuZCBpZHMgd2l0aCBkZXRhaWxlZCBpbmZvcm1hdGlvbiwgdGhhdCBjb3JyZXNwb25kIHRvIGEgc2V0IG9mIHF1ZXJ5IHBhcmFtZXRlcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeVBhcmFtcyAtIFRoZSBwYXJhbWV0ZXJzIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnNlYXJjaF0gLSBUaGUgc2VhcmNoIHRlcm1zIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy51c2VybmFtZV0gLSBBIGxpc3Qgb2YgdXNlcm5hbWVzIHRvIHNlYXJjaCBmaWxlcyBmcm9tLlxuICAgKiBAcGFyYW0ge0FycmF5fSBbcXVlcnlQYXJhbXMuZHVyYXRpb25dIC0gQW4gYXJyYXkgb2Ygc2l6ZSAyIDogWyBtaW5EdXJhdGlvbiwgbWF4RHVyYXRpb24gXSAoaW4gc2Vjb25kcykuXG4gICAqIElmIG1heER1cmF0aW9uIGlzIG5vdCBhIG51bWJlciwgaXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBcIipcIiAobm8gbWF4aW11bSBkdXJhdGlvbikuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIFByb21pc2Ugb2JqZWN0IHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgbGlzdCBvZiBuZXcgc291bmQgaWRzIGlmIHRoZSBxdWVyeSBnb2VzIHdlbGwuXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbiBlcnJvciBpZiBhIHByb2JsZW0gb2NjdXJzIGR1cmluZyB0aGUgcXVlcnkuXG4gICAqL1xuICBxdWVyeShxdWVyeVBhcmFtcykge1xuICAgIHJldHVybiBzdXBlci5xdWVyeShxdWVyeVBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGRldGFpbGVkIGluZm9ybWF0aW9uIG9mIHNvdW5kcyBmcm9tIHRoZWlyIGlkcy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheS5OdW1iZXJ9IGlkcyAtIFRoZSBpZHMgb2YgdGhlIHNvdW5kcyB3ZSB3YW50IHRvIGdldCB0aGUgZGV0YWlsZWQgaW5mbyBvZi5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHdpbGwgcmVzb2x2ZSB3aXRoIGFuIGFycmF5IG9mIHRoZSBzb3VuZCBpZHNcbiAgICogdGhlIGRldGFpbGVkIGluZm8gb2Ygd2hpY2ggbmVlZGVkIHRvIGJlIHF1ZXJpZWQuXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbiBlcnJvciBpZiBhIHByb2JsZW0gb2NjdXJzIGR1cmluZyB0aGUgcXVlcnkuXG4gICAqL1xuICBxdWVyeUZyb21JZHMoaWRzKSB7XG4gICAgcmV0dXJuIHN1cGVyLnF1ZXJ5RnJvbUlkcyhpZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvd25sb2FkIGhxIG1wMyBwcmV2aWV3cyBmcm9tIHRoZWlyIHNvdW5kIGlkcy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheS5OdW1iZXJ9IFtpZHM9bnVsbF0gLSBUaGUgaWRzIG9mIHRoZSBzb3VuZHMgdG8gZG93bmxvYWQuXG4gICAqIElmIDxjb2RlPm51bGw8L2NvZGU+LCB0aGUgaWRzIGZyb21cbiAgICogWzxjb2RlPmN1cnJlbnRTb3VuZHNJbmZvPC9jb2RlPl17QGxpbmsgbW9kdWxlOnNlcnZlci5TaW1wbGVGcmVlc291bmQjY3VycmVudFNvdW5kc0luZm99XG4gICAqIHdpbGwgYmUgdXNlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHdpbGwgcmVzb2x2ZSBpZiB0aGUgZG93bmxvYWRzIGdvIHdlbGwuXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbiBlcnJvciBpZiBhIHByb2JsZW0gb2NjdXJzIGR1cmluZyB0aGUgZG93bmxvYWRzLlxuICAgKi9cbiAgZG93bmxvYWQoaWRzID0gbnVsbCkge1xuICAgIGlmIChpZHMgPT09IG51bGwpXG4gICAgICBpZHMgPSBBcnJheS5mcm9tKHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLmtleXMoKSk7XG5cbiAgICByZXR1cm4gdGhpcy5fZG93bmxvYWRGaWxlc0Zyb21VcmxzKGlkcyk7XG4gIH1cblxuICAvKipcbiAgICogRG93bmxvYWQgaHEgbXAzIHByZXZpZXdzIGZyb20gcXVlcmllZCBzb3VuZCBpbmZvcm1hdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5UGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMuc2VhcmNoXSAtIFRoZSBzZWFyY2ggdGVybXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnVzZXJuYW1lXSAtIEEgbGlzdCBvZiB1c2VybmFtZXMgdG8gc2VhcmNoIGZpbGVzIGZyb20uXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtxdWVyeVBhcmFtcy5kdXJhdGlvbl0gLSBBbiBhcnJheSBvZiBzaXplIDIgOiBbIG1pbkR1cmF0aW9uLCBtYXhEdXJhdGlvbiBdIChpbiBzZWNvbmRzKS5cbiAgICogSWYgbWF4RHVyYXRpb24gaXMgbm90IGEgbnVtYmVyLCBpdCB3aWxsIGJlIGludGVycHJldGVkIGFzIFwiKlwiIChubyBtYXhpbXVtIGR1cmF0aW9uKS5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtkZXN0aW5hdGlvbj0nLiddIC0gVGhlIGZvbGRlciBpbiB3aGljaCB0byBzYXZlIHRoZSBkb3dubG9hZGVkIGZpbGVzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBQcm9taXNlIG9iamVjdCB0aGF0IHJlc29sdmVzIGlmIHRoZSBkb3dubG9hZHMgZ28gd2VsbC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBkb3dubG9hZHMuXG4gICAqL1xuICBxdWVyeUFuZERvd25sb2FkKHF1ZXJ5UGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHN1cGVyLnF1ZXJ5KHF1ZXJ5UGFyYW1zKVxuICAgICAgICAudGhlbih1cGRhdGVkSWRzID0+IHRoaXMuX2Rvd25sb2FkRmlsZXNGcm9tVXJscyh1cGRhdGVkSWRzKSlcbiAgICAgICAgLnRoZW4odXBkYXRlZElkcyA9PiByZXNvbHZlKHVwZGF0ZWRJZHMpKVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9kb3dubG9hZEZpbGVzRnJvbVVybHMoaWRzKSB7XG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWRzLmxlbmd0aDsgaSsrKVxuICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLl9kb3dubG9hZEZpbGVGcm9tVXJsKGlkc1tpXSkpO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZG93bmxvYWRGaWxlRnJvbVVybChpZCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBkc3QgPSBwYXRoLmpvaW4oY3dkLCB0aGlzLnB1YmxpY1BhdGgsIHRoaXMuZGVzdGluYXRpb24sIGAke2lkfS5tcDNgKVxuICAgICAgY29uc3QgZmlsZSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGRzdCk7XG4gICAgICBjb25zdCByZXF1ZXN0ID0gaHR0cC5nZXQoXG4gICAgICAgIHRoaXMuX3NvdW5kc0luZm8uZ2V0KGlkKS5wcmV2aWV3c1sncHJldmlldy1ocS1tcDMnXSxcbiAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgIHJlc3BvbnNlLnBpcGUoZmlsZSk7XG5cbiAgICAgICAgICBmaWxlLm9uKCdmaW5pc2gnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBwYXRoLmpvaW4odGhpcy5kZXN0aW5hdGlvbiwgYCR7aWR9Lm1wM2ApO1xuICAgICAgICAgICAgdGhpcy5fc291bmRzSW5mby5nZXQoaWQpLmxvY2FsVXJsID0gdXJsO1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8uZ2V0KGlkKS5sb2NhbFVybCA9IHVybDtcbiAgICAgICAgICAgIGZpbGUuY2xvc2UoKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGZpbGUub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgICAgICAgIGZzLnVubGluayhkc3QpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciBkb3dubG9hZGluZyBmaWxlICR7aWR9IDogJHtlcnJ9YCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgdGhlIGludGVybmFsIHNvdW5kIGluZm9ybWF0aW9uIGxpc3RzLlxuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5fc291bmRzSW5mbyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mbyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBzb3VuZCBpbmZvcm1hdGlvbiBsaXN0IGZyb20gYSBKU09OIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZSAtIFVybCBvZiB0aGUgZmlsZSB0byByZWFkLlxuICAgKi9cbiAgcmVhZEZyb21GaWxlKGZpbGVuYW1lKSB7XG4gICAgdmFyIHNpID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGYtOCcpKTtcblxuICAgIGlmIChzaSkge1xuICAgICAgdGhpcy5fc291bmRzSW5mbyA9IG5ldyBNYXAoKTtcblxuICAgICAgZm9yIChsZXQgaSBpbiBzaSlcbiAgICAgICAgdGhpcy5fc291bmRzSW5mby5zZXQoc2lbaV1bJ2lkJ10sIHNpW2ldKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRHVtcCBzb3VuZCBpbmZvcm1hdGlvbiBsaXN0IHRvIGEgSlNPTiBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWUgLSBVcmwgb2YgdGhlIGZpbGUgdG8gZHVtcCB0aGUgbGlzdCBvZiBmaWxlIGluZm9ybWF0aW9uIHRvLlxuICAgKi9cbiAgd3JpdGVUb0ZpbGUoZmlsZW5hbWUpIHtcbiAgICBmcy53cml0ZUZpbGVTeW5jKFxuICAgICAgZmlsZW5hbWUsXG4gICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLl9tYXBUb09iamVjdCh0aGlzLl9zb3VuZHNJbmZvKSwgbnVsbCwgMiksXG4gICAgICAndXRmLTgnXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgU2ltcGxlRnJlZXNvdW5kO1xuIl19