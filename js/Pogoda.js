document.addEventListener("DOMContentLoaded", function () {
  const myCity = localStorage.getItem("myCity") || "moskva";
  const myLat = localStorage.getItem("lat");
  const myLon = localStorage.getItem("lon");

  loadWeatherData(myCity).then((data) => {
    const weatherInfo = displayWeatherInfo(data);
    const latitude = data.coord ? data.coord.lat : 57.6261;
    const longitude = data.coord ? data.coord.lon : 39.8845;
    napered(latitude, longitude);
    localStorage.setItem("lat", latitude);
    localStorage.setItem("lon", longitude);
    loadTimeData(latitude, longitude).then((time) => {
      displayWeatherAndTime(data.name, weatherInfo, time);
    });
  });

  napered(myLat, myLon);

  async function loadWeatherData(city) {
    const weatherApiKey = "25b50792af8662dd9841a19828cab258";
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric&lang=ru`;

    return fetch(weatherApiUrl)
      .then((resp) => resp.json())
      .catch(() => {
        console.log("Ошибка при получении данных о погоде");
      });
  }

  async function loadTimeData(latitude, longitude) {
    const geoApiKey = "80eed714c3a04d618353d1617a286208";
    const geoApiUrl = `https://api.ipgeolocation.io/timezone?apiKey=${geoApiKey}&lat=${latitude}&long=${longitude}`;

    return fetch(geoApiUrl)
      .then((resp) => resp.json())
      .then((data) => {
        const localTime = new Date(data.date_time);
        const options = {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };
        const formattedTime = localTime.toLocaleString("ru-RU", options);
        const formattedTimeString =
          formattedTime.charAt(0).toUpperCase() +
          formattedTime.slice(1).replace(/,/g, "");

        const currentDay =
          formattedTimeString.split(" ")[1] + formattedTimeString.split(" ")[2];

        return formattedTimeString;
      })
      .catch(() => {
        console.log("Ошибка при получении данных о времени");
      });
  }

  let i = null;

  async function napered(lat, lon) {
    const headers = {
      "X-Yandex-Weather-Key": "d3ba034b-099a-497a-a36d-910c9cd706fc",
      "Content-Type": "application/json",
    };

    fetch(
      `https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}&lang=ru_RU&limit=4`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        document.querySelector(".pogodavpered_row").innerHTML = data.forecasts
          .map((day, index) => {
            return ` 
            <div class=${
              i == index ? "pogodavpered_column active" : "pogodavpered_column"
            } >
              <div class=${
                i == index
                  ? "pogodavpered_cerd cerd active"
                  : "pogodavpered_cerd cerd"
              }>
                <div class="cerd_row">
                  <div class="cerd_cerds">
                    <div class="cerd_dennedeli">${
                      index == 0
                        ? "Сегодня"
                        : index == 1
                        ? "Завтра"
                        : day.date.split("-")[1] + "." + day.date.split("-")[2]
                    }</div>
                    <div class="cerd_gradys1">${Math.round(
                      day.parts.day.temp_avg
                    )}°C</div>
                    <div class="cerd_oblachko">
                     <img class="cerd_img" src="https://yastatic.net/weather/i/icons/funky/dark/${
                       day.parts.day.icon
                     }.svg" alt="" />
                    </div>
                    <div class="cerd_text" onclick="${() =>
                      setDay(index, lat, lon)}">
                    ${
                      day.parts.day.condition == "clear"
                        ? "ясно"
                        : day.parts.day.condition == "partly-cloudy"
                        ? "малооблачно"
                        : day.parts.day.condition == "cloudy"
                        ? "облачно с прояснениями"
                        : day.parts.day.condition == "overcast"
                        ? "пасмурно"
                        : day.parts.day.condition == "light-rain"
                        ? "небольшой дождь"
                        : day.parts.day.condition == "rain"
                        ? "дождь"
                        : day.parts.day.condition == "heavy-rain"
                        ? "сильный дождь"
                        : day.parts.day.condition == "showers"
                        ? "ливень"
                        : day.parts.day.condition == "wet-snow"
                        ? "дождь со снегом"
                        : day.parts.day.condition == "light-snow"
                        ? "небольшой снег"
                        : day.parts.day.condition == "snow"
                        ? "снег"
                        : day.parts.day.condition == "snow-showers"
                        ? "снегопад"
                        : day.parts.day.condition == "hail"
                        ? "град"
                        : day.parts.day.condition == "thunderstorm"
                        ? "гроза"
                        : day.parts.day.condition == "thunderstorm-with-rain"
                        ? "дождь с грозой"
                        : day.parts.day.condition == "thunderstorm-with-hail"
                        ? "гроза с градом"
                        : ""
                    }</div>
                  </div>
               </div>
              </div>
           </div>`;
          })
          .join(" ");

        const cerds = document.querySelectorAll(".cerd_cerds");

        cerds.forEach((button, index) => {
          button.addEventListener("click", () => {
            setDay(index, lat, lon);
          });
        });

        document.querySelector(".cardes_images0").src = `
        https://yastatic.net/weather/i/icons/funky/dark/${data.forecasts[0].parts.morning.icon}.svg`;

        document.querySelector(".cardes_chisla0").innerHTML =
          data.forecasts[0].parts.morning.temp_avg;

        document.querySelector(".cardes_ohyhenie0").innerHTML =
          data.forecasts[0].parts.morning.feels_like;

        document.querySelector(".cardes_veroit0").innerHTML =
          data.forecasts[0].parts.morning.pressure_mm;

        document.querySelector(".cardes_humidity0").innerHTML =
          data.forecasts[0].parts.morning.humidity;

        document.querySelector(".cardes_images1").src = `
        https://yastatic.net/weather/i/icons/funky/dark/${data.forecasts[0].parts.day.icon}.svg`;

        document.querySelector(".cardes_chisla1").innerHTML =
          data.forecasts[0].parts.day.temp_avg;

        document.querySelector(".cardes_ohyhenie1").innerHTML =
          data.forecasts[0].parts.day.feels_like;

        document.querySelector(".cardes_veroit1").innerHTML =
          data.forecasts[0].parts.day.pressure_mm;

        document.querySelector(".cardes_humidity1").innerHTML =
          data.forecasts[0].parts.day.humidity;

        document.querySelector(".cardes_images2").src = `
        https://yastatic.net/weather/i/icons/funky/dark/${data.forecasts[0].parts.evening.icon}.svg`;

        document.querySelector(".cardes_chisla2").innerHTML =
          data.forecasts[0].parts.evening.temp_avg;

        document.querySelector(".cardes_ohyhenie2").innerHTML =
          data.forecasts[0].parts.evening.feels_like;

        document.querySelector(".cardes_veroit2").innerHTML =
          data.forecasts[0].parts.evening.pressure_mm;

        document.querySelector(".cardes_humidity2").innerHTML =
          data.forecasts[0].parts.evening.humidity;

        document.querySelector(".cardes_images3").src = `
        https://yastatic.net/weather/i/icons/funky/dark/${data.forecasts[0].parts.night.icon}.svg`;

        document.querySelector(".cardes_chisla3").innerHTML =
          data.forecasts[0].parts.night.temp_avg;

        document.querySelector(".cardes_ohyhenie3").innerHTML =
          data.forecasts[0].parts.night.feels_like;

        document.querySelector(".cardes_veroit3").innerHTML =
          data.forecasts[0].parts.night.pressure_mm;

        document.querySelector(".cardes_humidity3").innerHTML =
          data.forecasts[0].parts.night.humidity;
      });
  }

  function setDay(index, lat, lon) {
    const cerds = document.querySelectorAll(".cerd_cerds");

    console.log(cerds);

    cerds.forEach((button, index) => {
      button.classList.remove("active");
    });

    document.querySelectorAll(".cerd_cerds")[index].classList.add("active");

    const headers = {
      "X-Yandex-Weather-Key": "d3ba034b-099a-497a-a36d-910c9cd706fc",
      "Content-Type": "application/json",
    };

    fetch(
      `https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}&lang=ru_RU&limit=4`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        document.querySelector(".cardes_images0").src = `
        https://yastatic.net/weather/i/icons/funky/dark/${data.forecasts[0].parts.morning.icon}.svg`;

        document.querySelector(".cardes_chisla0").innerHTML =
          data.forecasts[index].parts.morning.temp_avg;

        document.querySelector(".cardes_ohyhenie0").innerHTML =
          data.forecasts[index].parts.morning.feels_like;

        document.querySelector(".cardes_veroit0").innerHTML =
          data.forecasts[index].parts.morning.pressure_mm;

        document.querySelector(".cardes_humidity0").innerHTML =
          data.forecasts[index].parts.morning.humidity;

        document.querySelector(".cardes_images1").src = `
        https://yastatic.net/weather/i/icons/funky/dark/${data.forecasts[index].parts.day.icon}.svg`;

        document.querySelector(".cardes_chisla1").innerHTML =
          data.forecasts[index].parts.day.temp_avg;

        document.querySelector(".cardes_ohyhenie1").innerHTML =
          data.forecasts[index].parts.day.feels_like;

        document.querySelector(".cardes_veroit1").innerHTML =
          data.forecasts[index].parts.day.pressure_mm;

        document.querySelector(".cardes_humidity1").innerHTML =
          data.forecasts[index].parts.day.humidity;

        document.querySelector(".cardes_images2").src = `
        https://yastatic.net/weather/i/icons/funky/dark/${data.forecasts[index].parts.evening.icon}.svg`;

        document.querySelector(".cardes_chisla2").innerHTML =
          data.forecasts[index].parts.evening.temp_avg;

        document.querySelector(".cardes_ohyhenie2").innerHTML =
          data.forecasts[index].parts.evening.feels_like;

        document.querySelector(".cardes_veroit2").innerHTML =
          data.forecasts[index].parts.evening.pressure_mm;

        document.querySelector(".cardes_humidity2").innerHTML =
          data.forecasts[index].parts.evening.humidity;

        document.querySelector(".cardes_images3").src = `
        https://yastatic.net/weather/i/icons/funky/dark/${data.forecasts[index].parts.night.icon}.svg`;

        document.querySelector(".cardes_chisla3").innerHTML =
          data.forecasts[index].parts.night.temp_avg;

        document.querySelector(".cardes_ohyhenie3").innerHTML =
          data.forecasts[index].parts.night.feels_like;

        document.querySelector(".cardes_veroit3").innerHTML =
          data.forecasts[index].parts.night.pressure_mm;

        document.querySelector(".cardes_humidity3").innerHTML =
          data.forecasts[index].parts.night.humidity;
      });
  }

  function displayWeatherInfo(data) {
    const temperature = data.main ? `${Math.round(data.main.temp)}°C` : "0°C";
    const clouds = data.clouds ? `${data.clouds.all}%` : "0%";
    const status = data.weather[0].main;
    const humidity = data.main ? `${data.main.humidity}%` : "0%";
    const wind = data.wind ? `${data.wind.speed} м/с` : "0 м/с";
    const gust =
      data.wind && data.wind.gust ? `${data.wind.gust} м/с` : "0 м/с";
    const description =
      data.weather && data.weather.length > 0
        ? data.weather[0].description
        : "Нет данных о погоде";
    const iconCode =
      data.weather && data.weather.length > 0 ? data.weather[0].icon : "01d";
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
    console.log(data);

    return {
      temperature,
      clouds,
      humidity,
      wind,
      gust,
      description,
      iconUrl,
      status,
    };
  }

  function displayWeatherAndTime(city, weatherInfo, time) {
    document.querySelector(".card_gorod").textContent = `${city}`;
    document.querySelector(
      ".card_temperatyra"
    ).textContent = `${weatherInfo.temperature}`;
    document.querySelector(
      ".cerd_gradys1"
    ).textContent = `${weatherInfo.temperature}`;
    document.querySelector(
      ".card_oblachnost"
    ).textContent = `${weatherInfo.clouds}`;
    document.querySelector(
      ".card_vlazhnost"
    ).textContent = `${weatherInfo.humidity}`;
    document.querySelector(".card_poryvy").textContent = `${weatherInfo.gust}`;
    document.querySelector(".card_vremi").textContent = `${time}`;
    document.querySelector(
      ".card_text"
    ).textContent = `${weatherInfo.description}`;

    document.querySelector(
      ".header"
    ).style.backgroundImage = `url('../img/${weatherInfo.status}.png')`;
    const image = document.querySelector(".card_tuchki");
    console.log(weatherInfo);

    document.querySelector("body").style.background =
      weatherInfo.status == "Clear"
        ? "#092C1F"
        : weatherInfo.status == "Clouds"
        ? "#052132"
        : weatherInfo.status == "Fog"
        ? "#2B343A"
        : weatherInfo.status == "Snow"
        ? "#2F4A63"
        : "#09242C";

    document.querySelector(".header_poisks").style.background =
      weatherInfo.status == "Clear"
        ? "#609A00"
        : weatherInfo.status == "Clouds"
        ? "#FED689"
        : weatherInfo.status == "Fog"
        ? "#A3B0B8"
        : weatherInfo.status == "Snow"
        ? "#CEDEF2"
        : "#00C2F1";

    const iconUrl = weatherInfo.iconUrl;
    const iconElement = document.querySelector(".card_tuchki");
    if (iconElement) {
      iconElement.setAttribute("src", iconUrl);
    }
  }

  document.querySelectorAll(".city-link").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const city = this.getAttribute("data-city");
      loadWeatherData(city).then((data) => {
        const weatherInfo = displayWeatherInfo(data);
        const latitude = data.coord ? data.coord.lat : 57.6261;
        const longitude = data.coord ? data.coord.lon : 39.8845;
        napered(latitude, longitude);
        loadTimeData(latitude, longitude).then((time) => {
          displayWeatherAndTime(data.name, weatherInfo, time);
        });
      });
    });
  });

  document
    .getElementById("search-btn")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const cityInput = document.getElementById("city-input");
      const city = cityInput.value.trim();
      if (!city) {
        loadWeatherData("Yaroslavl").then((data) => {
          const weatherInfo = displayWeatherInfo(data);
          console.log(data);
          const time = data
            ? "N/A"
            : "Время: " + new Date().toLocaleTimeString("ru-RU");
          displayWeatherAndTime("Ярославль", weatherInfo, time);
        });
      } else {
        loadWeatherData(city).then((data) => {
          const weatherInfo = displayWeatherInfo(data);
          const latitude = data.coord ? data.coord.lat : 57.6261;
          const longitude = data.coord ? data.coord.lon : 39.8845;
          napered(latitude, longitude);

          loadTimeData(latitude, longitude).then((time) => {
            displayWeatherAndTime(data.name, weatherInfo, time);
          });
        });
      }
      cityInput.value = "";
    });

  document
    .getElementById("city-input")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        const city = this.value.trim();
        if (!city) {
          loadWeatherData("Yaroslavl").then((data) => {
            const weatherInfo = displayWeatherInfo(data);
            const time = data
              ? "N/A"
              : "Время: " + new Date().toLocaleTimeString("ru-RU");
            displayWeatherAndTime("Ярославль", weatherInfo, time);
          });
        } else {
          loadWeatherData(city).then((data) => {
            const weatherInfo = displayWeatherInfo(data);
            const latitude = data.coord ? data.coord.lat : 57.6261;
            const longitude = data.coord ? data.coord.lon : 39.8845;
            napered(latitude, longitude);
            loadTimeData(latitude, longitude).then((time) => {
              displayWeatherAndTime(data.name, weatherInfo, time);
            });
          });
        }
        this.value = "";
      }
    });

  //ТУТА НАЧАЛОСЬ ПОИСК ЧЕРЕЗ ВВОД input ТАК ЧТО НЕ ПЕРЕПУТАТЬ
  const cityInput = document.getElementById("city-input");
  const suggestionsList = document.getElementById("suggestions");

  cityInput.addEventListener("input", function () {
    const userInput = this.value.trim().toLowerCase();
    if (!userInput) {
      suggestionsList.innerHTML = ""; // Очистить список подсказок, если поле ввода пустое
      return;
    }

    fetch(
      `http://api.geonames.org/searchJSON?q=${userInput}&maxRows=5&lang=ru&username=nikita123124124124`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.geonames) {
          // Проверка наличия данных о городах
          const suggestions = data.geonames.map((city) => city.name);
          cityInput.value === ""
            ? (suggestionsList.innerHTML = "")
            : displaySuggestions(suggestions);

          // displaySuggestions(suggestions);
        } else {
          console.error("Не удалось получить данные о городах:", data);
        }
      })
      .catch((error) => {
        console.error("Ошибка при получении данных о городах:", error);
      });
  });

  cityInput.addEventListener("blur", () => {
    setTimeout(() => {
      suggestionsList.innerHTML = "";
    }, 1000);
  });

  function displaySuggestions(suggestions) {
    suggestionsList.innerHTML = "";

    suggestions.forEach((suggestion) => {
      const li = document.createElement("li");
      li.textContent = suggestion;
      li.addEventListener("click", function () {
        cityInput.value = suggestion;
        const city = cityInput.value.trim();
        if (city) {
          loadWeatherData(city).then((data) => {
            const weatherInfo = displayWeatherInfo(data);
            const latitude = data.coord ? data.coord.lat : 57.6261;
            const longitude = data.coord ? data.coord.lon : 39.8845;
            napered(latitude, longitude);
            loadTimeData(latitude, longitude).then((time) => {
              displayWeatherAndTime(data.name, weatherInfo, time);
              suggestionsList.innerHTML = "";
              cityInput.value = "";
            });
          });
        }
        loadCityData(suggestion);
      });
      suggestionsList.appendChild(li);
    });
  }

  function loadCityData(city) {
    const weatherApiKey = "25b50792af8662dd9841a19828cab258";
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&lang=ru`;

    fetch(weatherApiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Отобразить данные о погоде на странице
        console.log(data);
        displayWeatherData(data);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных о погоде:", error);
      });
  }

  function displayWeatherData(weatherData) {
    const weatherInfoElement = document.getElementById("weather-info");
    if (weatherInfoElement) {
      weatherInfoElement.textContent = `Температура: ${weatherData.main.temp}°C`;
    }
  }

  // Добавляем обработчик события для кнопки поиска
  document.getElementById("search-btn").addEventListener("click", function () {
    const city = cityInput.value.trim();
    if (city) {
      s;
      loadCityData(city);
    }
  });

  // Добавляем обработчик события для нажатия клавиши Enter в поле ввода города
  cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const city = cityInput.value.trim();
      if (city) {
        loadCityData(city);
      }
    }
  });
  //КОНЕЦ ПОИСКА

  document.querySelector(".card_img").addEventListener("click", function () {
    window.location.href = "/profile.html";
  });

  loadWeatherData("Yaroslavl");
});
