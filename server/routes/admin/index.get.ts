import { defineEventHandler, setResponseHeader, sendRedirect } from 'h3';
import { verifyAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const auth = await verifyAuth(event);
  if (!auth) {
    return sendRedirect(event, '/admin/login');
  }

  setResponseHeader(event, 'content-type', 'text/html; charset=utf-8');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MBOS Admin - Product & AI Agent Management</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(19, 26, 43, 0.7);
      --border: rgba(255, 255, 255, 0.08);
      --border-focus: #38bdf8;
      --accent: #0ea5e9;
      --accent-hover: #38bdf8;
      --neon: #00e699;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --danger: #ef4444;
      --danger-hover: #f87171;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #090d16;
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header.top-nav {
      background: rgba(13, 19, 33, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 40;
    }
    .brand-area {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .brand-area img {
      height: 32px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
    }
    .brand-area .badge-admin {
      background: rgba(14, 165, 233, 0.15);
      color: #38bdf8;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 0.35rem;
      border: 1px solid rgba(14, 165, 233, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .badge-neon-status {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(0, 230, 153, 0.1);
      color: var(--neon);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.3rem 0.7rem;
      border-radius: 9999px;
      border: 1px solid rgba(0, 230, 153, 0.2);
    }
    .badge-neon-status::before {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--neon);
      box-shadow: 0 0 10px var(--neon);
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 0.9rem;
      border-radius: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-outline {
      background: rgba(255, 255, 255, 0.04);
      border-color: var(--border);
      color: var(--text-muted);
    }
    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }
    .btn-primary {
      background: linear-gradient(135deg, #0ea5e9, #2563eb);
      color: #fff;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #38bdf8, #1d4ed8);
    }
    .btn-danger {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }
    .btn-danger:hover {
      background: rgba(239, 68, 68, 0.25);
      color: #fff;
    }
    .main-layout {
      max-width: 1320px;
      width: 100%;
      margin: 0 auto;
      padding: 1.5rem;
      flex: 1;
    }
    .tabs-header {
      display: flex;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.5rem;
      overflow-x: auto;
    }
    .tab-btn {
      padding: 0.75rem 1.25rem;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      position: relative;
      transition: color 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .tab-btn:hover {
      color: #fff;
    }
    .tab-btn.active {
      color: #38bdf8;
    }
    .tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: #38bdf8;
      box-shadow: 0 0 12px #38bdf8;
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      padding: 1.25rem;
      backdrop-filter: blur(8px);
    }
    .stat-title {
      font-size: 0.8rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }
    .stat-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: #fff;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }
    .search-inputs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      flex: 1;
      max-width: 600px;
    }
    .input-field, .select-field {
      padding: 0.55rem 0.85rem;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      color: #fff;
      font-size: 0.85rem;
      outline: none;
    }
    .input-field:focus, .select-field:focus {
      border-color: var(--border-focus);
    }
    .input-search {
      flex: 1;
      min-width: 180px;
    }
    .products-table-container {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      overflow: hidden;
      backdrop-filter: blur(8px);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.875rem;
    }
    thead th {
      background: rgba(15, 23, 42, 0.9);
      padding: 0.85rem 1rem;
      color: var(--text-muted);
      font-weight: 600;
      border-bottom: 1px solid var(--border);
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }
    tbody tr {
      border-bottom: 1px solid var(--border);
      transition: background 0.15s ease;
    }
    tbody tr:hover {
      background: rgba(255, 255, 255, 0.02);
    }
    tbody td {
      padding: 0.85rem 1rem;
      vertical-align: middle;
    }
    .product-thumb {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: 0.4rem;
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--border);
    }
    .badge-pill {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 0.35rem;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.06);
      color: #cbd5e1;
    }
    /* Modal */
    .modal-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(6px);
      z-index: 100;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .modal-backdrop.open {
      display: flex;
    }
    .modal-panel {
      background: #111827;
      border: 1px solid var(--border);
      border-radius: 1rem;
      width: 100%;
      max-width: 650px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .modal-title {
      font-size: 1.25rem;
      font-weight: 700;
    }
    .modal-close {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.5rem;
      cursor: pointer;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .form-full {
      grid-column: 1 / -1;
    }
    label.field-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: #cbd5e1;
      margin-bottom: 0.4rem;
    }
    textarea.input-field {
      width: 100%;
      min-height: 90px;
      resize: vertical;
    }
    /* Image Upload Dropzone */
    .upload-zone {
      border: 2px dashed rgba(14, 165, 233, 0.4);
      background: rgba(14, 165, 233, 0.04);
      border-radius: 0.75rem;
      padding: 1.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    .upload-zone:hover {
      border-color: #38bdf8;
      background: rgba(14, 165, 233, 0.08);
    }
    .upload-preview {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 0.75rem;
      background: rgba(0,0,0,0.3);
      padding: 0.5rem;
      border-radius: 0.5rem;
    }
    .upload-preview img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 0.35rem;
    }
    /* AI Agent Card */
    .ai-hero-card {
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(99, 102, 241, 0.1));
      border: 1px solid rgba(14, 165, 233, 0.3);
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .code-block {
      background: #030712;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 1rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: #38bdf8;
      overflow-x: auto;
      margin-top: 0.5rem;
    }
    .copy-btn {
      float: right;
      padding: 0.2rem 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #fff;
      font-size: 0.75rem;
      border-radius: 0.25rem;
      cursor: pointer;
    }
    .copy-btn:hover { background: rgba(255, 255, 255, 0.2); }
  </style>
</head>
<body>
  <header class="top-nav">
    <div class="brand-area">
      <img src="/img/logo/logo1.png" alt="MBOS" onerror="this.style.display='none'">
      <span class="badge-admin">Management</span>
      <span class="badge-neon-status">Neon Postgres + Storage</span>
    </div>
    <div class="nav-actions">
      <a href="/home" target="_blank" class="btn btn-outline">&nearr; View Website</a>
      <button class="btn btn-outline" onclick="logout()">Sign Out</button>
    </div>
  </header>

  <main class="main-layout">
    <div class="tabs-header">
      <button class="tab-btn active" onclick="switchTab('products')">&#128083; Products</button>
      <button class="tab-btn" onclick="switchTab('banners')">&#128444; Banners & Carousel</button>
      <button class="tab-btn" onclick="switchTab('sections')">&#9998; Website Content</button>
      <button class="tab-btn" onclick="switchTab('ai')">&#129302; AI Agent Integrations</button>
    </div>

    <!-- PRODUCTS TAB -->
    <div id="tab-products" class="tab-content active">
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-title">Total Products</div>
          <div class="stat-value" id="statTotalProducts">-</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">In Stock Balance</div>
          <div class="stat-value" id="statTotalStock">-</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Categories</div>
          <div class="stat-value" id="statCategories">-</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Brands</div>
          <div class="stat-value" id="statBrands">-</div>
        </div>
      </div>

      <div class="toolbar">
        <div class="search-inputs">
          <input type="text" id="searchInput" class="input-field input-search" placeholder="Search products by title or description..." oninput="filterProducts()">
          <select id="categoryFilter" class="select-field" onchange="filterProducts()">
            <option value="">All Categories</option>
          </select>
          <select id="brandFilter" class="select-field" onchange="filterProducts()">
            <option value="">All Brands</option>
          </select>
        </div>
        <button class="btn btn-primary" onclick="openProductModal()">+ Add New Product</button>
      </div>

      <div class="products-table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 60px;">Image</th>
              <th style="width: 60px;">ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Stock</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="productsTableBody">
            <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 3rem;">Loading products from Neon Postgres...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- BANNERS TAB -->
    <div id="tab-banners" class="tab-content">
      <div class="toolbar">
        <h2>Homepage Carousel & Banners</h2>
        <button class="btn btn-primary" onclick="openBannerModal()">+ Add New Banner</button>
      </div>
      <div class="products-table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 100px;">Preview</th>
              <th>Order</th>
              <th>Remarks / Title</th>
              <th>Visibility</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="bannersTableBody">
            <tr><td colspan="5" style="text-align: center; padding: 2rem;">Loading banners...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECTIONS TAB -->
    <div id="tab-sections" class="tab-content">
      <div class="toolbar">
        <h2>Website Sections & Contact Info</h2>
      </div>
      <div class="products-table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 60px;">ID</th>
              <th>Section Name</th>
              <th>Phone / Text 1</th>
              <th>WhatsApp / Text 2</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody id="sectionsTableBody">
            <tr><td colspan="5" style="text-align: center; padding: 2rem;">Loading sections...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- AI AGENTS TAB -->
    <div id="tab-ai" class="tab-content">
      <div class="ai-hero-card">
        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #fff;">&#129302; AI Agent Automation Hub</h2>
        <p style="color: #cbd5e1; line-height: 1.6; max-width: 800px;">
          Other AI agents (OpenAI, Claude, Antigravity, Cursor, LangChain) can manage your products, upload images to Neon S3, update banners, and edit website text via the dedicated API.
        </p>

        <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <a href="/api/ai/openapi" target="_blank" class="btn btn-primary">&#128196; OpenAPI 3.1 Spec</a>
          <a href="/api/ai/tools" target="_blank" class="btn btn-outline">&#129520; Function Calling Spec</a>
          <a href="/api/ai/instructions" target="_blank" class="btn btn-outline">&#128214; Agent Instructions (Markdown)</a>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        <div class="stat-card">
          <h3 style="margin-bottom: 0.5rem;">Agent Authentication</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">Include this header in requests made by automated agents:</p>
          <div class="code-block">
            <button class="copy-btn" onclick="copyText('X-API-Key: mbos_ai_agent_secret_key')">Copy</button>
            X-API-Key: mbos_ai_agent_secret_key
          </div>
        </div>

        <div class="stat-card">
          <h3 style="margin-bottom: 0.5rem;">Example: Create Product via cURL</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">Quick command for AI scripts:</p>
          <div class="code-block" style="font-size: 0.75rem;">
            <button class="copy-btn" onclick="copyText(curlExample)">Copy</button>
            curl -X POST https://your-site/api/v1/products \\<br>
            &nbsp;&nbsp;-H "X-API-Key: mbos_ai_agent_secret_key" \\<br>
            &nbsp;&nbsp;-H "Content-Type: application/json" \\<br>
            &nbsp;&nbsp;-d '{"name": "Safety Glasses Pro", "balance": 50}'
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- PRODUCT MODAL -->
  <div id="productModal" class="modal-backdrop">
    <div class="modal-panel">
      <div class="modal-header">
        <h3 class="modal-title" id="modalProductTitle">Add New Product</h3>
        <button class="modal-close" onclick="closeProductModal()">&times;</button>
      </div>

      <form id="productForm">
        <input type="hidden" id="prodId">
        <div class="form-grid">
          <div class="form-full">
            <label class="field-label">Product Name *</label>
            <input type="text" id="prodName" class="input-field" style="width: 100%;" required placeholder="e.g. Plano Safety Spectacle 801">
          </div>

          <div>
            <label class="field-label">Category</label>
            <select id="prodCategory" class="select-field" style="width: 100%;">
              <option value="">No Category</option>
            </select>
          </div>

          <div>
            <label class="field-label">Brand</label>
            <select id="prodBrand" class="select-field" style="width: 100%;">
              <option value="">No Brand</option>
            </select>
          </div>

          <div>
            <label class="field-label">Stock Balance</label>
            <input type="number" id="prodBalance" class="input-field" style="width: 100%;" value="100">
          </div>

          <div>
            <label class="field-label">Primary Image Key</label>
            <input type="text" id="prodImgUrl" class="input-field" style="width: 100%;" placeholder="images/uploads/...">
          </div>

          <!-- Image Upload to Neon Storage -->
          <div class="form-full">
            <label class="field-label">Upload Product Image (Direct to Neon S3)</label>
            <div class="upload-zone" onclick="document.getElementById('fileInput').click()">
              <input type="file" id="fileInput" accept="image/*" style="display: none;" onchange="handleFileUpload(event)">
              <div id="uploadPrompt">
                &#128247; <strong>Click to upload image</strong> or drag and drop<br>
                <span style="font-size: 0.75rem; color: var(--text-muted);">PNG, JPG, WEBP stored in Neon Object Storage</span>
              </div>
              <div id="uploadProgress" style="display: none; color: #38bdf8;">Uploading to Neon S3...</div>
            </div>
            <div id="previewContainer" class="upload-preview" style="display: none;">
              <img id="previewImg" src="" alt="preview">
              <div style="flex: 1; font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis;" id="previewUrl"></div>
            </div>
          </div>

          <div class="form-full">
            <label class="field-label">Short Description</label>
            <input type="text" id="prodShortDesc" class="input-field" style="width: 100%;" placeholder="Brief feature summary">
          </div>

          <div class="form-full">
            <label class="field-label">Full Description (HTML / Details)</label>
            <textarea id="prodDesc" class="input-field" placeholder="Full specifications, standards (e.g. ANSI Z87.1)..."></textarea>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
          <button type="button" class="btn btn-outline" onclick="closeProductModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="saveProductBtn">Save Product</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    let allProducts = [];
    let allCategories = [];
    let allBrands = [];
    const curlExample = 'curl -X POST https://your-site/api/v1/products -H "X-API-Key: mbos_ai_agent_secret_key" -H "Content-Type: application/json" -d \'{"name": "Safety Glasses Pro", "balance": 50}\'';

    function switchTab(name) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById('tab-' + name).classList.add('active');

      if (name === 'banners') loadBanners();
      if (name === 'sections') loadSections();
    }

    async function init() {
      await loadInitialData();
    }

    async function loadInitialData() {
      try {
        const res = await fetch('/api/v1/products');
        const data = await res.json();
        allProducts = data.products || [];
        allCategories = data.categories || [];
        allBrands = data.brands || [];

        // Stats
        document.getElementById('statTotalProducts').textContent = allProducts.length;
        const totalStock = allProducts.reduce((sum, p) => sum + (p.balance || 0), 0);
        document.getElementById('statTotalStock').textContent = totalStock;
        document.getElementById('statCategories').textContent = allCategories.length;
        document.getElementById('statBrands').textContent = allBrands.length;

        // Category filter options
        const catSelect = document.getElementById('categoryFilter');
        const modalCatSelect = document.getElementById('prodCategory');
        catSelect.innerHTML = '<option value="">All Categories</option>' + allCategories.map(c => \`<option value="\${c.id}">\${c.name}</option>\`).join('');
        modalCatSelect.innerHTML = '<option value="">No Category</option>' + allCategories.map(c => \`<option value="\${c.id}">\${c.name}</option>\`).join('');

        // Brand filter options
        const brandSelect = document.getElementById('brandFilter');
        const modalBrandSelect = document.getElementById('prodBrand');
        brandSelect.innerHTML = '<option value="">All Brands</option>' + allBrands.map(b => \`<option value="\${b.id}">\${b.name}</option>\`).join('');
        modalBrandSelect.innerHTML = '<option value="">No Brand</option>' + allBrands.map(b => \`<option value="\${b.id}">\${b.name}</option>\`).join('');

        renderProducts(allProducts);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }

    function renderProducts(products) {
      const tbody = document.getElementById('productsTableBody');
      if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 3rem;">No products found matching filters.</td></tr>';
        return;
      }

      tbody.innerHTML = products.map(p => {
        const cat = allCategories.find(c => c.id === p.category_id);
        const brand = allBrands.find(b => b.id === p.brand_id);
        const img = p.img_url ? (p.img_url.startsWith('http') ? p.img_url : \`https://br-floral-tree-b35p9voh.storage.c-4.ap-southeast-1.aws.neon.tech/assets/\${p.img_url}\`) : '/img/product/placeholder.jpg';

        return \`
          <tr>
            <td>
              <img src="\${img}" class="product-thumb" onerror="this.src='/img/logo/logo1.png'">
            </td>
            <td><span class="badge-pill">#\${p.id}</span></td>
            <td>
              <div style="font-weight: 600; color: #fff;">\${escapeHtml(p.name)}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">\${escapeHtml(p.short_desc || '')}</div>
            </td>
            <td><span class="badge-pill">\${cat ? escapeHtml(cat.name) : '-'}</span></td>
            <td><span class="badge-pill">\${brand ? escapeHtml(brand.name) : '-'}</span></td>
            <td>
              <span style="font-weight: 600; color: \${(p.balance || 0) > 0 ? '#34d399' : '#f87171'}">\${p.balance ?? 0}</span>
            </td>
            <td style="text-align: right;">
              <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="editProduct(\${p.id})">Edit</button>
              <button class="btn btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="deleteProductPrompt(\${p.id})">Delete</button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function filterProducts() {
      const search = document.getElementById('searchInput').value.toLowerCase();
      const catId = document.getElementById('categoryFilter').value;
      const brandId = document.getElementById('brandFilter').value;

      const filtered = allProducts.filter(p => {
        const matchSearch = !search || (p.name && p.name.toLowerCase().includes(search)) || (p.short_desc && p.short_desc.toLowerCase().includes(search));
        const matchCat = !catId || p.category_id == catId;
        const matchBrand = !brandId || p.brand_id == brandId;
        return matchSearch && matchCat && matchBrand;
      });

      renderProducts(filtered);
    }

    // Product Modal & Upload
    function openProductModal(prod = null) {
      document.getElementById('productForm').reset();
      document.getElementById('previewContainer').style.display = 'none';

      if (prod) {
        document.getElementById('modalProductTitle').textContent = 'Edit Product #' + prod.id;
        document.getElementById('prodId').value = prod.id;
        document.getElementById('prodName').value = prod.name || '';
        document.getElementById('prodCategory').value = prod.category_id || '';
        document.getElementById('prodBrand').value = prod.brand_id || '';
        document.getElementById('prodBalance').value = prod.balance ?? 0;
        document.getElementById('prodImgUrl').value = prod.img_url || '';
        document.getElementById('prodShortDesc').value = prod.short_desc || '';
        document.getElementById('prodDesc').value = prod.desc || '';

        if (prod.img_url) {
          const img = prod.img_url.startsWith('http') ? prod.img_url : \`https://br-floral-tree-b35p9voh.storage.c-4.ap-southeast-1.aws.neon.tech/assets/\${prod.img_url}\`;
          document.getElementById('previewImg').src = img;
          document.getElementById('previewUrl').textContent = prod.img_url;
          document.getElementById('previewContainer').style.display = 'flex';
        }
      } else {
        document.getElementById('modalProductTitle').textContent = 'Add New Product';
        document.getElementById('prodId').value = '';
      }

      document.getElementById('productModal').classList.add('open');
    }

    function closeProductModal() {
      document.getElementById('productModal').classList.remove('open');
    }

    function editProduct(id) {
      const p = allProducts.find(item => item.id == id);
      if (p) openProductModal(p);
    }

    async function handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      const promptBox = document.getElementById('uploadPrompt');
      const progressBox = document.getElementById('uploadProgress');
      promptBox.style.display = 'none';
      progressBox.style.display = 'block';

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/v1/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (res.ok && data.success) {
          document.getElementById('prodImgUrl').value = data.key;
          document.getElementById('previewImg').src = data.url;
          document.getElementById('previewUrl').textContent = data.key;
          document.getElementById('previewContainer').style.display = 'flex';
        } else {
          alert('Upload failed: ' + (data.statusMessage || 'Unknown error'));
        }
      } catch (err) {
        alert('Upload failed: ' + err.message);
      } finally {
        promptBox.style.display = 'block';
        progressBox.style.display = 'none';
      }
    }

    document.getElementById('productForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById('saveProductBtn');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      const id = document.getElementById('prodId').value;
      const payload = {
        name: document.getElementById('prodName').value,
        category_id: document.getElementById('prodCategory').value || null,
        brand_id: document.getElementById('prodBrand').value || null,
        balance: parseInt(document.getElementById('prodBalance').value, 10) || 0,
        img_url: document.getElementById('prodImgUrl').value || null,
        short_desc: document.getElementById('prodShortDesc').value || null,
        desc: document.getElementById('prodDesc').value || null,
      };

      try {
        const url = id ? \`/api/v1/products/\${id}\` : '/api/v1/products';
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok && data.success) {
          closeProductModal();
          await loadInitialData();
        } else {
          alert('Failed to save product: ' + (data.statusMessage || 'Error'));
        }
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Product';
      }
    });

    async function deleteProductPrompt(id) {
      if (!confirm(\`Are you sure you want to delete product #\${id}?\`)) return;

      try {
        const res = await fetch(\`/api/v1/products/\${id}\`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok && data.success) {
          await loadInitialData();
        } else {
          alert('Failed to delete: ' + (data.statusMessage || 'Error'));
        }
      } catch (err) {
        alert('Error deleting product: ' + err.message);
      }
    }

    // Banners
    async function loadBanners() {
      try {
        const res = await fetch('/api/v1/banners');
        const banners = await res.json();
        const tbody = document.getElementById('bannersTableBody');

        if (banners.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No banners configured.</td></tr>';
          return;
        }

        tbody.innerHTML = banners.map(b => {
          const img = b.img_url ? (b.img_url.startsWith('http') ? b.img_url : \`https://br-floral-tree-b35p9voh.storage.c-4.ap-southeast-1.aws.neon.tech/assets/\${b.img_url}\`) : '';
          return \`
            <tr>
              <td><img src="\${img}" class="product-thumb" style="width: 80px; height: 40px;"></td>
              <td><span class="badge-pill">#\${b.order || 0}</span></td>
              <td>\${escapeHtml(b.remarks || 'Hero Banner')}</td>
              <td><span class="badge-pill" style="color: \${b.is_show ? '#34d399' : '#94a3b8'}">\${b.is_show ? 'Visible' : 'Hidden'}</span></td>
              <td style="text-align: right;">
                <button class="btn btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="deleteBannerPrompt(\${b.id})">Delete</button>
              </td>
            </tr>
          \`;
        }).join('');
      } catch (err) {
        console.error('Error loading banners:', err);
      }
    }

    async function deleteBannerPrompt(id) {
      if (!confirm('Delete banner?')) return;
      await fetch(\`/api/v1/banners/\${id}\`, { method: 'DELETE' });
      loadBanners();
    }

    // Sections
    async function loadSections() {
      try {
        const res = await fetch('/api/v1/sections');
        const sections = await res.json();
        const tbody = document.getElementById('sectionsTableBody');

        tbody.innerHTML = sections.map(s => \`
          <tr>
            <td><span class="badge-pill">#\${s.id}</span></td>
            <td><strong>\${escapeHtml(s.name)}</strong></td>
            <td>\${escapeHtml(s.plain_content1 || '-')}</td>
            <td>\${escapeHtml(s.plain_content2 || '-')}</td>
            <td style="text-align: right;">
              <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="promptEditSection(\${s.id}, '\${escapeHtml(s.plain_content1 || '')}', '\${escapeHtml(s.plain_content2 || '')}')">Edit</button>
            </td>
          </tr>
        \`).join('');
      } catch (err) {
        console.error('Error loading sections:', err);
      }
    }

    async function promptEditSection(id, val1, val2) {
      const p1 = prompt('Enter Phone or Text 1:', val1);
      if (p1 === null) return;
      const p2 = prompt('Enter WhatsApp Link or Text 2:', val2);
      if (p2 === null) return;

      await fetch(\`/api/v1/sections/\${id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plain_content1: p1, plain_content2: p2 })
      });
      loadSections();
    }

    async function logout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    }

    function copyText(str) {
      navigator.clipboard.writeText(str);
      alert('Copied to clipboard!');
    }

    function escapeHtml(text) {
      if (!text) return '';
      return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    window.addEventListener('DOMContentLoaded', init);
  </script>
</body>
</html>`;
});
