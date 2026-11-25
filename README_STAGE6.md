# NEXORA Stage 6 — Presentation & Deployment Ready

Stage 6 is the final presentation-polish pass on the React + JSON Server academic ecommerce project.

## Local development

From this folder:

```powershell
npm install
```

Terminal 1:

```powershell
npm run start-server
```

Terminal 2:

```powershell
npm start
```

Frontend: http://localhost:3000
API: http://localhost:5000

## Netlify + Render deployment

The frontend and JSON Server API should be deployed separately.

### 1. Deploy the API to Render

Use this repository/folder as a Node web service. `render.yaml` provides the start command:

```bash
npx json-server --host 0.0.0.0 --watch src/api/db.json --port $PORT
```

Copy the public Render URL.

### 2. Deploy the frontend to Netlify

The `netlify.toml` file configures:

- Build command: `npm run build`
- Publish directory: `build`
- SPA fallback: `/index.html`

In Netlify → Site configuration → Environment variables, add:

```text
REACT_APP_API_URL=https://YOUR-RENDER-API-URL
```

Then redeploy.

### Important presentation note

JSON Server is a lightweight academic/demo REST API. It is not a production relational database server. For the DBMS viva, describe the project's persistent collections and CRUD relationships accurately, and do not claim that JSON Server is executing SQL internally.
