document
  .getElementById("city-input")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const city = this.value.trim();
      if (!city) {
        alert("Please enter right city name");
      } else {
        loadCityData(city).then((data) => {
          localStorage.setItem("myLat", data.coord.lat);
          localStorage.setItem("myLon", data.coord.lon);
          const myCitis = JSON.parse(localStorage.getItem("myCitis")) || [];
          myCitis.push(data.name);
          localStorage.setItem("myCitis", JSON.stringify(myCitis));
        });
      }
      this.value = "";
    }
  });

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
        loadCityData(city)
          .then((response) => response.json())
          .then((data) => {
            localStorage.setItem("myLat", data.coord.lat);
            localStorage.setItem("myLon", data.coord.lon);
            localStorage.setItem("myCity", city);
            const myCitis = JSON.parse(localStorage.getItem("myCitis")) || [];
            myCitis.push(data.name);
            localStorage.setItem("myCitis", JSON.stringify(myCitis));
            suggestionsList.innerHTML = "";
          });
        cityInput.value = "";
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
      cityInput.value = "";
      localStorage.setItem("myLat", data.coord.lat);
      localStorage.setItem("myLon", data.coord.lon);
      const myCitis = JSON.parse(localStorage.getItem("myCitis")) || [];
      if (!myCitis.includes(data.name)) {
        myCitis.push(data.name);
        localStorage.setItem("myCitis", JSON.stringify(myCitis));
      }
      localStorage.setItem("myCity", data.name);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Ошибка при получении данных о погоде:", error);
    });
}

function loadData(city, index) {
  const weatherApiKey = "25b50792af8662dd9841a19828cab258";
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&lang=ru&units=metric`;
  //`http://openweathermap.org/img/wn/${iconCode}.png`

  fetch(weatherApiUrl)
    .then((response) => response.json())
    .then((data) => {
      document.querySelector(".temp" + index).innerHTML =
        Math.round(data.main.temp) + " °C";
      document.querySelector(
        ".icon" + index
      ).src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    });
}

setCitis();

function setCitis() {
  const myCitis = JSON.parse(localStorage.getItem("myCitis")) || [];
  const myCity = localStorage.getItem("myCity") || "";
  myCitis
    ? (document.querySelector(".myCitis").innerHTML = myCitis.map(
        (city, index) => {
          loadData(city, index);
          return `
        <div class="${
          city == myCity ? "city active" : "city"
        }" onclick="setCity('${city}')">${city} <section><img class="weatherIcon icon${index}"/><p class="temp temp${index}"></p></section></div>
        `;
        }
      ))
    : "";
}

function setCity(city) {
  localStorage.setItem("myCity", city);
  loadCityData(city);
  window.location.reload();
}

document.querySelector(".clear").addEventListener("click", function () {
  localStorage.removeItem("myCitis");
  localStorage.removeItem("myCity");
  localStorage.removeItem("myLat");
  localStorage.removeItem("myLon");
  window.location.reload();
});

function back() {
  window.location.href = "/index.html";
}
