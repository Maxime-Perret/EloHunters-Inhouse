"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const fs = tslib_1.__importStar(require("fs"));
async function announce(NA) {
    let eu_game = fs.readFileSync('./data/eu/game.json');
    eu_game = JSON.parse(eu_game.toString());
    if (!NA && eu_game.ongoing)
        return;
    let na_game = fs.readFileSync('./data/na/game.json');
    na_game = JSON.parse(na_game.toString());
    if (NA && na_game.ongoing)
        return;
    const { client } = framework_1.container;
    if (NA) {
        na_game.ongoing = false;
        Object.keys(na_game.blue).forEach((i) => na_game.blue[i] = { tag: '', id: '' });
        Object.keys(na_game.red).forEach((i) => na_game.red[i] = { tag: '', id: '' });
        fs.writeFileSync('./data/na/game.json', JSON.stringify(na_game));
    }
    else {
        eu_game.ongoing = false;
        Object.keys(eu_game.blue).forEach((i) => eu_game.blue[i] = { tag: '', id: '' });
        Object.keys(eu_game.red).forEach((i) => eu_game.red[i] = { tag: '', id: '' });
        fs.writeFileSync('./data/eu/game.json', JSON.stringify(eu_game));
    }
    const channel = await client.channels.fetch(!NA ? process.env.EU_CHANNEL : process.env.NA_CHANNEL);
    if (channel?.isText()) {
        try {
            const messages = await channel.messages.fetch();
            await Promise.all(messages.map(async (message) => {
                if (message.author.id === client.user.id) {
                    try {
                        return await message.delete();
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }));
        }
        catch (e) {
            console.error(e);
        }
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(`Blue Team`)
            .setDescription(`**Top**: \`empty\`
            **Jungle**: \`empty\`
            **Mid**: \`empty\`
            **Bottom**: \`empty\`
            **Support**: \`empty\``)
            .setColor('#1e65e4')
            .setFooter({ text: 'use the buttons below to choose a role' });
        const row = new discord_js_1.MessageActionRow();
        const topButton = new discord_js_1.MessageButton()
            .setCustomId(`role-blue-top-${NA}`)
            .setEmoji('<:top:969181832186855464>')
            .setStyle('SECONDARY');
        const jungleButton = new discord_js_1.MessageButton()
            .setCustomId(`role-blue-jungle-${NA}`)
            .setEmoji('<:jungle:969181873395892246>')
            .setStyle('SECONDARY');
        const midButton = new discord_js_1.MessageButton()
            .setCustomId(`role-blue-mid-${NA}`)
            .setEmoji('<:mid:969182063129423952>')
            .setStyle('SECONDARY');
        const botButton = new discord_js_1.MessageButton()
            .setCustomId(`role-blue-bottom-${NA}`)
            .setEmoji('<:bot:969181943050665995>')
            .setStyle('SECONDARY');
        const supportButton = new discord_js_1.MessageButton()
            .setCustomId(`role-blue-support-${NA}`)
            .setEmoji('<:support:969181989737496596>')
            .setStyle('SECONDARY');
        const buttons = [topButton, jungleButton, midButton, botButton, supportButton];
        row.setComponents(buttons);
        const announceMessage = await channel.send(`**InHouse Game Ongoing** <@&${!NA ? process.env.EU_ROLE : process.env.NA_ROLE}>`);
        const msg1 = await channel?.send({
            embeds: [embed],
            components: [row]
        });
        const embed2 = new discord_js_1.MessageEmbed()
            .setTitle(`Red Team`)
            .setDescription(`**Top**: \`empty\`
            **Jungle**: \`empty\`
            **Mid**: \`empty\`
            **Bottom**: \`empty\`
            **Support**: \`empty\``)
            .setColor('#e41e46')
            .setFooter({ text: 'use the buttons below to choose a role' });
        row.setComponents([]);
        buttons.map(button => {
            button.setCustomId('role-red' + button.customId?.slice(9));
            row.addComponents(button);
        });
        const msg = await channel?.send({
            embeds: [embed2],
            components: [row]
        });
        if (NA) {
            na_game.messages = [msg.id, msg1.id, announceMessage.id];
            fs.writeFileSync('./data/na/game.json', JSON.stringify(na_game));
        }
        else {
            eu_game.messages = [msg.id, msg1.id, announceMessage.id];
            fs.writeFileSync('./data/eu/game.json', JSON.stringify(eu_game));
        }
        setTimeout(async () => {
            if (NA) {
                try {
                    let new_na_game = fs.readFileSync('./data/na/game.json');
                    new_na_game = JSON.parse(new_na_game.toString());
                    if (new_na_game.ongoing)
                        return;
                    Object.keys(new_na_game.blue).forEach((i) => new_na_game.blue[i] = { tag: '', id: '' });
                    Object.keys(new_na_game.red).forEach((i) => new_na_game.red[i] = { tag: '', id: '' });
                    fs.writeFileSync('./data/na/game.json', JSON.stringify(new_na_game));
                    announceMessage.delete();
                    msg1.delete();
                    msg.delete();
                    const warn = await channel.send(`Queue was cancelled due to inactivity, next queue available in 80 mins`);
                    setTimeout(() => {
                        warn.delete();
                    }, 80 * 60 * 1000);
                }
                catch (e) {
                    console.error(e);
                }
            }
            else {
                try {
                    let new_eu_game = fs.readFileSync('./data/eu/game.json');
                    new_eu_game = JSON.parse(new_eu_game.toString());
                    if (new_eu_game.ongoing)
                        return;
                    Object.keys(new_eu_game.blue).forEach((i) => new_eu_game.blue[i] = { tag: '', id: '' });
                    Object.keys(new_eu_game.red).forEach((i) => new_eu_game.red[i] = { tag: '', id: '' });
                    fs.writeFileSync('./data/eu/game.json', JSON.stringify(new_eu_game));
                    announceMessage.delete();
                    msg1.delete();
                    msg.delete();
                    const warn = await channel.send(`Queue was cancelled due to inactivity, next queue available in 80 mins`);
                    setTimeout(() => {
                        warn.delete();
                    }, 80 * 60 * 1000);
                }
                catch (e) {
                    console.error(e);
                }
            }
        }, 60 * 40 * 1000);
    }
}
exports.default = announce;
//# sourceMappingURL=announce.js.map