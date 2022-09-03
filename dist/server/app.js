"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const framework_1 = require("@sapphire/framework");
const gameEnd_1 = tslib_1.__importDefault(require("../utils/gameEnd"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const app = (0, express_1.default)();
app.post('/game_ended', body_parser_1.default.json(), async (req, res) => {
    // const { region } = req.body;
    console.log('recieved game results: ' + JSON.stringify(req.body));
    // endGame(region.substring(0, 2) == 'NA')
    const NA = req.body.region !== "EUW1";
    const Region = NA ? 'americas' : 'europe';
    const { data } = await axios_1.default.get(`https://${Region}.api.riotgames.com/lol/match/v5/matches/${req.body.region}_${req.body.gameId}?api_key=RGAPI-67a289bf-8278-4eaf-874e-af05d6a54c4d`);
    (0, gameEnd_1.default)(NA, data);
    res.sendStatus(200);
});
app.listen(80, () => {
    framework_1.container.logger.info(`Server is running at port ${80}`);
});
//# sourceMappingURL=app.js.map