let ALL_PRODUCTS = [];

async function loadProducts() {
  ALL_PRODUCTS = window.SMARTBASH_PRODUCTS || [];
  return ALL_PRODUCTS;
}

function productCard(p) {
  return `
    <div class="product-card">
      <img src="${p.image}" alt="${escapeHtml(p.title)}" loading="lazy">
      <div class="product-card-body">
        <h3>${escapeHtml(p.title)}</h3>
        <div class="price">$${p.price}</div>
        <div class="vendor">${escapeHtml(p.vendor)}</div>
        <button class="view-btn" onclick="openProductModal('${p.handle}')">View & Buy</button>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function renderCarousel(products, containerId) {
  const el = document.getElementById(containerId);
  el.innerHTML = products.map(productCard).join('');
}

function renderGrid(products, containerId) {
  const el = document.getElementById(containerId);
  el.innerHTML = products.map(productCard).join('');
}

function openProductModal(handle) {
  const p = ALL_PRODUCTS.find(x => x.handle === handle);
  if (!p) return;
  const overlay = document.getElementById('product-modal');
  overlay.innerHTML = `
    <div class="modal-box">
      <img src="${p.image}" alt="${escapeHtml(p.title)}">
      <div class="modal-content" style="position:relative;">
        <button class="modal-close" onclick="closeProductModal()">&times;</button>
        <h2 style="font-size:1.4rem; margin-bottom:8px;">${escapeHtml(p.title)}</h2>
        <div class="price" style="font-size:1.3rem; margin-bottom:14px;">$${p.price}</div>
        <div class="description">${p.description}</div>
        <div class="buy-button-slot" data-handle="${p.handle}">
          <div class="placeholder-note">Buy Button goes here — generate from Shopify Admin → Sales Channels → Buy Button for this product, then paste the embed code into the matching slot in this file.</div>
        </div>
      </div>
    </div>
  `;
  overlay.classList.add('active');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('active');
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'product-modal') closeProductModal();
});
