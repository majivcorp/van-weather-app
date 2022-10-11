let dateToday = document.querySelector("#date");
let currentTime = document.querySelector("#local-time");
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
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
let month = months[now.getMonth()];
let date = now.getDate();
let year = now.getFullYear();
let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
dateToday.innerHTML = `${day}, ${month} ${date}, ${year}`;
currentTime.innerHTML = `${hour}:${minutes}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  return days[day];
}

function showForecast(response) {
  let dailyForecast = response.data.daily;
  let forecast = document.querySelector("#future");
  let forecastHTML = `<div class="row">`;
  dailyForecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col">
      <div>
        <img src="images/${
          forecastDay.weather[0].icon
        }.png" alt="Cloudy Day" id="icon" />
      </div>
      <div class="day">${formatDay(forecastDay.dt)}</div>
      <div class="temp" id="temp">
        <span class="high">${Math.round(forecastDay.temp.max)}°</span>
        <span class="low">| ${Math.round(forecastDay.temp.min)}°</span>
      </div>
    </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecast.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "63493f6a61b05c9dd9c1688ad634683f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function showTemp(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#current-weather").innerHTML =
    response.data.weather[0].main;
  let currentIcon = document.querySelector("#current-icon");
  currentIcon.setAttribute(
    "src",
    `images/${response.data.weather[0].icon}.png`
  );
  currentIcon.setAttribute("alt", response.data.weather[0].main);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "63493f6a61b05c9dd9c1688ad634683f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemp);
}

function typeCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "c03face7caa58a9b7ffa9f52b7238a93";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemp);
}

function getLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
let currentLocationButton = document.querySelector("#my-location");
currentLocationButton.addEventListener("click", getLocation);

let form = document.querySelector("#search-form");
form.addEventListener("submit", typeCity);

searchCity("Toronto");