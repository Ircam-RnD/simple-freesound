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
          throw new Error('response : ' + xhr.status + ' - ' + xhr.response);
        }
      };

      xhr.onerror = function () {
        throw new Error('response : ' + xhr.status + ' - ' + xhr.response);
      };
    }

    xhr.send(postData);
  });
};

exports.isNode = isNode;
exports.universalXMLHttpRequest = universalXMLHttpRequest;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImlzTm9kZSIsIkZ1bmN0aW9uIiwidW5pdmVyc2FsWE1MSHR0cFJlcXVlc3QiLCJxdWVyeSIsIm1ldGhvZCIsInBvc3REYXRhIiwicmVzb2x2ZSIsInJlamVjdCIsInhociIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInJlc3BvbnNlVHlwZSIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJzdGF0dXMiLCJKU09OIiwicGFyc2UiLCJyZXNwb25zZVRleHQiLCJFcnJvciIsIm9ubG9hZCIsInJlc3BvbnNlIiwib25lcnJvciIsInNlbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQSxJQUFNQSxTQUFTLElBQUlDLFFBQUosQ0FBYSxvREFBYixDQUFmOztBQUVBLElBQU1DLDBCQUEwQixTQUExQkEsdUJBQTBCLENBQUNDLEtBQUQsRUFBNEM7QUFBQSxNQUFwQ0MsTUFBb0MsdUVBQTNCLEtBQTJCO0FBQUEsTUFBcEJDLFFBQW9CLHVFQUFULElBQVM7O0FBQzFFLFNBQU8sc0JBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLFFBQU1DLE1BQU1SLFdBQVcsb0NBQVgsR0FBdUIsSUFBSVMsY0FBSixFQUFuQzs7QUFFQUQsUUFBSUUsSUFBSixDQUFTTixNQUFULEVBQWlCRCxLQUFqQixFQUF3QixJQUF4QjtBQUNBSyxRQUFJRyxZQUFKLEdBQW1CLE1BQW5COztBQUVBLFFBQUlYLFFBQUosRUFBYztBQUNaUSxVQUFJSSxrQkFBSixHQUF5QixZQUFNO0FBQzdCLFlBQUlKLElBQUlLLFVBQUosS0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsY0FBSUwsSUFBSU0sTUFBSixLQUFlLEdBQW5CLEVBQXdCO0FBQ3RCUixvQkFBUVMsS0FBS0MsS0FBTCxDQUFXUixJQUFJUyxZQUFmLENBQVI7QUFDRCxXQUZELE1BRU87QUFDTCxrQkFBTSxJQUFJQyxLQUFKLENBQWFWLElBQUlNLE1BQWpCLFdBQTZCTixJQUFJUyxZQUFqQyxDQUFOO0FBQ0Q7QUFDRjtBQUNGLE9BUkQ7QUFTRCxLQVZELE1BVU87QUFDTFQsVUFBSVcsTUFBSixHQUFhLFlBQU07QUFDakIsWUFBSVgsSUFBSU0sTUFBSixLQUFlLEdBQW5CLEVBQXdCO0FBQ3RCUixrQkFBUUUsSUFBSVksUUFBWjtBQUNELFNBRkQsTUFFTztBQUNMLGdCQUFNLElBQUlGLEtBQUosaUJBQXdCVixJQUFJTSxNQUE1QixXQUF3Q04sSUFBSVksUUFBNUMsQ0FBTjtBQUNEO0FBQ0YsT0FORDs7QUFRQVosVUFBSWEsT0FBSixHQUFjLFlBQU07QUFDbEIsY0FBTSxJQUFJSCxLQUFKLGlCQUF3QlYsSUFBSU0sTUFBNUIsV0FBd0NOLElBQUlZLFFBQTVDLENBQU47QUFDRCxPQUZEO0FBR0Q7O0FBRURaLFFBQUljLElBQUosQ0FBU2pCLFFBQVQ7QUFDRCxHQS9CTSxDQUFQO0FBZ0NELENBakNEOztRQW1DU0wsTSxHQUFBQSxNO1FBQVFFLHVCLEdBQUFBLHVCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgWE1MSHR0cFJlcXVlc3QgYXMgWEhSIH0gZnJvbSAneG1saHR0cHJlcXVlc3QnO1xuXG5jb25zdCBpc05vZGUgPSBuZXcgRnVuY3Rpb24oXCJ0cnkge3JldHVybiB0aGlzPT09Z2xvYmFsO31jYXRjaChlKXtyZXR1cm4gZmFsc2U7fVwiKTtcblxuY29uc3QgdW5pdmVyc2FsWE1MSHR0cFJlcXVlc3QgPSAocXVlcnksIG1ldGhvZCA9ICdnZXQnLCBwb3N0RGF0YSA9IG51bGwpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCB4aHIgPSBpc05vZGUoKSA/IG5ldyBYSFIoKSA6IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgeGhyLm9wZW4obWV0aG9kLCBxdWVyeSwgdHJ1ZSk7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcblxuICAgIGlmIChpc05vZGUoKSkge1xuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3hoci5zdGF0dXN9IDogJHt4aHIucmVzcG9uc2VUZXh0fWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgcmVzb2x2ZSh4aHIucmVzcG9uc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgcmVzcG9uc2UgOiAke3hoci5zdGF0dXN9IC0gJHt4aHIucmVzcG9uc2V9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgeGhyLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgcmVzcG9uc2UgOiAke3hoci5zdGF0dXN9IC0gJHt4aHIucmVzcG9uc2V9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgeGhyLnNlbmQocG9zdERhdGEpO1xuICB9KTtcbn07XG5cbmV4cG9ydCB7IGlzTm9kZSwgdW5pdmVyc2FsWE1MSHR0cFJlcXVlc3QgfTsiXX0=