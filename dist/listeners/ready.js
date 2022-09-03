"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ready = void 0;
const framework_1 = require("@sapphire/framework");
class Ready extends framework_1.Listener {
    constructor(context) {
        super(context, {
            event: framework_1.Events.ClientReady,
            once: true
        });
    }
    async run() {
        this.container.logger.info(`Logged in as ${this.container.client.user?.tag}!`);
    }
}
exports.Ready = Ready;
//# sourceMappingURL=ready.js.map