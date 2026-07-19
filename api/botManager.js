import TelegramBotAPI from './TechifyBots.js';
import { splitEmojis, getChatIds, log } from './helper.js';
import { onUpdate } from './botHandler.js';

// ══════════════════════════════════════════════════════════════
// BOT CONFIGURATION PARSER
// ══════════════════════════════════════════════════════════════


function parseBotConfigs(env) {
    // Multi-bot mode: BOT_TOKENS takes precedence
    if (env.BOT_TOKENS) {
        const entries = env.BOT_TOKENS.split(',').map(s => s.trim()).filter(Boolean);
        const configs = [];

        for (const entry of entries) {
            const lastColon = entry.lastIndexOf(':');
            if (lastColon === -1) {
                log.warn(`[BotManager] Invalid BOT_TOKENS entry (need token:username): ${entry.substring(0, 20)}...`);
                continue;
            }
            const token = entry.substring(0, lastColon).trim();
            const username = entry.substring(lastColon + 1).trim();
            if (!token || !username) {
                log.warn(`[BotManager] Skipping empty token or username`);
                continue;
            }
            configs.push({
                token,
                username,
                botId: username.toLowerCase(),
            });
        }

        if (configs.length === 0) {
            log.error('[BotManager] BOT_TOKENS set but no valid entries parsed');
            return [];
        }

        return configs;
    }

    // Single-bot mode: backward compatible
    if (env.BOT_TOKEN && env.BOT_USERNAME) {
        return [{
            token: env.BOT_TOKEN,
            username: env.BOT_USERNAME,
            botId: env.BOT_USERNAME.toLowerCase(),
        }];
    }

    return [];
}

// ══════════════════════════════════════════════════════════════
// BOT MANAGER
// ══════════════════════════════════════════════════════════════

export class BotManager {
    constructor(env) {
        this.env = env;
        this.bots = new Map(); // botId -> { api, config }
        this.webhookSecrets = new Map(); // secret -> botId (for routing)

        const configs = parseBotConfigs(env);

        for (const cfg of configs) {
            const randomLevel = (() => {
                const parsed = parseInt(env.RANDOM_LEVEL || '0', 10);
                return (isNaN(parsed) || parsed < 0 || parsed > 10) ? 0 : parsed;
            })();

            const botConfig = {
                token: cfg.token,
                username: cfg.username,
                botId: cfg.botId,
                api: new TelegramBotAPI(cfg.token),
                reactions: splitEmojis(env.EMOJI_LIST),
                restrictedChats: getChatIds(env.RESTRICTED_CHATS),
                forceSubChannels: (env.FORCE_SUBSCRIBE_CHANNELS || '').split(',').map(s => s.trim()).filter(Boolean),
                randomLevel,
                ownerId: env.OWNER_ID || '',
                webhookSecret: env.WEBHOOK_SECRET || '',
                botPhoto: env.BOT_PHOTO || '',
            };

            this.bots.set(cfg.botId, botConfig);
            this.webhookSecrets.set(botConfig.webhookSecret, cfg.botId);

            log.info(`[BotManager] Registered bot: @${cfg.username} (${cfg.botId})`);
        }

        log.info(`[BotManager] ${this.bots.size} bot(s) configured`);
    }

    getBot(botId) {
        return this.bots.get(botId);
    }

    getBotBySecret(secret) {
        const botId = this.webhookSecrets.get(secret);
        return botId ? this.bots.get(botId) : null;
    }

    getAllBots() {
        return [...this.bots.values()];
    }

    get count() {
        return this.bots.size;
    }

    async handleUpdate(botId, data) {
        const bot = this.bots.get(botId);
        if (!bot) throw new Error(`Unknown bot: ${botId}`);

        await onUpdate(
            data, bot.api, bot.reactions,
            bot.restrictedChats, bot.username,
            bot.randomLevel, bot.ownerId,
            bot.webhookSecret, bot.botPhoto,
            bot.forceSubChannels
        );
    }

    async handleBySecret(secret, data) {
        const bot = this.getBotBySecret(secret);
        if (!bot) return false;
        await this.handleUpdate(bot.botId, data);
        return true;
    }

    async registerWebhooks(baseUrl) {
        for (const bot of this.bots.values()) {
            const webhookUrl = `${baseUrl}/bot/${bot.botId}`;
            try {
                await bot.api.setWebhook(webhookUrl, bot.webhookSecret);
                log.info(`[BotManager] Webhook set for @${bot.username}: ${webhookUrl}`);
            } catch (error) {
                log.error(`[BotManager] Failed to set webhook for @${bot.username}: ${error.message}`);
            }
        }
    }
}

// ══════════════════════════════════════════════════════════════ END: botManager.js
