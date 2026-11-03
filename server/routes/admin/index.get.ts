import { defineEventHandler, setResponseHeader, sendRedirect } from 'h3';
import { verifyAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const auth = await verifyAuth(event);
  if (!auth) {
    return sendRedirect(event, '/admin/login');
  }

  setResponseHeader(event, 'content-type', 'text/html; charset=utf-8');

  const homepageEnabled = process.env.HOMEPAGE_CMS_ENABLED === 'true' && Boolean(process.env.ADMIN_API_KEY);

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MBOS Admin - Product & AI Agent Management</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <!-- TinyMCE CDNJS Build (Open-source, zero API key prompt) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js" referrerpolicy="origin"></script>

  <script>
    (function() {
      const savedTheme = localStorage.getItem('mbos_admin_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    })();
  </script>

  <style>
    :root {
      --bg: #090d16;
      --bg-header: rgba(13, 19, 33, 0.85);
      --card-bg: rgba(19, 26, 43, 0.7);
      --modal-bg: #111827;
      --border: rgba(255, 255, 255, 0.08);
      --border-focus: #38bdf8;
      --accent: #0ea5e9;
      --accent-hover: #38bdf8;
      --neon: #00e699;
      --text: #f1f5f9;
      --text-heading: #ffffff;
      --text-muted: #94a3b8;
      --input-bg: rgba(15, 23, 42, 0.7);
      --input-border: rgba(255, 255, 255, 0.12);
      --table-header: rgba(15, 23, 42, 0.9);
      --table-hover: rgba(255, 255, 255, 0.03);
      --badge-bg: rgba(255, 255, 255, 0.06);
      --danger: #ef4444;
      --danger-hover: #f87171;
    }
    [data-theme="light"] {
      --bg: #f8fafc;
      --bg-header: rgba(255, 255, 255, 0.95);
      --card-bg: #ffffff;
      --modal-bg: #ffffff;
      --border: rgba(0, 0, 0, 0.1);
      --border-focus: #0284c7;
      --accent: #0284c7;
      --accent-hover: #0369a1;
      --neon: #059669;
      --text: #1e293b;
      --text-heading: #0f172a;
      --text-muted: #64748b;
      --input-bg: #f8fafc;
      --input-border: #cbd5e1;
      --table-header: #f8fafc;
      --table-hover: #f1f5f9;
      --badge-bg: #e2e8f0;
      --danger: #dc2626;
      --danger-hover: #b91c1c;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    header.top-nav {
      background: var(--bg-header);
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
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    }
    .brand-area .badge-admin {
      background: rgba(14, 165, 233, 0.15);
      color: #0284c7;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 0.35rem;
      border: 1px solid rgba(14, 165, 233, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    [data-theme="dark"] .brand-area .badge-admin {
      color: #38bdf8;
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
      background: var(--card-bg);
      border-color: var(--border);
      color: var(--text);
    }
    .btn-outline:hover {
      background: var(--table-hover);
      border-color: var(--border-focus);
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
      color: var(--danger);
    }
    .btn-danger:hover {
      background: var(--danger);
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
      color: var(--text-heading);
    }
    .tab-btn.active {
      color: var(--accent);
    }
    .tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--accent);
      box-shadow: 0 0 12px var(--accent);
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
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
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
      color: var(--text-heading);
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
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: 0.5rem;
      color: var(--text);
      font-size: 0.85rem;
      outline: none;
      transition: border-color 0.2s ease;
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
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.875rem;
    }
    thead th {
      background: var(--table-header);
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
      background: var(--table-hover);
    }
    tbody td {
      padding: 0.85rem 1rem;
      vertical-align: middle;
    }
    .product-thumb {
      width: 48px;
      height: 48px;
      object-fit: contain;
      border-radius: 0.4rem;
      background: rgba(0,0,0,0.06);
      border: 1px solid var(--border);
    }
    .badge-pill {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 0.35rem;
      font-size: 0.75rem;
      font-weight: 600;
      background: var(--badge-bg);
      color: var(--text);
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
      background: var(--modal-bg);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 1rem;
      width: 100%;
      max-width: 880px;
      max-height: 92vh;
      overflow-y: auto;
      padding: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
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
      color: var(--text-heading);
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
      color: var(--text-muted);
      margin-bottom: 0.4rem;
    }
    textarea.input-field {
      width: 100%;
      min-height: 120px;
      resize: vertical;
    }

    /* 6-Slot Gallery Grid */
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.85rem;
      margin-top: 0.5rem;
    }
    @media (max-width: 768px) {
      .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 480px) {
      .gallery-grid {
        grid-template-columns: 1fr;
      }
    }
    .gallery-slot {
      background: var(--input-bg);
      border: 1px dashed var(--input-border);
      border-radius: 0.6rem;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 160px;
      transition: all 0.2s ease;
      position: relative;
    }
    .gallery-slot.has-image {
      border-style: solid;
      border-color: var(--border);
    }
    .gallery-slot-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }
    .gallery-slot-thumb {
      width: 100%;
      height: 90px;
      object-fit: contain;
      background: rgba(0,0,0,0.06);
      border-radius: 0.4rem;
      margin-bottom: 0.5rem;
    }
    .gallery-slot-empty {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      font-size: 0.75rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.4rem;
    }
    .gallery-slot-empty:hover {
      color: var(--accent);
      background: rgba(14, 165, 233, 0.05);
    }
    .gallery-slot-actions {
      display: flex;
      gap: 0.35rem;
      justify-content: center;
      margin-top: 0.3rem;
    }
    .gallery-slot-btn {
      padding: 0.25rem 0.55rem;
      font-size: 0.7rem;
      font-weight: 600;
      border-radius: 0.35rem;
      border: 1px solid var(--border);
      background: var(--card-bg);
      color: var(--text);
      cursor: pointer;
      transition: all 0.2s;
    }
    .gallery-slot-btn:hover {
      background: var(--accent);
      color: #fff;
    }
    .gallery-slot-btn.btn-remove {
      color: var(--danger);
      border-color: rgba(239, 68, 68, 0.3);
    }
    .gallery-slot-btn.btn-remove:hover {
      background: var(--danger);
      color: #fff;
    }
    .slot-progress {
      display: none;
      font-size: 0.75rem;
      color: var(--accent);
      font-weight: 600;
      padding: 0.5rem;
      text-align: center;
    }

    /* AI Agent Card */
    .ai-hero-card {
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(99, 102, 241, 0.08));
      border: 1px solid rgba(14, 165, 233, 0.25);
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .code-block {
      background: var(--input-bg);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 1rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: var(--accent);
      overflow-x: auto;
      margin-top: 0.5rem;
    }
    .copy-btn {
      float: right;
      padding: 0.2rem 0.6rem;
      background: var(--card-bg);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 0.35rem;
      font-size: 0.75rem;
      cursor: pointer;
    }
    .copy-btn:hover {
      background: var(--accent);
      color: #fff;
    }
  </style>
</head>
<body>
  <header class="top-nav">
    <div class="brand-area">
      <img src="/img/logo/logo1.png" alt="MBOS Logo" onerror="this.src='/img/product/placeholder.jpg'">
      <div>
        <strong style="font-weight: 800; letter-spacing: -0.02em; color: var(--text-heading);">MBOS OPTICS</strong>
        <span class="badge-admin">Admin Portal</span>
      </div>
      <div class="badge-neon-status">Neon DB Connected</div>
    </div>
    <div class="nav-actions">
      <!-- Light / Dark Mode Toggle Button -->
      <button type="button" id="themeToggleBtn" class="btn btn-outline" onclick="toggleTheme()" title="Toggle Light / Dark Mode" style="padding: 0.4rem 0.8rem;">
        <span id="themeIcon">☀️</span> <span id="themeLabel" style="font-size: 0.8rem;">Light</span>
      </button>
      <a href="/home" target="_blank" class="btn btn-outline">&nearr; View Storefront</a>
      <button class="btn btn-outline" onclick="logout()">Sign Out</button>
    </div>
  </header>

  <main class="main-layout">
    <div class="tabs-header">
      <button class="tab-btn active" onclick="switchTab('products')">&#128083; Products</button>
      <button class="tab-btn" onclick="switchTab('banners')">&#128444; Banners & Carousel</button>
      <button class="tab-btn" onclick="switchTab('sections')">&#9998; Website Content</button>
      <button class="tab-btn" onclick="switchTab('homepage')">Homepage HTML</button>
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
              <th>Gallery</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="productsTableBody">
            <tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 3rem;">Loading products from Neon Postgres...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- BANNERS TAB -->
    <div id="tab-banners" class="tab-content">
      <div class="toolbar">
        <h2 style="color: var(--text-heading);">Homepage Carousel & Banners</h2>
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
        <h2 style="color: var(--text-heading);">Storefront Content & Contact Sections</h2>
      </div>
      <div class="products-table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 60px;">ID</th>
              <th>Section Name</th>
              <th>Plain Content 1 (Phone / Address)</th>
              <th>Plain Content 2 (WhatsApp / Hours)</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="sectionsTableBody">
            <tr><td colspan="5" style="text-align: center; padding: 2rem;">Loading website content sections...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div id="tab-homepage" class="tab-content">
      <h2>Homepage HTML</h2>
      <p>Enter a complete HTML document with its own page title and description.</p>
      <p ${homepageEnabled ? 'hidden' : ''}>Homepage publishing is disabled. Apply the homepage migration and configure HOMEPAGE_CMS_ENABLED and ADMIN_API_KEY to use revision history.</p>
      <div ${homepageEnabled ? '' : 'hidden'}>
      <form id="homepageForm">
        <label class="field-label" for="homepageSource">HTML source</label>
        <textarea id="homepageSource" class="input-field" rows="14" required maxlength="2000000"></textarea>
        <button class="btn btn-primary" type="submit">Save Draft and Preview</button>
      </form>
      <h3>Revision History</h3>
      <div class="products-table-container">
        <table>
          <thead><tr><th>Revision</th><th>Saved</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="homepageRevisions"></tbody>
        </table>
      </div>
      <button class="btn btn-outline" type="button" onclick="runHomepageAction('restore-default')">Restore Built-in Homepage</button>
      <p id="homepageStatus" role="status"></p>
      <iframe id="homepagePreview" title="Homepage preview" sandbox referrerpolicy="no-referrer" style="width: 100%; height: 540px; background: white;" hidden></iframe>
      </div>
    </div>

    <!-- AI AGENT INTEGRATION TAB -->
    <div id="tab-ai" class="tab-content">
      <div class="ai-hero-card">
        <h2 style="color: var(--text-heading); margin-bottom: 0.5rem;">🤖 AI Agent Automation & MCP Tools</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
          MBOS Chamish is equipped with native programmatic endpoints and OpenAPI tool specifications so autonomous AI agents (Claude, GPT, Open-source LLMs) can inspect inventory, add new safety spectacles, adjust balances, and update marketing banners.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
          <div style="background: var(--card-bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 0.75rem;">
            <div style="font-weight: 700; color: var(--text-heading);">&#128220; OpenAPI Specification</div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.35rem 0 0.75rem;">Auto-generated schema of all store manipulation tools.</p>
            <a href="/api/ai/openapi" target="_blank" class="btn btn-outline" style="font-size: 0.75rem;">View /api/ai/openapi</a>
          </div>

          <div style="background: var(--card-bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 0.75rem;">
            <div style="font-weight: 700; color: var(--text-heading);">&#129520; Function Calling Tools</div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.35rem 0 0.75rem;">JSON definitions ready for Anthropic Tool Use or OpenAI functions.</p>
            <a href="/api/ai/tools" target="_blank" class="btn btn-outline" style="font-size: 0.75rem;">View /api/ai/tools</a>
          </div>

          <div style="background: var(--card-bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 0.75rem;">
            <div style="font-weight: 700; color: var(--text-heading);">&#128214; Agent System Instructions</div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.35rem 0 0.75rem;">Context prompt describing MBOS safety specs & catalog structure.</p>
            <a href="/api/ai/instructions" target="_blank" class="btn btn-outline" style="font-size: 0.75rem;">View /api/ai/instructions</a>
          </div>
        </div>
      </div>

      <div class="stat-card" style="margin-bottom: 1.5rem;">
        <h3 style="color: var(--text-heading); margin-bottom: 0.75rem;">Agent Authentication Key</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
          Pass this secret header in all autonomous agent HTTP requests:
        </p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyText('X-API-Key: mbos_ai_agent_secret_key')">Copy</button>
          X-API-Key: mbos_ai_agent_secret_key
        </div>
      </div>

      <div class="stat-card">
        <h3 style="color: var(--text-heading); margin-bottom: 0.75rem;">Example: Create Product via cURL / AI Code Execution</h3>
        <div class="code-block">
          <button class="copy-btn" onclick="copyText(curlExample)">Copy</button>
          curl -X POST https://mbos-chamish.yithanglee.workers.dev/api/v1/products \\<br>
          &nbsp;&nbsp;-H "X-API-Key: mbos_ai_agent_secret_key" \\<br>
          &nbsp;&nbsp;-H "Content-Type: application/json" \\<br>
          &nbsp;&nbsp;-d '{"name": "Safety Glasses Pro", "balance": 50}'
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
            <label class="field-label">Short Description</label>
            <input type="text" id="prodShortDesc" class="input-field" style="width: 100%;" placeholder="Brief feature summary">
          </div>

          <!-- MULTI-IMAGE GALLERY (6 SLOTS) -->
          <div class="form-full">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.25rem;">
              <label class="field-label" style="margin-bottom: 0;">Product Images & Gallery (6 Slots - Neon Storage)</label>
              <span style="font-size: 0.72rem; color: var(--text-muted);">Uploaded directly to Neon Storage <strong style="color: var(--accent);">assets</strong> bucket</span>
            </div>

            <!-- Hidden inputs for image keys -->
            <input type="hidden" id="prodImgUrl1">
            <input type="hidden" id="prodImgUrl2">
            <input type="hidden" id="prodImgUrl3">
            <input type="hidden" id="prodImgUrl4">
            <input type="hidden" id="prodImgUrl5">
            <input type="hidden" id="prodImgUrl6">

            <!-- Hidden file inputs -->
            <input type="file" id="fileSlot1" accept="image/*" style="display: none;" onchange="handleSlotUpload(event, 1)">
            <input type="file" id="fileSlot2" accept="image/*" style="display: none;" onchange="handleSlotUpload(event, 2)">
            <input type="file" id="fileSlot3" accept="image/*" style="display: none;" onchange="handleSlotUpload(event, 3)">
            <input type="file" id="fileSlot4" accept="image/*" style="display: none;" onchange="handleSlotUpload(event, 4)">
            <input type="file" id="fileSlot5" accept="image/*" style="display: none;" onchange="handleSlotUpload(event, 5)">
            <input type="file" id="fileSlot6" accept="image/*" style="display: none;" onchange="handleSlotUpload(event, 6)">

            <div class="gallery-grid">
              <!-- Slot 1 (Primary / Cover) -->
              <div class="gallery-slot" id="slotCard1">
                <div class="gallery-slot-header">
                  <span>Slot 1 (Cover *)</span>
                  <span id="slotStatus1" style="color: var(--neon); font-size: 0.65rem;">Primary</span>
                </div>
                <div id="slotContent1">
                  <div class="gallery-slot-empty" onclick="triggerSlotUpload(1)">
                    <span style="font-size: 1.4rem;">📷</span>
                    <span>Upload Cover</span>
                  </div>
                </div>
                <div id="slotProgress1" class="slot-progress">Uploading to Neon...</div>
              </div>

              <!-- Slot 2 -->
              <div class="gallery-slot" id="slotCard2">
                <div class="gallery-slot-header">
                  <span>Slot 2 (Angle 2)</span>
                </div>
                <div id="slotContent2">
                  <div class="gallery-slot-empty" onclick="triggerSlotUpload(2)">
                    <span style="font-size: 1.4rem;">📷</span>
                    <span>Upload Image 2</span>
                  </div>
                </div>
                <div id="slotProgress2" class="slot-progress">Uploading to Neon...</div>
              </div>

              <!-- Slot 3 -->
              <div class="gallery-slot" id="slotCard3">
                <div class="gallery-slot-header">
                  <span>Slot 3 (Angle 3)</span>
                </div>
                <div id="slotContent3">
                  <div class="gallery-slot-empty" onclick="triggerSlotUpload(3)">
                    <span style="font-size: 1.4rem;">📷</span>
                    <span>Upload Image 3</span>
                  </div>
                </div>
                <div id="slotProgress3" class="slot-progress">Uploading to Neon...</div>
              </div>

              <!-- Slot 4 -->
              <div class="gallery-slot" id="slotCard4">
                <div class="gallery-slot-header">
                  <span>Slot 4 (Angle 4)</span>
                </div>
                <div id="slotContent4">
                  <div class="gallery-slot-empty" onclick="triggerSlotUpload(4)">
                    <span style="font-size: 1.4rem;">📷</span>
                    <span>Upload Image 4</span>
                  </div>
                </div>
                <div id="slotProgress4" class="slot-progress">Uploading to Neon...</div>
              </div>

              <!-- Slot 5 -->
              <div class="gallery-slot" id="slotCard5">
                <div class="gallery-slot-header">
                  <span>Slot 5 (Details)</span>
                </div>
                <div id="slotContent5">
                  <div class="gallery-slot-empty" onclick="triggerSlotUpload(5)">
                    <span style="font-size: 1.4rem;">📷</span>
                    <span>Upload Image 5</span>
                  </div>
                </div>
                <div id="slotProgress5" class="slot-progress">Uploading to Neon...</div>
              </div>

              <!-- Slot 6 -->
              <div class="gallery-slot" id="slotCard6">
                <div class="gallery-slot-header">
                  <span>Slot 6 (All Colors)</span>
                </div>
                <div id="slotContent6">
                  <div class="gallery-slot-empty" onclick="triggerSlotUpload(6)">
                    <span style="font-size: 1.4rem;">📷</span>
                    <span>Upload Image 6</span>
                  </div>
                </div>
                <div id="slotProgress6" class="slot-progress">Uploading to Neon...</div>
              </div>
            </div>
          </div>

          <!-- TINYMCE FULL DESCRIPTION -->
          <div class="form-full">
            <label class="field-label">Full Specifications & Description (Rich Text WYSIWYG)</label>
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

  <div id="bannerModal" class="modal-backdrop">
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="bannerModalTitle">
      <div class="modal-header">
        <h3 class="modal-title" id="bannerModalTitle">Add New Banner</h3>
        <button type="button" class="modal-close" aria-label="Close" onclick="closeBannerModal()">&times;</button>
      </div>
      <form id="bannerForm">
        <div class="form-grid">
          <label class="form-full field-label">
            Image URL or asset key
            <input class="input-field" style="width: 100%;" id="bannerImage" name="img_url">
          </label>
          <label class="form-full field-label">
            Or upload an image *
            <input type="file" name="image_file" accept="image/*">
          </label>
          <label class="form-full field-label">
            Mobile image URL or asset key
            <input class="input-field" style="width: 100%;" name="mobile_img_url">
          </label>
          <label class="form-full field-label">
            Or upload a mobile image
            <input type="file" name="mobile_image_file" accept="image/*">
          </label>
          <p class="form-full" id="bannerUploadStatus" role="status"></p>
          <label class="field-label">
            Display order
            <input class="input-field" style="width: 100%;" type="number" name="order" value="0">
          </label>
          <label class="field-label">
            Remarks
            <input class="input-field" style="width: 100%;" name="remarks">
          </label>
          <label class="field-label">
            <input type="checkbox" name="is_show" checked> Visible
          </label>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
          <button type="button" class="btn btn-outline" onclick="closeBannerModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Banner</button>
        </div>
      </form>
    </div>
  </div>

  <div id="sectionModal" class="modal-backdrop">
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="sectionModalTitle">
      <div class="modal-header">
        <h3 class="modal-title" id="sectionModalTitle">Edit Section</h3>
        <button type="button" class="modal-close" aria-label="Close" onclick="closeSectionModal()">&times;</button>
      </div>
      <form id="sectionForm">
        <input type="hidden" id="sectionId">
        <div class="form-grid">
          <label class="form-full field-label">
            Plain Content 1 (Phone / Address)
            <textarea id="sectionContent1" class="input-field"></textarea>
          </label>
          <label class="form-full field-label">
            Plain Content 2 (WhatsApp / Hours)
            <textarea id="sectionContent2" class="input-field"></textarea>
          </label>
        </div>
        <p id="sectionSaveError" role="alert" hidden></p>
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
          <button type="button" class="btn btn-outline" onclick="closeSectionModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="saveSectionBtn">Save Section</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    let allProducts = [];
    let allCategories = [];
    let allBrands = [];
    const curlExample = ${JSON.stringify('curl -X POST https://mbos-chamish.yithanglee.workers.dev/api/v1/products -H "X-API-Key: mbos_ai_agent_secret_key" -H "Content-Type: application/json" -d \'{"name": "Safety Glasses Pro", "balance": 50}\'')};

    // --- THEME TOGGLE (LIGHT / DARK) ---
    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('mbos_admin_theme', next);
      updateThemeButton(next);

      // Reload TinyMCE editor skin if initialized
      if (tinymce.get('prodDesc')) {
        const content = tinymce.get('prodDesc').getContent();
        tinymce.get('prodDesc').destroy();
        initTinyMCE(next, content);
      }
    }

    function updateThemeButton(theme) {
      const icon = document.getElementById('themeIcon');
      const label = document.getElementById('themeLabel');
      if (theme === 'light') {
        if (icon) icon.textContent = '🌙';
        if (label) label.textContent = 'Dark';
      } else {
        if (icon) icon.textContent = '☀️';
        if (label) label.textContent = 'Light';
      }
    }

    // --- TINYMCE WYSIWYG INITIALIZATION ---
    function initTinyMCE(theme, initialContent = null) {
      const isLight = theme === 'light';
      tinymce.init({
        selector: '#prodDesc',
        height: 280,
        menubar: false,
        plugins: ['lists', 'link', 'table', 'code'],
        toolbar: 'undo redo | blocks | bold italic underline | bullist numlist | table | link code',
        skin: isLight ? 'oxide' : 'oxide-dark',
        content_css: isLight ? 'default' : 'dark',
        branding: false,
        promotion: false,
        setup: (editor) => {
          editor.on('init', () => {
            if (initialContent !== null) {
              editor.setContent(initialContent);
            }
          });
          editor.on('change', () => editor.save());
        }
      });
    }

    function switchTab(name) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById('tab-' + name).classList.add('active');

      if (name === 'banners') loadBanners();
      if (name === 'homepage' && ${homepageEnabled}) runHomepageAction();
      if (name === 'sections') loadSections();
    }

    async function init() {
      const savedTheme = localStorage.getItem('mbos_admin_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      updateThemeButton(savedTheme);
      initTinyMCE(savedTheme);
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
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 3rem;">No products found matching filters.</td></tr>';
        return;
      }

      tbody.innerHTML = products.map(p => {
        const cat = allCategories.find(c => c.id === p.category_id);
        const brand = allBrands.find(b => b.id === p.brand_id);
        const img = p.img_url ? (p.img_url.startsWith('http') ? p.img_url : \`https://br-floral-tree-b35p9voh.storage.c-4.ap-southeast-1.aws.neon.tech/assets/\${p.img_url}\`) : '/img/product/placeholder.jpg';
        const galleryCount = [p.img_url, p.img_url2, p.img_url3, p.img_url4, p.img_url5, p.img_url6].filter(Boolean).length;

        return \`
          <tr>
            <td>
              <img src="\${img}" class="product-thumb" onerror="this.src='/img/logo/logo1.png'">
            </td>
            <td><span class="badge-pill">#\${p.id}</span></td>
            <td>
              <div style="font-weight: 600; color: var(--text-heading);">\${escapeHtml(p.name)}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">\${escapeHtml(p.short_desc || '')}</div>
            </td>
            <td><span class="badge-pill">\${cat ? escapeHtml(cat.name) : '-'}</span></td>
            <td><span class="badge-pill">\${brand ? escapeHtml(brand.name) : '-'}</span></td>
            <td>
              <span style="font-weight: 600; color: \${(p.balance || 0) > 0 ? '#34d399' : '#f87171'}">\${p.balance ?? 0}</span>
            </td>
            <td>
              <span class="badge-pill" style="font-size: 0.7rem;">\${galleryCount} \${galleryCount === 1 ? 'image' : 'images'}</span>
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

    // --- MULTI-IMAGE GALLERY SLOTS LOGIC ---
    function resolveImgUrl(key) {
      if (!key) return '';
      return key.startsWith('http') ? key : \`https://br-floral-tree-b35p9voh.storage.c-4.ap-southeast-1.aws.neon.tech/assets/\${key}\`;
    }

    function renderSlotUI(slotNum, key) {
      const card = document.getElementById('slotCard' + slotNum);
      const container = document.getElementById('slotContent' + slotNum);
      const hiddenInput = document.getElementById('prodImgUrl' + slotNum);
      hiddenInput.value = key || '';

      if (key) {
        card.classList.add('has-image');
        const url = resolveImgUrl(key);
        const fileName = key.split('/').pop();
        container.innerHTML = \`
          <img src="\${url}" class="gallery-slot-thumb" alt="Slot \${slotNum}" onerror="this.src='/img/logo/logo1.png'">
          <div style="font-size: 0.7rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 0.35rem;" title="\${escapeHtml(key)}">\${escapeHtml(fileName)}</div>
          <div class="gallery-slot-actions">
            <button type="button" class="gallery-slot-btn" onclick="triggerSlotUpload(\${slotNum})">Change</button>
            <button type="button" class="gallery-slot-btn btn-remove" onclick="removeSlotImage(\${slotNum})">Remove</button>
          </div>
        \`;
      } else {
        card.classList.remove('has-image');
        const slotLabel = slotNum === 1 ? 'Cover' : ('Image ' + slotNum);
        container.innerHTML = \`
          <div class="gallery-slot-empty" onclick="triggerSlotUpload(\${slotNum})">
            <span style="font-size: 1.4rem;">📷</span>
            <span>Upload \${slotLabel}</span>
          </div>
        \`;
      }
    }

    function triggerSlotUpload(slotNum) {
      const fileInput = document.getElementById('fileSlot' + slotNum);
      if (fileInput) fileInput.click();
    }

    function removeSlotImage(slotNum) {
      renderSlotUI(slotNum, '');
    }

    async function handleSlotUpload(event, slotNum) {
      const file = event.target.files[0];
      if (!file) return;

      const contentBox = document.getElementById('slotContent' + slotNum);
      const progressBox = document.getElementById('slotProgress' + slotNum);
      contentBox.style.display = 'none';
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
          renderSlotUI(slotNum, data.key);
        } else {
          alert('Upload failed: ' + (data.statusMessage || 'Unknown error'));
        }
      } catch (err) {
        alert('Upload failed: ' + err.message);
      } finally {
        contentBox.style.display = 'block';
        progressBox.style.display = 'none';
        event.target.value = '';
      }
    }

    // --- PRODUCT MODAL & OPEN / CLOSE ---
    function openProductModal(prod = null) {
      document.getElementById('productForm').reset();

      if (prod) {
        document.getElementById('modalProductTitle').textContent = 'Edit Product #' + prod.id;
        document.getElementById('prodId').value = prod.id;
        document.getElementById('prodName').value = prod.name || '';
        document.getElementById('prodCategory').value = prod.category_id || '';
        document.getElementById('prodBrand').value = prod.brand_id || '';
        document.getElementById('prodBalance').value = prod.balance ?? 0;
        document.getElementById('prodShortDesc').value = prod.short_desc || '';

        // Load all 6 gallery slots
        renderSlotUI(1, prod.img_url || '');
        renderSlotUI(2, prod.img_url2 || '');
        renderSlotUI(3, prod.img_url3 || '');
        renderSlotUI(4, prod.img_url4 || '');
        renderSlotUI(5, prod.img_url5 || '');
        renderSlotUI(6, prod.img_url6 || '');

        // Set TinyMCE content
        const descContent = prod.desc || '';
        if (tinymce.get('prodDesc')) {
          tinymce.get('prodDesc').setContent(descContent);
        } else {
          document.getElementById('prodDesc').value = descContent;
        }
      } else {
        document.getElementById('modalProductTitle').textContent = 'Add New Product';
        document.getElementById('prodId').value = '';
        renderSlotUI(1, '');
        renderSlotUI(2, '');
        renderSlotUI(3, '');
        renderSlotUI(4, '');
        renderSlotUI(5, '');
        renderSlotUI(6, '');

        if (tinymce.get('prodDesc')) {
          tinymce.get('prodDesc').setContent('');
        } else {
          document.getElementById('prodDesc').value = '';
        }
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

    document.getElementById('productForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById('saveProductBtn');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      // Save TinyMCE editor content
      if (tinymce.get('prodDesc')) {
        tinymce.get('prodDesc').save();
      }
      const fullDesc = tinymce.get('prodDesc') ? tinymce.get('prodDesc').getContent() : document.getElementById('prodDesc').value;

      const id = document.getElementById('prodId').value;
      const payload = {
        name: document.getElementById('prodName').value,
        category_id: document.getElementById('prodCategory').value || null,
        brand_id: document.getElementById('prodBrand').value || null,
        balance: parseInt(document.getElementById('prodBalance').value, 10) || 0,
        img_url: document.getElementById('prodImgUrl1').value || null,
        img_url2: document.getElementById('prodImgUrl2').value || null,
        img_url3: document.getElementById('prodImgUrl3').value || null,
        img_url4: document.getElementById('prodImgUrl4').value || null,
        img_url5: document.getElementById('prodImgUrl5').value || null,
        img_url6: document.getElementById('prodImgUrl6').value || null,
        short_desc: document.getElementById('prodShortDesc').value || null,
        desc: fullDesc || null,
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

    // --- BANNERS TAB ---
    const bannerForm = document.getElementById('bannerForm');

    function openBannerModal() {
      document.getElementById('bannerModal').classList.add('open');
      document.getElementById('bannerImage').focus();
    }

    function closeBannerModal() {
      document.getElementById('bannerModal').classList.remove('open');
      bannerForm.reset();
      document.getElementById('bannerUploadStatus').textContent = '';
    }

    bannerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const saveButton = bannerForm.querySelector('button[type="submit"]');
      if (saveButton.disabled) return;

      const fields = new FormData(bannerForm);
      const image = fields.get('img_url').trim();
      if (!image && !fields.get('image_file').size) {
        alert('Select an image or enter an image URL or asset key.');
        return;
      }

      saveButton.disabled = true;
      const status = document.getElementById('bannerUploadStatus');
      try {
        for (const [fileField, urlField] of [
          ['image_file', 'img_url'],
          ['mobile_image_file', 'mobile_img_url'],
        ]) {
          const file = fields.get(fileField);
          if (!file.size) continue;
          status.textContent = 'Uploading ' + file.name + ' to Neon Object Storage…';
          const upload = new FormData();
          upload.append('file', file);
          upload.append('requireNeon', 'true');
          const response = await fetch('/api/v1/upload', { method: 'POST', body: upload });
          const result = await response.json();
          if (!response.ok || !result.success || result.storage !== 'neon-s3') {
            throw new Error(result.statusMessage || 'Neon did not confirm the upload');
          }
          fields.set(urlField, result.url);
          bannerForm.elements[urlField].value = result.url;
          bannerForm.elements[fileField].value = '';
        }
        status.textContent = 'Saving banner…';
        const res = await fetch('/api/v1/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            img_url: fields.get('img_url').trim(),
            mobile_img_url: fields.get('mobile_img_url').trim() || null,
            order: Number(fields.get('order')),
            remarks: fields.get('remarks').trim() || null,
            is_show: fields.has('is_show'),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.statusMessage || 'Request failed');
        }
        closeBannerModal();
        await loadBanners();
      } catch (err) {
        status.textContent = 'Failed to save banner: ' + err.message;
      } finally {
        saveButton.disabled = false;
      }
    });

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
              <td><img src="\${img}" class="product-thumb" style="width: 80px; height: 40px; object-fit: cover;"></td>
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

    // --- SECTIONS TAB ---
    let storefrontSections = [];
    async function loadSections() {
      try {
        const res = await fetch('/api/v1/sections');
        if (!res.ok) throw new Error('Could not load sections');
        storefrontSections = await res.json();
        const tbody = document.getElementById('sectionsTableBody');

        tbody.innerHTML = storefrontSections.map(s => \`
          <tr>
            <td><span class="badge-pill">#\${s.id}</span></td>
            <td><strong style="color: var(--text-heading);">\${escapeHtml(s.name)}</strong></td>
            <td>\${escapeHtml(s.plain_content1 || '-')}</td>
            <td>\${escapeHtml(s.plain_content2 || '-')}</td>
            <td style="text-align: right;">
              <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="openSectionModal(\${s.id})">Edit</button>
            </td>
          </tr>
        \`).join('');
      } catch (err) {
        console.error('Error loading sections:', err);
      }
    }

    const sectionModal = document.getElementById('sectionModal');
    const sectionSaveError = document.getElementById('sectionSaveError');
    const saveSectionBtn = document.getElementById('saveSectionBtn');
    let sectionEditButton;

    function openSectionModal(id) {
      const section = storefrontSections.find(section => Number(section.id) === id);
      if (!section) return;

      sectionEditButton = document.activeElement;
      document.getElementById('sectionModalTitle').textContent = 'Edit ' + section.name;
      document.getElementById('sectionId').value = section.id;
      const content1 = document.getElementById('sectionContent1');
      content1.value = section.plain_content1 ?? '';
      document.getElementById('sectionContent2').value = section.plain_content2 ?? '';
      sectionSaveError.hidden = true;
      sectionModal.classList.add('open');
      content1.focus();
    }

    function closeSectionModal() {
      if (saveSectionBtn.disabled) return;
      sectionModal.classList.remove('open');
      sectionEditButton?.focus();
    }

    sectionModal.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeSectionModal();
    });

    document.getElementById('sectionForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      if (saveSectionBtn.disabled) return;

      saveSectionBtn.disabled = true;
      sectionSaveError.hidden = true;
      try {
        const id = document.getElementById('sectionId').value;
        const res = await fetch('/api/v1/sections/' + encodeURIComponent(id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plain_content1: document.getElementById('sectionContent1').value,
            plain_content2: document.getElementById('sectionContent2').value,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.statusMessage || 'Request failed');
        }
        sectionModal.classList.remove('open');
        await loadSections();
      } catch (err) {
        sectionSaveError.textContent = 'Failed to save section: ' + err.message;
        sectionSaveError.hidden = false;
      } finally {
        saveSectionBtn.disabled = false;
      }
    });

    const homepageRevisions = document.getElementById('homepageRevisions');
    const homepageStatus = document.getElementById('homepageStatus');
    const homepageSource = document.getElementById('homepageSource');
    const homepagePreview = document.getElementById('homepagePreview');
    let homepageBusy = false;

    document.getElementById('homepageForm').addEventListener('submit', (event) => {
      event.preventDefault();
      runHomepageAction('draft');
    });

    async function homepageRequest(payload) {
      const response = await fetch('/api/v1/homepage', payload ? {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      } : undefined);
      const result = await response.json();
      if (!response.ok) throw new Error(result.statusMessage || 'Homepage request failed');
      return result;
    }

    async function runHomepageAction(action, id) {
      if (homepageBusy) return;
      if ((action === 'publish' || action === 'preview') && !id) return;
      if (action === 'publish' && !confirm('Publish homepage revision #' + id + '?')) return;
      if (action === 'restore-default' && !confirm('Restore the built-in homepage?')) return;

      homepageBusy = true;
      homepageStatus.textContent = 'Working…';
      try {
        if (action) {
          const result = await homepageRequest(action === 'draft' ? { action, html: homepageSource.value } : { action, id });
          if (action === 'draft' || action === 'preview') {
            id = result.id;
            homepagePreview.srcdoc = result.html;
            homepagePreview.hidden = false;
          }
          if (action === 'preview') {
            homepageSource.value = result.html;
          }
        }
        const { revisions, publishedId } = await homepageRequest();
        homepageRevisions.replaceChildren();
        if (!revisions.length) {
          const cell = homepageRevisions.insertRow().insertCell();
          cell.colSpan = 4;
          cell.textContent = 'No saved revisions yet.';
        }
        for (const revision of revisions) {
          const live = revision.id === publishedId;
          const row = homepageRevisions.insertRow();
          row.insertCell().textContent = '#' + revision.id;
          row.insertCell().textContent = new Date(revision.created_at).toLocaleString();
          row.insertCell().textContent = live ? 'Live' : 'Saved';
          const actions = row.insertCell();
          for (const [action, label] of [['preview', 'Preview'], ['publish', 'Publish']]) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-outline';
            button.textContent = label;
            button.disabled = action === 'publish' && live;
            button.addEventListener('click', () => runHomepageAction(action, revision.id));
            actions.append(button);
          }
        }
        homepageStatus.textContent = publishedId ? 'Live revision #' + publishedId : 'Built-in homepage is live';
        if (action === 'draft') homepageStatus.textContent += '. Saved draft #' + id;
      } catch (err) {
        homepageStatus.textContent = err.message;
      } finally {
        homepageBusy = false;
      }
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
