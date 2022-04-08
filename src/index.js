function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col">
      <div class="forecast-weather-date">${formatDay(forecastDay.dt)}</div>
      <img 
        src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png"
        alt=""
        width="42"
      />
      <div class="forecast-weather-temperatures">
        <span class="forecast-weather-temperature-min"> ${Math.round(
          forecastDay.temp.min
        )} °</span>
        <span class="forecast-weather-temperature-max"> | ${Math.round(
          forecastDay.temp.max
        )} °</span
        >
    </div>
    </div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "3cc63b2045ffdc342811848b9c3cdbe0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showCurrentWeather(response) {
  document.querySelector(
    "h4"
  ).innerHTML = `Current weather in <i class="fa-solid fa-location-dot"></i> ${response.data.name}, ${response.data.sys.country}`;

  celsiusTemperature = response.data.main.temp;

  document.querySelector("#temp").innerHTML = Math.round(celsiusTemperature);

  let wind = response.data.wind.speed * 3.6;
  document.querySelector("#wind").innerHTML = Math.round(wind);

  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "3cc63b2045ffdc342811848b9c3cdbe0";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showCurrentWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-text-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "3cc63b2045ffdc342811848b9c3cdbe0";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showCurrentWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  let monthIndex = date.getMonth();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[monthIndex];

  return `${day}, ${month} ${date.getDate()} <i class="fa-regular fa-clock"></i> ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let currentButton = document.querySelector("#current-location-button");
currentButton.addEventListener("click", getCurrentLocation);

let dateElement = document.querySelector("h6");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

searchCity("London");
