'use strict';

(function () {

  var markers = [];
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var COORDINATE_START = 130;
  var COORDINATE_END = 630;
  var MAX_PIN = 5;

  var markerTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var markerMapContainer = document.querySelector('.map__pins');
  var mapCheckBox = document.querySelectorAll('.map__checkbox ');

  var map = document.querySelector('.map');
  var mapFilterContainer = map.querySelector('.map__filters-container');

  // функция удаления доп. класса для показа блока
  var removeClass = function (selector, classElement) {
    var element = document.querySelector(selector);
    return element.classList.remove(classElement);
  };

  // функция добавлнеия атрибута
  var setAttributeDisabled = function (formFields) {
    for (var i = 0; i < formFields.length; i++) {
      formFields[i].setAttribute('disabled', 'disabled');
    }
  };

  // функция удаления атрибута
  var setAttributeEnabled = function (formFields) {
    for (var i = 0; i < formFields.length; i++) {
      formFields[i].removeAttribute('disabled');
    }
  };

  // рисуем шаблон с данными на странице
  var renderPin = function (element) {
    var pinElement = markerTemplate.cloneNode(true);

    pinElement.style.left = (element.location.x - PIN_WIDTH / 2) + 'px';
    pinElement.style.top = (element.location.y - PIN_HEIGHT) + 'px';
    pinElement.firstChild.src = element.author.avatar;
    pinElement.firstChild.alt = element.offer.title;

    return pinElement;
  };

  var fragment = document.createDocumentFragment();

  var createPinsList = function () {
    var maxPinOnMap = window.arrayLength > MAX_PIN ? MAX_PIN : window.arrayLength;
    for (var i = 0; i < maxPinOnMap; i++) {
      fragment.appendChild(renderPin(markers[i]));
    }

    markerMapContainer.appendChild(fragment);

    pinsCollection = document.querySelectorAll('[type="button"].map__pin');
  };

// module3-task3

// синхронизируем англ. названия и русское типов жилья
var getDescriptionOfType = function (type) {
  var typeOfFlat = '';
  switch (type) {
    case 'palace': typeOfFlat = 'Дворец';
      break;
    case 'flat': typeOfFlat = 'Квартира';
      break;
    case 'house': typeOfFlat = 'Дом';
      break;
    default: typeOfFlat = 'Бунгало';
      break;
  }
  return typeOfFlat;
};

// функция для верного склонения слова
var generateDeclensionWord = function (number, word) {
  var cases = [2, 0, 1, 1, 1, 2];
  return number + word[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};

// функция для записи в шаблон из массивов

var renderDeatailOffer = function (element) {
  var elementCard = cardTemplate.cloneNode(true);

  // проверяем и удаляем детальную объявления перед созданием нового
  if (map.querySelector('.map__card')) {
    map.removeChild(map.querySelector('.map__card'));
  }
  //заполняем карточку
  elementCard.querySelector('.popup__title').textContent = element.offer.title;
  elementCard.querySelector('.popup__text--address').textContent = element.offer.address;
  elementCard.querySelector('.popup__text--price').textContent = element.offer.price +' \u20BD/ночь';
  elementCard.querySelector('.popup__type').textContent = getDescriptionOfType(element.offer.type);
  elementCard.querySelector('.popup__text--capacity').textContent = generateDeclensionWord(element.offer.rooms, [' комната', ' комнаты', ' комнат']) + ' для ' + generateDeclensionWord(element.offer.guests, [' гостя', ' гостей', ' гостей']);
  elementCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + element.offer.checkin + ' , выезд до ' + element.offer.checkout + ' .';

  var popupFeatures = elementCard.querySelector('.popup__features').children;

  for (var i = 0; i < popupFeatures.length; i++) {
    popupFeatures[i].style.display = 'none';
  }
  for (var i = 0; i < element.offer.features.length; i++) {
    for (var j = 0; j < popupFeatures.length; j++) {
      if (popupFeatures[j].classList.contains('popup__feature--' + element.offer.features[i])) {
        popupFeatures[j].style.display = 'inline-block';
      }
    }
  }

  elementCard.querySelector('.popup__description').textContent = element.offer.description;

  for (var i = 0; i < element.offer.photos.length; i++){
    elementCard.querySelector('.popup__photo').src = element.offer.photos[i];
    elementCard.querySelector('.popup__photos').appendChild(elementCard.querySelector('.popup__photo').cloneNode(true));
  }

  elementCard.querySelector('.popup__avatar').src = element.author.avatar;

  return elementCard;
};

var addCardToPage = function (arrElem) {
  markerMapContainer.insertAdjacentElement('afterend', fragment.appendChild(renderDeatailOffer(arrElem)));
};

// module4-task2

var addForm = document.querySelector('.ad-form');
var addFormElement = addForm.querySelectorAll('.ad-form__element');
var addFormHeader = addForm.querySelector('.ad-form-header');
var mapFilter = document.querySelectorAll('.map__filter');
var mapPinMain = map.querySelector('.map__pin--main');

var MAP_PIN_FIRST_LEFT_COORDINATE = mapPinMain.style.left;
var MAP_PIN_FIRST_TOP_COORDINATE = mapPinMain.style.top;

var MAP_PIN_WIDTH = 65;
var MAP_PIN_HEIGHT = 65;
var MAP_PIN_SHARP_HEIGHT = 22;

var mapPinCoordinateX = parseInt(mapPinMain.style.left, 10) + Math.floor(MAP_PIN_WIDTH / 2);
var mapPinCoordinateY = parseInt(mapPinMain.style.top, 10) + Math.floor(MAP_PIN_HEIGHT / 2);

var noticeAddress = addForm.querySelector('#address');
noticeAddress.setAttribute('readonly', 'readonly');
noticeAddress.setAttribute('disabled', 'disabled');
noticeAddress.value = mapPinCoordinateX + ', ' + mapPinCoordinateY;

setAttributeDisabled(mapFilter);
setAttributeDisabled(addFormElement);

addFormHeader.setAttribute('disabled', 'disabled');

// перемещение пина и смена поля адресса

var getNoticeAddress = function () {
  noticeAddress.value = parseInt(mapPinMain.style.left, 10) + Math.floor(MAP_PIN_WIDTH / 2) + ', ' + (parseInt(mapPinMain.style.top, 10) + MAP_PIN_HEIGHT + MAP_PIN_SHARP_HEIGHT);
  noticeAddress.setAttribute('value', noticeAddress.value);
};

var movePin = function () {
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';

      var mapPinCoordinateLeft = parseInt(mapPinMain.style.left, 10) + MAP_PIN_WIDTH;
      var mapPinCoordinateTop = parseInt(mapPinMain.style.top, 10);
      var mapPinsWidth = markerMapContainer.getBoundingClientRect().width;
      var mapPinsLimitTop = COORDINATE_START - MAP_PIN_HEIGHT - MAP_PIN_SHARP_HEIGHT;
      var mapPinsLimitBottom = COORDINATE_END - MAP_PIN_HEIGHT - MAP_PIN_SHARP_HEIGHT;

      if (mapPinCoordinateLeft > mapPinsWidth) {
        mapPinMain.style.left = (mapPinsWidth - MAP_PIN_WIDTH) + 'px';
      } else if (mapPinCoordinateLeft < MAP_PIN_WIDTH) {
        mapPinMain.style.left = 0 + 'px';
      }

      if (mapPinCoordinateTop < mapPinsLimitTop) {
        mapPinMain.style.top = mapPinsLimitTop + 'px';
      } else if (mapPinCoordinateTop > mapPinsLimitBottom) {
        mapPinMain.style.top = mapPinsLimitBottom + 'px';
      }

      getNoticeAddress();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });
};

movePin();

  var createOfferArray = function (data) {
    markers = data;
    window.arrayLength = data.length;
  };

  var onSucces = function (data) {
    createOfferArray(data);
    createPinsList();
    setEventsOnPins();
  };

// делаем страницу активной
var activatePage = function () {
  window.load.dataLoad(onSucces, window.load.onError);

  removeClass('.map', 'map--faded');
  removeClass('.ad-form','ad-form--disabled');
  setAttributeEnabled(mapFilter);
  setAttributeEnabled(addFormElement);

  addFormHeader.removeAttribute('disabled');
  mapPinCoordinateY += MAP_PIN_SHARP_HEIGHT + Math.floor(MAP_PIN_WIDTH / 2);

  mapPinMain.removeEventListener('click', activatePage);
  map.insertBefore(fragment, mapFilterContainer);

  // по умолчанию выбрана одна комната, делаем ей соответсвие в одного гостя при активации страницы
  guestOption[2].removeAttribute('disabled');
  guestOption[2].setAttribute('selected', 'selected');

  // устанавливаем мин. цену и плейсхолдер по умолчанию === квартира
  formPrice.placeholder = 1000;
  formPrice.min = 1000;
};

// возврат карты к первоначальному состоянию
var setDisabledPage = function () {
    map.classList.add('map--faded');
    addForm.classList.add('ad-form--disabled');
    setAttributeDisabled(mapFilterContainer);
    setAttributeDisabled(mapCheckBox);
    deleteButtonMapPin();
    mapPinMain.style.left = MAP_PIN_FIRST_LEFT_COORDINATE;
    mapPinMain.style.top = MAP_PIN_FIRST_TOP_COORDINATE;
    getNoticeAddress();
};

var deleteButtonMapPin = function () {
  var buttonMapPin = markerMapContainer.querySelectorAll('button[type=button]');
  for (var i = 0; i < buttonMapPin.length; i++) {
    buttonMapPin[i].remove();
  }
};

mapPinMain.addEventListener('click', activatePage);

//module4-task3

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

// резервируем имена переменных
var noticeCard;
var closeButton;
var pinsCollection;


// бработсчик события ENTER
var onCloseButtonEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    onButtonClose();
  }
};

