export function getRandomPositiveReaction(reaction) {
    if (!reaction || reaction.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * reaction.length);
    return reaction[randomIndex];
}

// ---- FEATURE: Emoji String Splitter ----

export function splitEmojis(emojiString) {
    if (!emojiString) return [];
    const emojiRegex = /\p{Regional_Indicator}\p{Regional_Indicator}|(?:[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Emoji_Modifier_Base}][\uFE0F\p{Emoji_Modifier}]*(?:\u200D[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Emoji_Modifier_Base}][\uFE0F\p{Emoji_Modifier}]*)*)/gu;
    return emojiString.match(emojiRegex) || [];
}

// ══════════════════════════════════════════════════════════════
// CHAT & HTTP UTILITIES
// ══════════════════════════════════════════════════════════════

export function getChatIds(chats) {
    return chats ? chats.split(',').map(Number).filter(Boolean) : [];
}

export function returnHTML(content) {
    return new Response(content, {
        headers: { 'content-type': 'text/html' },
    });
}

// ══════════════════════════════════════════════════════════════
// STRUCTURED LOGGER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Logging ----

export const log = {
    info: (...args) => console.log('[INFO]', new Date().toISOString(), ...args),
    warn: (...args) => console.warn('[WARN]', new Date().toISOString(), ...args),
    error: (...args) => console.error('[ERROR]', new Date().toISOString(), ...args),
};

// ══════════════════════════════════════════════════════════════ END: helper.js
