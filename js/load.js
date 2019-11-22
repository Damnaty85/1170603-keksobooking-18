'use strict';

(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var TIME_OUT = 10000;
  var SECCES_CODE = 200;

  var dataLoad = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SECCES_CODE) {
        onSuccess(xhr.response);
      }else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = TIME_OUT;

    xhr.open('GET', URL_LOAD);
    xhr.send();
  };

  var onError = function (errorMessage) {
    var fragment = document.createDocumentFragment();
    var error = document.querySelector('#error').content.querySelector('.error');
    var errorElement = error.cloneNode(true);
    var main = document.querySelector('main');

    errorElement.querySelector('.error__message').textContent = errorMessage;
    fragment.appendChild(errorElement);
    main.appendChild(fragment);

    document.querySelector('.error__button').addEventListener('click', function () {
      dataLoad(window.main.onSucces, onError);
      if (window.main.onSucces){
        errorElement.remove();
      }
    });
  };

  window.load = {
    dataLoad: dataLoad,
    onError: onError,
    URL_LOAD: URL_LOAD
  };
})();
