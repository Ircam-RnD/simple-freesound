import { XMLHttpRequest as XHR } from 'xmlhttprequest';

const isNode = new Function("try {return this===global;}catch(e){return false;}");

const universalXMLHttpRequest = (query, method = 'get', postData = null) => {
  return new Promise((resolve, reject) => {
    const xhr = isNode() ? new XHR() : new XMLHttpRequest();

    xhr.open(method, query, true);
    xhr.responseType = 'json';

    if (isNode()) {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            throw new Error(`${xhr.status} : ${xhr.responseText}`);
          }
        }
      }
    } else {
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          throw new Error(errorMsg + `response : ${xhr.status} - ${xhr.response}`);
        }
      }

      xhr.onerror = () => {
        throw new Error(errorMsg + `response : ${xhr.status} - ${xhr.response}`);
      }
    }

    xhr.send(postData);
  });
};

export { isNode, universalXMLHttpRequest };