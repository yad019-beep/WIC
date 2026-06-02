let allPlaces = [];

const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuyuagjKqQihQ_mLwQ7k8aaCULBhw54XRdBFlf4wjQsesiWdONNWZvE-TU2hRIxuEPcW4lSvny6LID/pub?output=csv";
let currentTab = "food";
let filters = { openNow: false, minPrice: 0, maxPrice: 50, discountOnly: false, tags: [] };
let pickingNow = false;

const tagGroups = {
    food: ["full-meal", "dessert", "vegan", "good-for-study"],
    place: ["nature", "historic", "museums", "hidden-gems"]
};

function safeText(value) {
    return value
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function normalizeTag(tag) {
    return tag
        .toString()
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getPlaceTags(place) {
    if (Array.isArray(place.parsedTags)) return place.parsedTags;

    const rawTags = place.tags || place.tag || place.labels || "";
    place.parsedTags = rawTags
        .toString()
        .split(/[,;|]/)
        .map(normalizeTag)
        .filter(Boolean);

    return place.parsedTags;
}

function getActiveTags() {
    const allowedTags = tagGroups[currentTab] || [];
    return filters.tags.filter(tag => allowedTags.includes(tag));
}

function applyFilters(places) {
    let filtered = places.filter(p => p.category === currentTab);
    filtered = filtered.filter(p => p.price >= filters.minPrice && p.price <= (filters.maxPrice === 50 ? 999 : filters.maxPrice));
    if (filters.openNow) filtered = filtered.filter(p => p.openNow);
    if (filters.discountOnly) filtered = filtered.filter(p => p.hasDiscount);

    const activeTags = getActiveTags();
    if (activeTags.length > 0) {
        filtered = filtered.filter(p => {
            const placeTags = getPlaceTags(p);
            return activeTags.some(tag => placeTags.includes(tag));
        });
    }

    return filtered;
}

function jumpToPickedCard(placeName) {
    document.querySelectorAll('.location-card').forEach(card => {
        if (card.querySelector('h3')?.innerText !== placeName) return;
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.boxShadow = '0 0 0 4px #663399';
        setTimeout(() => card.style.boxShadow = '', 1500);
    });
}

function openPickRoll(places, picked) {
    const winnerSlot = 25;
    const line = Array.from({ length: 36 }, () => places[Math.floor(Math.random() * places.length)]);
    line[winnerSlot] = picked;

    const popup = document.createElement("div");
    popup.className = "pick-popup";
    popup.innerHTML = `
        <div class="pick-box">
            <button class="pick-close" type="button">×</button>
            <h3>Pick For Me</h3>
            <div class="pick-window">
                <div class="pick-marker"></div>
                <div class="pick-line">
                    ${line.map(place => `
                        <div class="pick-tile">
                            <strong>${safeText(place.name || "Unknown")}</strong>
                            <span>${place.price === 0 ? "Free" : "$" + safeText(place.price || "")}</span>
                        </div>
                    `).join("")}
                </div>
            </div>
            <div class="pick-result">Selected: <strong>${safeText(picked.name)}</strong></div>
        </div>
    `;

    document.body.appendChild(popup);
    popup.querySelector(".pick-close").onclick = () => popup.remove();

    requestAnimationFrame(() => {
        const row = popup.querySelector(".pick-line");
        const winningTile = row.children[winnerSlot];
        const middle = popup.querySelector(".pick-window").clientWidth / 2;
        const moveBy = winningTile.offsetLeft + winningTile.offsetWidth / 2 - middle;
        row.style.transform = `translateX(-${moveBy}px)`;
    });

    setTimeout(() => {
        popup.classList.add("done");
        pickingNow = false;
        jumpToPickedCard(picked.name);
    }, 4300);
}

// 动态数据库
function loadDataFromSheet(){
    Papa.parse(sheetURL, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(result){
            allPlaces = result.data.filter(p => p.name);
            allPlaces.forEach(p => {
                p.category = p.category ? p.category.toString().trim().toLowerCase() : "";
                p.price = Number(p.price) || 0;
                getPlaceTags(p);
            });
            //动态计算（提取本地时间来算是否开门）
            const now = new Date();
            const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
            
            allPlaces.forEach(p => {
                p.openNow = false;
                if (p.hours){
                    let hoursStr = p.hours.toString().trim().toLowerCase();
                    
                    if(hoursStr == '24 hours'){
                        p.openNow = true;
                    }
                    else if(hoursStr.includes('-')){
                        let times = hoursStr.split('-');
                        let openParts = times[0].split(':');
                        let closeParts = times[1].split(':');

                        if(openParts.length === 2 && closeParts.length === 2){
                            let openMins = parseInt(openParts[0]) * 60 + parseInt(openParts[1]);
                            let closeMins = parseInt(closeParts[0]) * 60 + parseInt(closeParts[1]);

                            if(closeMins < openMins) {
                                p.openNow = (currentTotalMinutes >= openMins) || (currentTotalMinutes <= closeMins);
                            } else{
                                p.openNow = (currentTotalMinutes >= openMins) && (currentTotalMinutes < closeMins);
                            }
                        }
                    }
                }
            });
            console.log("成功读取:", allPlaces.length);
            renderCards();
        },
        error: function(error){
            console.error("失败:", error);
            document.getElementById("results-container").innerHTML =
            `<div style="text-align:center; color:red; padding:2rem;">Failed to load data. 请检查网络或 CSV 链接。</div>`;
        }
    });
}
//  渲染函数 
function renderCards() {
    const container = document.getElementById("results-container");
    const pageTitle = document.getElementById("page-title");
    
    if (!container) return;

    // 过滤逻辑
    let filtered = applyFilters(allPlaces);
    
    // 更新标题
    if (pageTitle) {
        pageTitle.innerText = currentTab === "food" ? "Where to eat" : "Where to go";
    }
    
    // 空状态处理
    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color: #663399;">✨ No spots match your filters ✨</div>`;
        return;
    }
    
    // 生成 HTML
    container.innerHTML = filtered.map(p => `
        <article class="location-card">
            ${p.image ?
                `<img src="${p.image}" class="card-img" alt="${p.name}>`:
                `<div class="card-img"></div>`
            }
            <div class="card-info">
                <div class="card-header">
                    <h3>${p.name}</h3>
                    <span class="price">${p.price === 0 ? "Free" : "$" + p.price}</span>
                </div>
                <div class="description">${p.desc}</div>
                <div class="address">
                    📍 <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.address)}" 
                          target="_blank" 
                          rel="noopener" 
                          style="color: var(--purple-dark); text-decoration: underline; font-weight: bold;">
                        ${p.address} 
                    </a>
                </div>
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

