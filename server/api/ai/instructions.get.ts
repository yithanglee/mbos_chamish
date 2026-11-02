import { defineEventHandler, setResponseHeader } from 'h3';

export default defineEventHandler((event) => {
  setResponseHeader(event, 'content-type', 'text/markdown; charset=utf-8');
  return `# MBOS Safety Eyewear - AI Agent Integration Guide

## Overview
This website is a Server-Side Rendered (SSR) safety eyewear catalog built on Nitro, Neon PostgreSQL, and Neon Object Storage (S3).
AI agents can programmatically manage products, upload images, update content sections, and adjust banners using the REST API.

## Authentication
Every mutation request must include either:
- \`X-API-Key: <ADMIN_API_KEY>\`
- \`Authorization: Bearer <ADMIN_API_KEY>\`

## Available Tools & Endpoints

### 1. Products
- **List products**: \`GET /api/v1/products?category_id=...&brand_id=...&search=...\`
- **Get product**: \`GET /api/v1/products/:id\`
- **Create product**: \`POST /api/v1/products\`
  \`\`\`json
  {
    "name": "Safety Spectacle Series X",
    "short_desc": "Anti-fog ANSI Z87.1 certified safety glasses",
    "desc": "<p>Detailed description...</p>",
    "category_id": 1,
    "brand_id": 1,
    "img_url": "images/uploads/spectacle_x.jpg",
    "balance": 100
  }
  \`\`\`
- **Update product**: \`PUT /api/v1/products/:id\`
- **Delete product**: \`DELETE /api/v1/products/:id\`

### 2. Image Upload
- **Upload base64 image**: \`POST /api/v1/upload\`
  \`\`\`json
  {
    "filename": "model_101.jpg",
    "data": "data:image/jpeg;base64,...",
    "contentType": "image/jpeg"
  }
  \`\`\`
  Returns: \`{ "success": true, "key": "images/uploads/...", "url": "https://..." }\`

### 3. Website Sections
Sections control header contact info, about us text, and footer content:
- **List sections**: \`GET /api/v1/sections\`
- **Update section**: \`PUT /api/v1/sections/:id\`
  \`\`\`json
  {
    "plain_content1": "+60123456789",
    "content1": "<p>Updated content</p>"
  }
  \`\`\`

### 4. Homepage Banners
- **List banners**: \`GET /api/v1/banners\`
- **Create banner**: \`POST /api/v1/banners\`
- **Update banner**: \`PUT /api/v1/banners/:id\`
- **Delete banner**: \`DELETE /api/v1/banners/:id\`

### 5. Machine-Readable Specs
- OpenAPI Spec: \`/api/ai/openapi.json\`
- Function Calling Tools Spec: \`/api/ai/tools.json\`
`;
});
