"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsaAnnouncement = void 0;
const tslib_1 = require("tslib");
const plugin_scheduled_tasks_1 = require("@sapphire/plugin-scheduled-tasks");
const announce_1 = tslib_1.__importDefault(require("../utils/announce"));
class UsaAnnouncement extends plugin_scheduled_tasks_1.ScheduledTask {
    constructor(context) {
        super(context, {
            cron: '0 */2 * * *'
        });
    }
    async run() {
        (0, announce_1.default)(true);
    }
}
exports.UsaAnnouncement = UsaAnnouncement;
//# sourceMappingURL=na.js.map