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
    return (0, _possibleConstructorReturn3.default)(this, (SimpleFreesound.__proto__ || (0, _getPrototypeOf2.default)(SimpleFreesound)).call(this, apiKey));
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
    value: function _downloadFilesFromUrls() {
      var _this3 = this;

      return new _promise2.default(function (resolve, reject) {
        var urls = [];

        _this3._currentSoundsInfo.forEach(function (value, key) {
          urls.push(value['previews']['preview-hq-mp3']);
        });

        loader.load(urls).then(function (buffers) {
          var index = 0;

          _this3._currentSoundsInfo.forEach(function (value, key) {
            value['buffer'] = buffers[index];
            index++;
          });

          resolve();
        });
      });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImxvYWRlcnMiLCJsb2FkZXIiLCJBdWRpb0J1ZmZlckxvYWRlciIsIlNpbXBsZUZyZWVzb3VuZCIsImFwaUtleSIsInF1ZXJ5UGFyYW1zIiwiaWRzIiwiX2N1cnJlbnRTb3VuZHNJbmZvIiwia2V5cyIsIl9kb3dubG9hZEZpbGVzRnJvbVVybHMiLCJyZXNvbHZlIiwicmVqZWN0IiwidGhlbiIsInVwZGF0ZWRJZHMiLCJ1cmxzIiwiZm9yRWFjaCIsInZhbHVlIiwia2V5IiwicHVzaCIsImxvYWQiLCJpbmRleCIsImJ1ZmZlcnMiLCJfbWFwVG9PYmplY3QiLCJfc291bmRzSW5mbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsTzs7QUFDWjs7Ozs7Ozs7QUFFQSxJQUFNQyxTQUFTLElBQUlELFFBQVFFLGlCQUFaLEVBQWY7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUJNQyxlOzs7QUFDSiwyQkFBWUMsTUFBWixFQUFvQjtBQUFBO0FBQUEsbUpBQ1pBLE1BRFk7QUFFbkI7O0FBRUQ7Ozs7Ozs7Ozs7QUFpQkE7Ozs7Ozs7Ozs7Ozs7MEJBYU1DLFcsRUFBYTtBQUNqQiwySkFBbUJBLFdBQW5CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7aUNBVWFDLEcsRUFBSztBQUNoQixrS0FBMEJBLEdBQTFCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7K0JBVXFCO0FBQUEsVUFBWkEsR0FBWSx1RUFBTixJQUFNOztBQUNuQixVQUFJQSxRQUFRLElBQVosRUFDRUEsTUFBTSxvQkFBVyxLQUFLQyxrQkFBTCxDQUF3QkMsSUFBeEIsRUFBWCxDQUFOOztBQUVGLGFBQU8sS0FBS0Msc0JBQUwsQ0FBNEJILEdBQTVCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FDQWVpQkQsVyxFQUFhO0FBQUE7O0FBQzVCLGFBQU8sc0JBQVksVUFBQ0ssT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLDBKQUFZTixXQUFaLEVBQ0dPLElBREgsQ0FDUSxzQkFBYztBQUNsQixjQUFNTixNQUFNLG9CQUFXLE9BQUtDLGtCQUFMLENBQXdCQyxJQUF4QixFQUFYLENBQVo7QUFDQSxpQkFBS0Msc0JBQUwsQ0FBNEJILEdBQTVCO0FBQ0QsU0FKSCxFQUtHTSxJQUxILENBS1E7QUFBQSxpQkFBY0YsUUFBUUcsVUFBUixDQUFkO0FBQUEsU0FMUjtBQU1ELE9BUE0sQ0FBUDtBQVFEOztBQUVEOzs7OzZDQUN5QjtBQUFBOztBQUN2QixhQUFPLHNCQUFZLFVBQUNILE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxZQUFNRyxPQUFPLEVBQWI7O0FBRUEsZUFBS1Asa0JBQUwsQ0FBd0JRLE9BQXhCLENBQWdDLFVBQUNDLEtBQUQsRUFBUUMsR0FBUixFQUFnQjtBQUM5Q0gsZUFBS0ksSUFBTCxDQUFVRixNQUFNLFVBQU4sRUFBa0IsZ0JBQWxCLENBQVY7QUFDRCxTQUZEOztBQUlBZixlQUFPa0IsSUFBUCxDQUFZTCxJQUFaLEVBQ0dGLElBREgsQ0FDUSxtQkFBVztBQUNmLGNBQUlRLFFBQVEsQ0FBWjs7QUFFQSxpQkFBS2Isa0JBQUwsQ0FBd0JRLE9BQXhCLENBQWdDLFVBQUNDLEtBQUQsRUFBUUMsR0FBUixFQUFnQjtBQUM5Q0Qsa0JBQU0sUUFBTixJQUFrQkssUUFBUUQsS0FBUixDQUFsQjtBQUNBQTtBQUNELFdBSEQ7O0FBS0FWO0FBQ0QsU0FWSDtBQVdELE9BbEJNLENBQVA7QUFtQkQ7Ozt3QkE1R2dCO0FBQ2YsYUFBTyxLQUFLWSxZQUFMLENBQWtCLEtBQUtDLFdBQXZCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS3dCO0FBQ3RCLGFBQU8sS0FBS0QsWUFBTCxDQUFrQixLQUFLZixrQkFBdkIsQ0FBUDtBQUNEOzs7OztBQWtHRjs7a0JBRWNKLGUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBsb2FkZXJzIGZyb20gJ3dhdmVzLWxvYWRlcnMnO1xuaW1wb3J0IEZyZWVzb3VuZFF1ZXJ5IGZyb20gJy4uL2NvbW1vbi9GcmVlc291bmRRdWVyeSc7XG5cbmNvbnN0IGxvYWRlciA9IG5ldyBsb2FkZXJzLkF1ZGlvQnVmZmVyTG9hZGVyKCk7XG5cbi8qKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYXBpS2V5IC0gWW91ciBhcGkga2V5LCBhcyBnZW5lcmF0ZWQgZnJvbSB5b3VyIGZyZWVzb3VuZFxuICogZGV2ZWxvcGVyIGFjY291bnQgd2hlbiBjcmVhdGluZyBhIG5ldyBhcHBsaWNhdGlvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwic2ltcGxlLWZyZWVzb3VuZC5taW4uanNcIj48L3NjcmlwdD5cbiAqXG4gKiA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIj5cbiAqICAgdmFyIGFwaUtleSA9IFwieW91cl9mcmVlc291bmRfYXBpX2tleV9nb2VzX2hlcmVcIjtcbiAqICAgdmFyIHNmID0gbmV3IHNpbXBsZUZyZWVzb3VuZC5TaW1wbGVGcmVlc291bmQoYXBpS2V5KTtcbiAqXG4gKiAgIHNmLnF1ZXJ5KHtcbiAqICAgICBzZWFyY2g6IFsgJ2RydW0nLCAnYmFzcycgXSxcbiAqICAgICBkdXJhdGlvbjogWyAwLjAxLCAxIF1cbiAqICAgfSk7XG4gKiA8L3NjcmlwdD5cbiAqL1xuY2xhc3MgU2ltcGxlRnJlZXNvdW5kIGV4dGVuZHMgRnJlZXNvdW5kUXVlcnkge1xuICBjb25zdHJ1Y3RvcihhcGlLZXkpIHtcbiAgICBzdXBlcihhcGlLZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIGV2ZXJ5IGRldGFpbGVkIGluZm9ybWF0aW9uIG9idGFpbmVkIHNpbmNlIGluc3RhbnRpYXRpb25cbiAgICogb3IgbGFzdCBjYWxsIHRvIDxjb2RlPmNsZWFyKCk8L2NvZGU+LlxuICAgKi9cbiAgZ2V0IHNvdW5kc0luZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcFRvT2JqZWN0KHRoaXMuX3NvdW5kc0luZm8pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBkZXRhaWxlZCBpbmZvcm1hdGlvbiBvYnRhaW5lZCBmcm9tIHRoZSBsYXN0IGNhbGwgdG9cbiAgICogPGNvZGU+cXVlcnkoKTwvY29kZT4sIDxjb2RlPnF1ZXJ5RnJvbUlkcygpPC9jb2RlPiwgPGNvZGU+ZG93bmxvYWQoKTwvY29kZT5cbiAgICogb3IgPGNvZGU+cXVlcnlBbmREb3dubG9hZCgpPC9jb2RlPi5cbiAgICovXG4gIGdldCBjdXJyZW50U291bmRzSW5mbygpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwVG9PYmplY3QodGhpcy5fY3VycmVudFNvdW5kc0luZm8pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGxpc3Qgb2Ygc291bmQgaWRzIHdpdGggZGV0YWlsZWQgaW5mb3JtYXRpb24sIHRoYXQgY29ycmVzcG9uZCB0byBhIHNldCBvZiBxdWVyeSBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlQYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy5zZWFyY2hdIC0gVGhlIHNlYXJjaCB0ZXJtcyB0aGF0IHdpbGwgYmUgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMudXNlcm5hbWVdIC0gQSBsaXN0IG9mIHVzZXJuYW1lcyB0byBzZWFyY2ggZmlsZXMgZnJvbS5cbiAgICogQHBhcmFtIHtBcnJheX0gW3F1ZXJ5UGFyYW1zLmR1cmF0aW9uXSAtIEFuIGFycmF5IG9mIHNpemUgMiA6IFsgbWluRHVyYXRpb24sIG1heER1cmF0aW9uIF0gKGluIHNlY29uZHMpLlxuICAgKiBJZiBtYXhEdXJhdGlvbiBpcyBub3QgYSBudW1iZXIsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgXCIqXCIgKG5vIG1heGltdW0gZHVyYXRpb24pLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBQcm9taXNlIG9iamVjdCB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGxpc3Qgb2YgbmV3IHNvdW5kIGlkcyBpZiB0aGUgcXVlcnkgZ29lcyB3ZWxsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIHF1ZXJ5LlxuICAgKi9cbiAgcXVlcnkocXVlcnlQYXJhbXMpIHtcbiAgICByZXR1cm4gc3VwZXIucXVlcnkocXVlcnlQYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBkZXRhaWxlZCBpbmZvcm1hdGlvbiBvZiBzb3VuZHMgZnJvbSB0aGVpciBpZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXkuTnVtYmVyfSBpZHMgLSBUaGUgaWRzIG9mIHRoZSBzb3VuZHMgd2Ugd2FudCB0byBnZXQgdGhlIGRldGFpbGVkIGluZm8gb2YuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCB3aWxsIHJlc29sdmUgd2l0aCBhbiBhcnJheSBvZiB0aGUgc291bmQgaWRzXG4gICAqIHRoZSBkZXRhaWxlZCBpbmZvIG9mIHdoaWNoIG5lZWRlZCB0byBiZSBxdWVyaWVkLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIHF1ZXJ5LlxuICAgKi9cbiAgcXVlcnlGcm9tSWRzKGlkcykge1xuICAgIHJldHVybiBzdXBlci5xdWVyeUZyb21JZHMoaWRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb3dubG9hZCBocSBtcDMgcHJldmlld3MgZnJvbSB0aGVpciBzb3VuZCBpZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXkuTnVtYmVyfSBbaWRzPW51bGxdIC0gVGhlIGlkcyBvZiB0aGUgc291bmRzIHRvIGRvd25sb2FkLlxuICAgKiBJZiA8Y29kZT5udWxsPC9jb2RlPiwgdGhlIGlkcyBmcm9tIDxjb2RlPmN1cnJlbnRTb3VuZHNJbmZvPC9jb2RlPiB3aWxsIGJlIHVzZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCB3aWxsIHJlc29sdmUgaWYgdGhlIGRvd25sb2FkcyBnbyB3ZWxsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIGRvd25sb2Fkcy5cbiAgICovXG4gIGRvd25sb2FkKGlkcyA9IG51bGwpIHtcbiAgICBpZiAoaWRzID09PSBudWxsKVxuICAgICAgaWRzID0gQXJyYXkuZnJvbSh0aGlzLl9jdXJyZW50U291bmRzSW5mby5rZXlzKCkpO1xuXG4gICAgcmV0dXJuIHRoaXMuX2Rvd25sb2FkRmlsZXNGcm9tVXJscyhpZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvd25sb2FkIHNvdW5kcyBocSBtcDMgcHJldmlld3MgZnJvbSBxdWVyaWVkIHNvdW5kIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlQYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy5zZWFyY2hdIC0gVGhlIHNlYXJjaCB0ZXJtcyB0aGF0IHdpbGwgYmUgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMudXNlcm5hbWVdIC0gQSBsaXN0IG9mIHVzZXJuYW1lcyB0byBzZWFyY2ggZmlsZXMgZnJvbS5cbiAgICogQHBhcmFtIHtBcnJheX0gW3F1ZXJ5UGFyYW1zLmR1cmF0aW9uXSAtIEFuIGFycmF5IG9mIHNpemUgMiA6IFsgbWluRHVyYXRpb24sIG1heER1cmF0aW9uIF0gKGluIHNlY29uZHMpLlxuICAgKiBJZiBtYXhEdXJhdGlvbiBpcyBub3QgYSBudW1iZXIsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgXCIqXCIgKG5vIG1heGltdW0gZHVyYXRpb24pLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2Rlc3RpbmF0aW9uPScuJ10gLSBUaGUgZm9sZGVyIGluIHdoaWNoIHRvIHNhdmUgdGhlIGRvd25sb2FkZWQgZmlsZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIFByb21pc2Ugb2JqZWN0IHRoYXQgcmVzb2x2ZXMgaWYgdGhlIGRvd25sb2FkcyBnbyB3ZWxsLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gQW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgdGhlIGRvd25sb2Fkcy5cbiAgICovXG4gIHF1ZXJ5QW5kRG93bmxvYWQocXVlcnlQYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgc3VwZXIucXVlcnkocXVlcnlQYXJhbXMpXG4gICAgICAgIC50aGVuKHVwZGF0ZWRJZHMgPT4ge1xuICAgICAgICAgIGNvbnN0IGlkcyA9IEFycmF5LmZyb20odGhpcy5fY3VycmVudFNvdW5kc0luZm8ua2V5cygpKTtcbiAgICAgICAgICB0aGlzLl9kb3dubG9hZEZpbGVzRnJvbVVybHMoaWRzKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4odXBkYXRlZElkcyA9PiByZXNvbHZlKHVwZGF0ZWRJZHMpKVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9kb3dubG9hZEZpbGVzRnJvbVVybHMoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHVybHMgPSBbXTtcblxuICAgICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8uZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICB1cmxzLnB1c2godmFsdWVbJ3ByZXZpZXdzJ11bJ3ByZXZpZXctaHEtbXAzJ10pO1xuICAgICAgfSlcblxuICAgICAgbG9hZGVyLmxvYWQodXJscylcbiAgICAgICAgLnRoZW4oYnVmZmVycyA9PiB7XG4gICAgICAgICAgbGV0IGluZGV4ID0gMDtcblxuICAgICAgICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIHZhbHVlWydidWZmZXInXSA9IGJ1ZmZlcnNbaW5kZXhdO1xuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNpbXBsZUZyZWVzb3VuZDtcbiJdfQ==