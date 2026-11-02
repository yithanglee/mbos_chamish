import { defineEventHandler } from 'h3';

export default defineEventHandler(() => {
  return {
    version: '1.0.0',
    description: 'MBOS Safety Eyewear Website AI Agent Tools',
    authentication: {
      type: 'apiKey',
      header: 'X-API-Key',
      orBearer: 'Authorization: Bearer <API_KEY>',
    },
    tools: [
      {
        name: 'list_products',
        description: 'Retrieve a list of products with optional filters for category, brand, or search keyword',
        endpoint: '/api/v1/products',
        method: 'GET',
        parameters: {
          type: 'object',
          properties: {
            category_id: { type: 'integer', description: 'Filter by category ID' },
            brand_id: { type: 'integer', description: 'Filter by brand ID' },
            search: { type: 'string', description: 'Search term matching name or description' },
          },
        },
      },
      {
        name: 'get_product',
        description: 'Get single product details by product ID',
        endpoint: '/api/v1/products/{id}',
        method: 'GET',
        parameters: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'integer', description: 'The unique ID of the product' },
          },
        },
      },
      {
        name: 'create_product',
        description: 'Create a new product in the catalog with name, descriptions, category, brand, image URLs, and balance',
        endpoint: '/api/v1/products',
        method: 'POST',
        parameters: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', description: 'Product title/name' },
            short_desc: { type: 'string', description: 'Brief summary of product features' },
            desc: { type: 'string', description: 'Full description (supports HTML/markdown)' },
            category_id: { type: 'integer', description: 'Category ID' },
            brand_id: { type: 'integer', description: 'Brand ID' },
            img_url: { type: 'string', description: 'Primary image path or URL from upload' },
            img_url2: { type: 'string', description: 'Secondary image path' },
            img_url3: { type: 'string', description: 'Third image path' },
            balance: { type: 'integer', description: 'Inventory stock level' },
          },
        },
      },
      {
        name: 'update_product',
        description: 'Update an existing product by ID with partial fields',
        endpoint: '/api/v1/products/{id}',
        method: 'PUT',
        parameters: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'integer', description: 'Product ID to update' },
            name: { type: 'string' },
            short_desc: { type: 'string' },
            desc: { type: 'string' },
            category_id: { type: 'integer' },
            brand_id: { type: 'integer' },
            img_url: { type: 'string' },
            balance: { type: 'integer' },
          },
        },
      },
      {
        name: 'delete_product',
        description: 'Delete a product from the database by ID',
        endpoint: '/api/v1/products/{id}',
        method: 'DELETE',
        parameters: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'integer', description: 'Product ID to delete' },
          },
        },
      },
      {
        name: 'upload_image',
        description: 'Upload a product or banner image directly to Neon S3 storage using base64 encoded data',
        endpoint: '/api/v1/upload',
        method: 'POST',
        parameters: {
          type: 'object',
          required: ['filename', 'data'],
          properties: {
            filename: { type: 'string', description: 'Filename with extension (e.g. spectacle-1.jpg)' },
            data: { type: 'string', description: 'Base64 encoded file contents or data URL' },
            contentType: { type: 'string', description: 'MIME type, e.g. image/jpeg, image/png' },
          },
        },
      },
      {
        name: 'list_sections',
        description: 'List all text/content sections of the website (e.g. hero text, about us, contact info)',
        endpoint: '/api/v1/sections',
        method: 'GET',
        parameters: { type: 'object', properties: {} },
      },
      {
        name: 'update_section',
        description: 'Update website section contents or text blocks by section ID',
        endpoint: '/api/v1/sections/{id}',
        method: 'PUT',
        parameters: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'integer', description: 'Section ID' },
            name: { type: 'string' },
            content1: { type: 'string' },
            content2: { type: 'string' },
            plain_content1: { type: 'string' },
            plain_content2: { type: 'string' },
          },
        },
      },
      {
        name: 'list_banners',
        description: 'List all homepage hero banners and slides',
        endpoint: '/api/v1/banners',
        method: 'GET',
        parameters: { type: 'object', properties: {} },
      },
      {
        name: 'create_banner',
        description: 'Add a new banner slide to the homepage carousel',
        endpoint: '/api/v1/banners',
        method: 'POST',
        parameters: {
          type: 'object',
          required: ['img_url'],
          properties: {
            img_url: { type: 'string', description: 'Image key or URL' },
            mobile_img_url: { type: 'string' },
            order: { type: 'integer' },
            remarks: { type: 'string' },
            is_show: { type: 'boolean' },
          },
        },
      },
    ],
  };
});
