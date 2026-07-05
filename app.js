// Updated with your brand new deployment link
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwQVgzXzuvi0lgc16tsKJ27p8U5XCOSyNBFkRpK86MlLl2ZxslOqpBTDGFxaWEYacL0LA/exec";

let inventory = [];
let activeTab = 'calculators';

// 1. Database Fetch Engine
async function initializeApp() {
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '<div class="loading-message" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;"><i class="fa-solid fa-spinner fa-spin"></i> Loading live inventory...</div>';
    
    try {
        const response = await fetch(SCRIPT_URL);
        if (!response.ok) throw new Error("Network response was not ok");
        
        inventory = await response.json();
        
        // Render the items onto the screen
        loadItems();
    } catch (error) {
        console.error("Failed to fetch inventory:", error);
        grid.innerHTML = '<div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #dc3545;"><i class="fa-solid fa-triangle-exclamation"></i> Error connecting to live inventory database.</div>';
    }
}

function changeScreen(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    window.scrollTo(0, 0);
}

function switchCategory(targetCat) {
    activeTab = targetCat;
    
    document.getElementById('tab-calculators').classList.toggle('active', targetCat === 'calculators');
    document.getElementById('tab-drafting').classList.toggle('active', targetCat === 'drafting');
    
    loadItems();
}

// 2. Visual Layout Compiler
function loadItems() {
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = ''; 
    
    if (!inventory || inventory.length === 0) return;
    
    // Filters rows matching your active navigation categories
    const list = inventory.filter(i => i.category === activeTab);
    
    list.forEach(i => {
        // Enforces strong numerical matching for empty/string sheet rows
        const itemStock = parseInt(i.stock, 10) || 0;
        const outOfStock = itemStock <= 0;
        
        const card = document.createElement('div');
        card.className = `card ${outOfStock ? 'out-of-stock' : ''}`;
        
        let graphic = '';
        if (i.img && i.img.trim() !== "") {
            graphic = `<img src="${i.img}" alt="${i.name}">`;
        } else {
            let svg = i.type === 'calc'
                ? `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="3" width="14" height="18" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="10" y2="11"/><line x1="14" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="10" y2="15"/><line x1="14" y1="15" x2="16" y2="15"/></svg>`
                : `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 22L22 2H2V22Z"/><path d="M6 18L18 6H6V18Z" stroke-dasharray="2 2"/></svg>`;
            
            graphic = `<div class="fallback-svg-box">${svg}<p class="fallback-label">Image Pending</p></div>`;
        }

        card.innerHTML = `
            <div>
                <div class="img-container">${graphic}</div>
                <div class="item-name">${i.name}</div>
                <span class="badge ${outOfStock ? 'badge-unavailable' : 'badge-available'}">
                    <i class="fa-solid ${outOfStock ? 'fa-circle-xmark' : 'fa-circle-check'}"></i>
                    ${outOfStock ? 'Out of Stock' : `Available (${itemStock})`}
                </span>
            </div>
            <button onclick="${outOfStock ? '' : `borrowItem('${i.name.replace(/'/g, "\\'")}', this)`}" class="btn ${outOfStock ? 'btn-disabled' : ''}">
                ${outOfStock ? 'Unavailable' : 'Borrow Now'}
            </button>
        `;
        grid.appendChild(card);
    });
}

// Kick off initialization on load
initializeApp();
