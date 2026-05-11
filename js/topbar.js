// Topbar Tab Switching Logic

// 1. 获取 tab 按钮
const foodBtn = document.getElementById("tab-food");
const placeBtn = document.getElementById("tab-place");
const weatherBtn = document.getElementById("tab-weather");

// 2. 获取页面标题
const pageTitle = document.getElementById("page-title");


// 3. 点击 Food
foodBtn.addEventListener("click", function () {

    // 改标题（UI反馈）
    pageTitle.textContent = "Currently Browsing: Food";

    setActiveTab(foodBtn);

    // 控制台测试
    console.log("Switched to Food");
});

// 4. 点击 Place
placeBtn.addEventListener("click", function () {

    pageTitle.textContent = "Currently Browsing: Place";

    setActiveTab(placeBtn);

    console.log("Switched to Place");
});

// 5. 点击 Weather
weatherBtn.addEventListener("click", function () {

    pageTitle.textContent = "Currently Browsing: Weather";

    setActiveTab(weatherBtn);

    console.log("Switched to Weather");
});

function setActiveTab(activeBtn) {

    // 所有按钮变回默认
    foodBtn.classList.remove("active");
    placeBtn.classList.remove("active");
    weatherBtn.classList.remove("active");

    // 当前点击的变 active
    activeBtn.classList.add("active");
}