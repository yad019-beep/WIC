const allPlaces = [
    { id: 1, name: "RakiRaki Ramen", category: "food", price: 12, openNow: true, hasDiscount: true, discountDesc: "10% off UCSD ID", desc: "Authentic Hakata-style tonkotsu ramen.", address: "4646 Convoy St", hours: "11:00-22:00", url: "https://www.rakirakiramen.com/" },
    { id: 2, name: "Shake Shack UTC", category: "food", price: 15, openNow: true, hasDiscount: false, discountDesc: "", desc: "Modern day 'roadside' burger stand.", address: "4545 La Jolla Village Dr", hours: "10:00-21:00", url: "https://shakeshack.com/location/utc-san-diego-ca" },
    { id: 3, name: "Tapioca Express", category: "food", price: 8, openNow: true, hasDiscount: true, discountDesc: "$1 off", desc: "Classic Boba tea and Taiwanese snacks.", address: "9737 Judicial Way", hours: "11:00-23:00", url: "https://tapiocaexpress.com/" },
    { id: 4, name: "Coco Ichibanya", category: "food", price: 14, openNow: false, hasDiscount: false, discountDesc: "", desc: "Famous Japanese curry house.", address: "8120 Mira Mesa Blvd", hours: "11:00-21:00", url: "https://ichibanyausa.com/" },
    { id: 5, name: "The Taco Stand", category: "food", price: 9, openNow: true, hasDiscount: false, discountDesc: "", desc: "Authentic Tijuana-style taco experience.", address: "621 Pearl St", hours: "09:00-22:00", url: "https://letstaco.com/" },
    { id: 6, name: "La Jolla Shores", category: "place", price: 0, openNow: true, hasDiscount: false, discountDesc: "", desc: "A mile-long beach for swimming and surfing.", address: "La Jolla Shores Dr", hours: "24/7", url: "https://www.sandiego.gov/lifeguards/beaches/shores" },
    { id: 7, name: "Museum of Contemporary Art", category: "place", price: 15, openNow: false, hasDiscount: true, discountDesc: "Free for UCSD", desc: "Showcasing art of our time since 1941.", address: "700 Prospect St", hours: "10:00-17:00", url: "https://mcasd.org" },
    { id: 8, name: "Torrey Pines Gliderport", category: "place", price: 5, openNow: true, hasDiscount: true, discountDesc: "$20 off", desc: "Historic aviation site with cliffside views.", address: "2800 Torrey Pines Scenic Dr", hours: "09:00-18:00", url: "https://www.flytorrey.com/" },
    { id: 9, name: "Birch Aquarium", category: "place", price: 20, openNow: true, hasDiscount: true, discountDesc: "$5 off", desc: "Explore the cutting edge of Scripps research.", address: "2300 Expedition Way", hours: "09:00-17:00", url: "https://aquarium.ucsd.edu" }
];

let currentTab = "food";
let filters = { openNow: false, minPrice: 0, maxPrice: 50, discountOnly: false };

// ========== 渲染函数 ==========
function renderCards() {
    const container = document.getElementById("results-container");
    const pageTitle = document.getElementById("page-title");
    
    if (!container) return;

    // 过滤逻辑
    let filtered = allPlaces.filter(p => p.category === currentTab);
    filtered = filtered.filter(p => p.price >= filters.minPrice && p.price <= (filters.maxPrice === 50 ? 999 : filters.maxPrice));
    if (filters.openNow) filtered = filtered.filter(p => p.openNow);
    if (filters.discountOnly) filtered = filtered.filter(p => p.hasDiscount);
    
    // 更新标题
    if (pageTitle) {
        pageTitle.innerText = currentTab === "food" ? "🍔 Food Spots around UCSD" : "🌴 Places & Attractions";
    }
    
    // 空状态处理
    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color: #663399;">✨ No spots match your filters ✨</div>`;
        return;
    }
    
    // 生成 HTML
    container.innerHTML = filtered.map(p => `
        <article class="location-card">
            <div class="card-img"></div>
            <div class="card-info">
                <div class="card-header">
                    <h3>${p.name}</h3>
                    <span class="price">${p.price === 0 ? "Free" : "$" + p.price}</span>
                </div>
                <div class="description">${p.desc}</div>
                <div class="address">📍 ${p.address}</div>
                <div class="hours">🕒 ${p.hours}</div>
                <div class="badge-row">
                    <span class="status-badge ${p.openNow ? 'status-open' : 'status-closed'}">
                        ${p.openNow ? '🟢 Open now' : '🔴 Closed now'}
                    </span>
                    ${p.hasDiscount ? `<span class="discount-badge">🎁 ${p.discountDesc}</span>` : ""}
                </div>
                <div class="official-link">
                    <a href="${p.url}" target="_blank" rel="noopener">official site →</a>
                </div>
            </div>
        </article>
    `).join('');
}

// ========== 随机挑选逻辑 ==========
function randomPick() {
    let filtered = allPlaces.filter(p => p.category === currentTab);
    if (filters.openNow) filtered = filtered.filter(p => p.openNow);
    if (filters.discountOnly) filtered = filtered.filter(p => p.hasDiscount);
    
    if (filtered.length === 0) {
        alert("No spots match current category/filters!");
        return;
    }
    
    const lucky = filtered[Math.floor(Math.random() * filtered.length)];
    alert(`🎉 Random pick: ${lucky.name}!`);
    
    // 自动滚动到那个卡片
    const cards = document.querySelectorAll('.location-card');
    for (let card of cards) {
        if (card.querySelector('h3')?.innerText === lucky.name) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.boxShadow = '0 0 0 4px #663399';
            setTimeout(() => card.style.boxShadow = '', 1500);
            break;
        }
    }
}

// ========== 暴露给组员的接口 ==========
window.updateCardFilters = function(newFilters) {
    Object.assign(filters, newFilters);
    renderCards();
};

window.setHomepageTab = function(tab) {
    currentTab = tab;
    // 切换按钮激活状态
    document.getElementById("tab-food")?.classList.toggle("active", tab === "food");
    document.getElementById("tab-place")?.classList.toggle("active", tab === "place");
    renderCards();
};

// ========== 初始化与事件绑定 ==========
document.addEventListener('DOMContentLoaded', () => {
    renderCards();

    // 绑定 Tab
    document.getElementById("tab-food")?.addEventListener("click", () => setHomepageTab("food"));
    document.getElementById("tab-place")?.addEventListener("click", () => setHomepageTab("place"));

    // 绑定侧边栏过滤器 (根据你的 index.html ID)
    document.getElementById("Open-right-now")?.addEventListener("change", e => {
        window.updateCardFilters({ openNow: e.target.checked });
    });

    document.getElementById("discount-only")?.addEventListener("change", e => {
        window.updateCardFilters({ discountOnly: e.target.checked });
    });

    // 价格滑动条逻辑
    const sMin = document.getElementById("slider-min");
    const sMax = document.getElementById("slider-max");
    const vMin = document.getElementById("min-value");
    const vMax = document.getElementById("max-value");

    function updatePrice() {
        let min = parseInt(sMin.value);
        let max = parseInt(sMax.value);
        if (min >= max) { sMin.value = max - 1; min = max - 1; }
        if (vMin) vMin.innerText = min;
        if (vMax) vMax.innerText = max === 50 ? "50+" : max;
        window.updateCardFilters({ minPrice: min, maxPrice: max });
    }

    sMin?.addEventListener("input", updatePrice);
    sMax?.addEventListener("input", updatePrice);

    // 随机按钮
    document.querySelector(".random-btn")?.addEventListener("click", randomPick);
});