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
        <div class="buy-button-slot" id="buy-button-slot" data-handle="${p.handle}"></div>
      </div>
    </div>
  `;
  overlay.classList.add('active');
  renderBuyButton(p.handle);
}

let shopifyBuyClient = null;

function getShopifyBuyClient(callback) {
  if (window.ShopifyBuy && window.ShopifyBuy.UI) {
    if (!shopifyBuyClient) {
      shopifyBuyClient = window.ShopifyBuy.buildClient(SHOPIFY_BUY_CONFIG);
    }
    callback(shopifyBuyClient);
    return;
  }
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  script.onload = () => {
    shopifyBuyClient = window.ShopifyBuy.buildClient(SHOPIFY_BUY_CONFIG);
    callback(shopifyBuyClient);
  };
  document.head.appendChild(script);
}

function renderBuyButton(handle) {
  const slot = document.getElementById('buy-button-slot');
  const productId = BUY_BUTTON_PRODUCT_IDS[handle];
  if (!productId) {
    slot.innerHTML = '<div class="placeholder-note">Buy Button coming soon for this product.</div>';
    return;
  }
  slot.innerHTML = '';
  getShopifyBuyClient((client) => {
    window.ShopifyBuy.UI.onReady(client).then((ui) => {
      ui.createComponent('product', {
        id: productId,
        node: slot,
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: {
          product: {
            styles: { product: { '@media (min-width: 601px)': { 'max-width': '100%', 'margin-left': '0', 'margin-bottom': '0' } } },
            text: { button: 'Add to cart' }
          },
          modalProduct: {
            contents: { img: false, imgWithCarousel: true, button: false, buttonWithQuantity: true },
            text: { button: 'Add to cart' }
          },
          cart: { text: { total: 'Subtotal', button: 'Checkout' } },
          toggle: {}
        }
      });
    });
  });
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('active');
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'product-modal') closeProductModal();
});
