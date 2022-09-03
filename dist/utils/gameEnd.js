"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const utilities_1 = require("@sapphire/utilities");
const fs = tslib_1.__importStar(require("fs"));
const announce_1 = tslib_1.__importDefault(require("./announce"));
async function endGame(NA, gameData) {
    let eu_game = fs.readFileSync('./data/eu/game.json');
    eu_game = JSON.parse(eu_game.toString());
    let na_game = fs.readFileSync('./data/na/game.json');
    na_game = JSON.parse(na_game.toString());
    let winningTeam = '';
    gameData.info.teams.map((team) => {
        if (team.teamId == 100 && team.win)
            winningTeam = 'blue';
        else if (team.teamId == 200 && team.win)
            winningTeam = 'red';
    });
    const { client } = framework_1.container;
    let players = [];
    for (const [_key, value] of Object.entries(NA ? na_game.blue : eu_game.blue)) {
        players.push({ ...value, position: _key, winning: winningTeam == 'blue' ? true : false });
    }
    for (const [_key, value] of Object.entries(NA ? na_game.red : eu_game.red)) {
        players.push({ ...value, position: _key, winning: winningTeam == 'red' ? true : false });
    }
    if (!winningTeam)
        return console.log("None of the teams have won, aborting...");
    let discordUsers = await Promise.allSettled(players.map(async (player) => {
        const fetchedUser = client.users.fetch(player.id);
        return fetchedUser;
    }));
    discordUsers = discordUsers.filter((container) => container.status === 'fulfilled');
    discordUsers = discordUsers.map((player) => player.value); //a list of all players' discord
    discordUsers.map(async (user) => {
        const row = new discord_js_1.MessageActionRow();
        const selectMenu = new discord_js_1.MessageSelectMenu().setCustomId('select-mvp');
        let filteredUsers = discordUsers.filter((player) => player.id !== user.id); //returns a filtered user list
        let options = filteredUsers.map((userChild) => {
            return {
                label: userChild.tag,
                value: userChild.id
            };
        }).filter(utilities_1.filterNullAndUndefinedAndEmpty);
        if (process.env.DEV) {
            options = options.map((option, i) => {
                option = {
                    label: 'Dont choose me',
                    value: `placeholder-${i}`
                };
                return option;
            });
            options[0] = {
                label: players[0].tag,
                value: players[0].id
            };
        }
        selectMenu.addOptions(options);
        row.addComponents(selectMenu);
        try {
            const mvpMsg = await user.send({
                content: 'Game has ended, Vote below for the MVP',
                components: [row]
            });
            setTimeout(async () => {
                try {
                    try {
                        const fetchedMessage = await mvpMsg.channel.messages.fetch(mvpMsg.id);
                        if (fetchedMessage) {
                            try {
                                await fetchedMessage.delete();
                            }
                            catch (e) {
                                console.error(e);
                            }
                        }
                    }
                    catch (e) {
                        console.error(e);
                    }
                    let users = fs.readFileSync('./data/users.json');
                    users = JSON.parse(users.toString());
                    const ordered_users = users.sort((a, b) => b.mvps - a.mvps);
                    if (ordered_users[0].mvps) {
                        ordered_users[0].realMVP++;
                    }
                    let updatedUsers = ordered_users.map((user) => {
                        user.mvps = 0;
                        return user;
                    });
                    fs.writeFileSync('./data/users.json', JSON.stringify(updatedUsers));
                }
                catch (e) {
                    framework_1.container.logger.error(e);
                }
            }, 40 * 1000);
        }
        catch (e) {
            framework_1.container.logger.error(e);
        }
    });
    if (NA) {
        na_game.voice.map(async (channelID) => {
            try {
                const channel = await client.channels.fetch(channelID);
                setTimeout(async () => {
                    try {
                        await channel?.delete();
                    }
                    catch (e) {
                        console.error(e);
                    }
                }, 3 * 60 * 1000);
            }
            catch (e) {
                framework_1.container.logger.error(e);
            }
        });
        na_game.ongoing = false;
        // na_game.messages.map(async (message: Snowflake) => {
        //     try {
        //         const channel = await client.channels.fetch(process.env.NA_CHANNEL!);
        //         if (isGuildBasedChannel(channel)) {
        //             const fetchedMessage = await channel.messages.fetch(message);
        //             await fetchedMessage.delete();
        //         }
        //     }
        //     catch (e) {
        //         console.error(e)
        //     }
        // })
        // na_game.messages = [];
        fs.writeFileSync('./data/na/game.json', JSON.stringify(na_game));
    }
    else {
        eu_game.voice.map(async (channelID) => {
            try {
                const channel = await client.channels.fetch(channelID);
                setTimeout(async () => {
                    try {
                        await channel?.delete();
                    }
                    catch (e) {
                        console.error(e);
                    }
                }, 3 * 60 * 1000);
            }
            catch (e) {
                framework_1.container.logger.error(e);
            }
        });
        eu_game.ongoing = false;
        // eu_game.messages.map(async (message: Snowflake) => {
        //     try {
        //         const channel = await client.channels.fetch(process.env.EU_CHANNEL!);
        //         if (isGuildBasedChannel(channel)) {
        //             const fetchedMessage = await channel.messages.fetch(message);
        //             await fetchedMessage.delete();
        //         }
        //     }
        //     catch (e) {
        //         console.error(e)
        //     }
        // })
        // eu_game.messages = [];
        fs.writeFileSync('./data/eu/game.json', JSON.stringify(eu_game));
    }
    let users = fs.readFileSync('./data/users.json');
    users = JSON.parse(users.toString());
    players.map((player) => {
        const foundUser = users.filter((user) => player.id == user.id && user.position == player.position);
        if (!foundUser[0])
            return;
        if (player.winning) {
            foundUser[0].wins++;
        }
        else {
            foundUser[0].losses++;
        }
    });
    fs.writeFileSync('./data/users.json', JSON.stringify(users));
    setTimeout(() => {
        (0, announce_1.default)(NA);
    }, 5 * 60 * 1000);
}
exports.default = endGame;
//# sourceMappingURL=gameEnd.js.map