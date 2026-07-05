const items = [
    { name: "CASIO fx-570 ES PLUS", stock: 2, category: "calculators", type: "calc", img: "casio570.png" },
    { name: "CASIO fx-991 ES PLUS", stock: 1, category: "calculators", type: "calc", img: "casio991.png" },
    { name: 'CASIO fx-350 ES PLUS', stock: 1, category: 'calculators', type: 'calc', img: 'casio350.png' },
    { name: "SHARP EL-W531TH", stock: 1, category: "calculators", type: "calc", img: "sharp.png" },
    { name: "KARCE KC-5991", stock: 10, category: "calculators", type: "calc", img: "karce.png" },
    
    // TODO: add real images for rulers later
    { name: "Standard T-Square (_\")", stock: 0, category: "drafting", type: "draft", img: "tsquare.png" },
    { name: "__x__ Triangle Ruler", stock: 0, category: "drafting", type: "draft", img: "" },
    { name: "__x__ Triangle Ruler", stock: 0, category: "drafting", type: "draft", img: "" }
];

let activeTab = 'calculators';

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

function loadItems() {
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = ''; 
    
    // Uses your activeTab system to filter your local state
    const list = inventory.filter(i => i.category === activeTab);
    
    list.forEach(i => {
        const outOfStock = i.stock <= 0;
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

        // Modernized inner HTML with icons next to the text inside the badge structures
        card.innerHTML = `
            <div>
                <div class="img-container">${graphic}</div>
                <div class="item-name">${i.name}</div>
                <span class="badge ${outOfStock ? 'badge-unavailable' : 'badge-available'}">
                    <i class="fa-solid ${outOfStock ? 'fa-circle-xmark' : 'fa-circle-check'}"></i>
                    ${outOfStock ? 'Out of Stock' : `Available (${i.stock})`}
                </span>
            </div>
            <button onclick="${outOfStock ? '' : `borrowItem('${i.name.replace(/'/g, "\\'")}', this)`}" class="btn ${outOfStock ? 'btn-disabled' : ''}">
                ${outOfStock ? 'Unavailable' : 'Borrow Now'}
            </button>
        `;
grid.appendChild(card);
    });
}

loadItems(); // Or initializeApp(); depending on what your start function is named!
