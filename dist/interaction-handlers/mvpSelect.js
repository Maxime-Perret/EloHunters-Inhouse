"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MvpSelect = void 0;
const tslib_1 = require("tslib");
const discord_js_utilities_1 = require("@sapphire/discord.js-utilities");
const framework_1 = require("@sapphire/framework");
const fs = tslib_1.__importStar(require("fs"));
class MvpSelect extends framework_1.InteractionHandler {
    constructor(context) {
        super(context, {
            interactionHandlerType: "SELECT_MENU" /* InteractionHandlerTypes.SelectMenu */
        });
    }
    async run(interaction, mvp) {
        let users = fs.readFileSync('./data/users.json');
        users = JSON.parse(users.toString());
        let voteCount = 0;
        let updatedUsers = users.map((user) => {
            if (user.id === mvp) {
                user.mvps++;
            }
            if (user.mvps)
                voteCount += user.mvps;
            return user;
        });
        if (voteCount >= 10) {
            const ordered_users = updatedUsers.sort((a, b) => b.mvps - a.mvps);
            ordered_users[0].realMVP++;
            updatedUsers = ordered_users.map((user) => {
                user.mvps = 0;
                return user;
            });
        }
        fs.writeFileSync('./data/users.json', JSON.stringify(updatedUsers));
        try {
            const msg = await interaction.channel?.messages.fetch(interaction.message.id);
            await msg?.delete();
        }
        catch {
        }
        console.log(`${(0, discord_js_utilities_1.isGuildMember)(interaction.member) ? interaction.member.displayName : interaction.member?.user.id} voted for ${mvp}`);
        interaction.reply('Thanks for voting!, hope to see you in the next game ;)');
    }
    async parse(interaction) {
        if (interaction.customId !== 'select-mvp')
            return this.none();
        return this.some(interaction.values[0]);
    }
}
exports.MvpSelect = MvpSelect;
//# sourceMappingURL=mvpSelect.js.map