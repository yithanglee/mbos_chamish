import { defineEventHandler } from 'h3';

export default defineEventHandler(() => {
  return {
    openapi: '3.1.0',
    info: {
      title: 'MBOS Chamish Storefront & Content Management API',
      version: '1.0.0',
      description: 'API for AI Agents and Admin Dashboard to manage products, images, banners, and sections.',
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
          summary: 'List products',
          parameters: [
            { name: 'category_id', in: 'query', schema: { type: 'integer' } },
            { name: 'brand_id', in: 'query', schema: { type: 'integer' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'Success' } },
        },
        post: {
          summary: 'Create product',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', required: ['name'] } } },
          },
          responses: { 200: { description: 'Created' } },
        },
      },
      '/api/v1/products/{id}': {
        get: {
          summary: 'Get single product',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Success' } },
        },
        put: {
          summary: 'Update product',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'Updated' } },
        },
        delete: {
          summary: 'Delete product',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Deleted' } },
        },
      },
      '/api/v1/upload': {
        post: {
          summary: 'Upload image to Neon S3',
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } },
              'application/json': { schema: { type: 'object', required: ['filename', 'data'], properties: { filename: { type: 'string' }, data: { type: 'string' } } } },
            },
          },
          responses: { 200: { description: 'Uploaded' } },
        },
      },
      '/api/v1/sections': {
        get: { summary: 'List sections', responses: { 200: { description: 'Success' } } },
      },
      '/api/v1/sections/{id}': {
        put: {
          summary: 'Update section',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'Updated' } },
        },
      },
      '/api/v1/banners': {
        get: { summary: 'List banners', responses: { 200: { description: 'Success' } } },
        post: {
          summary: 'Create banner',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['img_url'] } } } },
          responses: { 200: { description: 'Created' } },
        },
      },
      '/api/v1/banners/{id}': {
        put: {
          summary: 'Update banner',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'Updated' } },
        },
        delete: {
          summary: 'Delete banner',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Deleted' } },
        },
      },
      '/api/v1/pages': {
        get: {
          summary: 'List dynamic pages stored in Neon DB',
          responses: { 200: { description: 'Success' } },
        },
        post: {
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
          summary: 'Update dynamic page by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'Updated' } },
        },
        delete: {
          summary: 'Delete dynamic page by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Deleted' } },
        },
      },
    },
  };
});
