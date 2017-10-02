'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _wavesLoaders = require('waves-loaders');

var loaders = _interopRequireWildcard(_wavesLoaders);

var _FreesoundQuery2 = require('../common/FreesoundQuery');

var _FreesoundQuery3 = _interopRequireDefault(_FreesoundQuery2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loader = new loaders.AudioBufferLoader();

/**
 * @memberof module:client
 *
 * @class <b><h5>client.SimpleFreesound</h5></b>
 *
 * Client side class allowing to query detailed info on sounds and download them
 * from <a href="http://freesound.org" target="_blank">freesound</a>.
 *
 * <!--
 * - [constructor]{@link module:client.SimpleFreesound}
 * -->
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
 * <!--
 *     - [readFromFile]{@link module:client.SimpleFreesound#readFromFile}
 *     - [writeToFile]{@link module:client.SimpleFreesound#writeToFile}
 * -->
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

var SimpleFreesound = function (_FreesoundQuery) {
  (0, _inherits3.default)(SimpleFreesound, _FreesoundQuery);

  function SimpleFreesound(apiKey) {
    (0, _classCallCheck3.default)(this, SimpleFreesound);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SimpleFreesound.__proto__ || (0, _getPrototypeOf2.default)(SimpleFreesound)).call(this, apiKey));

    _this.buffers = [];
    return _this;
  }

  /**
   * An object containing every detailed information obtained since
   * instantiation or last call to
   * [<code>clear()</code>]{@link module:client.SimpleFreesound#clear}.
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
     * [<code>currentSoundsInfo</code>]{@link module:client.SimpleFreesound#currentSoundsInfo}
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

  }, {
    key: 'queryAndDownload',
    value: function queryAndDownload(queryParams) {
      var _this2 = this;

      return new _promise2.default(function (resolve, reject) {
        (0, _get3.default)(SimpleFreesound.prototype.__proto__ || (0, _getPrototypeOf2.default)(SimpleFreesound.prototype), 'query', _this2).call(_this2, queryParams).then(function (updatedIds) {
          var ids = (0, _from2.default)(_this2._currentSoundsInfo.keys());
          _this2._downloadFilesFromUrls(ids);
        }).then(function (updatedIds) {
          return resolve(updatedIds);
        });
      });
    }

    /** @private */

  }, {
    key: '_downloadFilesFromUrls',
    value: function _downloadFilesFromUrls(ids) {
      var _this3 = this;

      return new _promise2.default(function (resolve, reject) {
        var urls = [];

        for (var i = 0; i < ids.length; i++) {
          urls.push(_this3._currentSoundsInfo.get(ids[i])['previews']['preview-hq-mp3']);
        }loader.load(urls).then(function (buffers) {
          _this3._buffers = buffers;

          for (var _i = 0; _i < ids.length; _i++) {
            var soundInfo = _this3._currentSoundsInfo.get(ids[_i]);
            soundInfo['buffer'] = buffers[_i];
            _this3._currentSoundsInfo.set(ids[_i], soundInfo);
          }

          resolve(_this3._buffers);
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
  }, {
    key: 'soundsInfo',
    get: function get() {
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

  }, {
    key: 'currentSoundsInfo',
    get: function get() {
      return this._mapToObject(this._currentSoundsInfo);
    }

    /**
     * Array of the buffers stored internally on download success, after call to
     * [<code>download()</code>]{@link module:client.SimpleFreesound#download} or
     * [<code>queryAndDownload()</code>]{@link module:client.SimpleFreesound#queryAndDownload}.
     *
     * @property {Array.AudioBuffer} buffers
     */

  }, {
    key: 'buffers',
    get: function get() {
      return this._buffers;
    }
  }]);
  return SimpleFreesound;
}(_FreesoundQuery3.default);

;

exports.default = SimpleFreesound;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImxvYWRlcnMiLCJsb2FkZXIiLCJBdWRpb0J1ZmZlckxvYWRlciIsIlNpbXBsZUZyZWVzb3VuZCIsImFwaUtleSIsImJ1ZmZlcnMiLCJxdWVyeVBhcmFtcyIsImlkcyIsIl9jdXJyZW50U291bmRzSW5mbyIsImtleXMiLCJfZG93bmxvYWRGaWxlc0Zyb21VcmxzIiwicmVzb2x2ZSIsInJlamVjdCIsInRoZW4iLCJ1cGRhdGVkSWRzIiwidXJscyIsImkiLCJsZW5ndGgiLCJwdXNoIiwiZ2V0IiwibG9hZCIsIl9idWZmZXJzIiwic291bmRJbmZvIiwic2V0IiwiX3NvdW5kc0luZm8iLCJfbWFwVG9PYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxPOztBQUNaOzs7Ozs7OztBQUVBLElBQU1DLFNBQVMsSUFBSUQsUUFBUUUsaUJBQVosRUFBZjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE4Q01DLGU7OztBQUNKLDJCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQUEsd0pBQ1pBLE1BRFk7O0FBRWxCLFVBQUtDLE9BQUwsR0FBYyxFQUFkO0FBRmtCO0FBR25COztBQUVEOzs7Ozs7Ozs7Ozs7O0FBbUNBOzs7Ozs7Ozs7Ozs7OzBCQWFNQyxXLEVBQWE7QUFDakIsMkpBQW1CQSxXQUFuQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7O2lDQVVhQyxHLEVBQUs7QUFDaEIsa0tBQTBCQSxHQUExQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7K0JBWXFCO0FBQUEsVUFBWkEsR0FBWSx1RUFBTixJQUFNOztBQUNuQixVQUFJQSxRQUFRLElBQVosRUFDRUEsTUFBTSxvQkFBVyxLQUFLQyxrQkFBTCxDQUF3QkMsSUFBeEIsRUFBWCxDQUFOOztBQUVGLGFBQU8sS0FBS0Msc0JBQUwsQ0FBNEJILEdBQTVCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQ0FnQmlCRCxXLEVBQWE7QUFBQTs7QUFDNUIsYUFBTyxzQkFBWSxVQUFDSyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsMEpBQVlOLFdBQVosRUFDR08sSUFESCxDQUNRLHNCQUFjO0FBQ2xCLGNBQU1OLE1BQU0sb0JBQVcsT0FBS0Msa0JBQUwsQ0FBd0JDLElBQXhCLEVBQVgsQ0FBWjtBQUNBLGlCQUFLQyxzQkFBTCxDQUE0QkgsR0FBNUI7QUFDRCxTQUpILEVBS0dNLElBTEgsQ0FLUTtBQUFBLGlCQUFjRixRQUFRRyxVQUFSLENBQWQ7QUFBQSxTQUxSO0FBTUQsT0FQTSxDQUFQO0FBUUQ7O0FBRUQ7Ozs7MkNBQ3VCUCxHLEVBQUs7QUFBQTs7QUFDMUIsYUFBTyxzQkFBWSxVQUFDSSxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsWUFBTUcsT0FBTyxFQUFiOztBQUVBLGFBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJVCxJQUFJVSxNQUF4QixFQUFnQ0QsR0FBaEM7QUFDRUQsZUFBS0csSUFBTCxDQUFVLE9BQUtWLGtCQUFMLENBQXdCVyxHQUF4QixDQUE0QlosSUFBSVMsQ0FBSixDQUE1QixFQUFvQyxVQUFwQyxFQUFnRCxnQkFBaEQsQ0FBVjtBQURGLFNBR0FmLE9BQU9tQixJQUFQLENBQVlMLElBQVosRUFDR0YsSUFESCxDQUNRLG1CQUFXO0FBQ2YsaUJBQUtRLFFBQUwsR0FBZ0JoQixPQUFoQjs7QUFFQSxlQUFLLElBQUlXLEtBQUksQ0FBYixFQUFnQkEsS0FBSVQsSUFBSVUsTUFBeEIsRUFBZ0NELElBQWhDLEVBQXFDO0FBQ25DLGdCQUFNTSxZQUFZLE9BQUtkLGtCQUFMLENBQXdCVyxHQUF4QixDQUE0QlosSUFBSVMsRUFBSixDQUE1QixDQUFsQjtBQUNBTSxzQkFBVSxRQUFWLElBQXNCakIsUUFBUVcsRUFBUixDQUF0QjtBQUNBLG1CQUFLUixrQkFBTCxDQUF3QmUsR0FBeEIsQ0FBNEJoQixJQUFJUyxFQUFKLENBQTVCLEVBQW9DTSxTQUFwQztBQUNEOztBQUVEWCxrQkFBUSxPQUFLVSxRQUFiO0FBQ0QsU0FYSDtBQVlELE9BbEJNLENBQVA7QUFtQkQ7O0FBRUQ7Ozs7Ozs0QkFHUTtBQUNOLFdBQUtHLFdBQUwsR0FBbUIsbUJBQW5CO0FBQ0EsV0FBS2hCLGtCQUFMLEdBQTBCLG1CQUExQjtBQUNEOzs7d0JBdElnQjtBQUNmLGFBQU8sS0FBS2lCLFlBQUwsQ0FBa0IsS0FBS0QsV0FBdkIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7d0JBU3dCO0FBQ3RCLGFBQU8sS0FBS0MsWUFBTCxDQUFrQixLQUFLakIsa0JBQXZCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozt3QkFPYztBQUNaLGFBQU8sS0FBS2EsUUFBWjtBQUNEOzs7OztBQTZHRjs7a0JBRWNsQixlIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbG9hZGVycyBmcm9tICd3YXZlcy1sb2FkZXJzJztcbmltcG9ydCBGcmVlc291bmRRdWVyeSBmcm9tICcuLi9jb21tb24vRnJlZXNvdW5kUXVlcnknO1xuXG5jb25zdCBsb2FkZXIgPSBuZXcgbG9hZGVycy5BdWRpb0J1ZmZlckxvYWRlcigpO1xuXG4vKipcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50XG4gKlxuICogQGNsYXNzIDxiPjxoNT5jbGllbnQuU2ltcGxlRnJlZXNvdW5kPC9oNT48L2I+XG4gKlxuICogQ2xpZW50IHNpZGUgY2xhc3MgYWxsb3dpbmcgdG8gcXVlcnkgZGV0YWlsZWQgaW5mbyBvbiBzb3VuZHMgYW5kIGRvd25sb2FkIHRoZW1cbiAqIGZyb20gPGEgaHJlZj1cImh0dHA6Ly9mcmVlc291bmQub3JnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+ZnJlZXNvdW5kPC9hPi5cbiAqXG4gKiA8IS0tXG4gKiAtIFtjb25zdHJ1Y3Rvcl17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmR9XG4gKiAtLT5cbiAqIC0gbWVtYmVyc1xuICogICAgIC0gW3NvdW5kc0luZm9de0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI3NvdW5kc0luZm99XG4gKiAgICAgLSBbY3VycmVudFNvdW5kc0luZm9de0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI2N1cnJlbnRTb3VuZHNJbmZvfVxuICogICAgIC0gW2J1ZmZlcnNde0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI2J1ZmZlcnN9XG4gKiAtIG1ldGhvZHNcbiAqICAgICAtIFtxdWVyeV17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjcXVlcnl9XG4gKiAgICAgLSBbcXVlcnlGcm9tSWRzXXtAbGluayBtb2R1bGU6Y2xpZW50LlNpbXBsZUZyZWVzb3VuZCNxdWVyeUZyb21JZHN9XG4gKiAgICAgLSBbZG93bmxvYWRde0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI2Rvd25sb2FkfVxuICogICAgIC0gW3F1ZXJ5QW5kRG93bmxvYWRde0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5QW5kRG93bmxvYWR9XG4gKiAgICAgLSBbY2xlYXJde0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI2NsZWFyfVxuICpcbiAqIDwhLS1cbiAqICAgICAtIFtyZWFkRnJvbUZpbGVde0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI3JlYWRGcm9tRmlsZX1cbiAqICAgICAtIFt3cml0ZVRvRmlsZV17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjd3JpdGVUb0ZpbGV9XG4gKiAtLT5cbiAqXG4gKiBQb3dlcmVkIGJ5XG4gKiA8YSBocmVmPVwiaHR0cDovL2ZyZWVzb3VuZC5vcmcvZG9jcy9hcGkvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+ZnJlZXNvdW5kIGFwaTwvYT4uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFwaUtleSAtIFlvdXIgYXBpIGtleSwgYXMgZ2VuZXJhdGVkIGZyb20geW91ciBmcmVlc291bmRcbiAqIGRldmVsb3BlciBhY2NvdW50IHdoZW4gY3JlYXRpbmcgYSBuZXcgYXBwbGljYXRpb24uXG4gKlxuICogQGV4YW1wbGVcbiAqIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cInNpbXBsZS1mcmVlc291bmQubWluLmpzXCI+PC9zY3JpcHQ+XG4gKlxuICogPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI+XG4gKiAgIHZhciBhcGlLZXkgPSBcInlvdXJfZnJlZXNvdW5kX2FwaV9rZXlfZ29lc19oZXJlXCI7XG4gKiAgIHZhciBzZiA9IG5ldyBzaW1wbGVGcmVlc291bmQuU2ltcGxlRnJlZXNvdW5kKGFwaUtleSk7XG4gKlxuICogICBzZi5xdWVyeSh7XG4gKiAgICAgc2VhcmNoOiBbICdkcnVtJywgJ2Jhc3MnIF0sXG4gKiAgICAgZHVyYXRpb246IFsgMC4wMSwgMSBdXG4gKiAgIH0pO1xuICogPC9zY3JpcHQ+XG4gKi9cbmNsYXNzIFNpbXBsZUZyZWVzb3VuZCBleHRlbmRzIEZyZWVzb3VuZFF1ZXJ5IHtcbiAgY29uc3RydWN0b3IoYXBpS2V5KSB7XG4gICAgc3VwZXIoYXBpS2V5KTtcbiAgICB0aGlzLmJ1ZmZlcnMgPVtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIGV2ZXJ5IGRldGFpbGVkIGluZm9ybWF0aW9uIG9idGFpbmVkIHNpbmNlXG4gICAqIGluc3RhbnRpYXRpb24gb3IgbGFzdCBjYWxsIHRvXG4gICAqIFs8Y29kZT5jbGVhcigpPC9jb2RlPl17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjY2xlYXJ9LlxuICAgKlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gc291bmRzSW5mb1xuICAgKi9cbiAgZ2V0IHNvdW5kc0luZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcFRvT2JqZWN0KHRoaXMuX3NvdW5kc0luZm8pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBkZXRhaWxlZCBpbmZvcm1hdGlvbiBvYnRhaW5lZCBmcm9tIHRoZSBsYXN0IGNhbGwgdG9cbiAgICogWzxjb2RlPnF1ZXJ5KCk8L2NvZGU+XXtAbGluayBtb2R1bGU6Y2xpZW50LlNpbXBsZUZyZWVzb3VuZCNxdWVyeX0sXG4gICAqIFs8Y29kZT5xdWVyeUZyb21JZHMoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5RnJvbUlkc30sXG4gICAqIFs8Y29kZT5kb3dubG9hZCgpPC9jb2RlPl17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjZG93bmxvYWR9IG9yXG4gICAqIFs8Y29kZT5xdWVyeUFuZERvd25sb2FkKCk8L2NvZGU+XXtAbGluayBtb2R1bGU6Y2xpZW50LlNpbXBsZUZyZWVzb3VuZCNxdWVyeUFuZERvd25sb2FkfS5cbiAgICpcbiAgICogQHByb3BlcnR5IHtPYmplY3R9IGN1cnJlbnRTb3VuZHNJbmZvXG4gICAqL1xuICBnZXQgY3VycmVudFNvdW5kc0luZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcFRvT2JqZWN0KHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcnJheSBvZiB0aGUgYnVmZmVycyBzdG9yZWQgaW50ZXJuYWxseSBvbiBkb3dubG9hZCBzdWNjZXNzLCBhZnRlciBjYWxsIHRvXG4gICAqIFs8Y29kZT5kb3dubG9hZCgpPC9jb2RlPl17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjZG93bmxvYWR9IG9yXG4gICAqIFs8Y29kZT5xdWVyeUFuZERvd25sb2FkKCk8L2NvZGU+XXtAbGluayBtb2R1bGU6Y2xpZW50LlNpbXBsZUZyZWVzb3VuZCNxdWVyeUFuZERvd25sb2FkfS5cbiAgICpcbiAgICogQHByb3BlcnR5IHtBcnJheS5BdWRpb0J1ZmZlcn0gYnVmZmVyc1xuICAgKi9cbiAgZ2V0IGJ1ZmZlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2J1ZmZlcnM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbGlzdCBvZiBzb3VuZCBpZHMgd2l0aCBkZXRhaWxlZCBpbmZvcm1hdGlvbiwgdGhhdCBjb3JyZXNwb25kIHRvIGEgc2V0IG9mIHF1ZXJ5IHBhcmFtZXRlcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeVBhcmFtcyAtIFRoZSBwYXJhbWV0ZXJzIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnNlYXJjaF0gLSBUaGUgc2VhcmNoIHRlcm1zIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy51c2VybmFtZV0gLSBBIGxpc3Qgb2YgdXNlcm5hbWVzIHRvIHNlYXJjaCBmaWxlcyBmcm9tLlxuICAgKiBAcGFyYW0ge0FycmF5fSBbcXVlcnlQYXJhbXMuZHVyYXRpb25dIC0gQW4gYXJyYXkgb2Ygc2l6ZSAyIDogWyBtaW5EdXJhdGlvbiwgbWF4RHVyYXRpb24gXSAoaW4gc2Vjb25kcykuXG4gICAqIElmIG1heER1cmF0aW9uIGlzIG5vdCBhIG51bWJlciwgaXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBcIipcIiAobm8gbWF4aW11bSBkdXJhdGlvbikuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIFByb21pc2Ugb2JqZWN0IHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgbGlzdCBvZiBuZXcgc291bmQgaWRzIGlmIHRoZSBxdWVyeSBnb2VzIHdlbGwuXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbiBlcnJvciBpZiBhIHByb2JsZW0gb2NjdXJzIGR1cmluZyB0aGUgcXVlcnkuXG4gICAqL1xuICBxdWVyeShxdWVyeVBhcmFtcykge1xuICAgIHJldHVybiBzdXBlci5xdWVyeShxdWVyeVBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGRldGFpbGVkIGluZm9ybWF0aW9uIG9mIHNvdW5kcyBmcm9tIHRoZWlyIGlkcy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheS5OdW1iZXJ9IGlkcyAtIFRoZSBpZHMgb2YgdGhlIHNvdW5kcyB3ZSB3YW50IHRvIGdldCB0aGUgZGV0YWlsZWQgaW5mbyBvZi5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHdpbGwgcmVzb2x2ZSB3aXRoIGFuIGFycmF5IG9mIHRoZSBzb3VuZCBpZHNcbiAgICogdGhlIGRldGFpbGVkIGluZm8gb2Ygd2hpY2ggbmVlZGVkIHRvIGJlIHF1ZXJpZWQuXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbiBlcnJvciBpZiBhIHByb2JsZW0gb2NjdXJzIGR1cmluZyB0aGUgcXVlcnkuXG4gICAqL1xuICBxdWVyeUZyb21JZHMoaWRzKSB7XG4gICAgcmV0dXJuIHN1cGVyLnF1ZXJ5RnJvbUlkcyhpZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvd25sb2FkIGhxIG1wMyBwcmV2aWV3cyBmcm9tIHRoZWlyIHNvdW5kIGlkcy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheS5OdW1iZXJ9IFtpZHM9bnVsbF0gLSBUaGUgaWRzIG9mIHRoZSBzb3VuZHMgdG8gZG93bmxvYWQuXG4gICAqIElmIDxjb2RlPm51bGw8L2NvZGU+LCB0aGUgaWRzIGZyb21cbiAgICogWzxjb2RlPmN1cnJlbnRTb3VuZHNJbmZvPC9jb2RlPl17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjY3VycmVudFNvdW5kc0luZm99XG4gICAqIHdpbGwgYmUgdXNlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHdpbGwgcmVzb2x2ZSBpZiB0aGUgZG93bmxvYWRzIGdvIHdlbGwuXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbiBlcnJvciBpZiBhIHByb2JsZW0gb2NjdXJzIGR1cmluZyB0aGUgZG93bmxvYWRzLlxuICAgKi9cbiAgZG93bmxvYWQoaWRzID0gbnVsbCkge1xuICAgIGlmIChpZHMgPT09IG51bGwpXG4gICAgICBpZHMgPSBBcnJheS5mcm9tKHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLmtleXMoKSk7XG5cbiAgICByZXR1cm4gdGhpcy5fZG93bmxvYWRGaWxlc0Zyb21VcmxzKGlkcyk7XG4gIH1cblxuICAvKipcbiAgICogRG93bmxvYWQgc291bmRzIGhxIG1wMyBwcmV2aWV3cyBmcm9tIHF1ZXJpZWQgc291bmQgaW5mb3JtYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeVBhcmFtcyAtIFRoZSBwYXJhbWV0ZXJzIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnNlYXJjaF0gLSBUaGUgc2VhcmNoIHRlcm1zIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy51c2VybmFtZV0gLSBBIGxpc3Qgb2YgdXNlcm5hbWVzIHRvIHNlYXJjaCBmaWxlcyBmcm9tLlxuICAgKiBAcGFyYW0ge0FycmF5fSBbcXVlcnlQYXJhbXMuZHVyYXRpb25dIC0gQW4gYXJyYXkgb2Ygc2l6ZSAyIDogWyBtaW5EdXJhdGlvbiwgbWF4RHVyYXRpb24gXSAoaW4gc2Vjb25kcykuXG4gICAqIElmIG1heER1cmF0aW9uIGlzIG5vdCBhIG51bWJlciwgaXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBcIipcIiAobm8gbWF4aW11bSBkdXJhdGlvbikuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbZGVzdGluYXRpb249Jy4nXSAtIFRoZSBmb2xkZXIgaW4gd2hpY2ggdG8gc2F2ZSB0aGUgZG93bmxvYWRlZCBmaWxlcy5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgUHJvbWlzZSBvYmplY3QgdGhhdCByZXNvbHZlcyB3aXRoIGFuIGFycmF5IG9mIHRoZVxuICAgKiBkb3dubG9hZGVkIDxjb2RlPkFuZGlvQnVmZmVyaWY8L2NvZGU+cyB0aGUgZG93bmxvYWRpbmcgZ28gd2VsbC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBkb3dubG9hZHMuXG4gICAqL1xuICBxdWVyeUFuZERvd25sb2FkKHF1ZXJ5UGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHN1cGVyLnF1ZXJ5KHF1ZXJ5UGFyYW1zKVxuICAgICAgICAudGhlbih1cGRhdGVkSWRzID0+IHtcbiAgICAgICAgICBjb25zdCBpZHMgPSBBcnJheS5mcm9tKHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLmtleXMoKSk7XG4gICAgICAgICAgdGhpcy5fZG93bmxvYWRGaWxlc0Zyb21VcmxzKGlkcyk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKHVwZGF0ZWRJZHMgPT4gcmVzb2x2ZSh1cGRhdGVkSWRzKSlcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZG93bmxvYWRGaWxlc0Zyb21VcmxzKGlkcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB1cmxzID0gW107XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWRzLmxlbmd0aDsgaSsrKVxuICAgICAgICB1cmxzLnB1c2godGhpcy5fY3VycmVudFNvdW5kc0luZm8uZ2V0KGlkc1tpXSlbJ3ByZXZpZXdzJ11bJ3ByZXZpZXctaHEtbXAzJ10pO1xuXG4gICAgICBsb2FkZXIubG9hZCh1cmxzKVxuICAgICAgICAudGhlbihidWZmZXJzID0+IHtcbiAgICAgICAgICB0aGlzLl9idWZmZXJzID0gYnVmZmVycztcblxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzb3VuZEluZm8gPSB0aGlzLl9jdXJyZW50U291bmRzSW5mby5nZXQoaWRzW2ldKTtcbiAgICAgICAgICAgIHNvdW5kSW5mb1snYnVmZmVyJ10gPSBidWZmZXJzW2ldO1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8uc2V0KGlkc1tpXSwgc291bmRJbmZvKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKHRoaXMuX2J1ZmZlcnMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciB0aGUgaW50ZXJuYWwgc291bmQgaW5mb3JtYXRpb24gbGlzdHMuXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLl9zb3VuZHNJbmZvID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvID0gbmV3IE1hcCgpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBTaW1wbGVGcmVlc291bmQ7XG4iXX0=