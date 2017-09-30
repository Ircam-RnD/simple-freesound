'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class performing generic queries from search terms, usernames and duration information.
 *
 * @param {String} apiKey - Your api key, as generated from your freesound
 * developer account when creating a new application.
 */
var FreesoundQuery = function () {
  function FreesoundQuery(apiKey) {
    (0, _classCallCheck3.default)(this, FreesoundQuery);

    this.apiKey = apiKey;
    this._soundsInfo = new _map2.default();
    this._currentSoundsInfo = new _map2.default();

    this._getDetailedInfoFromIds = this._getDetailedInfoFromIds.bind(this);
  }

  /**
   * @param {Object} queryParams - The parameters used to build the query.
   * @param {Array.String} [queryParams.search] - The search terms that will be used to build the query.
   * @param {Array.String} [queryParams.username] - A list of usernames to search files from.
   * @param {Array} [queryParams.duration] - An array of size 2 : [ minDuration, maxDuration ] (in seconds).
   * If maxDuration is not a number, it will be interpreted as "*" (no maximum duration).
   *
   * @returns {Promise} - A Promise object that will resolve with an array of the sound ids from the api's response to the query.
   *
   * @throws Will throw an error if a problem occurs during query.
   *
   * @todo
   * - add an option to change "page_size" default value (15)
   * - add an option to change "sort" default value ("score")
   * - add an option to filter using geotagging
   */


  (0, _createClass3.default)(FreesoundQuery, [{
    key: 'query',
    value: function query(queryParams) {
      return this._getSoundListFromParameters(queryParams).then(this._getDetailedInfoFromIds);
    }

    /**
     * @param {Array.Number} ids - The sound ids we want to get the detailed info of.
     *
     * @returns {Promise} A promise that will resolve with an array of the sound ids
     * the detailed info of which needed to be queried.
     *
     * @throws Will throw an error if a problem occurs during query.
     */

  }, {
    key: 'queryFromIds',
    value: function queryFromIds(ids) {
      return this._getDetailedInfoFromIds(ids);
    }

    /**
     * @private
     * @todo allow to choose between OR and AND to combine usernames in the query.
     */

  }, {
    key: '_getSoundListFromParameters',
    value: function _getSoundListFromParameters(params) {
      var _this = this;

      var clear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      return new _promise2.default(function (resolve, reject) {
        if (clear) _this._soundsInfo.clear();

        var query = 'http://freesound.org/apiv2/search/text/?';
        var suffix = '&token=' + _this.apiKey;

        if ((0, _keys2.default)(params).length > 0) {

          if (params.search && Array.isArray(params.search) && params.search.length > 0) {
            query += 'query="' + params.search[0] + '"';

            for (var i = 1; i < params.search.length; i++) {
              if (params.search[i] !== '') query += ' "' + params.search[i] + '"';
            }query += '&';
          }

          query += 'filter=';

          if (params.duration && Array.isArray(params.duration) && params.duration.length === 2 && !isNaN(parseFloat(params.duration[0])) && isFinite(params.duration[0])) {
            var minDuration = params.duration[0] < 0 ? 0 : params.duration[0];
            query += 'duration:[' + minDuration + ' TO ';

            if (!isNaN(parseFloat(params.duration[1])) && isFinite(params.duration[1])) {
              var maxDuration = params.duration[1] > minDuration ? params.duration[1] : minDuration;
              query += maxDuration + '] ';
            } else {
              // === '*'
              query += '*';
            }
          }

          var options = {
            // search:   [ 'query',    'OR' ],
            users: ['username', 'OR'],
            packs: ['pack', 'OR']
          };

          for (var l in options) {
            if (params[l] && Array.isArray(params[l]) && params[l].length > 0) {
              query += options[l][0] + ':(' + params[l][0];

              for (var _i = 1; _i < params[l].length; _i++) {
                if (params[l][_i] !== '') query += ' ' + options[l][1] + ' ' + params[l][_i];
              }query += ') ';
            }
          }
        }

        query = query.trim();
        query += suffix;

        (0, _util.universalXMLHttpRequest)(query).then(function (response) {
          var res = response.results;

          for (var r in res) {
            if (!_this._soundsInfo.has(res[r]['id'])) _this._soundsInfo.set(res[r]['id'], res[r]);
          }resolve();
        });
      });
    }

    /** @private */

  }, {
    key: '_getDetailedInfoFromIds',
    value: function _getDetailedInfoFromIds(ids) {
      var _this2 = this;

      this._currentSoundsInfo.clear();
      var promises = [];

      this._soundsInfo.forEach(function (info, id) {
        if (!_this2._soundsInfo.get(id).previews) {
          // detailed information was not previously stored
          promises.push(_this2._getDetailedInfoFromId(id));
        } else {
          _this2._currentSoundsInfo.set(id, info);
        }
      });

      return _promise2.default.all(promises);
    }

    /** @private */

  }, {
    key: '_getDetailedInfoFromId',
    value: function _getDetailedInfoFromId(id) {
      var _this3 = this;

      return new _promise2.default(function (resolve, reject) {
        // DOES THIS PREVENT OTHER FIELDS THAN "preview" TO BE RETURNED ?
        // let query = `http://www.freesound.org/apiv2/sounds/${id}/?filter=preview`;
        var query = 'http://www.freesound.org/apiv2/sounds/' + id + '/?';
        var suffix = '&token=' + _this3.apiKey;
        query += suffix;

        (0, _util.universalXMLHttpRequest)(query).then(function (response) {
          _this3._soundsInfo.set(id, response);
          _this3._currentSoundsInfo.set(id, _this3._soundsInfo.get(id));
          // this._soundsInfo.get(id).detailed = JSON.parse(xhr.responseText);

          resolve(id);
        });
        //.catch(error => console.error(error.stack));
      });
    }

    /**
     * @private
     * Used by both child classes
     */

  }, {
    key: '_mapToObject',
    value: function _mapToObject(map) {
      var res = {};

      map.forEach(function (value, key) {
        res[key] = value;
      });

      return res;
    }
  }]);
  return FreesoundQuery;
}();

