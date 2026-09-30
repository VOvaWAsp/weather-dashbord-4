const apiKey = "a66281db80595ed12520a9c8df8e5b0a";

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";

const cityInput = document.querySelector(".input-selection input");
const cityButton = document.querySelector(".input-selection button");

const error = document.querySelector(".error");
const containerSingle = document.querySelector(".container-single-weather");
const containerForecast = document.querySelector(".container-forecast-weather");
const title = document.querySelector(".title");
const weatherImg = document.querySelector(".weather-img");

const weatherTranslations = {
  "clear sky": "Ясно",
  "few clouds": "Малохмарно",
  "scattered clouds": "Мінлива хмарність",
  "broken clouds": "Хмарно",
  "overcast clouds": "Похмуро",
  "shower rain": "Злива",
  rain: "Дощ",
  "light rain": "Невеликий дощ",
  "moderate rain": "Помірний дощ",
  "heavy intensity rain": "Сильний дощ",
  thunderstorm: "Гроза",
  snow: "Сніг",
  mist: "Туман",
  fog: "Туман",
};

async function getWeather(city) {
  try {
    const response = await fetch(
      apiUrl + `${city}&appid=${apiKey}&units=metric&lang=ua}`,
    );
    const data = await response.json();
    console.log(data);

    if (response.status === 404) {
      error.style.display = "block";
      containerSingle.style.display = "none";
      containerForecast.style.display = "none";
      title.style.display = "none";
    }

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      `${Math.round(data.main.temp)}°C`;
    document.querySelector(".description").innerHTML =
      weatherTranslations[data.weather[0].description] ||
      data.weather[0].description;

    weatherImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    weatherImg.alt = data.weather[0].description;

    error.style.display = "none";
    containerSingle.style.display = "grid";
    containerForecast.style.display = "grid";
    title.style.display = "flex";
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

async function getForecast(city) {
  try {
    const response = await fetch(
      forecastUrl + `${city}&appid=${apiKey}&units=metric&lang=ua`,
    );

    const data = await response.json();

    const forecastContainer = document.querySelector(
      ".container-forecast-weather",
    );

    const days = data.list.filter((item, index) => index % 4 === 0);

    forecastContainer.innerHTML = "";

    days.slice(0, 7).forEach((day) => {
      const date = new Date(day.dt_txt);

      const description =
        weatherTranslations[day.weather[0].description] ||
        day.weather[0].description;

      forecastContainer.innerHTML += `
  <article class="forecast-card">
    <h3>${date.toLocaleDateString("uk-UA")}</h3>

    <img
      class="forecast-icon"
      src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
      alt="${description}"
    />

    <p>${Math.round(day.main.temp)}°C</p>
    <p>${description}</p>
  </article>
`;
    });
  } catch (error) {
    console.error(error);
  }
}

cityButton.addEventListener("click", () => {
  getWeather(cityInput.value);
  getForecast(cityInput.value);
  cityInput.value = "";
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeather(cityInput.value);
    getForecast(cityInput.value);
    cityInput.value = "";
  }
});
