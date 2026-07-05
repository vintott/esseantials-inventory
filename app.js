// Ensure this URL exactly matches your newest deployment link!
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwEXFsr4IzIWJ_jpq_PT1M0UFZpMU2vxsUch3-RxkZciAzSAMXNRBYucwbJzufp92cOIw/exec";

let inventory = [];
let activeTab = 'calculators';

// 1. Live Database Sync Engine
async function initializeApp() {
    const grid = document.getElementById('inventory-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="loading-message" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">
                <i class="fa-solid fa-spinner fa-spin"></i> Synchronizing with live council records...
            </div>`;
    }
    
    try {
        console.log("Fetching from:", SCRIPT_URL);
        const response = await fetch(SCRIPT_URL);
        if (!response.ok) throw new Error("Network response was not ok");
        
        // Grab the aggregated items array directly from the sheet API
        inventory = await response.json();
        console.log("Data successfully loaded:", inventory);
        
        // Render the UI cards
        loadItems();
    } catch (error) {
        console.error("Database connection failure:", error);
        if (grid) {
            grid.innerHTML = `
                <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #dc3545;">
                    <i class="fa-solid fa-triangle-exclamation"></i> Error connecting to live inventory database.
                </div>`;
        }
    }
}

function changeScreen(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.add('active');
    window.scrollTo(0, 0);
}

function switchCategory(targetCat) {
    activeTab = targetCat;
    
    const tabCalc = document.getElementById('tab-calculators');
    const tabDraft = document.getElementById('tab-drafting');
    
    if (tabCalc) tabCalc.classList.toggle('active', targetCat === 'calculators');
    if (tabDraft) tabDraft.classList.toggle('active', targetCat === 'drafting');
    
    loadItems();
}

// 2. Dynamic Component Framework Builder
function loadItems() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    grid.innerHTML = ''; 
    
    if (!inventory || inventory.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #666; padding: 2rem;">No items found in this category.</div>`;
        return;
    }
    
    // Filters items based on active workspace tab selection
    const list = inventory.filter(i => i.category === activeTab);
    
    list.forEach(i => {
        // Enforces strong integer casting for inventory level values
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

// Start database integration automatically on page layout load
document.addEventListener("DOMContentLoaded", initializeApp);
