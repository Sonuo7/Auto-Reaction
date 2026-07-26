// ─── Advertisement Pool ──────────────────────────────────────
const advertisements = [
  "@Ivys_cafe - 𝘋𝘪𝘴𝘤𝘰𝘷𝘦𝘳 new things, learning, 𝘢𝘯𝘥 𝘶𝘴𝘦𝘧𝘶𝘭 𝘛hings.",
  "@Alsamovies - 𝘎𝘦𝘵 movies, series, drama , 𝘢𝘯𝘥 𝘴𝘦𝘢𝘴𝘰𝘯𝘢𝘭 𝘳𝘦𝘭𝘦𝘢𝘴𝘦 𝘭𝘪𝘴𝘵𝘴.",
];

// ─── Public API ──────────────────────────────────────────────

export function getRandomAd() {
    return advertisements[Math.floor(Math.random() * advertisements.length)];
}

export function getAdFooter() {
    const ad = getRandomAd();
    return `\n\n✨ 𝗕𝘆: <b><a href="https://telegram.me/ivys_cafe">IvY</a></b>\n<blockquote>${ad}</blockquote>`;
}

export function getAdCount() {
    return advertisements.length;
}

// ══════════════════════════════════════════════════════════════ END: ads.js
