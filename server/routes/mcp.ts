import { defineEventHandler, readBody, getHeader, getQuery, setResponseHeader, createError } from 'h3';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSections,
  updateSection,
  getPages,
  getPageByRoute,
  createPage,
  updatePage,
  deletePage,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../utils/db';
import { uploadImage } from '../utils/storage';
import { verifyAuth } from '../utils/auth';

// Model Context Protocol (MCP) Tool Definitions
const MCP_TOOLS = [
  {
    name: 'list_products',
    description: 'Retrieve products from the MBOS safety glasses catalog with optional category, brand, or search query',
    inputSchema: {
      type: 'object',
      properties: {
        category_id: { type: 'integer', description: 'Filter by category ID' },
        brand_id: { type: 'integer', description: 'Filter by brand ID' },
        search: { type: 'string', description: 'Search term for name or short description' },
      },
    },
  },
  {
    name: 'get_product',
    description: 'Get full details of a single product including all 6 gallery image URLs, balance, and specifications',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'integer', description: 'Product ID' },
      },
    },
  },
  {
    name: 'create_product',
    description: 'Add a new safety spectacle to the catalog with descriptions, pricing/stock, and up to 6 gallery image keys',
    inputSchema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', description: 'Product name (e.g. "OZS Ballistic Pro 300")' },
        short_desc: { type: 'string', description: 'Brief highlight bullet or subtitle' },
        desc: { type: 'string', description: 'Full HTML description and specifications (ANSI standards, UV rating)' },
        category_id: { type: 'integer', description: 'Category ID' },
        brand_id: { type: 'integer', description: 'Brand ID' },
        balance: { type: 'integer', description: 'Stock balance' },
        img_url: { type: 'string', description: 'Primary cover image key or URL' },
        img_url2: { type: 'string', description: 'Gallery image 2 key or URL' },
        img_url3: { type: 'string', description: 'Gallery image 3 key or URL' },
        img_url4: { type: 'string', description: 'Gallery image 4 key or URL' },
        img_url5: { type: 'string', description: 'Gallery image 5 key or URL' },
        img_url6: { type: 'string', description: 'Gallery image 6 key or URL' },
      },
    },
  },
  {
    name: 'update_product',
    description: 'Update any product field, stock balance, or gallery image URLs by product ID',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'integer', description: 'Product ID to update' },
        name: { type: 'string' },
        short_desc: { type: 'string' },
        desc: { type: 'string' },
        category_id: { type: 'integer' },
        brand_id: { type: 'integer' },
        balance: { type: 'integer' },
        img_url: { type: 'string' },
        img_url2: { type: 'string' },
        img_url3: { type: 'string' },
        img_url4: { type: 'string' },
        img_url5: { type: 'string' },
        img_url6: { type: 'string' },
      },
    },
  },
  {
    name: 'delete_product',
    description: 'Delete a product from the database by ID',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'integer', description: 'Product ID to remove' },
      },
    },
  },
  {
    name: 'upload_asset_to_neon',
    description: 'Upload an image or 3D model (.glb, .gltf, .png, .jpg) to Neon Object Storage assets bucket from a remote URL or base64',
    inputSchema: {
      type: 'object',
      required: ['filename'],
      properties: {
        filename: { type: 'string', description: 'Destination filename with extension (e.g. "glasses-3d.glb" or "cover.jpg")' },
        sourceUrl: { type: 'string', description: 'Remote URL to download asset from (e.g. from DALL-E, Spline, or Meshy 3D)' },
        base64: { type: 'string', description: 'Raw base64 data string (if not using sourceUrl)' },
        contentType: { type: 'string', description: 'MIME type (e.g. "model/gltf-binary" or "image/jpeg")' },
      },
    },
  },
  {
    name: 'list_landing_sections',
    description: 'List all landing page sections including Section 9 (3D Story Section) and their current HTML/content',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'update_landing_section',
    description: 'Update a landing page section (e.g. Section 9 "3D Story Section" or Section 4 "Center Banner") with HTML, CSS, Three.js 3D story canvas, or text',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'integer', description: 'Section ID (e.g. 9 for 3D Story Section, 4 for Center Banner)' },
        content1: { type: 'string', description: 'HTML / WebGL Canvas / JavaScript content to render in section' },
        content2: { type: 'string', description: 'Optional secondary HTML content' },
        class_list: { type: 'string', description: 'CSS classes for section container (e.g. "py-5 bg-dark text-white")' },
        plain_content1: { type: 'string', description: 'Plain text line 1' },
        plain_content2: { type: 'string', description: 'Plain text line 2' },
      },
    },
  },
  {
    name: 'list_pages',
    description: 'List all dynamic website pages stored in Neon Database',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'create_or_update_page',
    description: 'Create a new dynamic page or update an existing page in Neon Database (e.g. route_name: "/safety-standards", content: "<html>")',
    inputSchema: {
      type: 'object',
      required: ['name', 'route_name', 'content'],
      properties: {
        id: { type: 'integer', description: 'Existing page ID if updating' },
        name: { type: 'string', description: 'Page Title' },
        subtitle: { type: 'string' },
        route_name: { type: 'string', description: 'URL route starting with slash (e.g. "/certifications" or "/3d-showcase")' },
        content: { type: 'string', description: 'Full HTML content of the page' },
        img_url: { type: 'string', description: 'Hero banner image' },
        show_nav: { type: 'boolean', description: 'Whether to show link in navigation bar' },
      },
    },
  },
  {
    name: 'delete_page',
    description: 'Delete a dynamic page from Neon Database by ID',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'integer', description: 'Page ID to delete' },
      },
    },
  },
  {
    name: 'list_banners',
    description: 'List all homepage carousel slides and banners',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

async function executeTool(name: string, args: any, event: any): Promise<any> {
  switch (name) {
    case 'list_products': {
      const data = await getProducts({
        category_id: args.category_id,
        brand_id: args.brand_id,
        search: args.search,
      });
      return data;
    }

    case 'get_product': {
      const p = await getProductById(args.id);
      if (!p) throw new Error(`Product #${args.id} not found`);
      return p;
    }

    case 'create_product': {
      const p = await createProduct(args);
      return { success: true, product: p };
    }

    case 'update_product': {
      const p = await updateProduct(args.id, args);
      if (!p) throw new Error(`Product #${args.id} not found`);
      return { success: true, product: p };
    }

    case 'delete_product': {
      const res = await deleteProduct(args.id);
      return res;
    }

    case 'upload_asset_to_neon': {
      let buffer: Buffer;
      let mime = args.contentType || 'application/octet-stream';
      let filename = args.filename || `asset_${Date.now()}.bin`;

      if (args.sourceUrl) {
        const resp = await fetch(args.sourceUrl);
        if (!resp.ok) throw new Error(`Failed to download asset from ${args.sourceUrl}: ${resp.statusText}`);
        const ab = await resp.arrayBuffer();
        buffer = Buffer.from(ab);
        if (!args.contentType && resp.headers.get('content-type')) {
          mime = resp.headers.get('content-type')!.split(';')[0];
        }
      } else if (args.base64) {
        buffer = Buffer.from(args.base64, 'base64');
      } else {
        throw new Error('Provide either sourceUrl or base64 data to upload_asset_to_neon');
      }

      const result = await uploadImage(filename, buffer, mime, event);
      return {
        success: true,
        url: result.url,
        key: result.key,
        filename: result.filename,
      };
    }

    case 'list_landing_sections': {
      const sections = await getSections();
      return sections;
    }

    case 'update_landing_section': {
      const updated = await updateSection(args.id, args);
      if (!updated) throw new Error(`Section #${args.id} not found`);
      return { success: true, section: updated };
    }

    case 'list_pages': {
      const pages = await getPages();
      return pages;
    }

    case 'create_or_update_page': {
      if (args.id) {
        const updated = await updatePage(args.id, args);
        return { success: true, page: updated };
      } else {
        const created = await createPage(args);
        return { success: true, page: created };
      }
    }

    case 'delete_page': {
      const res = await deletePage(args.id);
      return res;
    }

    case 'list_banners': {
      const banners = await getAllBanners();
      return banners;
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default defineEventHandler(async (event) => {
  // Support both GET (discovery / info) and POST (JSON-RPC 2.0 MCP protocol)
  if (event.method === 'GET') {
    setResponseHeader(event, 'content-type', 'application/json; charset=utf-8');
    return {
      mcpVersion: '2024-11-05',
      name: 'mbos-store-mcp',
      description: 'Model Context Protocol (MCP) Server for MBOS Chamish Storefront & Neon Storage',
      endpoints: {
        http: '/mcp',
        sse: '/sse',
        openapi: '/api/ai/openapi',
      },
      toolsCount: MCP_TOOLS.length,
      tools: MCP_TOOLS,
    };
  }

  // Verify Auth for POST requests
  const query = getQuery(event);
  const providedKey = getHeader(event, 'x-api-key') ||
    getHeader(event, 'authorization')?.replace(/^Bearer\s+/, '') ||
    (query.api_key as string);

  const expectedKey = process.env.ADMIN_API_KEY || process.env.ADMIN_SECRET || 'mbos_ai_agent_secret_key';
  if (providedKey !== expectedKey) {
    const auth = await verifyAuth(event);
    if (!auth) {
      setResponseHeader(event, 'content-type', 'application/json');
      return {
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Unauthorized: Provide valid X-API-Key or Bearer token header',
        },
      };
    }
  }

  const body = await readBody(event);
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'JSON-RPC body required' });
  }

  setResponseHeader(event, 'content-type', 'application/json; charset=utf-8');

  const { jsonrpc, id, method, params } = body;

  // MCP JSON-RPC Method Handlers
  switch (method) {
    case 'initialize': {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'mbos-store-mcp',
            version: '1.0.0',
          },
        },
      };
    }

    case 'notifications/initialized': {
      return { jsonrpc: '2.0', id: null, result: {} };
    }

    case 'ping': {
      return { jsonrpc: '2.0', id, result: {} };
    }

    case 'tools/list': {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools: MCP_TOOLS,
        },
      };
    }

    case 'tools/call': {
      if (!params || !params.name) {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32602, message: 'Missing tool name in params' },
        };
      }

      try {
        const result = await executeTool(params.name, params.arguments || {}, event);
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
              },
            ],
          },
        };
      } catch (err: any) {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            isError: true,
            content: [
              {
                type: 'text',
                text: `Error executing tool ${params.name}: ${err.message}`,
              },
            ],
          },
        };
      }
    }

    default: {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
      };
    }
  }
});
