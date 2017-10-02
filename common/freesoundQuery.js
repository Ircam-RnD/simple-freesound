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
        console.log(query);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkZyZWVzb3VuZFF1ZXJ5IiwiYXBpS2V5IiwiX3NvdW5kc0luZm8iLCJfY3VycmVudFNvdW5kc0luZm8iLCJfZ2V0RGV0YWlsZWRJbmZvRnJvbUlkcyIsImJpbmQiLCJxdWVyeVBhcmFtcyIsIl9nZXRTb3VuZExpc3RGcm9tUGFyYW1ldGVycyIsInRoZW4iLCJpZHMiLCJwYXJhbXMiLCJjbGVhciIsInJlc29sdmUiLCJyZWplY3QiLCJxdWVyeSIsInN1ZmZpeCIsImxlbmd0aCIsInNlYXJjaCIsIkFycmF5IiwiaXNBcnJheSIsImkiLCJkdXJhdGlvbiIsImlzTmFOIiwicGFyc2VGbG9hdCIsImlzRmluaXRlIiwibWluRHVyYXRpb24iLCJtYXhEdXJhdGlvbiIsIm9wdGlvbnMiLCJ1c2VycyIsInBhY2tzIiwibCIsInRyaW0iLCJjb25zb2xlIiwibG9nIiwicmVzIiwicmVzcG9uc2UiLCJyZXN1bHRzIiwiciIsImhhcyIsInNldCIsInByb21pc2VzIiwiZm9yRWFjaCIsImluZm8iLCJpZCIsImdldCIsInByZXZpZXdzIiwicHVzaCIsIl9nZXREZXRhaWxlZEluZm9Gcm9tSWQiLCJhbGwiLCJtYXAiLCJ2YWx1ZSIsImtleSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7Ozs7SUFNTUEsYztBQUNKLDBCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCLFNBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsbUJBQW5CO0FBQ0EsU0FBS0Msa0JBQUwsR0FBMEIsbUJBQTFCOztBQUVBLFNBQUtDLHVCQUFMLEdBQStCLEtBQUtBLHVCQUFMLENBQTZCQyxJQUE3QixDQUFrQyxJQUFsQyxDQUEvQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkFnQk1DLFcsRUFBYTtBQUNqQixhQUFPLEtBQUtDLDJCQUFMLENBQWlDRCxXQUFqQyxFQUNKRSxJ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OztBQVFBLGFBQU8sa0JBQVFNLEdBQVIsQ0FBWVIsUUFBWixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7MkNBQ3VCRyxFLEVBQUk7QUFBQTs7QUFDekIsYUFBTyxzQkFBWSxVQUFDL0IsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDO0FBQ0E7QUFDQSxZQUFJQyxtREFBaUQ2QixFQUFqRCxPQUFKO0FBQ0EsWUFBTTVCLHFCQUFtQixPQUFLZCxNQUE5QjtBQUNBYSxpQkFBU0MsTUFBVDs7QUFFQSwyQ0FBd0JELEtBQXhCLEVBQ0dOLElBREgsQ0FDUSxvQkFBWTtBQUNkLGlCQUFLTixXQUFMLENBQWlCcUMsR0FBakIsQ0FBcUJJLEVBQXJCLEVBQXlCUixRQUF6QjtBQUNBLGlCQUFLaEMsa0JBQUwsQ0FBd0JvQyxHQUF4QixDQUE0QkksRUFBNUIsRUFBZ0MsT0FBS3pDLFdBQUwsQ0FBaUIwQyxHQUFqQixDQUFxQkQsRUFBckIsQ0FBaEM7QUFDQTs7QUFFQS9CLGtCQUFRK0IsRUFBUjtBQUNILFNBUEg7QUFRRTtBQUNILE9BaEJNLENBQVA7QUFpQkQ7O0FBRUQ7Ozs7Ozs7aUNBSWFNLEcsRUFBSztBQUNoQixVQUFNZixNQUFNLEVBQVo7O0FBRUFlLFVBQUlSLE9BQUosQ0FBWSxVQUFDUyxLQUFELEVBQVFDLEdBQVIsRUFBZ0I7QUFDMUJqQixZQUFJaUIsR0FBSixJQUFXRCxLQUFYO0FBQ0QsT0FGRDs7QUFJQSxhQUFPaEIsR0FBUDtBQUNEOzs7OztBQUNGOztrQkFFY2xDLGMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1bml2ZXJzYWxYTUxIdHRwUmVxdWVzdCB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogQ2xhc3MgcGVyZm9ybWluZyBnZW5lcmljIHF1ZXJpZXMgZnJvbSBzZWFyY2ggdGVybXMsIHVzZXJuYW1lcyBhbmQgZHVyYXRpb24gaW5mb3JtYXRpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFwaUtleSAtIFlvdXIgYXBpIGtleSwgYXMgZ2VuZXJhdGVkIGZyb20geW91ciBmcmVlc291bmRcbiAqIGRldmVsb3BlciBhY2NvdW50IHdoZW4gY3JlYXRpbmcgYSBuZXcgYXBwbGljYXRpb24uXG4gKi9cbmNsYXNzIEZyZWVzb3VuZFF1ZXJ5IHtcbiAgY29uc3RydWN0b3IoYXBpS2V5KSB7XG4gICAgdGhpcy5hcGlLZXkgPSBhcGlLZXk7XG4gICAgdGhpcy5fc291bmRzSW5mbyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mbyA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMuX2dldERldGFpbGVkSW5mb0Zyb21JZHMgPSB0aGlzLl9nZXREZXRhaWxlZEluZm9Gcm9tSWRzLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5UGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMuc2VhcmNoXSAtIFRoZSBzZWFyY2ggdGVybXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnVzZXJuYW1lXSAtIEEgbGlzdCBvZiB1c2VybmFtZXMgdG8gc2VhcmNoIGZpbGVzIGZyb20uXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtxdWVyeVBhcmFtcy5kdXJhdGlvbl0gLSBBbiBhcnJheSBvZiBzaXplIDIgOiBbIG1pbkR1cmF0aW9uLCBtYXhEdXJhdGlvbiBdIChpbiBzZWNvbmRzKS5cbiAgICogSWYgbWF4RHVyYXRpb24gaXMgbm90IGEgbnVtYmVyLCBpdCB3aWxsIGJlIGludGVycHJldGVkIGFzIFwiKlwiIChubyBtYXhpbXVtIGR1cmF0aW9uKS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IC0gQSBQcm9taXNlIG9iamVjdCB0aGF0IHdpbGwgcmVzb2x2ZSB3aXRoIGFuIGFycmF5IG9mIHRoZSBzb3VuZCBpZHMgZnJvbSB0aGUgYXBpJ3MgcmVzcG9uc2UgdG8gdGhlIHF1ZXJ5LlxuICAgKlxuICAgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgcXVlcnkuXG4gICAqXG4gICAqIEB0b2RvXG4gICAqIC0gYWRkIGFuIG9wdGlvbiB0byBjaGFuZ2UgXCJwYWdlX3NpemVcIiBkZWZhdWx0IHZhbHVlICgxNSlcbiAgICogLSBhZGQgYW4gb3B0aW9uIHRvIGNoYW5nZSBcInNvcnRcIiBkZWZhdWx0IHZhbHVlIChcInNjb3JlXCIpXG4gICAqIC0gYWRkIGFuIG9wdGlvbiB0byBmaWx0ZXIgdXNpbmcgZ2VvdGFnZ2luZ1xuICAgKi9cbiAgcXVlcnkocXVlcnlQYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0U291bmRMaXN0RnJvbVBhcmFtZXRlcnMocXVlcnlQYXJhbXMpXG4gICAgICAudGhlbih0aGlzLl9nZXREZXRhaWxlZEluZm9Gcm9tSWRzKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXkuTnVtYmVyfSBpZHMgLSBUaGUgc291bmQgaWRzIHdlIHdhbnQgdG8gZ2V0IHRoZSBkZXRhaWxlZCBpbmZvIG9mLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIHdpdGggYW4gYXJyYXkgb2YgdGhlIHNvdW5kIGlkc1xuICAgKiB0aGUgZGV0YWlsZWQgaW5mbyBvZiB3aGljaCBuZWVkZWQgdG8gYmUgcXVlcmllZC5cbiAgICpcbiAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHF1ZXJ5LlxuICAgKi9cbiAgcXVlcnlGcm9tSWRzKGlkcykge1xuICAgIHJldHVybiB0aGlzLl9nZXREZXRhaWxlZEluZm9Gcm9tSWRzKGlkcyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHRvZG8gYWxsb3cgdG8gY2hvb3NlIGJldHdlZW4gT1IgYW5kIEFORCB0byBjb21iaW5lIHVzZXJuYW1lcyBpbiB0aGUgcXVlcnkuXG4gICAqL1xuICBfZ2V0U291bmRMaXN0RnJvbVBhcmFtZXRlcnMocGFyYW1zLCBjbGVhciA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmIChjbGVhcikgdGhpcy5fc291bmRzSW5mby5jbGVhcigpO1xuXG4gICAgICBsZXQgcXVlcnkgPSAnaHR0cDovL2ZyZWVzb3VuZC5vcmcvYXBpdjIvc2VhcmNoL3RleHQvPyc7XG4gICAgICBjb25zdCBzdWZmaXggPSBgJnRva2VuPSR7dGhpcy5hcGlLZXl9YDtcblxuICAgICAgaWYgKE9iamVjdC5rZXlzKHBhcmFtcykubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIGlmIChwYXJhbXMuc2VhcmNoICYmIEFycmF5LmlzQXJyYXkocGFyYW1zLnNlYXJjaCkgJiYgcGFyYW1zLnNlYXJjaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcXVlcnkgKz0gYHF1ZXJ5PVxcXCIke3BhcmFtcy5zZWFyY2hbMF19XFxcImA7XG5cbiAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBhcmFtcy5zZWFyY2gubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICBpZiAocGFyYW1zLnNlYXJjaFtpXSAhPT0gJycpXG4gICAgICAgICAgICAgIHF1ZXJ5ICs9IGAgXFxcIiR7cGFyYW1zLnNlYXJjaFtpXX1cXFwiYDtcblxuICAgICAgICAgIHF1ZXJ5ICs9ICcmJztcbiAgICAgICAgfVxuXG4gICAgICAgIHF1ZXJ5ICs9ICdmaWx0ZXI9JztcblxuICAgICAgICBpZiAocGFyYW1zLmR1cmF0aW9uICYmIEFycmF5LmlzQXJyYXkocGFyYW1zLmR1cmF0aW9uKSAmJiBwYXJhbXMuZHVyYXRpb24ubGVuZ3RoID09PSAyICYmXG4gICAgICAgICAgICAhaXNOYU4ocGFyc2VGbG9hdChwYXJhbXMuZHVyYXRpb25bMF0pKSAmJiBpc0Zpbml0ZShwYXJhbXMuZHVyYXRpb25bMF0pKSB7XG4gICAgICAgICAgY29uc3QgbWluRHVyYXRpb24gPSBwYXJhbXMuZHVyYXRpb25bMF0gPCAwID8gMCA6IHBhcmFtcy5kdXJhdGlvblswXTtcbiAgICAgICAgICBxdWVyeSArPSBgZHVyYXRpb246WyR7bWluRHVyYXRpb259IFRPIGA7XG5cbiAgICAgICAgICBpZiAoIWlzTmFOKHBhcnNlRmxvYXQocGFyYW1zLmR1cmF0aW9uWzFdKSkgJiYgaXNGaW5pdGUocGFyYW1zLmR1cmF0aW9uWzFdKSkge1xuICAgICAgICAgICAgY29uc3QgbWF4RHVyYXRpb24gPSBwYXJhbXMuZHVyYXRpb25bMV0gPiBtaW5EdXJhdGlvbiA/IHBhcmFtcy5kdXJhdGlvblsxXSA6IG1pbkR1cmF0aW9uO1xuICAgICAgICAgICAgcXVlcnkgKz0gYCR7bWF4RHVyYXRpb259XSBgO1xuICAgICAgICAgIH0gZWxzZSB7IC8vID09PSAnKidcbiAgICAgICAgICAgIHF1ZXJ5ICs9ICcqXSc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAvLyBzZWFyY2g6ICAgWyAncXVlcnknLCAgICAnT1InIF0sXG4gICAgICAgICAgdXNlcnM6ICAgIFsgJ3VzZXJuYW1lJywgJ09SJyBdLFxuICAgICAgICAgIHBhY2tzOiAgICBbICdwYWNrJywgICAgICdPUicgXSxcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGxldCBsIGluIG9wdGlvbnMpXG4gICAgICAgICAgaWYgKHBhcmFtc1tsXSAmJiBBcnJheS5pc0FycmF5KHBhcmFtc1tsXSkgJiYgcGFyYW1zW2xdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHF1ZXJ5ICs9IGAke29wdGlvbnNbbF1bMF19Oigke3BhcmFtc1tsXVswXX1gO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBhcmFtc1tsXS5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgaWYgKHBhcmFtc1tsXVtpXSAhPT0gJycpXG4gICAgICAgICAgICAgICAgcXVlcnkgKz0gYCAke29wdGlvbnNbbF1bMV19ICR7cGFyYW1zW2xdW2ldfWA7XG5cbiAgICAgICAgICAgIHF1ZXJ5ICs9ICcpICc7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBxdWVyeSA9IHF1ZXJ5LnRyaW0oKTtcbiAgICAgIHF1ZXJ5ICs9IHN1ZmZpeDtcbiAgICAgIGNvbnNvbGUubG9nKHF1ZXJ5KTtcblxuICAgICAgdW5pdmVyc2FsWE1MSHR0cFJlcXVlc3QocXVlcnkpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IHJlc3BvbnNlLnJlc3VsdHM7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHIgaW4gcmVzKVxuICAgICAgICAgICAgICBpZiAoIXRoaXMuX3NvdW5kc0luZm8uaGFzKHJlc1tyXVsnaWQnXSkpXG4gICAgICAgICAgICAgICAgdGhpcy5fc291bmRzSW5mby5zZXQocmVzW3JdWydpZCddLCByZXNbcl0pO1xuXG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2dldERldGFpbGVkSW5mb0Zyb21JZHMoaWRzKSB7XG4gICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8uY2xlYXIoKTtcbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuXG4gICAgdGhpcy5fc291bmRzSW5mby5mb3JFYWNoKChpbmZvLCBpZCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9zb3VuZHNJbmZvLmdldChpZCkucHJldmlld3MpIHsvLyBkZXRhaWxlZCBpbmZvcm1hdGlvbiB3YXMgbm90IHByZXZpb3VzbHkgc3RvcmVkXG4gICAgICAgIHByb21pc2VzLnB1c2godGhpcy5fZ2V0RGV0YWlsZWRJbmZvRnJvbUlkKGlkKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mby5zZXQoaWQsIGluZm8pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZ2V0RGV0YWlsZWRJbmZvRnJvbUlkKGlkKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIERPRVMgVEhJUyBQUkVWRU5UIE9USEVSIEZJRUxEUyBUSEFOIFwicHJldmlld1wiIFRPIEJFIFJFVFVSTkVEID9cbiAgICAgIC8vIGxldCBxdWVyeSA9IGBodHRwOi8vd3d3LmZyZWVzb3VuZC5vcmcvYXBpdjIvc291bmRzLyR7aWR9Lz9maWx0ZXI9cHJldmlld2A7XG4gICAgICBsZXQgcXVlcnkgPSBgaHR0cDovL3d3dy5mcmVlc291bmQub3JnL2FwaXYyL3NvdW5kcy8ke2lkfS8/YDtcbiAgICAgIGNvbnN0IHN1ZmZpeCA9IGAmdG9rZW49JHt0aGlzLmFwaUtleX1gO1xuICAgICAgcXVlcnkgKz0gc3VmZml4O1xuXG4gICAgICB1bml2ZXJzYWxYTUxIdHRwUmVxdWVzdChxdWVyeSlcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc291bmRzSW5mby5zZXQoaWQsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLnNldChpZCwgdGhpcy5fc291bmRzSW5mby5nZXQoaWQpKTtcbiAgICAgICAgICAgIC8vIHRoaXMuX3NvdW5kc0luZm8uZ2V0KGlkKS5kZXRhaWxlZCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgICAgIHJlc29sdmUoaWQpO1xuICAgICAgICB9KVxuICAgICAgICAvLy5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogVXNlZCBieSBib3RoIGNoaWxkIGNsYXNzZXNcbiAgICovXG4gIF9tYXBUb09iamVjdChtYXApIHtcbiAgICBjb25zdCByZXMgPSB7fTtcblxuICAgIG1hcC5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICByZXNba2V5XSA9IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgRnJlZXNvdW5kUXVlcnk7XG5cbiJdfQ==