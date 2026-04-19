// Shim: re-exports node:async_hooks so that bundled code that imports
// the bare 'async_hooks' specifier gets the correct Cloudflare-compatible module.
export * from 'node:async_hooks'
