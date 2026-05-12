// ========== UCSD 周边数据（照片稍后自己添加） ==========
const allPlaces = [
    { id: 1, name: "RakiRaki Ramen", category: "food", price: 12, rating: 4.5, openNow: true, hasDiscount: true, discountDesc: "10% off UCSD ID", desc: "Rich tonkotsu broth, spicy miso ramen.", address: "4646 Convoy St", hours: "11:00-22:00", url: "https://rakirakiramen.com" },
    { id: 2, name: "Shake Shack UTC", category: "food", price: 15, rating: 4.3, openNow: true, hasDiscount: false, discountDesc: "", desc: "Famous burgers and shakes.", address: "4545 La Jolla Village Dr", hours: "10:00-21:00", url: "https://shakeshack.com" },
    { id: 3, name: "Tapioca Express", category: "food", price: 8, rating: 4.0, openNow: true, hasDiscount: true, discountDesc: "$1 off large drink", desc: "Boba tea and popcorn chicken.", address: "9737 Judicial Way", hours: "11:00-23:00", url: "https://tapiocaexpress.com" },
    { id: 4, name: "Coco Ichibanya", category: "food", price: 14, rating: 4.4, openNow: false, hasDiscount: false, discountDesc: "", desc: "Customizable Japanese curry.", address: "8120 Mira Mesa Blvd", hours: "11:00-21:00", url: "https://ichibanyausa.com" },
    { id: 5, name: "The Taco Stand", category: "food", price: 9, rating: 4.6, openNow: true, hasDiscount: false, discountDesc: "", desc: "Al pastor tacos, handmade tortillas.", address: "621 Pearl St", hours: "09:00-22:00", url: "https://thetacostand.com" },
    { id: 6, name: "La Jolla Shores", category: "place", price: 0, rating: 4.8, openNow: true, hasDiscount: false, discountDesc: "", desc: "Kayaking, sunset walks, free beach.", address: "La Jolla Shores Dr", hours: "24/7", url: "https://www.sandiego.gov/lifeguards/beaches/ljshores" },
    { id: 7, name: "Museum of Contemporary Art", category: "place", price: 15, rating: 4.2, openNow: false, hasDiscount: true, discountDesc: "Free for UCSD students", desc: "Contemporary art + beautiful coastal terrace.", address: "700 Prospect St", hours: "10:00-17:00", url: "https://www.mcasd.org" },
    { id: 8, name: "Torrey Pines Gliderport", category: "place", price: 5, rating: 4.7, openNow: true, hasDiscount: true, discountDesc: "Student $20 off lessons", desc: "Hang gliding & cliff trails.", address: "2800 Torrey Pines Scenic Dr", hours: "09:00-18:00", url: "https://flytorreypines.com" },
    { id: 9, name: "Birch Aquarium", category: "place", price: 20, rating: 4.5, openNow: true, hasDiscount: true, discountDesc: "$5 off with UCSD ID", desc: "Marine life & tidepools.", address: "2300 Expedition Way", hours: "09:00-17:00", url: "https://aquarium.ucsd.edu" }
];

let currentTab = "food";
let filters = { openNow: false, minPrice: 0, maxPrice: 50, discountOnly: false };
const container = document.getElementById("results-container");
const pageTitle = document.getElementById("page-title");

function renderCards() {
    if (!container) return;
    let filtered = allPlaces.filter(p => p.category === currentTab);
    filtered = filtered.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    if (filters.openNow) filtered = filtered.filter(p => p.openNow);
    if (filters.discountOnly) filtered = filtered.filter(p => p.hasDiscount);
    pageTitle.innerText = currentTab === "food" ? "🍔 Food Spots around UCSD" : "🌴 Places & Attractions";
    if (filtered.length === 0) {
        container.innerHTML = `<div class="location-card" style="grid-column:1/-1; text-align:center; padding:2rem;">✨ No spots match your filters. Try adjusting price or open now ✨</div>`;
        return;
    }
    const cardsHtml = filtered.map(place => {
        const priceSymbol = place.price === 0 ? "Free" : `$${place.price}`;
        const discountBadge = place.hasDiscount ? `<span class="discount-badge">🎁 ${place.discountDesc}</span>` : "";
        const statusClass = place.openNow ? "status-open" : "status-closed";
        const statusText = place.openNow ? "🟢 Open now" : "🔴 Closed now";
        return `
            <article class="location-card">
                <div class="card-img"></div>
                <div class="card-info">
                    <div class="card-header"><h3>${place.name}</h3><span class="price">${priceSymbol}</span></div>
                    <div class="description">${place.desc}</div>
                    <div class="address">📍 ${place.address}</div>
                    <div class="hours">🕒 ${place.hours}</div>
                    <div class="badge-row"><span class="status-badge ${statusClass}">${statusText}</span>${discountBadge}</div>
                    <div class="official-link"><a href="${place.url}" target="_blank" rel="noopener">official site →</a></div>
                </div>
            </article>
        `;
    }).join('');
    container.innerHTML = cardsHtml;
}

function randomPick() {
    let filtered = allPlaces.filter(p => p.category === currentTab);
    filtered = filtered.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    if (filters.openNow) filtered = filtered.filter(p => p.openNow);
    if (filters.discountOnly) filtered = filtered.filter(p => p.hasDiscount);
    if (filtered.length === 0) { alert("No spots match filters"); return; }
    const lucky = filtered[Math.floor(Math.random() * filtered.length)];
    alert(`🎉 Random pick: ${lucky.name}!`);
    const cards = document.querySelectorAll('.location-card');
    for (let card of cards) {
        if (card.querySelector('h3')?.innerText === lucky.name) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.boxShadow = '0 0 0 3px #663399';
            setTimeout(() => card.style.boxShadow = '', 1000);
            break;
        }
    }
}

window.updateCardFilters = function(newFilters) {
    if (newFilters.openNow !== undefined) filters.openNow = newFilters.openNow;
    if (newFilters.minPrice !== undefined) filters.minPrice = newFilters.minPrice;
    if (newFilters.maxPrice !== undefined) filters.maxPrice = newFilters.maxPrice;
    if (newFilters.discountOnly !== undefined) filters.discountOnly = newFilters.discountOnly;
    renderCards();
};
window.setHomepageTab = function(tab) {
    currentTab = tab;
    renderCards();
};
window.triggerRandomPick = randomPick;

// 初始化渲染
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderCards);
else renderCards();