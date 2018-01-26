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
 * @param {Boolean} [storeSoundsInfo=false] - Store all sounds detailed informations,
 * including preview urls, to optimize the number of queries to the API (can be memory consuming).
 */
var FreesoundQuery = function () {
  function FreesoundQuery(apiKey) {
    var storeSoundsInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    (0, _classCallCheck3.default)(this, FreesoundQuery);

    this.apiKey = apiKey;
    this.storeSoundsInfo = storeSoundsInfo;

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

      if (!this.storeSoundsInfo) {
        this._soundsInfo.clear();
      }

      this._currentSoundsInfo.clear();
      var promises = [];

      ids.forEach(function (id) {
        var info = _this3._soundsInfo.get(id);

        if (!info.previews) // detailed information was not previously stored
          promises.push(_this3._getDetailedInfoFromId(id));else _this3._currentSoundsInfo.set(id, info);
      });

      return _promise2.default.all(promises);
    }

    /** @private */

  }, {
    key: '_getDetailedInfoFromId',
    value: function _getDetailedInfoFromId(id) {
      var _this4 = this;

      return new _promise2.default(function (resolve, reject) {
        var query = 'http://www.freesound.org/apiv2/sounds/' + id + '/?';
        var suffix = '&token=' + _this4.apiKey;
        query += suffix;

        (0, _util.universalXMLHttpRequest)(query).then(function (response) {
          _this4._soundsInfo.set(id, response);
          _this4._currentSoundsInfo.set(id, response);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkZyZWVzb3VuZFF1ZXJ5IiwiYXBpS2V5Iiwic3RvcmVTb3VuZHNJbmZvIiwiX3NvdW5kc0luZm8iLCJfY3VycmVudFNvdW5kc0luZm8iLCJfZ2V0RGV0YWlsZWRJbmZvRnJvbUlkcyIsImJpbmQiLCJxdWVyeVBhcmFtcyIsIl9nZXRTb3VuZExpc3RGcm9tUGFyYW1ldGVycyIsInRoZW4iLCJrZXlzIiwiaWRzIiwicGFyYW1zIiwiY2xlYXIiLCJyZXNvbHZlIiwicmVqZWN0IiwicXVlcnkiLCJzdWZmaXgiLCJsZW5ndGgiLCJzZWFyY2giLCJBcnJheSIsImlzQXJyYXkiLCJpIiwiZHVyYXRpb24iLCJpc05hTiIsInBhcnNlRmxvYXQiLCJpc0Zpbml0ZSIsIm1pbkR1cmF0aW9uIiwibWF4RHVyYXRpb24iLCJvcHRpb25zIiwidXNlcnMiLCJwYWNrcyIsImwiLCJ0cmltIiwicmVzIiwicmVzcG9uc2UiLCJyZXN1bHRzIiwiciIsInNldCIsImhhcyIsInByb21pc2VzIiwiZm9yRWFjaCIsImluZm8iLCJnZXQiLCJpZCIsInByZXZpZXdzIiwicHVzaCIsIl9nZXREZXRhaWxlZEluZm9Gcm9tSWQiLCJhbGwiLCJtYXAiLCJ2YWx1ZSIsImtleSIsIm9iaiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTs7Ozs7Ozs7SUFRTUEsYztBQUNKLDBCQUFZQyxNQUFaLEVBQTZDO0FBQUEsUUFBekJDLGVBQXlCLHVFQUFQLEtBQU87QUFBQTs7QUFDM0MsU0FBS0QsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsZUFBTCxHQUF1QkEsZUFBdkI7O0FBRUEsU0FBS0MsV0FBTCxHQUFtQixtQkFBbkI7QUFDQSxTQUFLQyxrQkFBTCxHQUEwQixtQkFBMUI7O0FBRUEsU0FBS0MsdUJBQUwsR0FBK0IsS0FBS0EsdUJBQUwsQ0FBNkJDLElBQTdCLENBQWtDLElBQWxDLENBQS9CO0FBQ0Q7O0FB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LFdBQUssSUFBSWlCLEdBQVQsSUFBZ0JDLEdBQWhCLEVBQXFCO0FBQ25CbEIsWUFBSUksR0FBSixDQUFRYSxHQUFSLEVBQWFDLElBQUlELEdBQUosQ0FBYjtBQUNEOztBQUVELGFBQU9qQixHQUFQO0FBQ0Q7Ozs7O0FBQ0Y7O2tCQUVjbEMsYyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVuaXZlcnNhbFhNTEh0dHBSZXF1ZXN0IH0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBDbGFzcyBwZXJmb3JtaW5nIGdlbmVyaWMgcXVlcmllcyBmcm9tIHNlYXJjaCB0ZXJtcywgdXNlcm5hbWVzIGFuZCBkdXJhdGlvbiBpbmZvcm1hdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYXBpS2V5IC0gWW91ciBhcGkga2V5LCBhcyBnZW5lcmF0ZWQgZnJvbSB5b3VyIGZyZWVzb3VuZFxuICogZGV2ZWxvcGVyIGFjY291bnQgd2hlbiBjcmVhdGluZyBhIG5ldyBhcHBsaWNhdGlvbi5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3N0b3JlU291bmRzSW5mbz1mYWxzZV0gLSBTdG9yZSBhbGwgc291bmRzIGRldGFpbGVkIGluZm9ybWF0aW9ucyxcbiAqIGluY2x1ZGluZyBwcmV2aWV3IHVybHMsIHRvIG9wdGltaXplIHRoZSBudW1iZXIgb2YgcXVlcmllcyB0byB0aGUgQVBJIChjYW4gYmUgbWVtb3J5IGNvbnN1bWluZykuXG4gKi9cbmNsYXNzIEZyZWVzb3VuZFF1ZXJ5IHtcbiAgY29uc3RydWN0b3IoYXBpS2V5LCBzdG9yZVNvdW5kc0luZm8gPSBmYWxzZSkge1xuICAgIHRoaXMuYXBpS2V5ID0gYXBpS2V5O1xuICAgIHRoaXMuc3RvcmVTb3VuZHNJbmZvID0gc3RvcmVTb3VuZHNJbmZvO1xuXG4gICAgdGhpcy5fc291bmRzSW5mbyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mbyA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMuX2dldERldGFpbGVkSW5mb0Zyb21JZHMgPSB0aGlzLl9nZXREZXRhaWxlZEluZm9Gcm9tSWRzLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5UGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgdXNlZCB0byBidWlsZCB0aGUgcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXkuU3RyaW5nfSBbcXVlcnlQYXJhbXMuc2VhcmNoXSAtIFRoZSBzZWFyY2ggdGVybXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5LlN0cmluZ30gW3F1ZXJ5UGFyYW1zLnVzZXJuYW1lXSAtIEEgbGlzdCBvZiB1c2VybmFtZXMgdG8gc2VhcmNoIGZpbGVzIGZyb20uXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtxdWVyeVBhcmFtcy5kdXJhdGlvbl0gLSBBbiBhcnJheSBvZiBzaXplIDIgOiBbIG1pbkR1cmF0aW9uLCBtYXhEdXJhdGlvbiBdIChpbiBzZWNvbmRzKS5cbiAgICogSWYgbWF4RHVyYXRpb24gaXMgbm90IGEgbnVtYmVyLCBpdCB3aWxsIGJlIGludGVycHJldGVkIGFzIFwiKlwiIChubyBtYXhpbXVtIGR1cmF0aW9uKS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IC0gQSBQcm9taXNlIG9iamVjdCB0aGF0IHdpbGwgcmVzb2x2ZSB3aXRoIGFuIGFycmF5IG9mIHRoZSBzb3VuZCBpZHMgZnJvbSB0aGUgYXBpJ3MgcmVzcG9uc2UgdG8gdGhlIHF1ZXJ5LlxuICAgKlxuICAgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgYSBwcm9ibGVtIG9jY3VycyBkdXJpbmcgcXVlcnkuXG4gICAqXG4gICAqIEB0b2RvXG4gICAqIC0gYWRkIGFuIG9wdGlvbiB0byBjaGFuZ2UgXCJwYWdlX3NpemVcIiBkZWZhdWx0IHZhbHVlICgxNSlcbiAgICogLSBhZGQgYW4gb3B0aW9uIHRvIGNoYW5nZSBcInNvcnRcIiBkZWZhdWx0IHZhbHVlIChcInNjb3JlXCIpXG4gICAqIC0gYWRkIGFuIG9wdGlvbiB0byBmaWx0ZXIgdXNpbmcgZ2VvdGFnZ2luZ1xuICAgKi9cbiAgcXVlcnkocXVlcnlQYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0U291bmRMaXN0RnJvbVBhcmFtZXRlcnMocXVlcnlQYXJhbXMpXG4gICAgICAudGhlbih1cGRhdGVkSWRzID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldERldGFpbGVkSW5mb0Zyb21JZHMoQXJyYXkuZnJvbSh0aGlzLl9jdXJyZW50U291bmRzSW5mby5rZXlzKCkpKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXkuTnVtYmVyfSBpZHMgLSBUaGUgc291bmQgaWRzIHdlIHdhbnQgdG8gZ2V0IHRoZSBkZXRhaWxlZCBpbmZvIG9mLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIHdpdGggYW4gYXJyYXkgb2YgdGhlIHNvdW5kIGlkc1xuICAgKiB0aGUgZGV0YWlsZWQgaW5mbyBvZiB3aGljaCBuZWVkZWQgdG8gYmUgcXVlcmllZC5cbiAgICpcbiAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIGEgcHJvYmxlbSBvY2N1cnMgZHVyaW5nIHF1ZXJ5LlxuICAgKi9cbiAgcXVlcnlGcm9tSWRzKGlkcykge1xuICAgIHJldHVybiB0aGlzLl9nZXREZXRhaWxlZEluZm9Gcm9tSWRzKGlkcyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHRvZG8gYWxsb3cgdG8gY2hvb3NlIGJldHdlZW4gT1IgYW5kIEFORCB0byBjb21iaW5lIHVzZXJuYW1lcyBpbiB0aGUgcXVlcnkuXG4gICAqL1xuICBfZ2V0U291bmRMaXN0RnJvbVBhcmFtZXRlcnMocGFyYW1zLCBjbGVhciA9IHRydWUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKGNsZWFyKSB0aGlzLl9jdXJyZW50U291bmRzSW5mby5jbGVhcigpO1xuXG4gICAgICBsZXQgcXVlcnkgPSAnaHR0cDovL2ZyZWVzb3VuZC5vcmcvYXBpdjIvc2VhcmNoL3RleHQvPyc7XG4gICAgICBjb25zdCBzdWZmaXggPSBgJnRva2VuPSR7dGhpcy5hcGlLZXl9YDtcblxuICAgICAgaWYgKE9iamVjdC5rZXlzKHBhcmFtcykubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIGlmIChwYXJhbXMuc2VhcmNoICYmIEFycmF5LmlzQXJyYXkocGFyYW1zLnNlYXJjaCkgJiYgcGFyYW1zLnNlYXJjaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcXVlcnkgKz0gYHF1ZXJ5PVxcXCIke3BhcmFtcy5zZWFyY2hbMF19XFxcImA7XG5cbiAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBhcmFtcy5zZWFyY2gubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICBpZiAocGFyYW1zLnNlYXJjaFtpXSAhPT0gJycpXG4gICAgICAgICAgICAgIHF1ZXJ5ICs9IGAgXFxcIiR7cGFyYW1zLnNlYXJjaFtpXX1cXFwiYDtcblxuICAgICAgICAgIHF1ZXJ5ICs9ICcmJztcbiAgICAgICAgfVxuXG4gICAgICAgIHF1ZXJ5ICs9ICdmaWx0ZXI9JztcblxuICAgICAgICBpZiAocGFyYW1zLmR1cmF0aW9uICYmIEFycmF5LmlzQXJyYXkocGFyYW1zLmR1cmF0aW9uKSAmJiBwYXJhbXMuZHVyYXRpb24ubGVuZ3RoID09PSAyICYmXG4gICAgICAgICAgICAhaXNOYU4ocGFyc2VGbG9hdChwYXJhbXMuZHVyYXRpb25bMF0pKSAmJiBpc0Zpbml0ZShwYXJhbXMuZHVyYXRpb25bMF0pKSB7XG4gICAgICAgICAgY29uc3QgbWluRHVyYXRpb24gPSBwYXJhbXMuZHVyYXRpb25bMF0gPCAwID8gMCA6IHBhcmFtcy5kdXJhdGlvblswXTtcbiAgICAgICAgICBxdWVyeSArPSBgZHVyYXRpb246WyR7bWluRHVyYXRpb259IFRPIGA7XG5cbiAgICAgICAgICBpZiAoIWlzTmFOKHBhcnNlRmxvYXQocGFyYW1zLmR1cmF0aW9uWzFdKSkgJiYgaXNGaW5pdGUocGFyYW1zLmR1cmF0aW9uWzFdKSkge1xuICAgICAgICAgICAgY29uc3QgbWF4RHVyYXRpb24gPSBwYXJhbXMuZHVyYXRpb25bMV0gPiBtaW5EdXJhdGlvbiA/IHBhcmFtcy5kdXJhdGlvblsxXSA6IG1pbkR1cmF0aW9uO1xuICAgICAgICAgICAgcXVlcnkgKz0gYCR7bWF4RHVyYXRpb259XSBgO1xuICAgICAgICAgIH0gZWxzZSB7IC8vID09PSAnKidcbiAgICAgICAgICAgIHF1ZXJ5ICs9ICcqXSc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAvLyBzZWFyY2g6ICAgWyAncXVlcnknLCAgICAnT1InIF0sXG4gICAgICAgICAgdXNlcnM6ICAgIFsgJ3VzZXJuYW1lJywgJ09SJyBdLFxuICAgICAgICAgIHBhY2tzOiAgICBbICdwYWNrJywgICAgICdPUicgXSxcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGxldCBsIGluIG9wdGlvbnMpXG4gICAgICAgICAgaWYgKHBhcmFtc1tsXSAmJiBBcnJheS5pc0FycmF5KHBhcmFtc1tsXSkgJiYgcGFyYW1zW2xdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHF1ZXJ5ICs9IGAke29wdGlvbnNbbF1bMF19Oigke3BhcmFtc1tsXVswXX1gO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBhcmFtc1tsXS5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgaWYgKHBhcmFtc1tsXVtpXSAhPT0gJycpXG4gICAgICAgICAgICAgICAgcXVlcnkgKz0gYCAke29wdGlvbnNbbF1bMV19ICR7cGFyYW1zW2xdW2ldfWA7XG5cbiAgICAgICAgICAgIHF1ZXJ5ICs9ICcpICc7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBxdWVyeSA9IHF1ZXJ5LnRyaW0oKTtcbiAgICAgIHF1ZXJ5ICs9IHN1ZmZpeDtcblxuICAgICAgdW5pdmVyc2FsWE1MSHR0cFJlcXVlc3QocXVlcnkpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IHJlc3BvbnNlLnJlc3VsdHM7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHIgaW4gcmVzKSB7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc1tyXSk7XG4gICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLnNldChyZXNbcl1bJ2lkJ10sIHJlc1tyXSk7XG5cbiAgICAgICAgICAgICAgaWYgKCF0aGlzLl9zb3VuZHNJbmZvLmhhcyhyZXNbcl1bJ2lkJ10pKVxuICAgICAgICAgICAgICAgIHRoaXMuX3NvdW5kc0luZm8uc2V0KHJlc1tyXVsnaWQnXSwgcmVzW3JdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9nZXREZXRhaWxlZEluZm9Gcm9tSWRzKGlkcykge1xuICAgIGlmICghdGhpcy5zdG9yZVNvdW5kc0luZm8pIHtcbiAgICAgIHRoaXMuX3NvdW5kc0luZm8uY2xlYXIoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jdXJyZW50U291bmRzSW5mby5jbGVhcigpO1xuICAgIGNvbnN0IHByb21pc2VzID0gW107XG5cbiAgICBpZHMuZm9yRWFjaChpZCA9PiB7XG4gICAgICBjb25zdCBpbmZvID0gdGhpcy5fc291bmRzSW5mby5nZXQoaWQpO1xuXG4gICAgICBpZiAoIWluZm8ucHJldmlld3MpIC8vIGRldGFpbGVkIGluZm9ybWF0aW9uIHdhcyBub3QgcHJldmlvdXNseSBzdG9yZWRcbiAgICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLl9nZXREZXRhaWxlZEluZm9Gcm9tSWQoaWQpKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5fY3VycmVudFNvdW5kc0luZm8uc2V0KGlkLCBpbmZvKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2dldERldGFpbGVkSW5mb0Zyb21JZChpZCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgcXVlcnkgPSBgaHR0cDovL3d3dy5mcmVlc291bmQub3JnL2FwaXYyL3NvdW5kcy8ke2lkfS8/YDtcbiAgICAgIGNvbnN0IHN1ZmZpeCA9IGAmdG9rZW49JHt0aGlzLmFwaUtleX1gO1xuICAgICAgcXVlcnkgKz0gc3VmZml4O1xuXG4gICAgICB1bml2ZXJzYWxYTUxIdHRwUmVxdWVzdChxdWVyeSlcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc291bmRzSW5mby5zZXQoaWQsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTb3VuZHNJbmZvLnNldChpZCwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgcmVzb2x2ZShpZCk7XG4gICAgICAgIH0pXG4gICAgICAgIC8vLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhY2spKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBVc2VkIGJ5IGJvdGggY2hpbGQgY2xhc3Nlc1xuICAgKi9cbiAgX21hcFRvT2JqZWN0KG1hcCkge1xuICAgIGNvbnN0IHJlcyA9IHt9O1xuXG4gICAgbWFwLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIHJlc1trZXldID0gdmFsdWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgX29iamVjdFRvTWFwKG9iaikge1xuICAgIGNvbnN0IHJlcyA9IG5ldyBNYXAoKTtcblxuICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcbiAgICAgIHJlcy5zZXQoa2V5LCBvYmpba2V5XSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgRnJlZXNvdW5kUXVlcnk7XG5cbiJdfQ==