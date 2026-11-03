import { defineEventHandler } from 'h3';

export default defineEventHandler(() => {
  return {
    openapi: '3.1.0',
    info: {
      title: 'MBOS Chamish Storefront & Content Management API',
      version: '1.0.0',
      description: 'API for AI Agents and ChatGPT Plugins to manage products, images, banners, and sections.',
    },
    servers: [
      { url: '/', description: 'Current Server' },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
        },
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    security: [
      { ApiKeyAuth: [] },
      { BearerAuth: [] },
    ],
    paths: {
      '/api/v1/products': {
        get: {
          operationId: 'list_products',
          summary: 'List products',
          description: 'Search, filter and retrieve all safety spectacles and eyewear products',
          parameters: [
            { name: 'category_id', in: 'query', schema: { type: 'integer' } },
            { name: 'brand_id', in: 'query', schema: { type: 'integer' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'Success' } },
        },
        post: {
          operationId: 'create_product',
          summary: 'Create product',
          description: 'Create a new product in the store with description and gallery images',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', required: ['name'] } } },
          },
          responses: { 200: { description: 'Created' } },
        },
      },
      '/api/v1/products/{id}': {
        get: {
          operationId: 'get_product',
          summary: 'Get single product',
          description: 'Get full details of a product by its ID including all 6 gallery image slots',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Success' } },
        },
        put: {
          operationId: 'update_product',
          summary: 'Update product',
          description: 'Update any product field, stock balance, or gallery image URLs',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'Updated' } },
        },
        delete: {
          operationId: 'delete_product',
          summary: 'Delete product',
          description: 'Delete a product from the database by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Deleted' } },
        },
      },
      '/api/v1/upload': {
        post: {
          operationId: 'upload_image',
          summary: 'Upload image or asset to Neon S3',
          description: 'Upload an image or asset file to Neon Object Storage',
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } },
              'application/json': { schema: { type: 'object', required: ['filename'], properties: { filename: { type: 'string' }, data: { type: 'string' }, sourceUrl: { type: 'string' } } } },
            },
          },
          responses: { 200: { description: 'Uploaded' } },
        },
      },
      '/api/v1/sections': {
        get: {
          operationId: 'list_sections',
          summary: 'List landing page sections',
          description: 'List all sections including 3D Story Section #9',
          responses: { 200: { description: 'Success' } },
        },
      },
      '/api/v1/sections/{id}': {
        put: {
          operationId: 'update_section',
          summary: 'Update landing page section',
          description: 'Update section HTML, CSS, or 3D animations',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'Updated' } },
        },
      },
      '/api/v1/banners': {
        get: {
          operationId: 'list_banners',
          summary: 'List homepage banners',
          responses: { 200: { description: 'Success' } },
        },
        post: {
          operationId: 'create_banner',
          summary: 'Create homepage banner',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['img_url'] } } } },
          responses: { 200: { description: 'Created' } },
        },
      },
      '/api/v1/banners/{id}': {
        put: {
          operationId: 'update_banner',
          summary: 'Update banner',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'Updated' } },
        },
        delete: {
          operationId: 'delete_banner',
          summary: 'Delete banner',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Deleted' } },
        },
      },
      '/api/v1/pages': {
        get: {
          operationId: 'list_pages',
          summary: 'List dynamic pages stored in Neon DB',
          responses: { 200: { description: 'Success' } },
        },
        post: {
          operationId: 'create_page',
          summary: 'Create dynamic page (route, title, HTML body)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'route_name', 'content'],
                  properties: {
                    name: { type: 'string', description: 'Page Title' },
                    subtitle: { type: 'string' },
                    route_name: { type: 'string', description: 'URL route starting with /' },
                    content: { type: 'string', description: 'Full HTML/JS content' },
                    img_url: { type: 'string' },
                    show_nav: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Created' } },
        },
      },
      '/api/v1/pages/{id}': {
        put: {
          operationId: 'update_page',
          summary: 'Update dynamic page by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'Updated' } },
        },
        delete: {
          operationId: 'delete_page',
          summary: 'Delete dynamic page by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Deleted' } },
        },
      },
    },
  };
});
