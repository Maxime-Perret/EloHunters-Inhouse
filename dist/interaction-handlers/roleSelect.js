"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleSelect = void 0;
const tslib_1 = require("tslib");
const framework_1 = require("@sapphire/framework");
const updateEmbed_1 = require("../utils/updateEmbed");
const gameStart_1 = tslib_1.__importDefault(require("../utils/gameStart"));
const fs = tslib_1.__importStar(require("fs"));
const discord_js_utilities_1 = require("@sapphire/discord.js-utilities");
const roles = {
    top: process.env.TOP,
    jungle: process.env.JG,
    mid: process.env.MID,
    bottom: process.env.ADC,
    support: process.env.SUPP
};
class RoleSelect extends framework_1.InteractionHandler {
    constructor(context) {
        super(context, {
            interactionHandlerType: "BUTTON" /* InteractionHandlerTypes.Button */
        });
    }
    async run(interaction, payload) {
        await interaction.deferReply({ ephemeral: true });
        if (!(0, discord_js_utilities_1.isGuildMember)(interaction.member))
            return;
        if (!interaction.member?.roles.resolve(roles[payload.role]) && !process.env.DEV) {
            return interaction.editReply('You don\'t have the required discord role.');
        }
        let eu_game = fs.readFileSync('./data/eu/game.json');
        eu_game = JSON.parse(eu_game.toString());
        let na_game = fs.readFileSync('./data/na/game.json');
        na_game = JSON.parse(na_game.toString());
        //exists check
        let exists = false;
        let sum = 0;
        for (const [_key, team] of Object.entries(payload.na ? na_game : eu_game)) {
            for (const [_key, user] of Object.entries(team)) {
                if (user) {
                    if (user.id === interaction.user.id && !process.env.DEV)
                        exists = true;
                    if (user.id)
                        sum++;
                }
            }
        }
        if (exists) {
            return interaction.editReply('You have already locked in a role!');
        }
        sum++; //add one more if they dont exist
        let users = fs.readFileSync('./data/users.json');
        users = JSON.parse(users.toString());
        const existingUser = users.filter((user) => (user.id === interaction.member?.user.id && user.position === payload.role));
        if (!existingUser.length) {
            const newUsers = [...users, {
                    username: interaction.user.username,
                    id: interaction.user.id,
                    wins: 0,
                    losses: 0,
                    winrate: 0,
                    mvps: 0,
                    position: payload.role,
                    realMVP: 0
                }];
            fs.writeFileSync('./data/users.json', JSON.stringify(newUsers));
        }
        if (payload.team === 'red') {
            if (payload.na) {
                na_game.red[payload.role] = { tag: interaction.user.tag, id: interaction.user.id };
            }
            else {
                eu_game.red[payload.role] = { tag: interaction.user.tag, id: interaction.user.id };
            }
        }
        else {
            if (payload.na) {
                na_game.blue[payload.role] = { tag: interaction.user.tag, id: interaction.user.id };
            }
            else {
                eu_game.blue[payload.role] = { tag: interaction.user.tag, id: interaction.user.id };
            }
        }
        if (payload.na) {
            fs.writeFileSync('./data/na/game.json', JSON.stringify(na_game));
        }
        else {
            fs.writeFileSync('./data/eu/game.json', JSON.stringify(eu_game));
        }
        const fetchedMessage = await interaction.channel?.messages.fetch(interaction.message.id);
        await (0, updateEmbed_1.updateEmbed)(fetchedMessage, payload.team, payload.na);
        interaction.editReply(`You have locked in as ${payload.role} in the ${payload.team} team.`);
        if (sum >= 10) {
            if (payload.na) {
                na_game.ongoing = true;
                fs.writeFileSync('./data/na/game.json', JSON.stringify(na_game));
            }
            else {
                eu_game.ongoing = true;
                fs.writeFileSync('./data/eu/game.json', JSON.stringify(eu_game));
            }
            try {
                if ((0, discord_js_utilities_1.isTextChannel)(interaction.channel)) {
                    try {
                        // const messages = await interaction.channel.messages.fetch();
                        // await Promise.all(messages.map(async message => {
                        //     if (message.author.id === this.container.client.user!.id) {
                        //         try {
                        //             return await message.delete()
                        //         }
                        //         catch (e) {
                        //             console.error(e);
                        //         }
                        //     }
                        // }))
                        await interaction.channel.send('Both teams are full, each player got sent the tournament code and an invitation to the voice channel as a private message. Join the lobby on the League client as fast as possible so the game can start!');
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
            catch (e) {
                console.error(e);
            }
            (0, gameStart_1.default)(interaction, payload.na);
        }
    }
    async parse(interaction) {
        if (!interaction.customId.startsWith('role'))
            return this.none();
        const data = interaction.customId.split('-');
        const payload = {
            team: data[1],
            role: data[2],
            na: data[3] == 'true'
        };
        return this.some(payload);
    }
}
exports.RoleSelect = RoleSelect;
//# sourceMappingURL=roleSelect.js.map