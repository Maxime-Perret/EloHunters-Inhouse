"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EuropeAnnouncement = void 0;
const tslib_1 = require("tslib");
const plugin_scheduled_tasks_1 = require("@sapphire/plugin-scheduled-tasks");
const announce_1 = tslib_1.__importDefault(require("../utils/announce"));
class EuropeAnnouncement extends plugin_scheduled_tasks_1.ScheduledTask {
    constructor(context) {
        super(context, {
            cron: '0 10-22/2,0 * * *'
        });
    }
    async run() {
        (0, announce_1.default)(false);
    }
}
exports.EuropeAnnouncement = EuropeAnnouncement;
//# sourceMappingURL=eu.js.map