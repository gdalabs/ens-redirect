# ENS Redirect

Redirect to any ENS name's `url` text record, instantly.

**Live:** https://ens.gdalabs.dev

## Usage

Append any `.eth` name to the URL:

```
https://ens.gdalabs.dev/yourname.eth
```

The service reads the `url` text record from ENS and performs a 302 redirect.

## Setup your ENS name

1. Go to [app.ens.domains](https://app.ens.domains)
2. Select your ENS name
3. Edit Records → add a `url` text record with your destination URL
4. Save and sign the transaction
5. Visit `https://ens.gdalabs.dev/yourname.eth`

## How it works

- Cloudflare Pages serves the landing page
- Cloudflare Functions (catch-all route) handles `/<name>.eth` requests
- ENS records are resolved via the [enstate.rs](https://enstate.rs) public API
- Returns a 302 redirect to the resolved URL

## Tech stack

- Vite + TypeScript (Vanilla)
- Cloudflare Pages + Functions
- Zero runtime dependencies

## Development

```sh
npm install
npm run dev
```

## Deploy

```sh
npm run build
npx wrangler pages deploy dist --project-name ens-redirect
```

## License

MIT
