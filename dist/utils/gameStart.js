"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const axios_1 = tslib_1.__importDefault(require("axios"));
const fs = tslib_1.__importStar(require("fs"));
const framework_1 = require("@sapphire/framework");
async function grabInvite(channelID) {
    const { client } = framework_1.container;
    const channel = await client.channels.fetch(channelID);
    if (channel?.isVoice()) {
        const invite = await channel.createInvite();
        return invite;
    }
    return null;
}
async function gameStart(interaction, NA) {
    let eu_game = fs.readFileSync('./data/eu/game.json');
    eu_game = JSON.parse(eu_game.toString());
    let na_game = fs.readFileSync('./data/na/game.json');
    na_game = JSON.parse(na_game.toString());
    try {
        // const { data } = await axios.post(`https://americas.api.riotgames.com/lol/tournament-stub/v4/providers?api_key=RGAPI-67a289bf-8278-4eaf-874e-af05d6a54c4d`,
        //     { "region": "EUW", "url": "https://dd1e-2003-d3-a736-e647-41a1-f7e-c226-f401.eu.ngrok.io" }
        // )
        //------
        const { data: tournament } = await axios_1.default.post(`https://americas.api.riotgames.com/lol/tournament/v4/tournaments?api_key=RGAPI-67a289bf-8278-4eaf-874e-af05d6a54c4d`, {
            "name": "InHouse",
            "providerId": !NA ? 12900 : 12909
        });
        const { data: tournamentCode } = await axios_1.default.post(`https://americas.api.riotgames.com/lol/tournament/v4/codes?count=1&tournamentId=${tournament}&api_key=RGAPI-67a289bf-8278-4eaf-874e-af05d6a54c4d`, {
            "mapType": "SUMMONERS_RIFT",
            "metadata": "",
            "pickType": "TOURNAMENT_DRAFT",
            "spectatorType": "ALL",
            "teamSize": 5
        });
        let bluePermissions = [{ id: interaction.guild.roles.everyone.id, deny: ['CONNECT'], type: 'role' }];
        let redPermissions = [{ id: interaction.guild.roles.everyone, deny: ['CONNECT'] }];
        let blueChannel = null;
        let redChannel = null;
        if (!process.env.DEV) {
            if (NA) {
                blueChannel = await interaction.guild?.channels.create('🔵 Blue Team', { type: 'GUILD_VOICE', userLimit: 5, position: 0 });
                redChannel = await interaction.guild?.channels.create('🔴 Red Team', { type: 'GUILD_VOICE', userLimit: 5, position: 1 });
                blueChannel?.setParent(process.env.NA_VC_CATEGORY);
                redChannel?.setParent(process.env.NA_VC_CATEGORY);
                na_game.voice = [blueChannel?.id, redChannel?.id];
                fs.writeFileSync('./data/na/game.json', JSON.stringify(na_game));
                for (const [position, user] of Object.entries(na_game.red)) {
                    redPermissions.push({
                        id: user.id,
                        type: 'member',
                        allow: 'CONNECT'
                    });
                }
                for (const [position, user] of Object.entries(na_game.blue)) {
                    bluePermissions.push({
                        id: user.id,
                        type: 'member',
                        allow: 'CONNECT'
                    });
                }
                blueChannel.edit({
                    permissionOverwrites: bluePermissions
                });
                redChannel.edit({ permissionOverwrites: redPermissions });
            }
            else {
                blueChannel = await interaction.guild?.channels.create('🔵 Blue Team', { type: 'GUILD_VOICE', userLimit: 5, position: 0 });
                redChannel = await interaction.guild?.channels.create('🔴 Red Team', { type: 'GUILD_VOICE', userLimit: 5, position: 1 });
                blueChannel?.setParent(process.env.EU_VC_CATEGORY);
                redChannel?.setParent(process.env.EU_VC_CATEGORY);
                eu_game.voice = [blueChannel?.id, redChannel?.id];
                for (const [position, user] of Object.entries(eu_game.red)) {
                    redPermissions.push({
                        id: user.id,
                        type: 'member',
                        allow: 'CONNECT'
                    });
                }
                for (const [position, user] of Object.entries(eu_game.blue)) {
                    bluePermissions.push({
                        id: user.id,
                        type: 'member',
                        allow: 'CONNECT'
                    });
                }
                fs.writeFileSync('./data/eu/game.json', JSON.stringify(eu_game));
                blueChannel.edit({
                    permissionOverwrites: bluePermissions
                });
                redChannel.edit({ permissionOverwrites: redPermissions });
            }
        }
        const embed = new discord_js_1.MessageEmbed()
            .setTitle('InHouse Tournament')
            .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/LoL_icon.svg/2048px-LoL_icon.svg.png')
            .setDescription('The InHouse tournament has been created, you can now join using the code below.')
            .setColor('#e92c2c');
        let chosenGame = NA ? na_game : eu_game;
        let redTeam = [];
        let blueTeam = [];
        let redInvite = '';
        let blueInvite = '';
        for (const [_key, team] of Object.entries(chosenGame)) {
            if (_key == 'red' || _key == 'blue') {
                if (_key == 'red') {
                    redTeam = team;
                    redInvite = !process.env.DEV ? (await grabInvite(redChannel.id))?.url : 'None';
                }
                else if (_key == 'blue') {
                    blueTeam = team;
                    blueInvite = !process.env.DEV ? (await grabInvite(blueChannel.id))?.url : 'None';
                }
            }
        }
        for (const [_user_key, user] of Object.entries(redTeam)) {
            try {
                embed.setFields([{
                        name: 'Tournament Code',
                        value: `\`${tournamentCode}\``
                    }, {
                        name: 'Voice Channel',
                        value: redInvite
                    }]);
                const fetchedUser = await interaction.guild?.members.fetch(user.id);
                await fetchedUser?.send({ embeds: [embed] });
            }
            catch (e) {
                console.error('error sending user their dm', e);
            }
        }
        for (const [_user_key, user] of Object.entries(blueTeam)) {
            try {
                embed.setFields([{
                        name: 'Tournament Code',
                        value: `\`${tournamentCode}\``
                    }, {
                        name: 'Voice Channel',
                        value: blueInvite
                    }]);
                const fetchedUser = await interaction.guild?.members.fetch(user.id);
                await fetchedUser?.send({ embeds: [embed] });
            }
            catch (e) {
                console.error('error sending user their dm', e);
            }
        }
        // if (!process.env.DEV) {
        //     setTimeout(() => {
        //         try {
        //             blueChannel?.delete()
        //             redChannel?.delete()
        //         }
        //         catch {
        //         }
        //     }, 5 * 60 * 1000);
        // }
    }
    catch (e) {
        framework_1.container.logger.error(e);
        console.error(e);
        console.log(e.response.data);
    }
}
exports.default = gameStart;
//# sourceMappingURL=gameStart.js.map