;

exports.default = FreesoundQuery;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkZyZWVzb3VuZFF1ZXJ5IiwiYXBpS2V5IiwiX3NvdW5kc0luZm8iLCJfY3VycmVudFNvdW5kc0luZm8iLCJfZ2V0RGV0YWlsZWRJbmZvRnJvbUlkcyIsImJpbmQiLCJxdWVyeVBhcmFtcyIsIl9nZXRTb3VuZExpc3RGcm9tUGFyYW1ldGVycyIsInRoZW4iLCJpZHMiLCJwYXJhbXMiLCJjbGVhciIsInJlc29sdmUiLCJyZWplY3QiLCJxdWVyeSIsInN1ZmZpeCIsImxlbmd0aCIsInNlYXJjaCIsIkFycmF5IiwiaXNBcnJheSIsImkiLCJkdXJhdGlvbiIsImlzTmFOIiwicGFyc2VGbG9hdCIsImlzRmluaXRlIiwibWluRHVyYXRpb24iLCJtYXhEdXJhdGlvbiIsIm9wdGlvbnMiLCJ1c2VycyIsInBhY2tzIiwibCIsInRyaW0iLCJyZXMiLCJyZXNwb25zZSIsInJlc3VsdHMiLCJyIiwiaGFzIiwic2V0IiwicHJvbWlzZXMiLCJmb3JFYWNoIiwiaW5mbyIsImlkIiwiZ2V0IiwicHJldmlld3MiLCJwdXNoIiwiX2dldERldGFpbGVkSW5mb0Zyb21JZCIsImFsbCIsIm1hcCIsInZhbHVlIiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7OztJQU1NQSxjO0FBQ0osMEJBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFDbEIsU0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixtQkFBbkI7QUFDQSxTQUFLQyxrQkFBTCxHQUEwQixtQkFBMUI7O0FBRUEsU0FBS0MsdUJBQUwsR0FBK0IsS0FBS0EsdUJBQUwsQ0FBNkJDLElBQTdCLENBQWtDLElBQWxDLENBQS9CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBCQWdCTUMsVyxFQUFhO0FBQ2pCLGFBQU8sS0FBS0MsMkJBQUwsQ0FBaUNELFdBQWpDLEVBQ0pFLElBREksQ0FDQyxLQUFLSix1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QUVEOzs7OzJDQUN1QkcsRSxFQUFJO0FBQUE7O0FBQ3pCLGFBQU8sc0JBQVksVUFBQzdCLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QztBQUNBO0FBQ0EsWUFBSUMsbURBQWlEMkIsRUFBakQsT0FBSjtBQUNBLFlBQU0xQixxQkFBbUIsT0FBS2QsTUFBOUI7QUFDQWEsaUJBQVNDLE1BQVQ7O0FBRUEsMkNBQXdCRCxLQUF4QixFQUNHTixJQURILENBQ1Esb0JBQVk7QUFDZCxpQkFBS04sV0FBTCxDQUFpQm1DLEdBQWpCLENBQXFCSSxFQUFyQixFQUF5QlIsUUFBekI7QUFDQSxpQkFBSzlCLGtCQUFMLENBQXdCa0MsR0FBeEIsQ0FBNEJJLEVBQTVCLEVBQWdDLE9BQUt2QyxXQUFMLENBQWlCd0MsR0FBakIsQ0FBcUJELEVBQXJCLENBQWhDO0FBQ0E7O0FBRUE3QixrQkFBUTZCLEVBQVI7QUFDSCxTQVBIO0FBUUU7QUFDSCxPQWhCTSxDQUFQO0FBaUJEOztBQUVEOzs7Ozs7O2lDQUlhTSxHLEVBQUs7QUFDaEIsVUFBTWYsTUFBTSxFQUFaOztBQUVBZSxVQUFJUixPQUFKLENBQVksVUFBQ1MsS0FBRCxFQUFRQyxHQUFSLEVBQWdCO0FBQzFCakIsWUFBSWlCLEdBQUosSUFBV0QsS0FBWDtBQUNELE9BRkQ7O0FBSUEsYUFBT2hCLEdBQVA7QUFDRDs7Ozs7QUFDRjs7a0JBRWNoQyxjIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdW5pdmVyc2FsWE1MSHR0cFJlcXVlc3QgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIENsYXNzIHBlcmZvcm1pbmcgZ2VuZXJpYyBxdWVyaWVzIGZyb20gc2VhcmNoIHRlcm1zLCB1c2VybmFtZXMgYW5kIGR1cmF0aW9uIGluZm9ybWF0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcGlLZXkgLSBZb3VyIGFwaSBrZXksIGFzIGdlbmVyYXRlZCBmcm9tIHlvdXIgZnJlZXNvdW5kXG4gKiBkZXZlbG9wZXIgYWNjb3VudCB3aGVuIGNyZWF0aW5nIGEgbmV3IGFwcGxpY2F0aW9uLlxuICovXG5jbGFzcyBGcmVlc291bmRRdWVyeSB7XG4gIGNvbnN0cnVjdG9yKGFwaUtleSkge1xuICAgIHRoaXMuYXBpS2V5ID0gYXBpS2V5O1xuICAgIHRoaXMuX3NvdW5kc0luZm8gPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8gPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLl9nZXREZXRhaWxlZEluZm9Gcm9tSWRzID0gdGhpcy5fZ2V0RGV0YWlsZWRJbmZvRnJvbUlkcy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeVBhcmFtcyAtIFRoZSBwYXJhbWV0ZXJzIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnNlYXJjaF0gLSBUaGUgc2VhcmNoIHRlcm1zIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy51c2VybmFtZV0gLSBBIGxpc3Qgb2YgdXNlcm5hbWVzIHRvIHNlYXJjaCBmaWxlcyBmcm9tLlxuICAgKiBAcGFyYW0ge0FycmF5fSBbcXVlcnlQYXJhbXMuZHVyYXRpb25dIC0gQW4gYXJyYXkgb2Ygc2l6ZSAyIDogWyBtaW5EdXJhdGlvbiwgbWF4RHVyYXRpb24gXSAoaW4gc2Vjb25kcykuXG4gICAqIElmIG1heER1cmF0aW9uIGlzIG5vdCBhIG51bWJlciwgaXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBcIipcIiAobm8gbWF4aW11bSBkdXJhdGlvbikuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSAtIEEgUHJvbWlzZSBvYmplY3QgdGhhdCB3aWxsIHJlc29sdmUgd2l0aCBhbiBhcnJheSBvZiB0aGUgc291bmQgaWRzIGZyb20gdGhlIGFwaSdzIHJlc3BvbnNlIHRvIHRoZSBxdWVyeS5cbiAgICpcbiAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHF1ZXJ5LlxuICAgKlxuICAgKiBAdG9kb1xuICAgKiAtIGFkZCBhbiBvcHRpb24gdG8gY2hhbmdlIFwicGFnZV9zaXplXCIgZGVmYXVsdCB2YWx1ZSAoMTUpXG4gICAqIC0gYWRkIGFuIG9wdGlvbiB0byBjaGFuZ2UgXCJzb3J0XCIgZGVmYXVsdCB2YWx1ZSAoXCJzY29yZVwiKVxuICAgKiAtIGFkZCBhbiBvcHRpb24gdG8gZmlsdGVyIHVzaW5nIGdlb3RhZ2dpbmdcbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5UGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFNvdW5kTGlzdEZyb21QYXJhbWV0ZXJzKHF1ZXJ5UGFyYW1zKVxuICAgICAgLnRoZW4odGhpcy5fZ2V0RGV0YWlsZWRJbmZvRnJvbUlkcylcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5Lk51bWJlcn0gaWRzIC0gVGhlIHNvdW5kIGlkcyB3ZSB3YW50IHRvIGdldCB0aGUgZGV0YWlsZWQgaW5mbyBvZi5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHdpbGwgcmVzb2x2ZSB3aXRoIGFuIGFycmF5IG9mIHRoZSBzb3VuZCBpZHNcbiAgICogdGhlIGRldGFpbGVkIGluZm8gb2Ygd2hpY2ggbmVlZGVkIHRvIGJlIHF1ZXJpZWQuXG4gICAqXG4gICAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiBhIHByb2JsZW0gb2NjdXJzIGR1cmluZyBxdWVyeS5cbiAgICovXG4gIHF1ZXJ5RnJvbUlkcyhpZHMpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0RGV0YWlsZWRJbmZvRnJvbUlkcyhpZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0b2RvIGFsbG93IHRvIGNob29zZSBiZXR3ZWVuIE9SIGFuZCBBTkQgdG8gY29tYmluZSB1c2VybmFtZXMgaW4gdGhlIHF1ZXJ5LlxuICAgKi9cbiAgX2dldFNvdW5kTGlzdEZyb21QYXJhbWV0ZXJzKHBhcmFtcywgY2xlYXIgPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoY2xlYXIpIHRoaXMuX3NvdW5kc0luZm8uY2xlYXIoKTtcblxuICAgICAgbGV0IHF1ZXJ5ID0gJ2h0dHA6Ly9mcmVlc291bmQub3JnL2FwaXYyL3NlYXJjaC90ZXh0Lz8nO1xuICAgICAgY29uc3Qgc3VmZml4ID0gYCZ0b2tlbj0ke3RoaXMuYXBpS2V5fWA7XG5cbiAgICAgIGlmIChPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCA+IDApIHtcblxuICAgICAgICBpZiAocGFyYW1zLnNlYXJjaCAmJiBBcnJheS5pc0FycmF5KHBhcmFtcy5zZWFyY2gpICYmIHBhcmFtcy5zZWFyY2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHF1ZXJ5ICs9IGBxdWVyeT1cXFwiJHtwYXJhbXMuc2VhcmNoWzBdfVxcXCJgO1xuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwYXJhbXMuc2VhcmNoLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgaWYgKHBhcmFtcy5zZWFyY2hbaV0gIT09ICcnKVxuICAgICAgICAgICAgICBxdWVyeSArPSBgIFxcXCIke3BhcmFtcy5zZWFyY2hbaV19XFxcImA7XG5cbiAgICAgICAgICBxdWVyeSArPSAnJic7XG4gICAgICAgIH1cblxuICAgICAgICBxdWVyeSArPSAnZmlsdGVyPSc7XG5cbiAgICAgICAgaWYgKHBhcmFtcy5kdXJhdGlvbiAmJiBBcnJheS5pc0FycmF5KHBhcmFtcy5kdXJhdGlvbikgJiYgcGFyYW1zLmR1cmF0aW9uLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICAgICAgIWlzTmFOKHBhcnNlRmxvYXQocGFyYW1zLmR1cmF0aW9uWzBdKSkgJiYgaXNGaW5pdGUocGFyYW1zLmR1cmF0aW9uWzBdKSkge1xuICAgICAgICAgIGNvbnN0IG1pbkR1cmF0aW9uID0gcGFyYW1zLmR1cmF0aW9uWzBdIDwgMCA/IDAgOiBwYXJhbXMuZHVyYXRpb25bMF07XG4gICAgICAgICAgcXVlcnkgKz0gYGR1cmF0aW9uOlske21pbkR1cmF0aW9ufSBUTyBgO1xuXG4gICAgICAgICAgaWYgKCFpc05hTihwYXJzZUZsb2F0KHBhcmFtcy5kdXJhdGlvblsxXSkpICYmIGlzRmluaXRlKHBhcmFtcy5kdXJhdGlvblsxXSkpIHtcbiAgICAgICAgICAgIGNvbnN0IG1heER1cmF0aW9uID0gcGFyYW1zLmR1cmF0aW9uWzFdID4gbWluRHVyYXRpb24gPyBwYXJhbXMuZHVyYXRpb25bMV0gOiBtaW5EdXJhdGlvbjtcbiAgICAgICAgICAgIHF1ZXJ5ICs9IGAke21heER1cmF0aW9ufV0gYDtcbiAgICAgICAgICB9IGVsc2UgeyAvLyA9PT0gJyonXG4gICAgICAgICAgICBxdWVyeSArPSAnKic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAvLyBzZWFyY2g6ICAgWyAncXVlcnknLCAgICAnT1InIF0sXG4gICAgICAgICAgdXNlcnM6ICAgIFsgJ3VzZXJuYW1lJywgJ09SJyBdLFxuICAgICAgICAgIHBhY2tzOiAgICBbICdwYWNrJywgICAgICdPUicgXSxcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGxldCBsIGluIG9wdGlvbnMpXG4gICAgICAgICAgaWYgKHBhcmFtc1tsXSAmJiBBcnJheS5pc0FycmF5KHBhcmFtc1tsXSkgJiYgcGFyYW1zW2xdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHF1ZXJ5ICs9IGAke29wdGlvbnNbbF1bMF19Oigke3BhcmFtc1tsXVswXX1gO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBhcmFtc1tsXS5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgaWYgKHBhcmFtc1tsXVtpXSAhPT0gJycpXG4gICAgICAgICAgICAgICAgcXVlcnkgKz0gYCAke29wdGlvbnNbbF1bMV19ICR7cGFyYW1zW2xdW2ldfWA7XG5cbiAgICAgICAgICAgIHF1ZXJ5ICs9ICcpICc7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBxdWVyeSA9IHF1ZXJ5LnRyaW0oKTtcbiAgICAgIHF1ZXJ5ICs9IHN1ZmZpeDtcblxuICAgICAgdW5pdmVyc2FsWE1MSHR0cFJlcXVlc3QocXVlcnkpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IHJlc3BvbnNlLnJlc3VsdHM7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHIgaW4gcmVzKVxuICAgICAgICAgICAgICBpZiAoIXRoaXMuX3NvdW5kc0luZm8uaGFzKHJlc1tyXVsnaWQnXSkpXG4gICAgICAgICAgICAgICAgdGhpcy5fc291bmRzSW5mby5zZXQocmVzW3JdWydpZCddLCByZXNbcl0pO1xuXG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2dldERldGFpbGVkSW5mb0Zyb21JZHMoaWRzKSB7XG4gICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8uY2xlYXIoKTtcbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuXG4gICAgdGhpcy5fc291bmRzSW5mby5mb3JFYWNoKChpbmZvLCBpZCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9zb3VuZHNJbmZvLmdldChpZCkucHJldmlld3MpIHsvLyBkZXRhaWxlZCBpbmZvcm1hdGlvbiB3YXMgbm90IHByZXZpb3VzbHkgc3RvcmVkXG4gICAgICAgIHByb21pc2VzLnB1c2godGhpcy5fZ2V0RGV0YWlsZWRJbmZvRnJvbUlkKGlkKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mby5zZXQoaWQsIGluZm8pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZ2V0RGV0YWlsZWRJbmZvRnJvbUlkKGlkKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIERPRVMgVEhJUyBQUkVWRU5UIE9USEVSIEZJRUxEUyBUSEFOIFwicHJldmlld1wiIFRPIEJFIFJFVFVSTkVEID9cbiAgICAgIC8vIGxldCBxdWVyeSA9IGBodHRwOi8vd3d3LmZyZWVzb3VuZC5vcmcvYXBpdjIvc291bmRzLyR7aWR9Lz9maWx0ZXI9cHJldmlld2A7XG4gICAgICBsZXQgcXVlcnkgPSBgaHR0cDovL3d3dy5mcmVlc291bmQub3JnL2FwaXYyL3NvdW5kcy8ke2lkfS8/YDtcbiAgICAgIGNvbnN0IHN1ZmZpeCA9IGAmdG9rZW49JHt0aGlzLmFwaUtleX1gO1xuICAgICAgcXVlcnkgKz0gc3VmZml4O1xuXG4gICAgICB1bml2ZXJzYWxYTUxIdHRwUmVxdWVzdChxdWVyeSlcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc291bmRzSW5mby5zZXQoaWQsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLnNldChpZCwgdGhpcy5fc291bmRzSW5mby5nZXQoaWQpKTtcbiAgICAgICAgICAgIC8vIHRoaXMuX3NvdW5kc0luZm8uZ2V0KGlkKS5kZXRhaWxlZCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgICAgIHJlc29sdmUoaWQpO1xuICAgICAgICB9KVxuICAgICAgICAvLy5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogVXNlZCBieSBib3RoIGNoaWxkIGNsYXNzZXNcbiAgICovXG4gIF9tYXBUb09iamVjdChtYXApIHtcbiAgICBjb25zdCByZXMgPSB7fTtcblxuICAgIG1hcC5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICByZXNba2V5XSA9IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgRnJlZXNvdW5kUXVlcnk7XG5cbiJdfQ==