"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leaderboard = void 0;
const tslib_1 = require("tslib");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const fs = tslib_1.__importStar(require("fs"));
const rawUsers_1 = require("../utils/rawUsers");
class Leaderboard extends framework_1.Command {
    constructor(context) {
        super(context, {
            name: 'leaderboard',
            description: 'shows InHouse leaderboard',
            chatInputCommand: { register: true, behaviorWhenNotIdentical: "OVERWRITE" /* RegisterBehavior.Overwrite */, guildIds: [process.env.GUILD] }
        });
    }
    async chatInputRun(interaction) {
        let users = [];
        const rawData = fs.readFileSync('./data/users.json');
        users = JSON.parse(rawData.toString());
        let rawUsers = (0, rawUsers_1.computeRaw)(users);
        rawUsers = rawUsers.sort((a, b) => b.wins - a.wins);
        rawUsers = rawUsers.map(user => {
            user.winrate = 3 * user.wins / (user.wins + user.losses) + 1 * user.wins / rawUsers[0].wins;
            return user;
        });
        // users = rawUsers.sort((a: user, b: user) => b.winrate - a.winrate); // sort by winrate
        users = rawUsers.filter(user => user.wins > 0 || user.losses > 0);
        const embed = new discord_js_1.MessageEmbed();
        embed.description = '';
        embed.setTitle('Leaderboard');
        embed.setColor('RED');
        // const emojiGuild = await this.container.client.guilds.fetch('969164207847260180')
        users.map((user, i) => {
            embed.description = embed.description + `\n**${i + 1 <= 3 ? (0, rawUsers_1.addMedal)(i + 1) : i + 1}** - ${user.username} | \`${user.wins}\` Wins | \`${user.losses}\` Losses`;
        });
        if (!users.length)
            embed.description = 'No players found';
        interaction.reply({
            embeds: [embed]
        });
    }
}
exports.Leaderboard = Leaderboard;
//# sourceMappingURL=leaderboard.js.map