// 随机挑选逻辑 
function randomPick() {
    if (pickingNow) return;

    let filtered = applyFilters(allPlaces);
    
    if (filtered.length === 0) {
        alert("No spots match current category/filters!");
        return;
    }
    
    const picked = filtered[Math.floor(Math.random() * filtered.length)];
    pickingNow = true;
    openPickRoll(filtered, picked);
}

//  暴露给组员的接口 
window.updateCardFilters = function(newFilters) {
    Object.assign(filters, newFilters);
    renderCards();
};

window.setHomepageTab = function(tab) {
    currentTab = tab;
    document.body.classList.toggle("food-page", tab === "food");
    document.body.classList.toggle("place-page", tab === "place");
    // 切换按钮激活状态
    document.getElementById("tab-food")?.classList.toggle("active", tab === "food");
    document.getElementById("tab-place")?.classList.toggle("active", tab === "place");
    renderCards();
};

//  初始化与事件绑定 
document.addEventListener('DOMContentLoaded', () => {
    loadDataFromSheet();

    // 绑定 Tab
    document.getElementById("tab-food")?.addEventListener("click", () => setHomepageTab("food"));
    document.getElementById("tab-place")?.addEventListener("click", () => setHomepageTab("place"));

    // 绑定侧边栏过滤器
    document.getElementById("Open-right-now")?.addEventListener("change", e => {
        window.updateCardFilters({ openNow: e.target.checked });
    });

    document.getElementById("discount-only")?.addEventListener("change", e => {
        window.updateCardFilters({ discountOnly: e.target.checked });
    });

    // 价格滑动条逻辑
    Object.values(tagGroups).flat().forEach(tagId => {
        document.getElementById(tagId)?.addEventListener("change", e => {
            const selectedTags = new Set(filters.tags);
            if (e.target.checked) {
                selectedTags.add(tagId);
            } else {
                selectedTags.delete(tagId);
            }
            window.updateCardFilters({ tags: Array.from(selectedTags) });
        });
    });

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
