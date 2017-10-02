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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImxvYWRlcnMiLCJsb2FkZXIiLCJBdWRpb0J1ZmZlckxvYWRlciIsIlNpbXBsZUZyZWVzb3VuZCIsImFwaUtleSIsImJ1ZmZlcnMiLCJxdWVyeVBhcmFtcyIsImlkcyIsIl9jdXJyZW50U291bmRzSW5mbyIsImtleXMiLCJfZG93bmxvYWRGaWxlc0Zyb21VcmxzIiwicmVzb2x2ZSIsInJlamVjdCIsInRoZW4iLCJ1cGRhdGVkSWRzIiwidXJscyIsImkiLCJsZW5ndGgiLCJwdXNoIiwiZ2V0IiwibG9hZCIsIl9idWZmZXJzIiwic291bmRJbmZvIiwic2V0IiwiX3NvdW5kc0luZm8iLCJfbWFwVG9PYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxPOztBQUNaOzs7Ozs7OztBQUVBLElBQU1DLFNBQVMsSUFBSUQsUUFBUUUsaUJBQVosRUFBZjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBc0NNQyxlOzs7QUFDSiwyQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUFBLHdKQUNaQSxNQURZOztBQUVsQixVQUFLQyxPQUFMLEdBQWMsRUFBZDtBQUZrQjtBQUduQjs7QUFFRDs7Ozs7Ozs7Ozs7OztBQW1DQTs7Ozs7Ozs7Ozs7OzswQkFhTUMsVyxFQUFhO0FBQ2pCLDJKQUFtQkEsV0FBbkI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7OztpQ0FVYUMsRyxFQUFLO0FBQ2hCLGtLQUEwQkEsR0FBMUI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OytCQVlxQjtBQUFBLFVBQVpBLEdBQVksdUVBQU4sSUFBTTs7QUFDbkIsVUFBSUEsUUFBUSxJQUFaLEVBQ0VBLE1BQU0sb0JBQVcsS0FBS0Msa0JBQUwsQ0FBd0JDLElBQXhCLEVBQVgsQ0FBTjs7QUFFRixhQUFPLEtBQUtDLHNCQUFMLENBQTRCSCxHQUE1QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUNBZ0JpQkQsVyxFQUFhO0FBQUE7O0FBQzVCLGFBQU8sc0JBQVksVUFBQ0ssT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLDBKQUFZTixXQUFaLEVBQ0dPLElBREgsQ0FDUSxzQkFBYztBQUNsQixjQUFNTixNQUFNLG9CQUFXLE9BQUtDLGtCQUFMLENBQXdCQyxJQUF4QixFQUFYLENBQVo7QUFDQSxpQkFBS0Msc0JBQUwsQ0FBNEJILEdBQTVCO0FBQ0QsU0FKSCxFQUtHTSxJQUxILENBS1E7QUFBQSxpQkFBY0YsUUFBUUcsVUFBUixDQUFkO0FBQUEsU0FMUjtBQU1ELE9BUE0sQ0FBUDtBQVFEOztBQUVEOzs7OzJDQUN1QlAsRyxFQUFLO0FBQUE7O0FBQzFCLGFBQU8sc0JBQVksVUFBQ0ksT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLFlBQU1HLE9BQU8sRUFBYjs7QUFFQSxhQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSVQsSUFBSVUsTUFBeEIsRUFBZ0NELEdBQWhDO0FBQ0VELGVBQUtHLElBQUwsQ0FBVSxPQUFLVixrQkFBTCxDQUF3QlcsR0FBeEIsQ0FBNEJaLElBQUlTLENBQUosQ0FBNUIsRUFBb0MsVUFBcEMsRUFBZ0QsZ0JBQWhELENBQVY7QUFERixTQUdBZixPQUFPbUIsSUFBUCxDQUFZTCxJQUFaLEVBQ0dGLElBREgsQ0FDUSxtQkFBVztBQUNmLGlCQUFLUSxRQUFMLEdBQWdCaEIsT0FBaEI7O0FBRUEsZUFBSyxJQUFJVyxLQUFJLENBQWIsRUFBZ0JBLEtBQUlULElBQUlVLE1BQXhCLEVBQWdDRCxJQUFoQyxFQUFxQztBQUNuQyxnQkFBTU0sWUFBWSxPQUFLZCxrQkFBTCxDQUF3QlcsR0FBeEIsQ0FBNEJaLElBQUlTLEVBQUosQ0FBNUIsQ0FBbEI7QUFDQU0sc0JBQVUsUUFBVixJQUFzQmpCLFFBQVFXLEVBQVIsQ0FBdEI7QUFDQSxtQkFBS1Isa0JBQUwsQ0FBd0JlLEdBQXhCLENBQTRCaEIsSUFBSVMsRUFBSixDQUE1QixFQUFvQ00sU0FBcEM7QUFDRDs7QUFFRFgsa0JBQVEsT0FBS1UsUUFBYjtBQUNELFNBWEg7QUFZRCxPQWxCTSxDQUFQO0FBbUJEOztBQUVEOzs7Ozs7NEJBR1E7QUFDTixXQUFLRyxXQUFMLEdBQW1CLG1CQUFuQjtBQUNBLFdBQUtoQixrQkFBTCxHQUEwQixtQkFBMUI7QUFDRDs7O3dCQXRJZ0I7QUFDZixhQUFPLEtBQUtpQixZQUFMLENBQWtCLEtBQUtELFdBQXZCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7O3dCQVN3QjtBQUN0QixhQUFPLEtBQUtDLFlBQUwsQ0FBa0IsS0FBS2pCLGtCQUF2QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7d0JBT2M7QUFDWixhQUFPLEtBQUthLFFBQVo7QUFDRDs7Ozs7QUE2R0Y7O2tCQUVjbEIsZSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGxvYWRlcnMgZnJvbSAnd2F2ZXMtbG9hZGVycyc7XG5pbXBvcnQgRnJlZXNvdW5kUXVlcnkgZnJvbSAnLi4vY29tbW9uL0ZyZWVzb3VuZFF1ZXJ5JztcblxuY29uc3QgbG9hZGVyID0gbmV3IGxvYWRlcnMuQXVkaW9CdWZmZXJMb2FkZXIoKTtcblxuLyoqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudFxuICpcbiAqIEBjbGFzcyA8Yj48aDU+Y2xpZW50LlNpbXBsZUZyZWVzb3VuZDwvaDU+PC9iPlxuICpcbiAqIENsaWVudCBzaWRlIGNsYXNzIGFsbG93aW5nIHRvIHF1ZXJ5IGRldGFpbGVkIGluZm8gb24gc291bmRzIGFuZCBkb3dubG9hZCB0aGVtXG4gKiBmcm9tIDxhIGhyZWY9XCJodHRwOi8vZnJlZXNvdW5kLm9yZ1wiIHRhcmdldD1cIl9ibGFua1wiPmZyZWVzb3VuZDwvYT4uXG4gKlxuICogLSBtZW1iZXJzXG4gKiAgICAgLSBbc291bmRzSW5mb117QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjc291bmRzSW5mb31cbiAqICAgICAtIFtjdXJyZW50U291bmRzSW5mb117QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjY3VycmVudFNvdW5kc0luZm99XG4gKiAgICAgLSBbYnVmZmVyc117QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjYnVmZmVyc31cbiAqIC0gbWV0aG9kc1xuICogICAgIC0gW3F1ZXJ5XXtAbGluayBtb2R1bGU6Y2xpZW50LlNpbXBsZUZyZWVzb3VuZCNxdWVyeX1cbiAqICAgICAtIFtxdWVyeUZyb21JZHNde0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI3F1ZXJ5RnJvbUlkc31cbiAqICAgICAtIFtkb3dubG9hZF17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjZG93bmxvYWR9XG4gKiAgICAgLSBbcXVlcnlBbmREb3dubG9hZF17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjcXVlcnlBbmREb3dubG9hZH1cbiAqICAgICAtIFtjbGVhcl17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjY2xlYXJ9XG4gKlxuICogUG93ZXJlZCBieVxuICogPGEgaHJlZj1cImh0dHA6Ly9mcmVlc291bmQub3JnL2RvY3MvYXBpL1wiIHRhcmdldD1cIl9ibGFua1wiPmZyZWVzb3VuZCBhcGk8L2E+LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcGlLZXkgLSBZb3VyIGFwaSBrZXksIGFzIGdlbmVyYXRlZCBmcm9tIHlvdXIgZnJlZXNvdW5kXG4gKiBkZXZlbG9wZXIgYWNjb3VudCB3aGVuIGNyZWF0aW5nIGEgbmV3IGFwcGxpY2F0aW9uLlxuICpcbiAqIEBleGFtcGxlXG4gKiA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCJzaW1wbGUtZnJlZXNvdW5kLm1pbi5qc1wiPjwvc2NyaXB0PlxuICpcbiAqIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiPlxuICogICB2YXIgYXBpS2V5ID0gXCJ5b3VyX2ZyZWVzb3VuZF9hcGlfa2V5X2dvZXNfaGVyZVwiO1xuICogICB2YXIgc2YgPSBuZXcgc2ltcGxlRnJlZXNvdW5kLlNpbXBsZUZyZWVzb3VuZChhcGlLZXkpO1xuICpcbiAqICAgc2YucXVlcnkoe1xuICogICAgIHNlYXJjaDogWyAnZHJ1bScsICdiYXNzJyBdLFxuICogICAgIGR1cmF0aW9uOiBbIDAuMDEsIDEgXVxuICogICB9KTtcbiAqIDwvc2NyaXB0PlxuICovXG5jbGFzcyBTaW1wbGVGcmVlc291bmQgZXh0ZW5kcyBGcmVlc291bmRRdWVyeSB7XG4gIGNvbnN0cnVjdG9yKGFwaUtleSkge1xuICAgIHN1cGVyKGFwaUtleSk7XG4gICAgdGhpcy5idWZmZXJzID1bXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgY29udGFpbmluZyBldmVyeSBkZXRhaWxlZCBpbmZvcm1hdGlvbiBvYnRhaW5lZCBzaW5jZVxuICAgKiBpbnN0YW50aWF0aW9uIG9yIGxhc3QgY2FsbCB0b1xuICAgKiBbPGNvZGU+Y2xlYXIoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI2NsZWFyfS5cbiAgICpcbiAgICogQHByb3BlcnR5IHtPYmplY3R9IHNvdW5kc0luZm9cbiAgICovXG4gIGdldCBzb3VuZHNJbmZvKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXBUb09iamVjdCh0aGlzLl9zb3VuZHNJbmZvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgZGV0YWlsZWQgaW5mb3JtYXRpb24gb2J0YWluZWQgZnJvbSB0aGUgbGFzdCBjYWxsIHRvXG4gICAqIFs8Y29kZT5xdWVyeSgpPC9jb2RlPl17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjcXVlcnl9LFxuICAgKiBbPGNvZGU+cXVlcnlGcm9tSWRzKCk8L2NvZGU+XXtAbGluayBtb2R1bGU6Y2xpZW50LlNpbXBsZUZyZWVzb3VuZCNxdWVyeUZyb21JZHN9LFxuICAgKiBbPGNvZGU+ZG93bmxvYWQoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI2Rvd25sb2FkfSBvclxuICAgKiBbPGNvZGU+cXVlcnlBbmREb3dubG9hZCgpPC9jb2RlPl17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjcXVlcnlBbmREb3dubG9hZH0uXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBjdXJyZW50U291bmRzSW5mb1xuICAgKi9cbiAgZ2V0IGN1cnJlbnRTb3VuZHNJbmZvKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXBUb09iamVjdCh0aGlzLl9jdXJyZW50U291bmRzSW5mbyk7XG4gIH1cblxuICAvKipcbiAgICogQXJyYXkgb2YgdGhlIGJ1ZmZlcnMgc3RvcmVkIGludGVybmFsbHkgb24gZG93bmxvYWQgc3VjY2VzcywgYWZ0ZXIgY2FsbCB0b1xuICAgKiBbPGNvZGU+ZG93bmxvYWQoKTwvY29kZT5de0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI2Rvd25sb2FkfSBvclxuICAgKiBbPGNvZGU+cXVlcnlBbmREb3dubG9hZCgpPC9jb2RlPl17QGxpbmsgbW9kdWxlOmNsaWVudC5TaW1wbGVGcmVlc291bmQjcXVlcnlBbmREb3dubG9hZH0uXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuQXVkaW9CdWZmZXJ9IGJ1ZmZlcnNcbiAgICovXG4gIGdldCBidWZmZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl9idWZmZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGxpc3Qgb2Ygc291bmQgaWRzIHdpdGggZGV0YWlsZWQgaW5mb3JtYXRpb24sIHRoYXQgY29ycmVzcG9uZCB0byBhIHNldCBvZiBxdWVyeSBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlQYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy5zZWFyY2hdIC0gVGhlIHNlYXJjaCB0ZXJtcyB0aGF0IHdpbGwgYmUgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMudXNlcm5hbWVdIC0gQSBsaXN0IG9mIHVzZXJuYW1lcyB0byBzZWFyY2ggZmlsZXMgZnJvbS5cbiAgICogQHBhcmFtIHtBcnJheX0gW3F1ZXJ5UGFyYW1zLmR1cmF0aW9uXSAtIEFuIGFycmF5IG9mIHNpemUgMiA6IFsgbWluRHVyYXRpb24sIG1heER1cmF0aW9uIF0gKGluIHNlY29uZHMpLlxuICAgKiBJZiBtYXhEdXJhdGlvbiBpcyBub3QgYSBudW1iZXIsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgXCIqXCIgKG5vIG1heGltdW0gZHVyYXRpb24pLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBQcm9taXNlIG9iamVjdCB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGxpc3Qgb2YgbmV3IHNvdW5kIGlkcyBpZiB0aGUgcXVlcnkgZ29lcyB3ZWxsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIHF1ZXJ5LlxuICAgKi9cbiAgcXVlcnkocXVlcnlQYXJhbXMpIHtcbiAgICByZXR1cm4gc3VwZXIucXVlcnkocXVlcnlQYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBkZXRhaWxlZCBpbmZvcm1hdGlvbiBvZiBzb3VuZHMgZnJvbSB0aGVpciBpZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXkuTnVtYmVyfSBpZHMgLSBUaGUgaWRzIG9mIHRoZSBzb3VuZHMgd2Ugd2FudCB0byBnZXQgdGhlIGRldGFpbGVkIGluZm8gb2YuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCB3aWxsIHJlc29sdmUgd2l0aCBhbiBhcnJheSBvZiB0aGUgc291bmQgaWRzXG4gICAqIHRoZSBkZXRhaWxlZCBpbmZvIG9mIHdoaWNoIG5lZWRlZCB0byBiZSBxdWVyaWVkLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIHF1ZXJ5LlxuICAgKi9cbiAgcXVlcnlGcm9tSWRzKGlkcykge1xuICAgIHJldHVybiBzdXBlci5xdWVyeUZyb21JZHMoaWRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb3dubG9hZCBocSBtcDMgcHJldmlld3MgZnJvbSB0aGVpciBzb3VuZCBpZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXkuTnVtYmVyfSBbaWRzPW51bGxdIC0gVGhlIGlkcyBvZiB0aGUgc291bmRzIHRvIGRvd25sb2FkLlxuICAgKiBJZiA8Y29kZT5udWxsPC9jb2RlPiwgdGhlIGlkcyBmcm9tXG4gICAqIFs8Y29kZT5jdXJyZW50U291bmRzSW5mbzwvY29kZT5de0BsaW5rIG1vZHVsZTpjbGllbnQuU2ltcGxlRnJlZXNvdW5kI2N1cnJlbnRTb3VuZHNJbmZvfVxuICAgKiB3aWxsIGJlIHVzZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCB3aWxsIHJlc29sdmUgaWYgdGhlIGRvd25sb2FkcyBnbyB3ZWxsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIGRvd25sb2Fkcy5cbiAgICovXG4gIGRvd25sb2FkKGlkcyA9IG51bGwpIHtcbiAgICBpZiAoaWRzID09PSBudWxsKVxuICAgICAgaWRzID0gQXJyYXkuZnJvbSh0aGlzLl9jdXJyZW50U291bmRzSW5mby5rZXlzKCkpO1xuXG4gICAgcmV0dXJuIHRoaXMuX2Rvd25sb2FkRmlsZXNGcm9tVXJscyhpZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvd25sb2FkIHNvdW5kcyBocSBtcDMgcHJldmlld3MgZnJvbSBxdWVyaWVkIHNvdW5kIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlQYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy5zZWFyY2hdIC0gVGhlIHNlYXJjaCB0ZXJtcyB0aGF0IHdpbGwgYmUgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMudXNlcm5hbWVdIC0gQSBsaXN0IG9mIHVzZXJuYW1lcyB0byBzZWFyY2ggZmlsZXMgZnJvbS5cbiAgICogQHBhcmFtIHtBcnJheX0gW3F1ZXJ5UGFyYW1zLmR1cmF0aW9uXSAtIEFuIGFycmF5IG9mIHNpemUgMiA6IFsgbWluRHVyYXRpb24sIG1heER1cmF0aW9uIF0gKGluIHNlY29uZHMpLlxuICAgKiBJZiBtYXhEdXJhdGlvbiBpcyBub3QgYSBudW1iZXIsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgXCIqXCIgKG5vIG1heGltdW0gZHVyYXRpb24pLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2Rlc3RpbmF0aW9uPScuJ10gLSBUaGUgZm9sZGVyIGluIHdoaWNoIHRvIHNhdmUgdGhlIGRvd25sb2FkZWQgZmlsZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIFByb21pc2Ugb2JqZWN0IHRoYXQgcmVzb2x2ZXMgd2l0aCBhbiBhcnJheSBvZiB0aGVcbiAgICogZG93bmxvYWRlZCA8Y29kZT5BbmRpb0J1ZmZlcmlmPC9jb2RlPnMgdGhlIGRvd25sb2FkaW5nIGdvIHdlbGwuXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbiBlcnJvciBpZiBhIHByb2JsZW0gb2NjdXJzIGR1cmluZyB0aGUgZG93bmxvYWRzLlxuICAgKi9cbiAgcXVlcnlBbmREb3dubG9hZChxdWVyeVBhcmFtcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzdXBlci5xdWVyeShxdWVyeVBhcmFtcylcbiAgICAgICAgLnRoZW4odXBkYXRlZElkcyA9PiB7XG4gICAgICAgICAgY29uc3QgaWRzID0gQXJyYXkuZnJvbSh0aGlzLl9jdXJyZW50U291bmRzSW5mby5rZXlzKCkpO1xuICAgICAgICAgIHRoaXMuX2Rvd25sb2FkRmlsZXNGcm9tVXJscyhpZHMpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbih1cGRhdGVkSWRzID0+IHJlc29sdmUodXBkYXRlZElkcykpXG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2Rvd25sb2FkRmlsZXNGcm9tVXJscyhpZHMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdXJscyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkcy5sZW5ndGg7IGkrKylcbiAgICAgICAgdXJscy5wdXNoKHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLmdldChpZHNbaV0pWydwcmV2aWV3cyddWydwcmV2aWV3LWhxLW1wMyddKTtcblxuICAgICAgbG9hZGVyLmxvYWQodXJscylcbiAgICAgICAgLnRoZW4oYnVmZmVycyA9PiB7XG4gICAgICAgICAgdGhpcy5fYnVmZmVycyA9IGJ1ZmZlcnM7XG5cbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgc291bmRJbmZvID0gdGhpcy5fY3VycmVudFNvdW5kc0luZm8uZ2V0KGlkc1tpXSk7XG4gICAgICAgICAgICBzb3VuZEluZm9bJ2J1ZmZlciddID0gYnVmZmVyc1tpXTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLnNldChpZHNbaV0sIHNvdW5kSW5mbyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSh0aGlzLl9idWZmZXJzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgdGhlIGludGVybmFsIHNvdW5kIGluZm9ybWF0aW9uIGxpc3RzLlxuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5fc291bmRzSW5mbyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mbyA9IG5ldyBNYXAoKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgU2ltcGxlRnJlZXNvdW5kO1xuIl19