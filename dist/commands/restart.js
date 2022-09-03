"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restart = void 0;
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const fs = tslib_1.__importStar(require("fs"));
class Restart extends framework_1.Command {
    constructor(context) {
        super(context, {
            name: 'restart',
            description: 'restart a queue',
            preconditions: ['GuildOnly', 'AdminOnly']
        });
    }
    async chatInputRun(interaction) {
        let eu_game = fs.readFileSync('./data/eu/game.json');
        eu_game = JSON.parse(eu_game.toString());
        let na_game = fs.readFileSync('./data/na/game.json');
        na_game = JSON.parse(na_game.toString());
        await interaction.deferReply({ ephemeral: true });
        const region = interaction.options.getString('region');
        if (region === 'na') {
            const naChannel = await this.container.client.channels.fetch(process.env.NA_CHANNEL);
            if (!naChannel?.isText())
                return;
            if (na_game.ongoing)
                return interaction.editReply('Game is ongoing.');
            Object.keys(na_game.blue).forEach((i) => na_game.blue[i] = { tag: '', id: '' });
            Object.keys(na_game.red).forEach((i) => na_game.red[i] = { tag: '', id: '' });
            fs.writeFileSync('./data/na/game.json', JSON.stringify(na_game));
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`Blue Team`)
                .setDescription(`**Top**: \`empty\`
            **Mid**: \`empty\`
            **Jungle**: \`empty\`
            **Bottom**: \`empty\`
            **Support**: \`empty\``)
                .setColor('#1e65e4')
                .setFooter({ text: 'use the buttons below to choose a role' });
            const row = new discord_js_1.MessageActionRow();
            const topButton = new discord_js_1.MessageButton()
                .setCustomId(`role-blue-top-true`)
                .setEmoji('<:top:969181832186855464>')
                .setStyle('SECONDARY');
            const midButton = new discord_js_1.MessageButton()
                .setCustomId(`role-blue-mid-true`)
                .setEmoji('<:mid:969182063129423952>')
                .setStyle('SECONDARY');
            const jungleButton = new discord_js_1.MessageButton()
                .setCustomId(`role-blue-jungle-true`)
                .setEmoji('<:jungle:969181873395892246>')
                .setStyle('SECONDARY');
            const botButton = new discord_js_1.MessageButton()
                .setCustomId(`role-blue-bottom-true`)
                .setEmoji('<:bot:969181943050665995>')
                .setStyle('SECONDARY');
            const supportButton = new discord_js_1.MessageButton()
                .setCustomId(`role-blue-support-true`)
                .setEmoji('<:support:969181989737496596>')
                .setStyle('SECONDARY');
            const buttons = [topButton, midButton, jungleButton, botButton, supportButton];
            row.setComponents(buttons);
            const blueNA = await naChannel.messages.fetch(na_game.messages[1]);
            blueNA.edit({
                embeds: [embed],
                components: [row]
            });
            const embed2 = new discord_js_1.MessageEmbed()
                .setTitle(`Red Team`)
                .setDescription(`**Top**: \`empty\`
        **Mid**: \`empty\`
        **Jungle**: \`empty\`
        **Bottom**: \`empty\`
        **Support**: \`empty\``)
                .setColor('#e41e46')
                .setFooter({ text: 'use the buttons below to choose a role' });
            row.setComponents([]);
            buttons.map(button => {
                button.setCustomId('role-red' + button.customId?.slice(9));
                row.addComponents(button);
            });
            const redNA = await naChannel.messages.fetch(na_game.messages[0]);
            redNA.edit({
                embeds: [embed2],
                components: [row]
            });
        }
        else {
            const euChannel = await this.container.client.channels.fetch(process.env.EU_CHANNEL);
            if (!euChannel?.isText())
                return;
            if (eu_game.ongoing)
                return interaction.editReply('Game is ongoing.');
            Object.keys(eu_game.blue).forEach((i) => eu_game.blue[i] = { tag: '', id: '' });
            Object.keys(eu_game.red).forEach((i) => eu_game.red[i] = { tag: '', id: '' });
            fs.writeFileSync('./data/eu/game.json', JSON.stringify(eu_game));
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`Blue Team`)
                .setDescription(`**Top**: \`empty\`
            **Mid**: \`empty\`
            **Jungle**: \`empty\`
            **Bottom**: \`empty\`
            **Support**: \`empty\``)
                .setColor('#1e65e4')
                .setFooter({ text: 'use the buttons below to choose a role' });
            const row = new discord_js_1.MessageActionRow();
            const topButton = new discord_js_1.MessageButton()
                .setCustomId(`role-blue-top-false`)
                .setEmoji('<:top:969181832186855464>')
                .setStyle('SECONDARY');
            const midButton = new discord_js_1.MessageButton()
                .setCustomId(`role-blue-mid-false`)
                .setEmoji('<:mid:969182063129423952>')
                .setStyle('SECONDARY');
            const jungleButton = new discord_js_1.MessageButton()
                .setCustomId(`role-blue-jungle-false`)
                .setEmoji('<:jungle:969181873395892246>')
                .setStyle('SECONDARY');
            const botButton = new discord_js_1.MessageButton()
                .setCustomId(`role-blue-bottom-false`)
                .setEmoji('<:bot:969181943050665995>')
                .setStyle('SECONDARY');
            const supportButton = new discord_js_1.MessageButton()
                .setCustomId(`role-blue-support-false`)
                .setEmoji('<:support:969181989737496596>')
                .setStyle('SECONDARY');
            const buttons = [topButton, midButton, jungleButton, botButton, supportButton];
            row.setComponents(buttons);
            const blueEU = await euChannel.messages.fetch(eu_game.messages[1]);
            blueEU.edit({
                embeds: [embed],
                components: [row]
            });
            const embed2 = new discord_js_1.MessageEmbed()
                .setTitle(`Red Team`)
                .setDescription(`**Top**: \`empty\`
        **Mid**: \`empty\`
        **Jungle**: \`empty\`
        **Bottom**: \`empty\`
        **Support**: \`empty\``)
                .setColor('#e41e46')
                .setFooter({ text: 'use the buttons below to choose a role' });
            row.setComponents([]);
            buttons.map(button => {
                button.setCustomId('role-red' + button.customId?.slice(9));
                row.addComponents(button);
            });
            const redEU = await euChannel.messages.fetch(eu_game.messages[0]);
            redEU.edit({
                embeds: [embed2],
                components: [row]
            });
        }
        interaction.editReply('Restarted the queue.');
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
exports.Restart = Restart;
//# sourceMappingURL=restart.js.map