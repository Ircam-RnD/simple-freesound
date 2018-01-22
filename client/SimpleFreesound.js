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

var SimpleFreesound = function (_FreesoundQuery) {
  (0, _inherits3.default)(SimpleFreesound, _FreesoundQuery);

  function SimpleFreesound(apiKey) {
    (0, _classCallCheck3.default)(this, SimpleFreesound);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SimpleFreesound.__proto__ || (0, _getPrototypeOf2.default)(SimpleFreesound)).call(this, apiKey));

    _this._buffers = [];
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
      var _this3 = this;

      return new _promise2.default(function (resolve, reject) {
        var urls = [];

        for (var i = 0; i < ids.length; i++) {
          var url = _this3._currentSoundsInfo.get(ids[i])['previews']['preview-hq-mp3'];
          url = url.split(':'); //.splice(1);
          url[0] = 'https';
          url = url.join(':');

          urls.push(url);
        }

        loader.load(urls).then(function (buffers) {
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
    },
    set: function set(si) {
      this._soundsInfo = this._objectToMap(si);
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
    },
    set: function set(csi) {
      this._currentSoundsInfo = this._objectToMap(csi);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImxvYWRlcnMiLCJsb2FkZXIiLCJBdWRpb0J1ZmZlckxvYWRlciIsIlNpbXBsZUZyZWVzb3VuZCIsImFwaUtleSIsIl9idWZmZXJzIiwicXVlcnlQYXJhbXMiLCJpZHMiLCJfY3VycmVudFNvdW5kc0luZm8iLCJrZXlzIiwiX2Rvd25sb2FkRmlsZXNGcm9tVXJscyIsInJlc29sdmUiLCJyZWplY3QiLCJ0aGVuIiwidXBkYXRlZElkcyIsInVybHMiLCJpIiwibGVuZ3RoIiwidXJsIiwiZ2V0Iiwic3BsaXQiLCJqb2luIiwicHVzaCIsImxvYWQiLCJidWZmZXJzIiwic291bmRJbmZvIiwic2V0IiwiX3NvdW5kc0luZm8iLCJfbWFwVG9PYmplY3QiLCJzaSIsIl9vYmplY3RUb01hcCIsImNzaSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLE87O0FBQ1o7Ozs7Ozs7O0FBRUEsSUFBTUMsU0FBUyxJQUFJRCxRQUFRRSxpQkFBWixFQUFmOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFzQ01DLGU7OztBQUNKLDJCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQUEsd0pBQ1pBLE1BRFk7O0FBRWxCLFVBQUtDLFFBQUwsR0FBZSxFQUFmO0FBRmtCO0FBR25COztBQUVEOzs7Ozs7Ozs7Ozs7O0FBMkNBOzs7Ozs7Ozs7Ozs7OzBCQWFNQyxXLEVBQWE7QUFDakIsMkpBQW1CQSxXQUFuQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7O2lDQVVhQyxHLEVBQUs7QUFDaEIsa0tBQTBCQSxHQUExQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7K0JBWXFCO0FBQUEsVUFBWkEsR0FBWSx1RUFBTixJQUFNOztBQUNuQixVQUFJQSxRQUFRLElBQVosRUFDRUEsTUFBTSxvQkFBVyxLQUFLQyxrQkFBTCxDQUF3QkMsSUFBeEIsRUFBWCxDQUFOOztBQUVGLGFBQU8sS0FBS0Msc0JBQUwsQ0FBNEJILEdBQTVCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQ0FnQmlCRCxXLEVBQWE7QUFBQTs7QUFDNUIsYUFBTyxzQkFBWSxVQUFDSyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsMEpBQVlOLFdBQVosRUFDR08sSUFESCxDQUNRLHNCQUFjO0FBQ2xCLGNBQU1OLE1BQU0sb0JBQVcsT0FBS0Msa0JBQUwsQ0FBd0JDLElBQXhCLEVBQVgsQ0FBWjtBQUNBLGlCQUFLQyxzQkFBTCxDQUE0QkgsR0FBNUI7QUFDRCxTQUpILEVBS0dNLElBTEgsQ0FLUTtBQUFBLGlCQUFjRixRQUFRRyxVQUFSLENBQWQ7QUFBQSxTQUxSO0FBTUQsT0FQTSxDQUFQO0FBUUQ7O0FBRUQ7Ozs7Ozs0QkFHUSxDQUlQO0FBSEM7QUFDQTtBQUNBOzs7QUFHRjs7OzsyQ0FDdUJQLEcsRUFBSztBQUFBOztBQUMxQixhQUFPLHNCQUFZLFVBQUNJLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxZQUFNRyxPQUFPLEVBQWI7O0FBRUEsYUFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlULElBQUlVLE1BQXhCLEVBQWdDRCxHQUFoQyxFQUFxQztBQUNuQyxjQUFJRSxNQUFNLE9BQUtWLGtCQUFMLENBQXdCVyxHQUF4QixDQUE0QlosSUFBSVMsQ0FBSixDQUE1QixFQUFvQyxVQUFwQyxFQUFnRCxnQkFBaEQsQ0FBVjtBQUNBRSxnQkFBTUEsSUFBSUUsS0FBSixDQUFVLEdBQVYsQ0FBTixDQUZtQyxDQUVkO0FBQ3JCRixjQUFJLENBQUosSUFBUyxPQUFUO0FBQ0FBLGdCQUFNQSxJQUFJRyxJQUFKLENBQVMsR0FBVCxDQUFOOztBQUVBTixlQUFLTyxJQUFMLENBQVVKLEdBQVY7QUFDRDs7QUFFRGpCLGVBQU9zQixJQUFQLENBQVlSLElBQVosRUFDR0YsSUFESCxDQUNRLG1CQUFXO0FBQ2YsaUJBQUtSLFFBQUwsR0FBZ0JtQixPQUFoQjs7QUFFQSxlQUFLLElBQUlSLEtBQUksQ0FBYixFQUFnQkEsS0FBSVQsSUFBSVUsTUFBeEIsRUFBZ0NELElBQWhDLEVBQXFDO0FBQ25DLGdCQUFNUyxZQUFZLE9BQUtqQixrQkFBTCxDQUF3QlcsR0FBeEIsQ0FBNEJaLElBQUlTLEVBQUosQ0FBNUIsQ0FBbEI7QUFDQVMsc0JBQVUsUUFBVixJQUFzQkQsUUFBUVIsRUFBUixDQUF0QjtBQUNBLG1CQUFLUixrQkFBTCxDQUF3QmtCLEdBQXhCLENBQTRCbkIsSUFBSVMsRUFBSixDQUE1QixFQUFvQ1MsU0FBcEM7QUFDRDs7QUFFRGQsa0JBQVEsT0FBS04sUUFBYjtBQUNELFNBWEg7QUFZRCxPQXhCTSxDQUFQO0FBeUJEOztBQUVEOzs7Ozs7NEJBR1E7QUFDTixXQUFLc0IsV0FBTCxHQUFtQixtQkFBbkI7QUFDQSxXQUFLbkIsa0JBQUwsR0FBMEIsbUJBQTFCO0FBQ0Q7Ozt3QkE3SmdCO0FBQ2YsYUFBTyxLQUFLb0IsWUFBTCxDQUFrQixLQUFLRCxXQUF2QixDQUFQO0FBQ0QsSztzQkFFY0UsRSxFQUFJO0FBQ2pCLFdBQUtGLFdBQUwsR0FBbUIsS0FBS0csWUFBTCxDQUFrQkQsRUFBbEIsQ0FBbkI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7O3dCQVN3QjtBQUN0QixhQUFPLEtBQUtELFlBQUwsQ0FBa0IsS0FBS3BCLGtCQUF2QixDQUFQO0FBQ0QsSztzQkFFcUJ1QixHLEVBQUs7QUFDekIsV0FBS3ZCLGtCQUFMLEdBQTBCLEtBQUtzQixZQUFMLENBQWtCQyxHQUFsQixDQUExQjtBQUNEOztBQUVEOzs7Ozs7Ozs7O3dCQU9jO0FBQ1osYUFBTyxLQUFLMUIsUUFBWjtBQUNEOzs7OztBQTRIRjs7a0JBRWNGLGUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBsb2FkZXJzIGZyb20gJ3dhdmVzLWxvYWRlcnMnO1xuaW1wb3J0IEZyZWVzb3VuZFF1ZXJ5IGZyb20gJy4uL2NvbW1vbi9GcmVlc291bmRRdWVyeSc7XG5cbmNvbnN0IGxvYWRlciA9IG5ldyBsb2FkZXJzLkF1ZGlvQnVmZmVyTG9hZGVyKCk7XG5cbi8qKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnRcbiAqXG4gKiBAY2xhc3MgPGI+PGg1PmNsaWVudC5TaW1wbGVGcmVlc291bmQ8L2g1PjwvYj5cbiAqXG4gKiBDbGllbnQgc2lkZSBjbGFzcyBhbGxvd2luZyB0byBxdWVyeSBkZXRhaWxlZCBpbmZvIG9uIHNvdW5kcyBhbmQgZG93bmxvYWQgdGhlbVxuICogZnJvbSA8YSBocmVmPVwiaHR0cDovL2ZyZWVzb3VuZC5vcmdcIiB0YXJnZXQ9XCJfYmxhbmtcIj5mcmVlc291bmQ8L2E+LlxuICpcbiAqIC0gbWVtYmVyc1xuICogICAgIC0gW3NvdW5kc0luZm9de0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI3NvdW5kc0luZm99XG4gKiAgICAgLSBbY3VycmVudFNvdW5kc0luZm9de0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI2N1cnJlbnRTb3VuZHNJbmZvfVxuICogICAgIC0gW2J1ZmZlcnNde0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI2J1ZmZlcnN9XG4gKiAtIG1ldGhvZHNcbiAqICAgICAtIFtxdWVyeV17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjcXVlcnl9XG4gKiAgICAgLSBbcXVlcnlGcm9tSWRzXXtAbGluayBtb2R1bGU6Y2xpZW50LlNpbXBsZUZyZWVzb3VuZCNxdWVyeUZyb21JZHN9XG4gKiAgICAgLSBbZG93bmxvYWRde0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI2Rvd25sb2FkfVxuICogICAgIC0gW3F1ZXJ5QW5kRG93bmxvYWRde0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5QW5kRG93bmxvYWR9XG4gKiAgICAgLSBbY2xlYXJde0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI2NsZWFyfVxuICpcbiAqIFBvd2VyZWQgYnlcbiAqIDxhIGhyZWY9XCJodHRwOi8vZnJlZXNvdW5kLm9yZy9kb2NzL2FwaS9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5mcmVlc291bmQgYXBpPC9hPi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYXBpS2V5IC0gWW91ciBhcGkga2V5LCBhcyBnZW5lcmF0ZWQgZnJvbSB5b3VyIGZyZWVzb3VuZFxuICogZGV2ZWxvcGVyIGFjY291bnQgd2hlbiBjcmVhdGluZyBhIG5ldyBhcHBsaWNhdGlvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwic2ltcGxlLWZyZWVzb3VuZC5taW4uanNcIj48L3NjcmlwdD5cbiAqXG4gKiA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIj5cbiAqICAgdmFyIGFwaUtleSA9IFwieW91cl9mcmVlc291bmRfYXBpX2tleV9nb2VzX2hlcmVcIjtcbiAqICAgdmFyIHNmID0gbmV3IHNpbXBsZUZyZWVzb3VuZC5TaW1wbGVGcmVlc291bmQoYXBpS2V5KTtcbiAqXG4gKiAgIHNmLnF1ZXJ5KHtcbiAqICAgICBzZWFyY2g6IFsgJ2RydW0nLCAnYmFzcycgXSxcbiAqICAgICBkdXJhdGlvbjogWyAwLjAxLCAxIF1cbiAqICAgfSk7XG4gKiA8L3NjcmlwdD5cbiAqL1xuY2xhc3MgU2ltcGxlRnJlZXNvdW5kIGV4dGVuZHMgRnJlZXNvdW5kUXVlcnkge1xuICBjb25zdHJ1Y3RvcihhcGlLZXkpIHtcbiAgICBzdXBlcihhcGlLZXkpO1xuICAgIHRoaXMuX2J1ZmZlcnMgPVtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIGV2ZXJ5IGRldGFpbGVkIGluZm9ybWF0aW9uIG9idGFpbmVkIHNpbmNlXG4gICAqIGluc3RhbnRpYXRpb24gb3IgbGFzdCBjYWxsIHRvXG4gICAqIFs8Y29kZT5jbGVhcigpPC9jb2RlPl17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjY2xlYXJ9LlxuICAgKlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gc291bmRzSW5mb1xuICAgKi9cbiAgZ2V0IHNvdW5kc0luZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcFRvT2JqZWN0KHRoaXMuX3NvdW5kc0luZm8pO1xuICB9XG5cbiAgc2V0IHNvdW5kc0luZm8oc2kpIHtcbiAgICB0aGlzLl9zb3VuZHNJbmZvID0gdGhpcy5fb2JqZWN0VG9NYXAoc2kpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBkZXRhaWxlZCBpbmZvcm1hdGlvbiBvYnRhaW5lZCBmcm9tIHRoZSBsYXN0IGNhbGwgdG9cbiAgICogWzxjb2RlPnF1ZXJ5KCk8L2NvZGU+XXtAbGluayBtb2R1bGU6Y2xpZW50LlNpbXBsZUZyZWVzb3VuZCNxdWVyeX0sXG4gICAqIFs8Y29kZT5xdWVyeUZyb21JZHMoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5RnJvbUlkc30sXG4gICAqIFs8Y29kZT5kb3dubG9hZCgpPC9jb2RlPl17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjZG93bmxvYWR9IG9yXG4gICAqIFs8Y29kZT5xdWVyeUFuZERvd25sb2FkKCk8L2NvZGU+XXtAbGluayBtb2R1bGU6Y2xpZW50LlNpbXBsZUZyZWVzb3VuZCNxdWVyeUFuZERvd25sb2FkfS5cbiAgICpcbiAgICogQHByb3BlcnR5IHtPYmplY3R9IGN1cnJlbnRTb3VuZHNJbmZvXG4gICAqL1xuICBnZXQgY3VycmVudFNvdW5kc0luZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcFRvT2JqZWN0KHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvKTtcbiAgfVxuXG4gIHNldCBjdXJyZW50U291bmRzSW5mbyhjc2kpIHtcbiAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mbyA9IHRoaXMuX29iamVjdFRvTWFwKGNzaSk7XG4gIH1cblxuICAvKipcbiAgICogQXJyYXkgb2YgdGhlIGJ1ZmZlcnMgc3RvcmVkIGludGVybmFsbHkgb24gZG93bmxvYWQgc3VjY2VzcywgYWZ0ZXIgY2FsbCB0b1xuICAgKiBbPGNvZGU+ZG93bmxvYWQoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI2Rvd25sb2FkfSBvclxuICAgKiBbPGNvZGU+cXVlcnlBbmREb3dubG9hZCgpPC9jb2RlPl17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjcXVlcnlBbmREb3dubG9hZH0uXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuQXVkaW9CdWZmZXJ9IGJ1ZmZlcnNcbiAgICovXG4gIGdldCBidWZmZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl9idWZmZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGxpc3Qgb2Ygc291bmQgaWRzIHdpdGggZGV0YWlsZWQgaW5mb3JtYXRpb24sIHRoYXQgY29ycmVzcG9uZCB0byBhIHNldCBvZiBxdWVyeSBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlQYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy5zZWFyY2hdIC0gVGhlIHNlYXJjaCB0ZXJtcyB0aGF0IHdpbGwgYmUgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMudXNlcm5hbWVdIC0gQSBsaXN0IG9mIHVzZXJuYW1lcyB0byBzZWFyY2ggZmlsZXMgZnJvbS5cbiAgICogQHBhcmFtIHtBcnJheX0gW3F1ZXJ5UGFyYW1zLmR1cmF0aW9uXSAtIEFuIGFycmF5IG9mIHNpemUgMiA6IFsgbWluRHVyYXRpb24sIG1heER1cmF0aW9uIF0gKGluIHNlY29uZHMpLlxuICAgKiBJZiBtYXhEdXJhdGlvbiBpcyBub3QgYSBudW1iZXIsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgXCIqXCIgKG5vIG1heGltdW0gZHVyYXRpb24pLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBQcm9taXNlIG9iamVjdCB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGxpc3Qgb2YgbmV3IHNvdW5kIGlkcyBpZiB0aGUgcXVlcnkgZ29lcyB3ZWxsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIHF1ZXJ5LlxuICAgKi9cbiAgcXVlcnkocXVlcnlQYXJhbXMpIHtcbiAgICByZXR1cm4gc3VwZXIucXVlcnkocXVlcnlQYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBkZXRhaWxlZCBpbmZvcm1hdGlvbiBvZiBzb3VuZHMgZnJvbSB0aGVpciBpZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXkuTnVtYmVyfSBpZHMgLSBUaGUgaWRzIG9mIHRoZSBzb3VuZHMgd2Ugd2FudCB0byBnZXQgdGhlIGRldGFpbGVkIGluZm8gb2YuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCB3aWxsIHJlc29sdmUgd2l0aCBhbiBhcnJheSBvZiB0aGUgc291bmQgaWRzXG4gICAqIHRoZSBkZXRhaWxlZCBpbmZvIG9mIHdoaWNoIG5lZWRlZCB0byBiZSBxdWVyaWVkLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIHF1ZXJ5LlxuICAgKi9cbiAgcXVlcnlGcm9tSWRzKGlkcykge1xuICAgIHJldHVybiBzdXBlci5xdWVyeUZyb21JZHMoaWRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb3dubG9hZCBocSBtcDMgcHJldmlld3MgZnJvbSB0aGVpciBzb3VuZCBpZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXkuTnVtYmVyfSBbaWRzPW51bGxdIC0gVGhlIGlkcyBvZiB0aGUgc291bmRzIHRvIGRvd25sb2FkLlxuICAgKiBJZiA8Y29kZT5udWxsPC9jb2RlPiwgdGhlIGlkcyBmcm9tXG4gICAqIFs8Y29kZT5jdXJyZW50U291bmRzSW5mbzwvY29kZT5de0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI2N1cnJlbnRTb3VuZHNJbmZvfVxuICAgKiB3aWxsIGJlIHVzZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCB3aWxsIHJlc29sdmUgaWYgdGhlIGRvd25sb2FkcyBnbyB3ZWxsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIGRvd25sb2Fkcy5cbiAgICovXG4gIGRvd25sb2FkKGlkcyA9IG51bGwpIHtcbiAgICBpZiAoaWRzID09PSBudWxsKVxuICAgICAgaWRzID0gQXJyYXkuZnJvbSh0aGlzLl9jdXJyZW50U291bmRzSW5mby5rZXlzKCkpO1xuXG4gICAgcmV0dXJuIHRoaXMuX2Rvd25sb2FkRmlsZXNGcm9tVXJscyhpZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvd25sb2FkIHNvdW5kcyBocSBtcDMgcHJldmlld3MgZnJvbSBxdWVyaWVkIHNvdW5kIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlQYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy5zZWFyY2hdIC0gVGhlIHNlYXJjaCB0ZXJtcyB0aGF0IHdpbGwgYmUgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMudXNlcm5hbWVdIC0gQSBsaXN0IG9mIHVzZXJuYW1lcyB0byBzZWFyY2ggZmlsZXMgZnJvbS5cbiAgICogQHBhcmFtIHtBcnJheX0gW3F1ZXJ5UGFyYW1zLmR1cmF0aW9uXSAtIEFuIGFycmF5IG9mIHNpemUgMiA6IFsgbWluRHVyYXRpb24sIG1heER1cmF0aW9uIF0gKGluIHNlY29uZHMpLlxuICAgKiBJZiBtYXhEdXJhdGlvbiBpcyBub3QgYSBudW1iZXIsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgXCIqXCIgKG5vIG1heGltdW0gZHVyYXRpb24pLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2Rlc3RpbmF0aW9uPScuJ10gLSBUaGUgZm9sZGVyIGluIHdoaWNoIHRvIHNhdmUgdGhlIGRvd25sb2FkZWQgZmlsZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIFByb21pc2Ugb2JqZWN0IHRoYXQgcmVzb2x2ZXMgd2l0aCBhbiBhcnJheSBvZiB0aGVcbiAgICogZG93bmxvYWRlZCA8Y29kZT5BbmRpb0J1ZmZlcmlmPC9jb2RlPnMgdGhlIGRvd25sb2FkaW5nIGdvIHdlbGwuXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbiBlcnJvciBpZiBhIHByb2JsZW0gb2NjdXJzIGR1cmluZyB0aGUgZG93bmxvYWRzLlxuICAgKi9cbiAgcXVlcnlBbmREb3dubG9hZChxdWVyeVBhcmFtcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzdXBlci5xdWVyeShxdWVyeVBhcmFtcylcbiAgICAgICAgLnRoZW4odXBkYXRlZElkcyA9PiB7XG4gICAgICAgICAgY29uc3QgaWRzID0gQXJyYXkuZnJvbSh0aGlzLl9jdXJyZW50U291bmRzSW5mby5rZXlzKCkpO1xuICAgICAgICAgIHRoaXMuX2Rvd25sb2FkRmlsZXNGcm9tVXJscyhpZHMpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbih1cGRhdGVkSWRzID0+IHJlc29sdmUodXBkYXRlZElkcykpXG4gICAgfSk7XG4gIH1cblxuICAvKioqXG4gICAqIENhbmNlbCBhbGwgdW5yZXNvbHZlZCB5ZXQgcHJvbWlzZXMgKHF1ZXJpZXMgYW5kIGRvd25sb2FkcykuXG4gICAqL1xuICBhYm9ydCgpIHtcbiAgICAvLyBUT0RPIChubyBuYXRpdmUgd2F5IHRvIGNhbmNlbCB1bnJlc29sdmVkIHlldCBwcm9taXNlcylcbiAgICAvLyBtYXliZSB1c2luZyBQcm9taXNlLnJhY2UoKSB3aXRoIGEgY2FuY2VsbGFibGUgcHJvbWlzZSBhbmRcbiAgICAvLyB0aGUgcmVzdWx0IG9mIFByb21pc2UuYWxsIGluIGEgc2FtZSBBcnJheSAvIGl0ZXJhYmxlIC4uLiA/XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2Rvd25sb2FkRmlsZXNGcm9tVXJscyhpZHMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdXJscyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgdXJsID0gdGhpcy5fY3VycmVudFNvdW5kc0luZm8uZ2V0KGlkc1tpXSlbJ3ByZXZpZXdzJ11bJ3ByZXZpZXctaHEtbXAzJ107XG4gICAgICAgIHVybCA9IHVybC5zcGxpdCgnOicpOy8vLnNwbGljZSgxKTtcbiAgICAgICAgdXJsWzBdID0gJ2h0dHBzJztcbiAgICAgICAgdXJsID0gdXJsLmpvaW4oJzonKTtcblxuICAgICAgICB1cmxzLnB1c2godXJsKTtcbiAgICAgIH1cblxuICAgICAgbG9hZGVyLmxvYWQodXJscylcbiAgICAgICAgLnRoZW4oYnVmZmVycyA9PiB7XG4gICAgICAgICAgdGhpcy5fYnVmZmVycyA9IGJ1ZmZlcnM7XG5cbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgc291bmRJbmZvID0gdGhpcy5fY3VycmVudFNvdW5kc0luZm8uZ2V0KGlkc1tpXSk7XG4gICAgICAgICAgICBzb3VuZEluZm9bJ2J1ZmZlciddID0gYnVmZmVyc1tpXTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLnNldChpZHNbaV0sIHNvdW5kSW5mbyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSh0aGlzLl9idWZmZXJzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgdGhlIGludGVybmFsIHNvdW5kIGluZm9ybWF0aW9uIGxpc3RzLlxuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5fc291bmRzSW5mbyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mbyA9IG5ldyBNYXAoKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgU2ltcGxlRnJlZXNvdW5kO1xuIl19