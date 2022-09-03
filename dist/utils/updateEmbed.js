"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmbed = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
function updateEmbed(message, team, NA) {
    let eu_game = fs.readFileSync('./data/eu/game.json');
    eu_game = JSON.parse(eu_game.toString());
    let na_game = fs.readFileSync('./data/na/game.json');
    na_game = JSON.parse(na_game.toString());
    if (team !== 'blue' && team !== 'red')
        return;
    message.embeds[0].description = `**Top**: \`${(NA ? na_game[team].top.tag : eu_game[team].top.tag) || 'empty'}\`
        **Jungle**: \`${(NA ? na_game[team].jungle.tag : eu_game[team].jungle.tag) || 'empty'}\`
        **Mid**: \`${(NA ? na_game[team].mid.tag : eu_game[team].mid.tag) || 'empty'}\`
        **Bottom**: \`${(NA ? na_game[team].bottom.tag : eu_game[team].bottom.tag) || 'empty'}\`
        **Support**: \`${(NA ? na_game[team].support.tag : eu_game[team].support.tag) || 'empty'}\``;
    let i = 0;
    for (const [_key, value] of Object.entries(NA ? na_game[team] : eu_game[team])) {
        if (value.id) {
            message.components[0].components[i].setDisabled(true);
        }
        i++;
    }
    return message.edit({ embeds: message.embeds, components: message.components });
}
exports.updateEmbed = updateEmbed;
//# sourceMappingURL=updateEmbed.js.map