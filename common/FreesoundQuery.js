'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

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
      var _this = this;

      return this._getSoundListFromParameters(queryParams).then(function (updatedIds) {
        return _this._getDetailedInfoFromIds((0, _from2.default)(_this._currentSoundsInfo.keys()));
      });
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
      var _this2 = this;

      var clear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      return new _promise2.default(function (resolve, reject) {
        if (clear) _this2._currentSoundsInfo.clear();

        var query = 'http://freesound.org/apiv2/search/text/?';
        var suffix = '&token=' + _this2.apiKey;

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
              query += '*]';
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
            // console.log(res[r]);
            _this2._currentSoundsInfo.set(res[r]['id'], res[r]);

            if (!_this2._soundsInfo.has(res[r]['id'])) _this2._soundsInfo.set(res[r]['id'], res[r]);
          }

          resolve();
        });
      });
    }

    /** @private */

  }, {
    key: '_getDetailedInfoFromIds',
    value: function _getDetailedInfoFromIds(ids) {
      var _this3 = this;

      this._currentSoundsInfo.clear();
      var promises = [];

      ids.forEach(function (id) {
        var info = _this3._soundsInfo.get(id);

        if (!info.previews) // detailed information was not previously stored
          promises.push(_this3._getDetailedInfoFromId(id));else _this3._currentSoundsInfo.set(id, info);
      });

      // this._soundsInfo.forEach((info, id) => {
      //   if (!this._soundsInfo.get(id).previews) { // detailed information was not previously stored
      //     promises.push(this._getDetailedInfoFromId(id));
      //   } else {
      //     this._currentSoundsInfo.set(id, info);
      //   }
      // });

      return _promise2.default.all(promises);
    }

    /** @private */

  }, {
    key: '_getDetailedInfoFromId',
    value: function _getDetailedInfoFromId(id) {
      var _this4 = this;

      return new _promise2.default(function (resolve, reject) {
        // DOES THIS PREVENT OTHER FIELDS THAN "preview" TO BE RETURNED ?
        // let query = `http://www.freesound.org/apiv2/sounds/${id}/?filter=preview`;
        var query = 'http://www.freesound.org/apiv2/sounds/' + id + '/?';
        var suffix = '&token=' + _this4.apiKey;
        query += suffix;

        (0, _util.universalXMLHttpRequest)(query).then(function (response) {
          _this4._soundsInfo.set(id, response);
          _this4._currentSoundsInfo.set(id, _this4._soundsInfo.get(id));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkZyZWVzb3VuZFF1ZXJ5IiwiYXBpS2V5IiwiX3NvdW5kc0luZm8iLCJfY3VycmVudFNvdW5kc0luZm8iLCJfZ2V0RGV0YWlsZWRJbmZvRnJvbUlkcyIsImJpbmQiLCJxdWVyeVBhcmFtcyIsIl9nZXRTb3VuZExpc3RGcm9tUGFyYW1ldGVycyIsInRoZW4iLCJrZXlzIiwiaWRzIiwicGFyYW1zIiwiY2xlYXIiLCJyZXNvbHZlIiwicmVqZWN0IiwicXVlcnkiLCJzdWZmaXgiLCJsZW5ndGgiLCJzZWFyY2giLCJBcnJheSIsImlzQXJyYXkiLCJpIiwiZHVyYXRpb24iLCJpc05hTiIsInBhcnNlRmxvYXQiLCJpc0Zpbml0ZSIsIm1pbkR1cmF0aW9uIiwibWF4RHVyYXRpb24iLCJvcHRpb25zIiwidXNlcnMiLCJwYWNrcyIsImwiLCJ0cmltIiwicmVzIiwicmVzcG9uc2UiLCJyZXN1bHRzIiwiciIsInNldCIsImhhcyIsInByb21pc2VzIiwiZm9yRWFjaCIsImluZm8iLCJnZXQiLCJpZCIsInByZXZpZXdzIiwicHVzaCIsIl9nZXREZXRhaWxlZEluZm9Gcm9tSWQiLCJhbGwiLCJtYXAiLCJ2YWx1ZSIsImtleSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTs7Ozs7O0lBTU1BLGM7QUFDSiwwQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQixTQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLG1CQUFuQjtBQUNBLFNBQUtDLGtCQUFMLEdBQTBCLG1CQUExQjs7QUFFQSxTQUFLQyx1QkFBTCxHQUErQixLQUFLQSx1QkFBTCxDQUE2QkMsSUFBN0IsQ0FBa0MsSUFBbEMsQ0FBL0I7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBZ0JNQyxXLEVBQWE7QUFBQTs7QUFDakIsYUFBTyxLQUFLQywyQkFBTCxDQUFpQ0QsV0FBakMsRUFDSkUs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TCxtQkFBU00sSUFBVCxDQUFjLE9BQUtDLHNCQUFMLENBQTRCSCxFQUE1QixDQUFkLEVBREYsS0FHRSxPQUFLeEMsa0JBQUwsQ0FBd0JrQyxHQUF4QixDQUE0Qk0sRUFBNUIsRUFBZ0NGLElBQWhDO0FBQ0gsT0FQRDs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFPLGtCQUFRTSxHQUFSLENBQVlSLFFBQVosQ0FBUDtBQUNEOztBQUVEOzs7OzJDQUN1QkksRSxFQUFJO0FBQUE7O0FBQ3pCLGFBQU8sc0JBQVksVUFBQzlCLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QztBQUNBO0FBQ0EsWUFBSUMsbURBQWlENEIsRUFBakQsT0FBSjtBQUNBLFlBQU0zQixxQkFBbUIsT0FBS2YsTUFBOUI7QUFDQWMsaUJBQVNDLE1BQVQ7O0FBRUEsMkNBQXdCRCxLQUF4QixFQUNHUCxJQURILENBQ1Esb0JBQVk7QUFDZCxpQkFBS04sV0FBTCxDQUFpQm1DLEdBQWpCLENBQXFCTSxFQUFyQixFQUF5QlQsUUFBekI7QUFDQSxpQkFBSy9CLGtCQUFMLENBQXdCa0MsR0FBeEIsQ0FBNEJNLEVBQTVCLEVBQWdDLE9BQUt6QyxXQUFMLENBQWlCd0MsR0FBakIsQ0FBcUJDLEVBQXJCLENBQWhDO0FBQ0E7O0FBRUE5QixrQkFBUThCLEVBQVI7QUFDSCxTQVBIO0FBUUU7QUFDSCxPQWhCTSxDQUFQO0FBaUJEOztBQUVEOzs7Ozs7O2lDQUlhSyxHLEVBQUs7QUFDaEIsVUFBTWYsTUFBTSxFQUFaOztBQUVBZSxVQUFJUixPQUFKLENBQVksVUFBQ1MsS0FBRCxFQUFRQyxHQUFSLEVBQWdCO0FBQzFCakIsWUFBSWlCLEdBQUosSUFBV0QsS0FBWDtBQUNELE9BRkQ7O0FBSUEsYUFBT2hCLEdBQVA7QUFDRDs7Ozs7QUFDRjs7a0JBRWNqQyxjIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdW5pdmVyc2FsWE1MSHR0cFJlcXVlc3QgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIENsYXNzIHBlcmZvcm1pbmcgZ2VuZXJpYyBxdWVyaWVzIGZyb20gc2VhcmNoIHRlcm1zLCB1c2VybmFtZXMgYW5kIGR1cmF0aW9uIGluZm9ybWF0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcGlLZXkgLSBZb3VyIGFwaSBrZXksIGFzIGdlbmVyYXRlZCBmcm9tIHlvdXIgZnJlZXNvdW5kXG4gKiBkZXZlbG9wZXIgYWNjb3VudCB3aGVuIGNyZWF0aW5nIGEgbmV3IGFwcGxpY2F0aW9uLlxuICovXG5jbGFzcyBGcmVlc291bmRRdWVyeSB7XG4gIGNvbnN0cnVjdG9yKGFwaUtleSkge1xuICAgIHRoaXMuYXBpS2V5ID0gYXBpS2V5O1xuICAgIHRoaXMuX3NvdW5kc0luZm8gPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8gPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLl9nZXREZXRhaWxlZEluZm9Gcm9tSWRzID0gdGhpcy5fZ2V0RGV0YWlsZWRJbmZvRnJvbUlkcy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeVBhcmFtcyAtIFRoZSBwYXJhbWV0ZXJzIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnNlYXJjaF0gLSBUaGUgc2VhcmNoIHRlcm1zIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy51c2VybmFtZV0gLSBBIGxpc3Qgb2YgdXNlcm5hbWVzIHRvIHNlYXJjaCBmaWxlcyBmcm9tLlxuICAgKiBAcGFyYW0ge0FycmF5fSBbcXVlcnlQYXJhbXMuZHVyYXRpb25dIC0gQW4gYXJyYXkgb2Ygc2l6ZSAyIDogWyBtaW5EdXJhdGlvbiwgbWF4RHVyYXRpb24gXSAoaW4gc2Vjb25kcykuXG4gICAqIElmIG1heER1cmF0aW9uIGlzIG5vdCBhIG51bWJlciwgaXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBcIipcIiAobm8gbWF4aW11bSBkdXJhdGlvbikuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSAtIEEgUHJvbWlzZSBvYmplY3QgdGhhdCB3aWxsIHJlc29sdmUgd2l0aCBhbiBhcnJheSBvZiB0aGUgc291bmQgaWRzIGZyb20gdGhlIGFwaSdzIHJlc3BvbnNlIHRvIHRoZSBxdWVyeS5cbiAgICpcbiAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHF1ZXJ5LlxuICAgKlxuICAgKiBAdG9kb1xuICAgKiAtIGFkZCBhbiBvcHRpb24gdG8gY2hhbmdlIFwicGFnZV9zaXplXCIgZGVmYXVsdCB2YWx1ZSAoMTUpXG4gICAqIC0gYWRkIGFuIG9wdGlvbiB0byBjaGFuZ2UgXCJzb3J0XCIgZGVmYXVsdCB2YWx1ZSAoXCJzY29yZVwiKVxuICAgKiAtIGFkZCBhbiBvcHRpb24gdG8gZmlsdGVyIHVzaW5nIGdlb3RhZ2dpbmdcbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5UGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFNvdW5kTGlzdEZyb21QYXJhbWV0ZXJzKHF1ZXJ5UGFyYW1zKVxuICAgICAgLnRoZW4odXBkYXRlZElkcyA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXREZXRhaWxlZEluZm9Gcm9tSWRzKEFycmF5LmZyb20odGhpcy5fY3VycmVudFNvdW5kc0luZm8ua2V5cygpKSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5Lk51bWJlcn0gaWRzIC0gVGhlIHNvdW5kIGlkcyB3ZSB3YW50IHRvIGdldCB0aGUgZGV0YWlsZWQgaW5mbyBvZi5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHdpbGwgcmVzb2x2ZSB3aXRoIGFuIGFycmF5IG9mIHRoZSBzb3VuZCBpZHNcbiAgICogdGhlIGRldGFpbGVkIGluZm8gb2Ygd2hpY2ggbmVlZGVkIHRvIGJlIHF1ZXJpZWQuXG4gICAqXG4gICAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiBhIHByb2JsZW0gb2NjdXJzIGR1cmluZyBxdWVyeS5cbiAgICovXG4gIHF1ZXJ5RnJvbUlkcyhpZHMpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0RGV0YWlsZWRJbmZvRnJvbUlkcyhpZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0b2RvIGFsbG93IHRvIGNob29zZSBiZXR3ZWVuIE9SIGFuZCBBTkQgdG8gY29tYmluZSB1c2VybmFtZXMgaW4gdGhlIHF1ZXJ5LlxuICAgKi9cbiAgX2dldFNvdW5kTGlzdEZyb21QYXJhbWV0ZXJzKHBhcmFtcywgY2xlYXIgPSB0cnVlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmIChjbGVhcikgdGhpcy5fY3VycmVudFNvdW5kc0luZm8uY2xlYXIoKTtcblxuICAgICAgbGV0IHF1ZXJ5ID0gJ2h0dHA6Ly9mcmVlc291bmQub3JnL2FwaXYyL3NlYXJjaC90ZXh0Lz8nO1xuICAgICAgY29uc3Qgc3VmZml4ID0gYCZ0b2tlbj0ke3RoaXMuYXBpS2V5fWA7XG5cbiAgICAgIGlmIChPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCA+IDApIHtcblxuICAgICAgICBpZiAocGFyYW1zLnNlYXJjaCAmJiBBcnJheS5pc0FycmF5KHBhcmFtcy5zZWFyY2gpICYmIHBhcmFtcy5zZWFyY2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHF1ZXJ5ICs9IGBxdWVyeT1cXFwiJHtwYXJhbXMuc2VhcmNoWzBdfVxcXCJgO1xuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwYXJhbXMuc2VhcmNoLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgaWYgKHBhcmFtcy5zZWFyY2hbaV0gIT09ICcnKVxuICAgICAgICAgICAgICBxdWVyeSArPSBgIFxcXCIke3BhcmFtcy5zZWFyY2hbaV19XFxcImA7XG5cbiAgICAgICAgICBxdWVyeSArPSAnJic7XG4gICAgICAgIH1cblxuICAgICAgICBxdWVyeSArPSAnZmlsdGVyPSc7XG5cbiAgICAgICAgaWYgKHBhcmFtcy5kdXJhdGlvbiAmJiBBcnJheS5pc0FycmF5KHBhcmFtcy5kdXJhdGlvbikgJiYgcGFyYW1zLmR1cmF0aW9uLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICAgICAgIWlzTmFOKHBhcnNlRmxvYXQocGFyYW1zLmR1cmF0aW9uWzBdKSkgJiYgaXNGaW5pdGUocGFyYW1zLmR1cmF0aW9uWzBdKSkge1xuICAgICAgICAgIGNvbnN0IG1pbkR1cmF0aW9uID0gcGFyYW1zLmR1cmF0aW9uWzBdIDwgMCA/IDAgOiBwYXJhbXMuZHVyYXRpb25bMF07XG4gICAgICAgICAgcXVlcnkgKz0gYGR1cmF0aW9uOlske21pbkR1cmF0aW9ufSBUTyBgO1xuXG4gICAgICAgICAgaWYgKCFpc05hTihwYXJzZUZsb2F0KHBhcmFtcy5kdXJhdGlvblsxXSkpICYmIGlzRmluaXRlKHBhcmFtcy5kdXJhdGlvblsxXSkpIHtcbiAgICAgICAgICAgIGNvbnN0IG1heER1cmF0aW9uID0gcGFyYW1zLmR1cmF0aW9uWzFdID4gbWluRHVyYXRpb24gPyBwYXJhbXMuZHVyYXRpb25bMV0gOiBtaW5EdXJhdGlvbjtcbiAgICAgICAgICAgIHF1ZXJ5ICs9IGAke21heER1cmF0aW9ufV0gYDtcbiAgICAgICAgICB9IGVsc2UgeyAvLyA9PT0gJyonXG4gICAgICAgICAgICBxdWVyeSArPSAnKl0nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgLy8gc2VhcmNoOiAgIFsgJ3F1ZXJ5JywgICAgJ09SJyBdLFxuICAgICAgICAgIHVzZXJzOiAgICBbICd1c2VybmFtZScsICdPUicgXSxcbiAgICAgICAgICBwYWNrczogICAgWyAncGFjaycsICAgICAnT1InIF0sXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChsZXQgbCBpbiBvcHRpb25zKVxuICAgICAgICAgIGlmIChwYXJhbXNbbF0gJiYgQXJyYXkuaXNBcnJheShwYXJhbXNbbF0pICYmIHBhcmFtc1tsXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBxdWVyeSArPSBgJHtvcHRpb25zW2xdWzBdfTooJHtwYXJhbXNbbF1bMF19YDtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwYXJhbXNbbF0ubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgIGlmIChwYXJhbXNbbF1baV0gIT09ICcnKVxuICAgICAgICAgICAgICAgIHF1ZXJ5ICs9IGAgJHtvcHRpb25zW2xdWzFdfSAke3BhcmFtc1tsXVtpXX1gO1xuXG4gICAgICAgICAgICBxdWVyeSArPSAnKSAnO1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcXVlcnkgPSBxdWVyeS50cmltKCk7XG4gICAgICBxdWVyeSArPSBzdWZmaXg7XG5cbiAgICAgIHVuaXZlcnNhbFhNTEh0dHBSZXF1ZXN0KHF1ZXJ5KVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSByZXNwb25zZS5yZXN1bHRzO1xuXG4gICAgICAgICAgICBmb3IgKGxldCByIGluIHJlcykge1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNbcl0pO1xuICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mby5zZXQocmVzW3JdWydpZCddLCByZXNbcl0pO1xuXG4gICAgICAgICAgICAgIGlmICghdGhpcy5fc291bmRzSW5mby5oYXMocmVzW3JdWydpZCddKSlcbiAgICAgICAgICAgICAgICB0aGlzLl9zb3VuZHNJbmZvLnNldChyZXNbcl1bJ2lkJ10sIHJlc1tyXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSlcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZ2V0RGV0YWlsZWRJbmZvRnJvbUlkcyhpZHMpIHtcbiAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mby5jbGVhcigpO1xuICAgIGNvbnN0IHByb21pc2VzID0gW107XG5cbiAgICBpZHMuZm9yRWFjaChpZCA9PiB7XG4gICAgICBjb25zdCBpbmZvID0gdGhpcy5fc291bmRzSW5mby5nZXQoaWQpO1xuXG4gICAgICBpZiAoIWluZm8ucHJldmlld3MpIC8vIGRldGFpbGVkIGluZm9ybWF0aW9uIHdhcyBub3QgcHJldmlvdXNseSBzdG9yZWRcbiAgICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLl9nZXREZXRhaWxlZEluZm9Gcm9tSWQoaWQpKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8uc2V0KGlkLCBpbmZvKTtcbiAgICB9KTtcblxuICAgIC8vIHRoaXMuX3NvdW5kc0luZm8uZm9yRWFjaCgoaW5mbywgaWQpID0+IHtcbiAgICAvLyAgIGlmICghdGhpcy5fc291bmRzSW5mby5nZXQoaWQpLnByZXZpZXdzKSB7IC8vIGRldGFpbGVkIGluZm9ybWF0aW9uIHdhcyBub3QgcHJldmlvdXNseSBzdG9yZWRcbiAgICAvLyAgICAgcHJvbWlzZXMucHVzaCh0aGlzLl9nZXREZXRhaWxlZEluZm9Gcm9tSWQoaWQpKTtcbiAgICAvLyAgIH0gZWxzZSB7XG4gICAgLy8gICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLnNldChpZCwgaW5mbyk7XG4gICAgLy8gICB9XG4gICAgLy8gfSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9nZXREZXRhaWxlZEluZm9Gcm9tSWQoaWQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy8gRE9FUyBUSElTIFBSRVZFTlQgT1RIRVIgRklFTERTIFRIQU4gXCJwcmV2aWV3XCIgVE8gQkUgUkVUVVJORUQgP1xuICAgICAgLy8gbGV0IHF1ZXJ5ID0gYGh0dHA6Ly93d3cuZnJlZXNvdW5kLm9yZy9hcGl2Mi9zb3VuZHMvJHtpZH0vP2ZpbHRlcj1wcmV2aWV3YDtcbiAgICAgIGxldCBxdWVyeSA9IGBodHRwOi8vd3d3LmZyZWVzb3VuZC5vcmcvYXBpdjIvc291bmRzLyR7aWR9Lz9gO1xuICAgICAgY29uc3Qgc3VmZml4ID0gYCZ0b2tlbj0ke3RoaXMuYXBpS2V5fWA7XG4gICAgICBxdWVyeSArPSBzdWZmaXg7XG5cbiAgICAgIHVuaXZlcnNhbFhNTEh0dHBSZXF1ZXN0KHF1ZXJ5KVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zb3VuZHNJbmZvLnNldChpZCwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8uc2V0KGlkLCB0aGlzLl9zb3VuZHNJbmZvLmdldChpZCkpO1xuICAgICAgICAgICAgLy8gdGhpcy5fc291bmRzSW5mby5nZXQoaWQpLmRldGFpbGVkID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICAgICAgcmVzb2x2ZShpZCk7XG4gICAgICAgIH0pXG4gICAgICAgIC8vLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhY2spKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBVc2VkIGJ5IGJvdGggY2hpbGQgY2xhc3Nlc1xuICAgKi9cbiAgX21hcFRvT2JqZWN0KG1hcCkge1xuICAgIGNvbnN0IHJlcyA9IHt9O1xuXG4gICAgbWFwLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIHJlc1trZXldID0gdmFsdWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBGcmVlc291bmRRdWVyeTtcblxuIl19