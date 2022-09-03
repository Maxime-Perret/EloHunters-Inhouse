"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cancel = void 0;
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_js_utilities_1 = require("@sapphire/discord.js-utilities");
const framework_1 = require("@sapphire/framework");
const fs = tslib_1.__importStar(require("fs"));
class Cancel extends framework_1.Command {
    constructor(context) {
        super(context, {
            name: 'remove',
            description: 'remove a member from the queue',
            preconditions: ['GuildOnly', 'AdminOnly'],
        });
    }
    async chatInputRun(interaction) {
        await interaction.deferReply({ ephemeral: true });
        let eu_game = fs.readFileSync('./data/eu/game.json');
        eu_game = JSON.parse(eu_game.toString());
        let na_game = fs.readFileSync('./data/na/game.json');
        na_game = JSON.parse(na_game.toString());
        const member = interaction.options.getMember('member');
        const region = interaction.options.getString('region');
        if (!(0, discord_js_utilities_1.isGuildMember)(member))
            return interaction.editReply('invalid member');
        if (region == 'na') {
            const naChannel = await this.container.client.channels.fetch(process.env.NA_CHANNEL);
            if (!naChannel?.isText())
                return;
            const bluePlayers = [];
            const redPlayers = [];
            let isRed = false;
            for (const [key, value] of Object.entries(na_game.blue)) {
                bluePlayers.push({ role: key, tag: value.tag, id: value.id });
            }
            for (const [key, value] of Object.entries(na_game.red)) {
                redPlayers.push({ role: key, tag: value.tag, id: value.id });
            }
            let foundPlayer = bluePlayers.filter((player) => player.id === member?.id);
            if (!foundPlayer.length) {
                foundPlayer = redPlayers.filter((player) => player.id === member?.id);
                isRed = true;
            }
            if (!foundPlayer.length)
                return interaction.editReply('Member is not in queue');
            if (!isRed) {
                na_game.blue[foundPlayer[0].role] = {
                    tag: "",
                    id: ""
                };
                fs.writeFileSync('./data/na/game.json', JSON.stringify(na_game));
                const blueNA = await naChannel.messages.fetch(na_game.messages[1]);
                let buttons = blueNA.components[0].components;
                buttons = buttons.map(button => {
                    if (button.customId == `role-blue-${foundPlayer[0].role}-true`) {
                        button.setDisabled(false);
                    }
                    return button;
                });
                blueNA.components[0].components = buttons;
                blueNA.embeds[0].description = blueNA.embeds[0].description?.replace(foundPlayer[0].tag, 'empty');
                blueNA.edit({
                    embeds: blueNA.embeds,
                    components: blueNA.components
                });
                return interaction.editReply('Removed ' + member.displayName + ' from queue.');
            }
            else {
                na_game.red[foundPlayer[0].role] = {
                    tag: "",
                    id: ""
                };
                fs.writeFileSync('./data/na/game.json', JSON.stringify(na_game));
                const redNA = await naChannel.messages.fetch(na_game.messages[0]);
                let buttons = redNA.components[0].components;
                buttons = buttons.map(button => {
                    if (button.customId == `role-red-${foundPlayer[0].role}-true`) {
                        button.setDisabled(false);
                    }
                    return button;
                });
                redNA.components[0].components = buttons;
                redNA.embeds[0].description = redNA.embeds[0].description?.replace(foundPlayer[0].tag, 'empty');
                redNA.edit({
                    embeds: redNA.embeds,
                    components: redNA.components
                });
                return interaction.editReply('Removed ' + member.displayName + ' from queue.');
            }
        }
        else if (region == 'eu') {
            const euChannel = await this.container.client.channels.fetch(process.env.EU_CHANNEL);
            if (!euChannel?.isText())
                return;
            const bluePlayers = [];
            const redPlayers = [];
            let isRed = false;
            for (const [key, value] of Object.entries(eu_game.blue)) {
                bluePlayers.push({ role: key, tag: value.tag, id: value.id });
            }
            for (const [key, value] of Object.entries(eu_game.red)) {
                redPlayers.push({ role: key, tag: value.tag, id: value.id });
            }
            let foundPlayer = bluePlayers.filter((player) => player.id === member?.id);
            if (!foundPlayer.length) {
                foundPlayer = redPlayers.filter((player) => player.id === member?.id);
                isRed = true;
            }
            if (!foundPlayer.length)
                return interaction.editReply('Member is not in queue');
            if (!isRed) {
                eu_game.blue[foundPlayer[0].role] = {
                    tag: "",
                    id: ""
                };
                fs.writeFileSync('./data/eu/game.json', JSON.stringify(eu_game));
                const blueEU = await euChannel.messages.fetch(eu_game.messages[1]);
                let buttons = blueEU.components[0].components;
                buttons = buttons.map(button => {
                    if (button.customId == `role-blue-${foundPlayer[0].role}-false`) {
                        button.setDisabled(false);
                    }
                    return button;
                });
                blueEU.components[0].components = buttons;
                blueEU.embeds[0].description = blueEU.embeds[0].description?.replace(foundPlayer[0].tag, 'empty');
                blueEU.edit({
                    embeds: blueEU.embeds,
                    components: blueEU.components
                });
                return interaction.editReply('Removed ' + member.displayName + ' from queue.');
            }
            else {
                eu_game.red[foundPlayer[0].role] = {
                    tag: "",
                    id: ""
                };
                fs.writeFileSync('./data/eu/game.json', JSON.stringify(eu_game));
                const redEU = await euChannel.messages.fetch(eu_game.messages[0]);
                let buttons = redEU.components[0].components;
                buttons = buttons.map(button => {
                    if (button.customId == `role-red-${foundPlayer[0].role}-false`) {
                        button.setDisabled(false);
                    }
                    return button;
                });
                redEU.components[0].components = buttons;
                redEU.embeds[0].description = redEU.embeds[0].description?.replace(foundPlayer[0].tag, 'empty');
                redEU.edit({
                    embeds: redEU.embeds,
                    components: redEU.components
                });
            }
            return interaction.editReply('Removed ' + member.displayName + ' from queue.');
        }
        return interaction.editReply('Invalid region');
    }
    registerApplicationCommands(registry) {
        const builder = new builders_1.SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option => {
            option.setName('member')
                .setDescription('the member to remove')
                .setRequired(true);
            return option;
        })
            .addStringOption(option => {
            option.setName('region')
                .setRequired(true)
                .setChoices({ name: 'eu', value: 'eu' }, { name: 'na', value: 'na' })
                .setDescription('the region to select');
            return option;
        });
        registry.registerChatInputCommand(builder, {
            registerCommandIfMissing: true,
            behaviorWhenNotIdentical: "OVERWRITE" /* RegisterBehavior.Overwrite */,
            guildIds: [process.env.GUILD]
        });
    }
}
exports.Cancel = Cancel;
//# sourceMappingURL=remove.js.map