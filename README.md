# Utilities comparison

Gas, power, and broadband comparison on **Cloudflare Workers**.

Live site: `https://compare.gillfamily.co.nz`

## Cloudflare configuration

Static files (`index.html`, `css/`, `js/`, `favicon.svg`) are Workers static assets. `worker/index.js` checks the host, then serves those files through the `ASSETS` binding.

`wrangler.toml` sets **`workers_dev = false`** and **`preview_urls = false`**.

Set **`CANONICAL_HOST`** to `compare.gillfamily.co.nz`. The custom domain is declared under `[[routes]]` so it survives redeploys. The Worker rejects any other host.

**Build command** (Git): `npx wrangler deploy`  
**Build variable:** `CLOUDFLARE_API_TOKEN`

## Local develop

```bash
npm install
npm run dev
```

Localhost is allowed by the Worker host check even when `CANONICAL_HOST` is set.

## Deploy

```bash
npm run deploy
```

## Layout

```
index.html, css/, js/, favicon.svg
worker/index.js     host check, then static assets
wrangler.toml, package.json
```
