const baseUrl =
  "https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=a94d0a5ac08570add4b47b8da933f247&units=metric";

const current = document.querySelector(".current");
const forecast = document.querySelector(".forecast");
const weather = document.querySelector(".weather");

fetch(baseUrl)
  .then((Response) => Response.json())
  .then((data) => {
    renderCurrent(data);
    renderForecast(data);
  })
  .catch((error) => {
    console.error("Ошибка:", error);
    weather.textContent =
      "Ошибка: API недоступен. Пожалуйста, попробуйте позднее.";
  });

const renderCurrent = (data) => {
  const iconUrl = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;
  const template = `
   <div class="city">
    <div class="city_name">
      <p>${data.city.name}</p>
    </div>
    <div class="city_time">
      <p>Time:</p>
      <span id="hours"></span> : <span id="minutes"></span> :
      <span id="seconds"></span>
    </div>
  </div>
  <div class="city_weather">
    <p>${data.list[0].weather[0].main}</p>
    <img src="${iconUrl}" alt="погода">
    <p>${Math.ceil(data.list[0].main.temp)} °C</p>
    <p>${data.list[0].wind.speed} m/s</p>
  </div>
  <div class="search"> 
    <input class="location_city" type="text" value="" placeholder="Minsk" />
    <button class="search_weather">Search</button>
  </div>
`;
  current.innerHTML = template;
  const btn = document.querySelector(".search_weather");
  btn.addEventListener("click", handleSearch);
};

function handleSearch() {
  const inputCity = document.querySelector(".location_city").value.trim();
  if (inputCity) {
    const newBaseUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${inputCity}&appid=a94d0a5ac08570add4b47b8da933f247&units=metric`;
    fetch(newBaseUrl)
      .then((Response) => Response.json())
      .then((data) => {
        document.querySelector(".forecast").innerHTML = "";
        renderCurrent(data);
        renderForecast(data);
      })
      .catch((error) => {
        console.error("Ошибка:", error);
        const errorMessage = `Ошибка: API недоступен или вы ввели несуществующий город. Пожалуйста, попробуйте позднее.`;
        const backButton = document.createElement("button");
        backButton.textContent = "Вернуться обратно";
        backButton.className = "back-button";
        backButton.addEventListener("click", () => {
          location.href = "/index.html";
        });
        weather.textContent = errorMessage;
        weather.appendChild(backButton);
      });
  }
}

function renderForecast(data) {
  for (let i = 0; i < 40; i += 8) {
    const iconUrl = `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
    const template = `
    <div class="container">
      <div class="container_time">
        <p>${data.list[i].dt_txt.slice(0, 10)}</p>
        <p>${data.list[i].dt_txt.slice(11, 16)}</p>
      </div>
      <img src="${iconUrl}" alt="Погода">
      <div>
        <p>${Math.ceil(data.list[i].main.temp)} degrees</p>
      </div>
    </div>`;
    forecast.innerHTML += template;
  }
}

function updateClock() {
  let now = new Date();
  let hours = now.getHours().toString().padStart(2, "0");
  let minutes = now.getMinutes().toString().padStart(2, "0");
  let seconds = now.getSeconds().toString().padStart(2, "0");

  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}

setInterval(updateClock, 1000);
