"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Start = void 0;
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const framework_1 = require("@sapphire/framework");
const announce_1 = tslib_1.__importDefault(require("../utils/announce"));
class Start extends framework_1.Command {
    constructor(context) {
        super(context, {
            name: 'start',
            description: 'clear everything and start a new queue',
            preconditions: ['GuildOnly', 'AdminOnly']
        });
    }
    async chatInputRun(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });
        const na = interaction.options.getString('region') === 'na';
        await (0, announce_1.default)(na);
        interaction.editReply('Successfully started a new queue');
    }
    registerApplicationCommands(registry) {
        const builder = new builders_1.SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(option => {
            option.setName('region');
            option.setChoices({
                name: 'na',
                value: 'na'
            }, {
                name: 'eu',
                value: 'eu'
            });
            option.setDescription('the region to select');
            option.setRequired(true);
            return option;
        });
        registry.registerChatInputCommand(builder, { guildIds: [process.env.GUILD], behaviorWhenNotIdentical: "OVERWRITE" /* RegisterBehavior.Overwrite */ });
    }
}
exports.Start = Start;
//# sourceMappingURL=start.js.map