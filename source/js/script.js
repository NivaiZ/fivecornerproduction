// Открытие и закрытие бургерного меню
const navMain = document.querySelector('.main-nav');
const navToggle = document.querySelector('.main-nav__toggle');

navToggle.addEventListener('click', function () {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
  }
});

// Маска для телефона
$(".order-form__script").mask("+7 (999) 999-99-99");

// Получение объекта в FormData
const {
  orderForm
} = document.forms;

function retrieveFormValue(event) {
  event.preventDefault();

  const formData = new FormData(orderForm);
  const values = Object.fromEntries(formData.entries());
  alert('Данные отправлены');
  console.log('Данные корзины', values);
}

orderForm.addEventListener('submit', retrieveFormValue);

// Событие blur
const form = document.getElementById("suggest");
form.addEventListener("focus", function (event) {
  event.target.style.background = "pink";
}, true);
form.addEventListener("blur", function (event) {
  event.target.style.background = "";
}, true);
/*
// Получение автоподсказок с помощью сервиса DaData
$("#address").suggestions({
  token: "de5fe5416f2af782d7e040547c09e701cd77f35b",/ Вызывается, когда пользователь выбирает одну из подсказок /
  type: "ADDRESS",

  onSelect: function (suggestion) {
    console.log(suggestion);
  }
});
*/

//Выделение input с типом текст
$("input[type=text]").click(function () {
  $(this).select();
});

//Выделение textarea с типом текст
$("textarea[type=text]").click(function () {
  $(this).select();
});

//Выделение textarea с типом текст
$("input[type=email]").click(function () {
  $(this).select();
});

//Инициализация яндекс.карты
window.onload = function() {
  if ($('#mapAddress').length > 0) {

      ymaps.ready(init);

      // end if length
  }

  function init() {
      var myPlacemark;

      var myMap = new ymaps.Map('mapAddress', {
          center: [60.033081, 30.428086],
          zoom: 16,
          controls: ['zoomControl', 'geolocationControl', 'fullscreenControl']
      });
      myMap.behaviors.disable('scrollZoom');

      myMap.events.add('click', function(e) {
          var coords = e.get('coords');
          if (myPlacemark) {
              myPlacemark.geometry.setCoordinates(coords);
          } else {
              myPlacemark = createPlacemark(coords);
              myMap.geoObjects.add(myPlacemark);
              myPlacemark.events.add('dragend', function() {
                  getAddress(myPlacemark.geometry.getCoordinates());
              });
          }
          getAddress(coords);
      });
      //Отображение метки(балуна на карте)
  myGeoObject = new ymaps.GeoObject({
      // Описание геометрии.
      geometry: {
        type: "Point",
        coordinates: [60.033081, 30.428086]
      },
      // Свойства.
      properties: {
        // Контент метки.
        iconCaption: 'Проспект Просвещения, 99',

      }
    }, {
      // Опции.
      // Иконка метки будет растягиваться под размер ее содержимого.
      preset: 'islands#greenDotIconWithCaption',
      // Метку можно перемещать.
    }),
    myPieChart = new ymaps.Placemark([
      60.033081, 30.428086
    ]);

  myMap.geoObjects
    .add(myGeoObject)

      function createPlacemark(coords) {
          return new ymaps.Placemark(coords, {
              iconCaption: 'Уже ищу...'
          }, {
              preset: 'islands#violetDotIconWithCaption',
              draggable: true
          });
      }

      function getAddress(coords) {
          myPlacemark.properties.set('iconCaption', 'Уже ищу...');
          ymaps.geocode(coords).then(function(res) {
              var firstGeoObject = res.geoObjects.get(0);
              $(document).find('#address').val(firstGeoObject.getAddressLine());
              myPlacemark.properties.set({
                  iconCaption: [
                      firstGeoObject.getAdministrativeAreas(),
                      firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                  ].filter(Boolean).join(', '),
                  balloonContent: firstGeoObject.getAddressLine()
              });
          });
      }

      const getPlaceBySuggestView = (siggestViewGuessValue) => {
          ymaps.geocode(siggestViewGuessValue).then(res => {
               const firstGeoObject = res.geoObjects.get(0);
              const coords = firstGeoObject.geometry.getCoordinates();

              // Область видимости геообъекта.
              const bounds = firstGeoObject.properties.get('boundedBy');

              // Масштабируем карту на область видимости геообъекта.
              myMap.setBounds(bounds, {
                  checkZoomRange: true
              });

              myPlacemark = createPlacemark(coords);
              myMap.geoObjects.add(myPlacemark);
              getAddress(myPlacemark.geometry.getCoordinates());

          }, error => {
            // Обработка ошибки
            console.log(error)
          });
      }


      const suggestView = new ymaps.SuggestView('suggest');

      suggestView.events.add('select', (e) => {
        const chosenAddress = e.get('item').value;
        getPlaceBySuggestView(chosenAddress);
      });

      //end init
  }

  //end win on load
}
