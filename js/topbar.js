// Topbar Tab Switching Logic

// 1. 获取 tab 按钮
const foodBtn = document.getElementById("tab-food");
const placeBtn = document.getElementById("tab-place");

// 2. 获取页面标题
const pageTitle = document.getElementById("page-title");


// 3. 点击 Food
foodBtn.addEventListener("click", function () {

    // 改标题（UI反馈）
    pageTitle.textContent = "Currently Browsing: Food";
    document.body.classList.remove("place-page");
    document.body.classList.add("food-page");

    setActiveTab(foodBtn);

    // 控制台测试
    console.log("Switched to Food");
});

// 4. 点击 Place
placeBtn.addEventListener("click", function () {

    pageTitle.textContent = "Currently Browsing: Place";
    document.body.classList.remove("food-page");
    document.body.classList.add("place-page");

    setActiveTab(placeBtn);

    console.log("Switched to Place");
});

// 5. 点击 Weather

function setActiveTab(activeBtn) {

    // 所有按钮变回默认
    foodBtn.classList.remove("active");
    placeBtn.classList.remove("active");

    // 当前点击的变 active
    activeBtn.classList.add("active");
}

const weatherCondition = document.getElementById("weather-condition");
const weatherTemp = document.getElementById("weather-temp");
const weatherRain = document.getElementById("weather-rain");
const weatherLocation = document.getElementById("weather-location");

function getWeatherText(code) {
    if (code === 0) return "Clear";
    if ([1, 2, 3].includes(code)) return "Cloudy";
    if ([45, 48].includes(code)) return "Fog";
    if (code >= 51 && code <= 67) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Showers";
    if (code >= 95) return "Storm";
    return "Weather";
}

function loadWeather(latitude, longitude, label) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=precipitation_probability_max&temperature_unit=fahrenheit&timezone=auto&forecast_days=1`;

    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            weatherCondition.textContent = getWeatherText(data.current.weather_code);
            weatherTemp.textContent = Math.round(data.current.temperature_2m) + " F";
            weatherRain.textContent = data.daily.precipitation_probability_max[0] + "%";
            weatherLocation.textContent = label;
        })
        .catch(function () {
            weatherCondition.textContent = "Weather";
            weatherTemp.textContent = "-- F";
            weatherRain.textContent = "--%";
            weatherLocation.textContent = "Unavailable";
        });
}

function loadTodayWeather() {
    loadWeather(32.72, -117.16, "San Diego");
}

loadTodayWeather();
