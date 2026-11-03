when in ssr , the index.ejs will render the indexRouter file

but because it also loads PhxApp, the navigateTo function will populate the <body id="page"> with the public html file...
## Editable homepage

The **Homepage HTML** admin tab accepts complete HTML documents with CSS and
JavaScript. Postgres stores each draft and the live revision ID. The Worker
serves published HTML at `/` and `/home`. Include a title, description, and
canonical link in the document head. Agents can use the storefront APIs to
retrieve data before generating a draft.

1. Apply [the homepage migration](scripts/migrations/001-homepage-revisions.sql)
   on a test database branch before applying it to the storefront database.
2. Set a strong `ADMIN_API_KEY` as a Worker secret, set
   `HOMEPAGE_CMS_ENABLED=true`, and deploy the Worker.
3. In **Homepage HTML**, save and preview a draft, then publish the selected
   revision. Publish an older revision to roll back, or choose **Restore
   Built-in Homepage**. The iframe preview disables scripts and forms.

Agents can call `GET /api/v1/homepage` to list revisions and the live ID.
Send JSON to `POST /api/v1/homepage` with `X-API-Key` for these actions:

| Action | Fields | Result |
| --- | --- | --- |
| `draft` | `html` | Saves the HTML and returns its revision ID and HTML |
| `preview` | `id` | Returns saved HTML |
| `publish` | `id` | Makes that revision live |
| `restore-default` | | Restores the bundled homepage |

Grant access only to trusted authors and agents. Published HTML can include
JavaScript that runs on the storefront origin.
