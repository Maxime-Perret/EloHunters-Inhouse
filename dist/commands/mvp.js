"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MVP = void 0;
const tslib_1 = require("tslib");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const fs = tslib_1.__importStar(require("fs"));
const rawUsers_1 = require("../utils/rawUsers");
class MVP extends framework_1.Command {
    constructor(context) {
        super(context, {
            name: 'mvp',
            description: 'shows InHouse MVP leaderboard',
            chatInputCommand: { register: true, behaviorWhenNotIdentical: "OVERWRITE" /* RegisterBehavior.Overwrite */, guildIds: [process.env.GUILD] }
        });
    }
    async chatInputRun(interaction) {
        let users = [];
        const rawData = fs.readFileSync('./data/users.json');
        users = JSON.parse(rawData.toString());
        let rawUsers = (0, rawUsers_1.computeRaw)(users);
        rawUsers = rawUsers.sort((a, b) => b.realMVP - a.realMVP);
        rawUsers = rawUsers.filter(user => user.realMVP > 0);
        const embed = new discord_js_1.MessageEmbed();
        embed.description = '';
        embed.setTitle('MVP Leaderboard');
        embed.setColor('RED');
        rawUsers.map(async (user, i) => {
            embed.description = embed.description + `\n**${i + 1 <= 3 ? (0, rawUsers_1.addMedal)(i + 1) : i + 1}** - ${user.username} | \`${user.realMVP}\` MVPs`;
        });
        if (!rawUsers.length)
            embed.description = 'No players found';
        interaction.reply({
            embeds: [embed]
        });
    }
}
exports.MVP = MVP;
//# sourceMappingURL=mvp.js.map