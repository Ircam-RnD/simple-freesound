'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
   * An object containing every detailed information obtained since instantiation
   * or last call to <code>clear()</code>.
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
        // const keys = Array.from(this._currentSoundsInfo.keys());

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
  }, {
    key: 'getBuffers',
    value: function getBuffers() {
      return this._buffers;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImxvYWRlcnMiLCJsb2FkZXIiLCJBdWRpb0J1ZmZlckxvYWRlciIsIlNpbXBsZUZyZWVzb3VuZCIsImFwaUtleSIsImJ1ZmZlcnMiLCJxdWVyeVBhcmFtcyIsImlkcyIsIl9jdXJyZW50U291bmRzSW5mbyIsImtleXMiLCJfZG93bmxvYWRGaWxlc0Zyb21VcmxzIiwicmVzb2x2ZSIsInJlamVjdCIsInRoZW4iLCJ1cGRhdGVkSWRzIiwidXJscyIsImkiLCJsZW5ndGgiLCJwdXNoIiwiZ2V0IiwibG9hZCIsIl9idWZmZXJzIiwic291bmRJbmZvIiwic2V0IiwiX21hcFRvT2JqZWN0IiwiX3NvdW5kc0luZm8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLE87O0FBQ1o7Ozs7Ozs7O0FBRUEsSUFBTUMsU0FBUyxJQUFJRCxRQUFRRSxpQkFBWixFQUFmOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW1CTUMsZTs7O0FBQ0osMkJBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFBQSx3SkFDWkEsTUFEWTs7QUFFbEIsVUFBS0MsT0FBTCxHQUFjLEVBQWQ7QUFGa0I7QUFHbkI7O0FBRUQ7Ozs7Ozs7Ozs7QUFpQkE7Ozs7Ozs7Ozs7Ozs7MEJBYU1DLFcsRUFBYTtBQUNqQiwySkFBbUJBLFdBQW5CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7aUNBVWFDLEcsRUFBSztBQUNoQixrS0FBMEJBLEdBQTFCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7K0JBVXFCO0FBQUEsVUFBWkEsR0FBWSx1RUFBTixJQUFNOztBQUNuQixVQUFJQSxRQUFRLElBQVosRUFDRUEsTUFBTSxvQkFBVyxLQUFLQyxrQkFBTCxDQUF3QkMsSUFBeEIsRUFBWCxDQUFOOztBQUVGLGFBQU8sS0FBS0Msc0JBQUwsQ0FBNEJILEdBQTVCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FDQWVpQkQsVyxFQUFhO0FBQUE7O0FBQzVCLGFBQU8sc0JBQVksVUFBQ0ssT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLDBKQUFZTixXQUFaLEVBQ0dPLElBREgsQ0FDUSxzQkFBYztBQUNsQixjQUFNTixNQUFNLG9CQUFXLE9BQUtDLGtCQUFMLENBQXdCQyxJQUF4QixFQUFYLENBQVo7QUFDQSxpQkFBS0Msc0JBQUwsQ0FBNEJILEdBQTVCO0FBQ0QsU0FKSCxFQUtHTSxJQUxILENBS1E7QUFBQSxpQkFBY0YsUUFBUUcsVUFBUixDQUFkO0FBQUEsU0FMUjtBQU1ELE9BUE0sQ0FBUDtBQVFEOztBQUVEOzs7OzJDQUN1QlAsRyxFQUFLO0FBQUE7O0FBQzFCLGFBQU8sc0JBQVksVUFBQ0ksT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLFlBQU1HLE9BQU8sRUFBYjtBQUNBOztBQUVBLGFBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJVCxJQUFJVSxNQUF4QixFQUFnQ0QsR0FBaEM7QUFDRUQsZUFBS0csSUFBTCxDQUFVLE9BQUtWLGtCQUFMLENBQXdCVyxHQUF4QixDQUE0QlosSUFBSVMsQ0FBSixDQUE1QixFQUFvQyxVQUFwQyxFQUFnRCxnQkFBaEQsQ0FBVjtBQURGLFNBR0FmLE9BQU9tQixJQUFQLENBQVlMLElBQVosRUFDR0YsSUFESCxDQUNRLG1CQUFXO0FBQ2YsaUJBQUtRLFFBQUwsR0FBZ0JoQixPQUFoQjs7QUFFQSxlQUFLLElBQUlXLEtBQUksQ0FBYixFQUFnQkEsS0FBSVQsSUFBSVUsTUFBeEIsRUFBZ0NELElBQWhDLEVBQXFDO0FBQ25DLGdCQUFNTSxZQUFZLE9BQUtkLGtCQUFMLENBQXdCVyxHQUF4QixDQUE0QlosSUFBSVMsRUFBSixDQUE1QixDQUFsQjtBQUNBTSxzQkFBVSxRQUFWLElBQXNCakIsUUFBUVcsRUFBUixDQUF0QjtBQUNBLG1CQUFLUixrQkFBTCxDQUF3QmUsR0FBeEIsQ0FBNEJoQixJQUFJUyxFQUFKLENBQTVCLEVBQW9DTSxTQUFwQztBQUNEOztBQUVEWCxrQkFBUSxPQUFLVSxRQUFiO0FBQ0QsU0FYSDtBQVlELE9BbkJNLENBQVA7QUFvQkQ7OztpQ0FFWTtBQUNYLGFBQU8sS0FBS0EsUUFBWjtBQUNEOzs7d0JBakhnQjtBQUNmLGFBQU8sS0FBS0csWUFBTCxDQUFrQixLQUFLQyxXQUF2QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUt3QjtBQUN0QixhQUFPLEtBQUtELFlBQUwsQ0FBa0IsS0FBS2hCLGtCQUF2QixDQUFQO0FBQ0Q7Ozs7O0FBdUdGOztrQkFFY0wsZSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGxvYWRlcnMgZnJvbSAnd2F2ZXMtbG9hZGVycyc7XG5pbXBvcnQgRnJlZXNvdW5kUXVlcnkgZnJvbSAnLi4vY29tbW9uL0ZyZWVzb3VuZFF1ZXJ5JztcblxuY29uc3QgbG9hZGVyID0gbmV3IGxvYWRlcnMuQXVkaW9CdWZmZXJMb2FkZXIoKTtcblxuLyoqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcGlLZXkgLSBZb3VyIGFwaSBrZXksIGFzIGdlbmVyYXRlZCBmcm9tIHlvdXIgZnJlZXNvdW5kXG4gKiBkZXZlbG9wZXIgYWNjb3VudCB3aGVuIGNyZWF0aW5nIGEgbmV3IGFwcGxpY2F0aW9uLlxuICpcbiAqIEBleGFtcGxlXG4gKiA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCJzaW1wbGUtZnJlZXNvdW5kLm1pbi5qc1wiPjwvc2NyaXB0PlxuICpcbiAqIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiPlxuICogICB2YXIgYXBpS2V5ID0gXCJ5b3VyX2ZyZWVzb3VuZF9hcGlfa2V5X2dvZXNfaGVyZVwiO1xuICogICB2YXIgc2YgPSBuZXcgc2ltcGxlRnJlZXNvdW5kLlNpbXBsZUZyZWVzb3VuZChhcGlLZXkpO1xuICpcbiAqICAgc2YucXVlcnkoe1xuICogICAgIHNlYXJjaDogWyAnZHJ1bScsICdiYXNzJyBdLFxuICogICAgIGR1cmF0aW9uOiBbIDAuMDEsIDEgXVxuICogICB9KTtcbiAqIDwvc2NyaXB0PlxuICovXG5jbGFzcyBTaW1wbGVGcmVlc291bmQgZXh0ZW5kcyBGcmVlc291bmRRdWVyeSB7XG4gIGNvbnN0cnVjdG9yKGFwaUtleSkge1xuICAgIHN1cGVyKGFwaUtleSk7XG4gICAgdGhpcy5idWZmZXJzID1bXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgY29udGFpbmluZyBldmVyeSBkZXRhaWxlZCBpbmZvcm1hdGlvbiBvYnRhaW5lZCBzaW5jZSBpbnN0YW50aWF0aW9uXG4gICAqIG9yIGxhc3QgY2FsbCB0byA8Y29kZT5jbGVhcigpPC9jb2RlPi5cbiAgICovXG4gIGdldCBzb3VuZHNJbmZvKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXBUb09iamVjdCh0aGlzLl9zb3VuZHNJbmZvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgZGV0YWlsZWQgaW5mb3JtYXRpb24gb2J0YWluZWQgZnJvbSB0aGUgbGFzdCBjYWxsIHRvXG4gICAqIDxjb2RlPnF1ZXJ5KCk8L2NvZGU+LCA8Y29kZT5xdWVyeUZyb21JZHMoKTwvY29kZT4sIDxjb2RlPmRvd25sb2FkKCk8L2NvZGU+XG4gICAqIG9yIDxjb2RlPnF1ZXJ5QW5kRG93bmxvYWQoKTwvY29kZT4uXG4gICAqL1xuICBnZXQgY3VycmVudFNvdW5kc0luZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcFRvT2JqZWN0KHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBsaXN0IG9mIHNvdW5kIGlkcyB3aXRoIGRldGFpbGVkIGluZm9ybWF0aW9uLCB0aGF0IGNvcnJlc3BvbmQgdG8gYSBzZXQgb2YgcXVlcnkgcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5UGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMuc2VhcmNoXSAtIFRoZSBzZWFyY2ggdGVybXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnVzZXJuYW1lXSAtIEEgbGlzdCBvZiB1c2VybmFtZXMgdG8gc2VhcmNoIGZpbGVzIGZyb20uXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtxdWVyeVBhcmFtcy5kdXJhdGlvbl0gLSBBbiBhcnJheSBvZiBzaXplIDIgOiBbIG1pbkR1cmF0aW9uLCBtYXhEdXJhdGlvbiBdIChpbiBzZWNvbmRzKS5cbiAgICogSWYgbWF4RHVyYXRpb24gaXMgbm90IGEgbnVtYmVyLCBpdCB3aWxsIGJlIGludGVycHJldGVkIGFzIFwiKlwiIChubyBtYXhpbXVtIGR1cmF0aW9uKS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgUHJvbWlzZSBvYmplY3QgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBsaXN0IG9mIG5ldyBzb3VuZCBpZHMgaWYgdGhlIHF1ZXJ5IGdvZXMgd2VsbC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBxdWVyeS5cbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5UGFyYW1zKSB7XG4gICAgcmV0dXJuIHN1cGVyLnF1ZXJ5KHF1ZXJ5UGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgZGV0YWlsZWQgaW5mb3JtYXRpb24gb2Ygc291bmRzIGZyb20gdGhlaXIgaWRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5Lk51bWJlcn0gaWRzIC0gVGhlIGlkcyBvZiB0aGUgc291bmRzIHdlIHdhbnQgdG8gZ2V0IHRoZSBkZXRhaWxlZCBpbmZvIG9mLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIHdpdGggYW4gYXJyYXkgb2YgdGhlIHNvdW5kIGlkc1xuICAgKiB0aGUgZGV0YWlsZWQgaW5mbyBvZiB3aGljaCBuZWVkZWQgdG8gYmUgcXVlcmllZC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBxdWVyeS5cbiAgICovXG4gIHF1ZXJ5RnJvbUlkcyhpZHMpIHtcbiAgICByZXR1cm4gc3VwZXIucXVlcnlGcm9tSWRzKGlkcyk7XG4gIH1cblxuICAvKipcbiAgICogRG93bmxvYWQgaHEgbXAzIHByZXZpZXdzIGZyb20gdGhlaXIgc291bmQgaWRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5Lk51bWJlcn0gW2lkcz1udWxsXSAtIFRoZSBpZHMgb2YgdGhlIHNvdW5kcyB0byBkb3dubG9hZC5cbiAgICogSWYgPGNvZGU+bnVsbDwvY29kZT4sIHRoZSBpZHMgZnJvbSA8Y29kZT5jdXJyZW50U291bmRzSW5mbzwvY29kZT4gd2lsbCBiZSB1c2VkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIGlmIHRoZSBkb3dubG9hZHMgZ28gd2VsbC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBkb3dubG9hZHMuXG4gICAqL1xuICBkb3dubG9hZChpZHMgPSBudWxsKSB7XG4gICAgaWYgKGlkcyA9PT0gbnVsbClcbiAgICAgIGlkcyA9IEFycmF5LmZyb20odGhpcy5fY3VycmVudFNvdW5kc0luZm8ua2V5cygpKTtcblxuICAgIHJldHVybiB0aGlzLl9kb3dubG9hZEZpbGVzRnJvbVVybHMoaWRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb3dubG9hZCBzb3VuZHMgaHEgbXAzIHByZXZpZXdzIGZyb20gcXVlcmllZCBzb3VuZCBpbmZvcm1hdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5UGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMuc2VhcmNoXSAtIFRoZSBzZWFyY2ggdGVybXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnVzZXJuYW1lXSAtIEEgbGlzdCBvZiB1c2VybmFtZXMgdG8gc2VhcmNoIGZpbGVzIGZyb20uXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtxdWVyeVBhcmFtcy5kdXJhdGlvbl0gLSBBbiBhcnJheSBvZiBzaXplIDIgOiBbIG1pbkR1cmF0aW9uLCBtYXhEdXJhdGlvbiBdIChpbiBzZWNvbmRzKS5cbiAgICogSWYgbWF4RHVyYXRpb24gaXMgbm90IGEgbnVtYmVyLCBpdCB3aWxsIGJlIGludGVycHJldGVkIGFzIFwiKlwiIChubyBtYXhpbXVtIGR1cmF0aW9uKS5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtkZXN0aW5hdGlvbj0nLiddIC0gVGhlIGZvbGRlciBpbiB3aGljaCB0byBzYXZlIHRoZSBkb3dubG9hZGVkIGZpbGVzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBQcm9taXNlIG9iamVjdCB0aGF0IHJlc29sdmVzIGlmIHRoZSBkb3dubG9hZHMgZ28gd2VsbC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IEFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHRoZSBkb3dubG9hZHMuXG4gICAqL1xuICBxdWVyeUFuZERvd25sb2FkKHF1ZXJ5UGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHN1cGVyLnF1ZXJ5KHF1ZXJ5UGFyYW1zKVxuICAgICAgICAudGhlbih1cGRhdGVkSWRzID0+IHtcbiAgICAgICAgICBjb25zdCBpZHMgPSBBcnJheS5mcm9tKHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLmtleXMoKSk7XG4gICAgICAgICAgdGhpcy5fZG93bmxvYWRGaWxlc0Zyb21VcmxzKGlkcyk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKHVwZGF0ZWRJZHMgPT4gcmVzb2x2ZSh1cGRhdGVkSWRzKSlcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZG93bmxvYWRGaWxlc0Zyb21VcmxzKGlkcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB1cmxzID0gW107XG4gICAgICAvLyBjb25zdCBrZXlzID0gQXJyYXkuZnJvbSh0aGlzLl9jdXJyZW50U291bmRzSW5mby5rZXlzKCkpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkcy5sZW5ndGg7IGkrKylcbiAgICAgICAgdXJscy5wdXNoKHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLmdldChpZHNbaV0pWydwcmV2aWV3cyddWydwcmV2aWV3LWhxLW1wMyddKTtcblxuICAgICAgbG9hZGVyLmxvYWQodXJscylcbiAgICAgICAgLnRoZW4oYnVmZmVycyA9PiB7XG4gICAgICAgICAgdGhpcy5fYnVmZmVycyA9IGJ1ZmZlcnM7XG5cbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgc291bmRJbmZvID0gdGhpcy5fY3VycmVudFNvdW5kc0luZm8uZ2V0KGlkc1tpXSk7XG4gICAgICAgICAgICBzb3VuZEluZm9bJ2J1ZmZlciddID0gYnVmZmVyc1tpXTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLnNldChpZHNbaV0sIHNvdW5kSW5mbyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSh0aGlzLl9idWZmZXJzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRCdWZmZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl9idWZmZXJzO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBTaW1wbGVGcmVlc291bmQ7XG4iXX0=