// обработчик события ESC
var onEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onButtonClose();
  }
};

// закрытие
var onCloseButtonClick = function () {
  onButtonClose();
};

// создаем события клика мышью
var setClickEventsOnPins = function (i) {
  pinsCollection[i].addEventListener('click', function () {
    addCardToPage(markers[i]);

    noticeCard = map.querySelector('.map__card');
    closeButton = noticeCard.querySelector('.popup__close');

    document.addEventListener('keydown', onEscPress);
    closeButton.addEventListener('keydown', onCloseButtonEnterPress);
    closeButton.addEventListener('click', onCloseButtonClick);
  });
};

// создаем событие клика ENTER
var setKeydownEventsOnPins = function (i) {
  pinsCollection[i].addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      addCardToPage(markers[i]);

      noticeCard = map.querySelector('.map__card');
      closeButton = noticeCard.querySelector('.popup__close');

      document.addEventListener('keydown', onEscPress);
      closeButton.addEventListener('keydown', onCloseButtonEnterPress);
      closeButton.addEventListener('click', onCloseButtonClick);
    }
  });
};

// закрытие детального объявления
var onButtonClose = function () {
  noticeCard.remove();

  document.removeEventListener('keydown', onEscPress);
  closeButton.removeEventListener('keydown', onCloseButtonEnterPress);
  closeButton.removeEventListener('click', onCloseButtonClick);
};

