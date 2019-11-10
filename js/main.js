'use strict';

var TITLES = ['Сдам квартиру семейной паре, только русским', 'Квартира на окраине, зато дешево', 'Многокомнатная квартира, в центре', 'В квартире свежий ремонт', 'Светлая квартира, в черте города'];
var PRICE_MIN = 10000;
var PRICE_MAX = 40000;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var CHEK_IN_OUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = ['Уютная квартира почти что в центре', 'Тихая квартирка, тихие соседи', 'Квартира находится в пяти минутах от метро', 'В квартире нет тараканов'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var COORDINATE_START = 130;
var COORDINATE_END = 630;

var markerTemplate = document.querySelector('#pin').content;
var markerMapContainer = document.querySelector('.map__pins');

var widthMap = markerMapContainer.clientWidth - PIN_WIDTH;

// функция удаления доп. класса для показа блока
var removeClass = function (selector, classElement) {
  var element = document.querySelector(selector);
  return element.classList.remove(classElement);
};

removeClass('.map', 'map--faded');

// Функция вовращает рандомное число между минимальным(включительно) и максимальным(включительно)
var getRandomNumber = function (min, max) {
  return Math.round((Math.random() * (max - min)) + min);
};

//  Обращается к случайному элементу в массиве, генерируя случайное число с плавающей точкой от нуля до длины массива и округляя его до ближайшего целого числа
var getRandomElement = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

// Алгоритм тасования Фишера-Йетса
var shuffle = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

// генерим объект с данными
var getOffer = function () {

  var offers = [];
  var offerAmount = 8;

  for (var i = 0; i < offerAmount; i++) {

    var coordinateX = getRandomNumber(0, widthMap);
    var coordinateY = getRandomNumber(COORDINATE_START, COORDINATE_END);

    offers[i] =
      {
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },
        offer: {
          title: getRandomElement(TITLES),
          address: coordinateX + ', ' + coordinateY,
          price: getRandomNumber(PRICE_MIN, PRICE_MAX),
          type: getRandomElement(TYPES),
          rooms: getRandomNumber(ROOMS_MIN, ROOMS_MAX),
          guests: getRandomNumber(0, 4),
          checkin: getRandomElement(CHEK_IN_OUT),
          checkout: getRandomElement(CHEK_IN_OUT),
          features: shuffle(FEATURES),
          description: getRandomElement(DESCRIPTION),
          photos: shuffle(PHOTOS)
        },
        location: {
          x: coordinateX,
          y: coordinateY
        }
      };
  }
  return offers;
};

// рисуем шаблон с данными на странице
var renderPin = function (element) {
  var pinElement = markerTemplate.cloneNode(true);

  pinElement.querySelector('.map__pin').style.left = (element.location.x - PIN_WIDTH / 2) + 'px';
  pinElement.querySelector('.map__pin').style.top = (element.location.y - PIN_HEIGHT) + 'px';
  pinElement.querySelector('.map__pin').firstChild.src = element.author.avatar;
  pinElement.querySelector('.map__pin').firstChild.alt = element.offer.title;

  return pinElement;
};

var fragment = document.createDocumentFragment();

for (var i = 0; i < getOffer().length; i++) {
  fragment.appendChild(renderPin(getOffer()[i]));
}

markerMapContainer.appendChild(fragment);
