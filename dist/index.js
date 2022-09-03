"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const register_redis_1 = require("@sapphire/plugin-scheduled-tasks/register-redis");
const framework_1 = require("@sapphire/framework");
require("./server/app");
const client = new framework_1.SapphireClient({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'],
    partials: ['GUILD_MEMBER', 'CHANNEL', 'MESSAGE'],
    loadMessageCommandListeners: true,
    defaultPrefix: '$',
    presence: {
        status: 'online',
        activities: [
            {
                name: 'League of Legends',
                type: 'STREAMING',
                url: 'https://www.twitch.tv/leagueoflegends'
            }
        ]
    },
    tasks: {
        strategy: new register_redis_1.ScheduledTaskRedisStrategy({
            bull: {
                redis: {
                    host: '127.0.0.1'
                }
            }
        })
    }
});
client.login(process.env.TOKEN);
//# sourceMappingURL=index.js.map