// объеденеям собития в одну функцию
var setEventsOnPins = function () {
  for (var i = 0; i < pinsCollection.length; i++) {
    setClickEventsOnPins(i);
    setKeydownEventsOnPins(i);
  }
};

// попытка сделать ненавязчиваю валидацию, ограничивая и направляя пользователя в верном направлении валидации

var roomOption = addForm.querySelector('#room_number');
var guestOption = addForm.querySelector('#capacity');

setAttributeDisabled(guestOption);

// соотносим комната === гость
var ROOM_GUEST_RATIO = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0]
};

// функция обавляет disabled, если условие соответсвия false и включает, если true
var disableСapacityOptions = function (inputValue) {
  var capacityOptions = guestOption.querySelectorAll('option');
  capacityOptions.forEach(function (it) {
    it.disabled = true;
  });
  ROOM_GUEST_RATIO[inputValue].forEach(function (it) {
    guestOption.querySelector('option' + '[value="' + it + '"]').disabled = false;
    guestOption.value = it;
  });
};

var onRoomNumberSelectChange = function () {
  disableСapacityOptions(roomOption.value);
};

roomOption.addEventListener('change', onRoomNumberSelectChange);

var formTitle = addForm.querySelector('#title');

// устанавливаем правила для заголовка по ТЗ
formTitle.setAttribute('requared', 'requared');
formTitle.minLength = 30;
formTitle.maxLength = 100;

var formPrice = addForm.querySelector('#price');

// устанавливаем правила для цены по ТЗ
formPrice.setAttribute('requared', 'requared');
formPrice.max = 1000000;

var formDescription = addForm.querySelector('#description');
formDescription.style = 'resize: none;';

var apartmentsType = addForm.querySelector('#type');

//устанавливаем минимальную цену ы зависимости от типа жилья и меняем плейсхолдер
var setMinPriceOfType = function () {
  switch (apartmentsType.value) {
    case 'bungalo': formPrice.placeholder = 0;
      formPrice.min = 0;
      break;
    case 'flat': formPrice.placeholder = 1000;
      formPrice.min = 1000;
      break;
    case 'house': formPrice.placeholder = 5000;
      formPrice.min = 5000;
      break;
    case 'palace': formPrice.placeholder = 10000;
      formPrice.min = 10000;
      break;
  }
};

// событие изминения по типу жилья
apartmentsType.addEventListener('change', function () {
  setMinPriceOfType();
});

var noticeTimeIn = addForm.querySelector('#timein');
var noticeTimeOut = addForm.querySelector('#timeout');

// отключаем время выезда от пользовательского изминения
noticeTimeOut.setAttribute('disabled', 'disabled');

// условие времени заезда и выезда
var setTimeOutOfTimeIn = function () {
  switch (noticeTimeIn.value) {
    case '12:00': noticeTimeOut.value = '12:00';
    break;
    case '13:00': noticeTimeOut.value = '13:00';
    break;
    case '14:00': noticeTimeOut.value = '14:00';
    break;
  }
};

// событие изминения выезда от заезда
noticeTimeIn.addEventListener('change', function () {
  setTimeOutOfTimeIn();
});

  window.main = {
    onSucces: onSucces,
    activatePage: activatePage,
    setDisabledPage: setDisabledPage
  };
})();
