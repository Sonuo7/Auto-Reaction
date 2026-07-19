let VERSION = '3.0'; // Fallback for Cloudflare Workers / non-Node.js runtimes

try {
    if (import.meta.url) {
        const { createRequire } = await import('node:module');
        const require = createRequire(import.meta.url);
        const pkg = require('../package.json');
        VERSION = pkg.version;
    }
} catch {
    // Cloudflare Workers or other non-Node.js runtime — use fallback above
}

export { VERSION };
