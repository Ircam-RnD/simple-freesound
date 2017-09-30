'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.universalXMLHttpRequest = exports.isNode = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _xmlhttprequest = require('xmlhttprequest');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isNode = new Function("try {return this===global;}catch(e){return false;}");

var universalXMLHttpRequest = function universalXMLHttpRequest(query) {
  var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'get';
  var postData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  return new _promise2.default(function (resolve, reject) {
    var xhr = isNode() ? new _xmlhttprequest.XMLHttpRequest() : new XMLHttpRequest();

    xhr.open(method, query, true);
    xhr.responseType = 'json';

    if (isNode()) {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            throw new Error(xhr.status + ' : ' + xhr.responseText);
          }
        }
      };
    } else {
      xhr.onload = function () {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          throw new Error(errorMsg + ('response : ' + xhr.status + ' - ' + xhr.response));
        }
      };

      xhr.onerror = function () {
        throw new Error(errorMsg + ('response : ' + xhr.status + ' - ' + xhr.response));
      };
    }

    xhr.send(postData);
  });
};

exports.isNode = isNode;
exports.universalXMLHttpRequest = universalXMLHttpRequest;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImlzTm9kZSIsIkZ1bmN0aW9uIiwidW5pdmVyc2FsWE1MSHR0cFJlcXVlc3QiLCJxdWVyeSIsIm1ldGhvZCIsInBvc3REYXRhIiwicmVzb2x2ZSIsInJlamVjdCIsInhociIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInJlc3BvbnNlVHlwZSIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJzdGF0dXMiLCJKU09OIiwicGFyc2UiLCJyZXNwb25zZVRleHQiLCJFcnJvciIsIm9ubG9hZCIsInJlc3BvbnNlIiwiZXJyb3JNc2ciLCJvbmVycm9yIiwic2VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBLElBQU1BLFNBQVMsSUFBSUMsUUFBSixDQUFhLG9EQUFiLENBQWY7O0FBRUEsSUFBTUMsMEJBQTBCLFNBQTFCQSx1QkFBMEIsQ0FBQ0MsS0FBRCxFQUE0QztBQUFBLE1BQXBDQyxNQUFvQyx1RUFBM0IsS0FBMkI7QUFBQSxNQUFwQkMsUUFBb0IsdUVBQVQsSUFBUzs7QUFDMUUsU0FBTyxzQkFBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsUUFBTUMsTUFBTVIsV0FBVyxvQ0FBWCxHQUF1QixJQUFJUyxjQUFKLEVBQW5DOztBQUVBRCxRQUFJRSxJQUFKLENBQVNOLE1BQVQsRUFBaUJELEtBQWpCLEVBQXdCLElBQXhCO0FBQ0FLLFFBQUlHLFlBQUosR0FBbUIsTUFBbkI7O0FBRUEsUUFBSVgsUUFBSixFQUFjO0FBQ1pRLFVBQUlJLGtCQUFKLEdBQXlCLFlBQU07QUFDN0IsWUFBSUosSUFBSUssVUFBSixLQUFtQixDQUF2QixFQUEwQjtBQUN4QixjQUFJTCxJQUFJTSxNQUFKLEtBQWUsR0FBbkIsRUFBd0I7QUFDdEJSLG9CQUFRUyxLQUFLQyxLQUFMLENBQVdSLElBQUlTLFlBQWYsQ0FBUjtBQUNELFdBRkQsTUFFTztBQUNMLGtCQUFNLElBQUlDLEtBQUosQ0FBYVYsSUFBSU0sTUFBakIsV0FBNkJOLElBQUlTLFlBQWpDLENBQU47QUFDRDtBQUNGO0FBQ0YsT0FSRDtBQVNELEtBVkQsTUFVTztBQUNMVCxVQUFJVyxNQUFKLEdBQWEsWUFBTTtBQUNqQixZQUFJWCxJQUFJTSxNQUFKLEtBQWUsR0FBbkIsRUFBd0I7QUFDdEJSLGtCQUFRRSxJQUFJWSxRQUFaO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZ0JBQU0sSUFBSUYsS0FBSixDQUFVRyw0QkFBeUJiLElBQUlNLE1BQTdCLFdBQXlDTixJQUFJWSxRQUE3QyxDQUFWLENBQU47QUFDRDtBQUNGLE9BTkQ7O0FBUUFaLFVBQUljLE9BQUosR0FBYyxZQUFNO0FBQ2xCLGNBQU0sSUFBSUosS0FBSixDQUFVRyw0QkFBeUJiLElBQUlNLE1BQTdCLFdBQXlDTixJQUFJWSxRQUE3QyxDQUFWLENBQU47QUFDRCxPQUZEO0FBR0Q7O0FBRURaLFFBQUllLElBQUosQ0FBU2xCLFFBQVQ7QUFDRCxHQS9CTSxDQUFQO0FBZ0NELENBakNEOztRQW1DU0wsTSxHQUFBQSxNO1FBQVFFLHVCLEdBQUFBLHVCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgWE1MSHR0cFJlcXVlc3QgYXMgWEhSIH0gZnJvbSAneG1saHR0cHJlcXVlc3QnO1xuXG5jb25zdCBpc05vZGUgPSBuZXcgRnVuY3Rpb24oXCJ0cnkge3JldHVybiB0aGlzPT09Z2xvYmFsO31jYXRjaChlKXtyZXR1cm4gZmFsc2U7fVwiKTtcblxuY29uc3QgdW5pdmVyc2FsWE1MSHR0cFJlcXVlc3QgPSAocXVlcnksIG1ldGhvZCA9ICdnZXQnLCBwb3N0RGF0YSA9IG51bGwpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCB4aHIgPSBpc05vZGUoKSA/IG5ldyBYSFIoKSA6IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgeGhyLm9wZW4obWV0aG9kLCBxdWVyeSwgdHJ1ZSk7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcblxuICAgIGlmIChpc05vZGUoKSkge1xuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3hoci5zdGF0dXN9IDogJHt4aHIucmVzcG9uc2VUZXh0fWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgcmVzb2x2ZSh4aHIucmVzcG9uc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1zZyArIGByZXNwb25zZSA6ICR7eGhyLnN0YXR1c30gLSAke3hoci5yZXNwb25zZX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB4aHIub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTXNnICsgYHJlc3BvbnNlIDogJHt4aHIuc3RhdHVzfSAtICR7eGhyLnJlc3BvbnNlfWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHhoci5zZW5kKHBvc3REYXRhKTtcbiAgfSk7XG59O1xuXG5leHBvcnQgeyBpc05vZGUsIHVuaXZlcnNhbFhNTEh0dHBSZXF1ZXN0IH07Il19