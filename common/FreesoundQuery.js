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
  }, {
    key: '_objectToMap',
    value: function _objectToMap(obj) {
      var res = new _map2.default();

      for (var key in obj) {
        res.set(key, obj[key]);
      }

      return res;
    }
  }]);
  return FreesoundQuery;
}();

;

exports.default = FreesoundQuery;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkZyZWVzb3VuZFF1ZXJ5IiwiYXBpS2V5IiwiX3NvdW5kc0luZm8iLCJfY3VycmVudFNvdW5kc0luZm8iLCJfZ2V0RGV0YWlsZWRJbmZvRnJvbUlkcyIsImJpbmQiLCJxdWVyeVBhcmFtcyIsIl9nZXRTb3VuZExpc3RGcm9tUGFyYW1ldGVycyIsInRoZW4iLCJrZXlzIiwiaWRzIiwicGFyYW1zIiwiY2xlYXIiLCJyZXNvbHZlIiwicmVqZWN0IiwicXVlcnkiLCJzdWZmaXgiLCJsZW5ndGgiLCJzZWFyY2giLCJBcnJheSIsImlzQXJyYXkiLCJpIiwiZHVyYXRpb24iLCJpc05hTiIsInBhcnNlRmxvYXQiLCJpc0Zpbml0ZSIsIm1pbkR1cmF0aW9uIiwibWF4RHVyYXRpb24iLCJvcHRpb25zIiwidXNlcnMiLCJwYWNrcyIsImwiLCJ0cmltIiwicmVzIiwicmVzcG9uc2UiLCJyZXN1bHRzIiwiciIsInNldCIsImhhcyIsInByb21pc2VzIiwiZm9yRWFjaCIsImluZm8iLCJnZXQiLCJpZCIsInByZXZpZXdzIiwicHVzaCIsIl9nZXREZXRhaWxlZEluZm9Gcm9tSWQiLCJhbGwiLCJtYXAiLCJ2YWx1ZSIsImtleSIsIm9iaiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTs7Ozs7O0lBTU1BLGM7QUFDSiwwQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQixTQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLG1CQUFuQjtBQUNBLFNBQUtDLGtCQUFMLEdBQTBCLG1CQUExQjs7QUFFQSxTQUFLQyx1QkFBTCxHQUErQixLQUFLQSx1QkFBTCxDQUE2QkMsSUFBN0IsQ0FBa0MsSUFBbEMsQ0FBL0I7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBZ0JNQyxXLEVBQWE7QUFBQTs7QUFDakIsYUFBTyxLQUFLQywyQkFBTCxDQUFpQ0QsV0FBakMs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QUFRYSxHQUFSLEVBQWFDLElBQUlELEdBQUosQ0FBYjtBQUNEOztBQUVELGFBQU9qQixHQUFQO0FBQ0Q7Ozs7O0FBQ0Y7O2tCQUVjakMsYyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVuaXZlcnNhbFhNTEh0dHBSZXF1ZXN0IH0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBDbGFzcyBwZXJmb3JtaW5nIGdlbmVyaWMgcXVlcmllcyBmcm9tIHNlYXJjaCB0ZXJtcywgdXNlcm5hbWVzIGFuZCBkdXJhdGlvbiBpbmZvcm1hdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYXBpS2V5IC0gWW91ciBhcGkga2V5LCBhcyBnZW5lcmF0ZWQgZnJvbSB5b3VyIGZyZWVzb3VuZFxuICogZGV2ZWxvcGVyIGFjY291bnQgd2hlbiBjcmVhdGluZyBhIG5ldyBhcHBsaWNhdGlvbi5cbiAqL1xuY2xhc3MgRnJlZXNvdW5kUXVlcnkge1xuICBjb25zdHJ1Y3RvcihhcGlLZXkpIHtcbiAgICB0aGlzLmFwaUtleSA9IGFwaUtleTtcbiAgICB0aGlzLl9zb3VuZHNJbmZvID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5fZ2V0RGV0YWlsZWRJbmZvRnJvbUlkcyA9IHRoaXMuX2dldERldGFpbGVkSW5mb0Zyb21JZHMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnlQYXJhbXMgLSBUaGUgcGFyYW1ldGVycyB1c2VkIHRvIGJ1aWxkIHRoZSBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheS5TdHJpbmd9IFtxdWVyeVBhcmFtcy5zZWFyY2hdIC0gVGhlIHNlYXJjaCB0ZXJtcyB0aGF0IHdpbGwgYmUgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMudXNlcm5hbWVdIC0gQSBsaXN0IG9mIHVzZXJuYW1lcyB0byBzZWFyY2ggZmlsZXMgZnJvbS5cbiAgICogQHBhcmFtIHtBcnJheX0gW3F1ZXJ5UGFyYW1zLmR1cmF0aW9uXSAtIEFuIGFycmF5IG9mIHNpemUgMiA6IFsgbWluRHVyYXRpb24sIG1heER1cmF0aW9uIF0gKGluIHNlY29uZHMpLlxuICAgKiBJZiBtYXhEdXJhdGlvbiBpcyBub3QgYSBudW1iZXIsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgXCIqXCIgKG5vIG1heGltdW0gZHVyYXRpb24pLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gLSBBIFByb21pc2Ugb2JqZWN0IHRoYXQgd2lsbCByZXNvbHZlIHdpdGggYW4gYXJyYXkgb2YgdGhlIHNvdW5kIGlkcyBmcm9tIHRoZSBhcGkncyByZXNwb25zZSB0byB0aGUgcXVlcnkuXG4gICAqXG4gICAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiBhIHByb2JsZW0gb2NjdXJzIGR1cmluZyBxdWVyeS5cbiAgICpcbiAgICogQHRvZG9cbiAgICogLSBhZGQgYW4gb3B0aW9uIHRvIGNoYW5nZSBcInBhZ2Vfc2l6ZVwiIGRlZmF1bHQgdmFsdWUgKDE1KVxuICAgKiAtIGFkZCBhbiBvcHRpb24gdG8gY2hhbmdlIFwic29ydFwiIGRlZmF1bHQgdmFsdWUgKFwic2NvcmVcIilcbiAgICogLSBhZGQgYW4gb3B0aW9uIHRvIGZpbHRlciB1c2luZyBnZW90YWdnaW5nXG4gICAqL1xuICBxdWVyeShxdWVyeVBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLl9nZXRTb3VuZExpc3RGcm9tUGFyYW1ldGVycyhxdWVyeVBhcmFtcylcbiAgICAgIC50aGVuKHVwZGF0ZWRJZHMgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0RGV0YWlsZWRJbmZvRnJvbUlkcyhBcnJheS5mcm9tKHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLmtleXMoKSkpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtBcnJheS5OdW1iZXJ9IGlkcyAtIFRoZSBzb3VuZCBpZHMgd2Ugd2FudCB0byBnZXQgdGhlIGRldGFpbGVkIGluZm8gb2YuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCB3aWxsIHJlc29sdmUgd2l0aCBhbiBhcnJheSBvZiB0aGUgc291bmQgaWRzXG4gICAqIHRoZSBkZXRhaWxlZCBpbmZvIG9mIHdoaWNoIG5lZWRlZCB0byBiZSBxdWVyaWVkLlxuICAgKlxuICAgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgcXVlcnkuXG4gICAqL1xuICBxdWVyeUZyb21JZHMoaWRzKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldERldGFpbGVkSW5mb0Zyb21JZHMoaWRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdG9kbyBhbGxvdyB0byBjaG9vc2UgYmV0d2VlbiBPUiBhbmQgQU5EIHRvIGNvbWJpbmUgdXNlcm5hbWVzIGluIHRoZSBxdWVyeS5cbiAgICovXG4gIF9nZXRTb3VuZExpc3RGcm9tUGFyYW1ldGVycyhwYXJhbXMsIGNsZWFyID0gdHJ1ZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoY2xlYXIpIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLmNsZWFyKCk7XG5cbiAgICAgIGxldCBxdWVyeSA9ICdodHRwOi8vZnJlZXNvdW5kLm9yZy9hcGl2Mi9zZWFyY2gvdGV4dC8/JztcbiAgICAgIGNvbnN0IHN1ZmZpeCA9IGAmdG9rZW49JHt0aGlzLmFwaUtleX1gO1xuXG4gICAgICBpZiAoT2JqZWN0LmtleXMocGFyYW1zKS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgaWYgKHBhcmFtcy5zZWFyY2ggJiYgQXJyYXkuaXNBcnJheShwYXJhbXMuc2VhcmNoKSAmJiBwYXJhbXMuc2VhcmNoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBxdWVyeSArPSBgcXVlcnk9XFxcIiR7cGFyYW1zLnNlYXJjaFswXX1cXFwiYDtcblxuICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcGFyYW1zLnNlYXJjaC5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIGlmIChwYXJhbXMuc2VhcmNoW2ldICE9PSAnJylcbiAgICAgICAgICAgICAgcXVlcnkgKz0gYCBcXFwiJHtwYXJhbXMuc2VhcmNoW2ldfVxcXCJgO1xuXG4gICAgICAgICAgcXVlcnkgKz0gJyYnO1xuICAgICAgICB9XG5cbiAgICAgICAgcXVlcnkgKz0gJ2ZpbHRlcj0nO1xuXG4gICAgICAgIGlmIChwYXJhbXMuZHVyYXRpb24gJiYgQXJyYXkuaXNBcnJheShwYXJhbXMuZHVyYXRpb24pICYmIHBhcmFtcy5kdXJhdGlvbi5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgICAgICFpc05hTihwYXJzZUZsb2F0KHBhcmFtcy5kdXJhdGlvblswXSkpICYmIGlzRmluaXRlKHBhcmFtcy5kdXJhdGlvblswXSkpIHtcbiAgICAgICAgICBjb25zdCBtaW5EdXJhdGlvbiA9IHBhcmFtcy5kdXJhdGlvblswXSA8IDAgPyAwIDogcGFyYW1zLmR1cmF0aW9uWzBdO1xuICAgICAgICAgIHF1ZXJ5ICs9IGBkdXJhdGlvbjpbJHttaW5EdXJhdGlvbn0gVE8gYDtcblxuICAgICAgICAgIGlmICghaXNOYU4ocGFyc2VGbG9hdChwYXJhbXMuZHVyYXRpb25bMV0pKSAmJiBpc0Zpbml0ZShwYXJhbXMuZHVyYXRpb25bMV0pKSB7XG4gICAgICAgICAgICBjb25zdCBtYXhEdXJhdGlvbiA9IHBhcmFtcy5kdXJhdGlvblsxXSA+IG1pbkR1cmF0aW9uID8gcGFyYW1zLmR1cmF0aW9uWzFdIDogbWluRHVyYXRpb247XG4gICAgICAgICAgICBxdWVyeSArPSBgJHttYXhEdXJhdGlvbn1dIGA7XG4gICAgICAgICAgfSBlbHNlIHsgLy8gPT09ICcqJ1xuICAgICAgICAgICAgcXVlcnkgKz0gJypdJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgIC8vIHNlYXJjaDogICBbICdxdWVyeScsICAgICdPUicgXSxcbiAgICAgICAgICB1c2VyczogICAgWyAndXNlcm5hbWUnLCAnT1InIF0sXG4gICAgICAgICAgcGFja3M6ICAgIFsgJ3BhY2snLCAgICAgJ09SJyBdLFxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAobGV0IGwgaW4gb3B0aW9ucylcbiAgICAgICAgICBpZiAocGFyYW1zW2xdICYmIEFycmF5LmlzQXJyYXkocGFyYW1zW2xdKSAmJiBwYXJhbXNbbF0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcXVlcnkgKz0gYCR7b3B0aW9uc1tsXVswXX06KCR7cGFyYW1zW2xdWzBdfWA7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcGFyYW1zW2xdLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICBpZiAocGFyYW1zW2xdW2ldICE9PSAnJylcbiAgICAgICAgICAgICAgICBxdWVyeSArPSBgICR7b3B0aW9uc1tsXVsxXX0gJHtwYXJhbXNbbF1baV19YDtcblxuICAgICAgICAgICAgcXVlcnkgKz0gJykgJztcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHF1ZXJ5ID0gcXVlcnkudHJpbSgpO1xuICAgICAgcXVlcnkgKz0gc3VmZml4O1xuXG4gICAgICB1bml2ZXJzYWxYTUxIdHRwUmVxdWVzdChxdWVyeSlcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gcmVzcG9uc2UucmVzdWx0cztcblxuICAgICAgICAgICAgZm9yIChsZXQgciBpbiByZXMpIHtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzW3JdKTtcbiAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8uc2V0KHJlc1tyXVsnaWQnXSwgcmVzW3JdKTtcblxuICAgICAgICAgICAgICBpZiAoIXRoaXMuX3NvdW5kc0luZm8uaGFzKHJlc1tyXVsnaWQnXSkpXG4gICAgICAgICAgICAgICAgdGhpcy5fc291bmRzSW5mby5zZXQocmVzW3JdWydpZCddLCByZXNbcl0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2dldERldGFpbGVkSW5mb0Zyb21JZHMoaWRzKSB7XG4gICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8uY2xlYXIoKTtcbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuXG4gICAgaWRzLmZvckVhY2goaWQgPT4ge1xuICAgICAgY29uc3QgaW5mbyA9IHRoaXMuX3NvdW5kc0luZm8uZ2V0KGlkKTtcblxuICAgICAgaWYgKCFpbmZvLnByZXZpZXdzKSAvLyBkZXRhaWxlZCBpbmZvcm1hdGlvbiB3YXMgbm90IHByZXZpb3VzbHkgc3RvcmVkXG4gICAgICAgIHByb21pc2VzLnB1c2godGhpcy5fZ2V0RGV0YWlsZWRJbmZvRnJvbUlkKGlkKSk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLnNldChpZCwgaW5mbyk7XG4gICAgfSk7XG5cbiAgICAvLyB0aGlzLl9zb3VuZHNJbmZvLmZvckVhY2goKGluZm8sIGlkKSA9PiB7XG4gICAgLy8gICBpZiAoIXRoaXMuX3NvdW5kc0luZm8uZ2V0KGlkKS5wcmV2aWV3cykgeyAvLyBkZXRhaWxlZCBpbmZvcm1hdGlvbiB3YXMgbm90IHByZXZpb3VzbHkgc3RvcmVkXG4gICAgLy8gICAgIHByb21pc2VzLnB1c2godGhpcy5fZ2V0RGV0YWlsZWRJbmZvRnJvbUlkKGlkKSk7XG4gICAgLy8gICB9IGVsc2Uge1xuICAgIC8vICAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mby5zZXQoaWQsIGluZm8pO1xuICAgIC8vICAgfVxuICAgIC8vIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZ2V0RGV0YWlsZWRJbmZvRnJvbUlkKGlkKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIERPRVMgVEhJUyBQUkVWRU5UIE9USEVSIEZJRUxEUyBUSEFOIFwicHJldmlld1wiIFRPIEJFIFJFVFVSTkVEID9cbiAgICAgIC8vIGxldCBxdWVyeSA9IGBodHRwOi8vd3d3LmZyZWVzb3VuZC5vcmcvYXBpdjIvc291bmRzLyR7aWR9Lz9maWx0ZXI9cHJldmlld2A7XG4gICAgICBsZXQgcXVlcnkgPSBgaHR0cDovL3d3dy5mcmVlc291bmQub3JnL2FwaXYyL3NvdW5kcy8ke2lkfS8/YDtcbiAgICAgIGNvbnN0IHN1ZmZpeCA9IGAmdG9rZW49JHt0aGlzLmFwaUtleX1gO1xuICAgICAgcXVlcnkgKz0gc3VmZml4O1xuXG4gICAgICB1bml2ZXJzYWxYTUxIdHRwUmVxdWVzdChxdWVyeSlcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc291bmRzSW5mby5zZXQoaWQsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLnNldChpZCwgdGhpcy5fc291bmRzSW5mby5nZXQoaWQpKTtcbiAgICAgICAgICAgIC8vIHRoaXMuX3NvdW5kc0luZm8uZ2V0KGlkKS5kZXRhaWxlZCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgICAgIHJlc29sdmUoaWQpO1xuICAgICAgICB9KVxuICAgICAgICAvLy5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogVXNlZCBieSBib3RoIGNoaWxkIGNsYXNzZXNcbiAgICovXG4gIF9tYXBUb09iamVjdChtYXApIHtcbiAgICBjb25zdCByZXMgPSB7fTtcblxuICAgIG1hcC5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICByZXNba2V5XSA9IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIF9vYmplY3RUb01hcChvYmopIHtcbiAgICBjb25zdCByZXMgPSBuZXcgTWFwKCk7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICByZXMuc2V0KGtleSwgb2JqW2tleV0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEZyZWVzb3VuZFF1ZXJ5O1xuXG4iXX0=