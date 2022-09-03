"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cancel = void 0;
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_js_utilities_1 = require("@sapphire/discord.js-utilities");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const fs = tslib_1.__importStar(require("fs"));
const announce_1 = tslib_1.__importDefault(require("../utils/announce"));
class Cancel extends framework_1.Command {
    constructor(context) {
        super(context, {
            name: 'cancel',
            description: 'cancel a queue',
            preconditions: ['GuildOnly', 'AdminOnly'],
        });
    }
    async chatInputRun(interaction) {
        await interaction.deferReply({ ephemeral: true });
        let eu_game = fs.readFileSync('./data/eu/game.json');
        eu_game = JSON.parse(eu_game.toString());
        let na_game = fs.readFileSync('./data/na/game.json');
        na_game = JSON.parse(na_game.toString());
        const region = interaction.options.getString('region');
        if (region == 'na') {
            const naChannel = await this.container.client.channels.fetch(process.env.NA_CHANNEL);
            if (!(0, discord_js_utilities_1.isGuildBasedChannel)(naChannel))
                return;
            na_game.messages.map(async (message) => {
                try {
                    const foundMessage = await naChannel.messages.fetch(message);
                    foundMessage.delete();
                }
                catch {
                }
            });
            Object.keys(na_game.blue).forEach((i) => na_game.blue[i] = { tag: '', id: '' });
            Object.keys(na_game.red).forEach((i) => na_game.red[i] = { tag: '', id: '' });
            na_game.messages = [];
            fs.writeFileSync('./data/na/game.json', JSON.stringify(na_game));
            if (na_game.ongoing) {
                (0, announce_1.default)(true);
            }
        }
        else if (region == 'eu') {
            const euChannel = await this.container.client.channels.fetch(process.env.EU_CHANNEL);
            if (!(0, discord_js_utilities_1.isGuildBasedChannel)(euChannel))
                return;
            eu_game.messages.map(async (message) => {
                try {
                    const foundMessage = await euChannel.messages.fetch(message);
                    foundMessage.delete();
                }
                catch {
                }
            });
            Object.keys(eu_game.blue).forEach((i) => eu_game.blue[i] = { tag: '', id: '' });
            Object.keys(eu_game.red).forEach((i) => eu_game.red[i] = { tag: '', id: '' });
            eu_game.messages = [];
            fs.writeFileSync('./data/na/game.json', JSON.stringify(eu_game));
            if (eu_game.ongoing) {
                (0, announce_1.default)(false);
            }
        }
        const embed = new discord_js_1.MessageEmbed().setTitle('Success')
            .setColor('RED')
            .setDescription(`Successfully cancelled the queue.`);
        interaction.editReply({ embeds: [embed] });
    }
    registerApplicationCommands(registry) {
        const builder = new builders_1.SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
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
//# sourceMappingURL=cancel.js.map