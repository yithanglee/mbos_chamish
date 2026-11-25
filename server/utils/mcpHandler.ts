import { manageStorefrontDesign } from './storefrontDesign';
import { H3Event, readBody, getHeader, getQuery, setResponseHeader, setResponseStatus, createError } from 'h3';
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
} from './db';
import { uploadImage } from './storage';
import { mcpOAuthConfig, mcpOAuthScopes } from './mcpOAuth';
import { verifyAuth } from './auth';
import { listHomepageRevisions, manageHomepageRevision } from './homepage';

export const MCP_TOOLS = [
  {
    name: 'product',
    description: 'Unified tool to manage MBOS safety eyewear products: list, get details by ID, create new product, update existing product, or delete product',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['list', 'get', 'create', 'update', 'delete'],
          description: 'The product operation to perform (default: "list", or "get" if id provided)',
        },
        id: { type: 'integer', description: 'Product ID (required for get, update, delete)' },
        name: { type: 'string', description: 'Product name (required for create)' },
        short_desc: { type: 'string', description: 'Brief highlight bullet or subtitle' },
        desc: { type: 'string', description: 'Full HTML description and specifications' },
        category_id: { type: 'integer', description: 'Category ID' },
        brand_id: { type: 'integer', description: 'Brand ID' },
        balance: { type: 'integer', description: 'Stock balance' },
        search: { type: 'string', description: 'Search term for name or short description' },
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
    name: 'products',
    description: 'List, filter, or search products in the safety eyewear catalog',
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
    name: 'storefront_design',
    securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
    description: 'Manage site-wide CSS revisions for the public storefront. Draft saves without publishing. Preview returns draft CSS for review. Publish applies a revision, including an older revision for rollback. Restore-default removes the override. For new media, ask the user to upload it in MBOS Admin → Banners & Carousel and provide the resulting hosted URL. Reference that URL in the stylesheet. Never upload objects through this tool or embed media as data URLs.',
    inputSchema: {
      type: 'object',
      required: ['action'],
      properties: {
        action: { type: 'string', enum: ['list', 'draft', 'preview', 'publish', 'restore-default'] },
        id: { type: 'integer', description: 'Revision ID for preview or publish' },
        css: { type: 'string', description: 'Full CSS stylesheet for draft. Reference hosted media URLs from Banners & Carousel uploads.' },
      },
    },
  },
  {
    name: 'homepage',
    description: 'Manage homepage HTML revisions. Draft saves without publishing. Publish changes the live homepage and can roll back to an older revision. Restore-default switches to the built-in homepage.',
    inputSchema: {
      type: 'object',
      required: ['action'],
      properties: {
        action: { type: 'string', enum: ['list', 'draft', 'preview', 'publish', 'restore-default'] },
        html: { type: 'string', maxLength: 2000000, description: 'Complete HTML document, required for draft' },
        id: { type: 'integer', minimum: 1, maximum: 2147483647, description: 'Revision ID, required for preview and publish' },
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

async function executeTool(name: string, args: any, event: H3Event): Promise<any> {
  switch (name) {
    case 'product': {
      const action = args.action ? args.action.toLowerCase() : (args.id ? 'get' : 'list');
      if (action === 'list') {
        return await getProducts({
          category_id: args.category_id,
          brand_id: args.brand_id,
          search: args.search,
        });
      }
      if (action === 'get') {
        if (!args.id) throw new Error('Product ID required for action: get');
        const p = await getProductById(args.id);
        if (!p) throw new Error(`Product #${args.id} not found`);
        return p;
      }
      if (action === 'create') {
        const p = await createProduct(args);
        return { success: true, product: p };
      }
      if (action === 'update') {
        if (!args.id) throw new Error('Product ID required for action: update');
        const p = await updateProduct(args.id, args);
        if (!p) throw new Error(`Product #${args.id} not found`);
        return { success: true, product: p };
      }
      if (action === 'delete') {
        if (!args.id) throw new Error('Product ID required for action: delete');
        return await deleteProduct(args.id);
      }
      throw new Error(`Unsupported action "${action}" for product tool`);
    }

    case 'products': {
      return await getProducts({
        category_id: args.category_id,
        brand_id: args.brand_id,
        search: args.search,
      });
    }

    case 'list_products': {
      return await getProducts({
        category_id: args.category_id,
        brand_id: args.brand_id,
        search: args.search,
      });
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
      return await deleteProduct(args.id);
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
      return await getSections();
    }

    case 'update_landing_section': {
      const updated = await updateSection(args.id, args);
      if (!updated) throw new Error(`Section #${args.id} not found`);
      return { success: true, section: updated };
    }

    case 'storefront_design': return manageStorefrontDesign(args);

    case 'homepage': {
      if (args.action === 'list') return listHomepageRevisions();
      const result = await manageHomepageRevision(args);
      if (args.action === 'draft' && 'id' in result) return { id: result.id };
      return result;
    }

    case 'list_pages': {
      return await getPages();
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
      return await deletePage(args.id);
    }

    case 'list_banners': {
      return await getAllBanners();
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export async function handleMcpRequest(event: H3Event) {
  // Always attach CORS headers for cross-origin ChatGPT and MCP client support
  setResponseHeader(event, 'Access-Control-Allow-Origin', '*');
  setResponseHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS');
  setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, x-api-key, Accept, mcp-session-id, MCP-Protocol-Version, X-Requested-With');
  setResponseHeader(event, 'Access-Control-Max-Age', '86400');

  // Handle preflight OPTIONS immediately
  if (event.method === 'OPTIONS') {
    return '';
  }

  if (event.method !== 'POST') {
    setResponseHeader(event, 'Allow', 'POST, OPTIONS');
    throw createError({ statusCode: 405 });
  }

  const body = await readBody(event).catch(() => null);
  if (body?.jsonrpc !== '2.0' || typeof body.method !== 'string') {
    setResponseStatus(event, 400);
    return { jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid JSON-RPC request' } };
  }

  const { id, method, params } = body;
  if (id === undefined) {
    setResponseStatus(event, 202);
    return;
  }

  const oauth = mcpOAuthConfig();
  const scopes = oauth ? await mcpOAuthScopes(event, method === 'tools/list' || params?.name === 'storefront_design') : new Set<string>();
  const productRead = ['products', 'list_products', 'get_product'].includes(params?.name);
  const productWrite = ['create_product', 'update_product', 'delete_product'].includes(params?.name);
  const discovery = method !== 'tools/call';
  const requiredScope = productWrite ? 'products:write' : 'products:read';
  const oauthAllowed = (params?.name === 'storefront_design' && scopes.has('design:write')) ||
    ((discovery || productRead || productWrite) &&
    (scopes.has(requiredScope) || (discovery && scopes.has('products:write'))));
  const designCall = method === 'tools/call' && params?.name === 'storefront_design';
  const legacyAuth = oauthAllowed || designCall ? null : await verifyAuth(event);

  if (!legacyAuth && !oauthAllowed && (oauth || !['initialize', 'ping'].includes(method))) {
    setResponseStatus(event, 401);
    if (oauth) {
      setResponseHeader(event, 'WWW-Authenticate',
        `Bearer resource_metadata="${oauth.metadata}", scope="openid email"`);
    }
    return { jsonrpc: '2.0', id, error: { code: -32000, message: 'Unauthorized' } };
  }

  // Handle MCP JSON-RPC Methods
  switch (method) {
    case 'initialize': {
      return {
        jsonrpc: '2.0',
        id: id ?? 1,
        result: {
          protocolVersion: ['2024-11-05', '2025-03-26', '2025-06-18', '2025-11-25'].includes(params?.protocolVersion)
            ? params.protocolVersion : '2025-11-25',
          capabilities: {
            tools: { listChanged: false },
            resources: {},
            prompts: {},
          },
          serverInfo: {
            name: 'mbos-store-mcp',
            version: '1.0.0',
          },
        },
      };
    }

    case 'notifications/initialized': {
      return { jsonrpc: '2.0', id: id ?? null, result: {} };
    }

    case 'ping': {
      return { jsonrpc: '2.0', id: id ?? 1, result: {} };
    }

    case 'tools/list': {
      return {
        jsonrpc: '2.0',
        id: id ?? 1,
        result: {
          tools: legacyAuth ? MCP_TOOLS.filter(({ name }) => name !== 'storefront_design') : MCP_TOOLS.filter(({ name }) =>
            (scopes.has('design:write') && name === 'storefront_design') ||
            (scopes.has('products:read') && ['products', 'list_products', 'get_product'].includes(name)) ||
            (scopes.has('products:write') && ['create_product', 'update_product', 'delete_product'].includes(name))),
        },
      };
    }

    case 'resources/list': {
      return {
        jsonrpc: '2.0',
        id: id ?? 1,
        result: {
          resources: [],
        },
      };
    }

    case 'prompts/list': {
      return {
        jsonrpc: '2.0',
        id: id ?? 1,
        result: {
          prompts: [],
        },
      };
    }

    case 'logging/setLevel': {
      return {
        jsonrpc: '2.0',
        id: id ?? 1,
        result: {},
      };
    }

    case 'tools/call': {
      if (!params || !params.name) {
        return {
          jsonrpc: '2.0',
          id: id ?? 1,
          error: { code: -32602, message: 'Missing tool name in params' },
        };
      }

      try {
        const result = await executeTool(params.name, params.arguments || {}, event);
        return {
          jsonrpc: '2.0',
          id: id ?? 1,
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
          id: id ?? 1,
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
        id: id ?? 1,
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
      };
    }
  }
}

export function handleSseRequest(event: H3Event) {
  setResponseHeader(event, 'Access-Control-Allow-Origin', '*');
  setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS');
  setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, x-api-key, Accept, mcp-session-id');

  if (event.method === 'OPTIONS') {
    return '';
  }

  setResponseHeader(event, 'Content-Type', 'text/event-stream; charset=utf-8');
  setResponseHeader(event, 'Cache-Control', 'no-cache, no-transform');
  setResponseHeader(event, 'Connection', 'keep-alive');

  const host = getHeader(event, 'host') || 'mbos-chamish.yithanglee.workers.dev';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const query = getQuery(event);
  const sessionId = (query.sessionId as string) || (query.session_id as string) || `session_${Date.now()}`;
  const fullEndpoint = `${protocol}://${host}/api/mcp?sessionId=${sessionId}`;

  return `event: endpoint\ndata: ${fullEndpoint}\n\n`;
}
