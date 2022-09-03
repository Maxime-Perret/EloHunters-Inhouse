"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandDeniedListener = void 0;
const framework_1 = require("@sapphire/framework");
class CommandDeniedListener extends framework_1.Listener {
    run(error, { interaction }) {
        console.log(error.message);
        interaction.editReply(error.message);
        // ...
    }
}
exports.CommandDeniedListener = CommandDeniedListener;
//# sourceMappingURL=error.js.map