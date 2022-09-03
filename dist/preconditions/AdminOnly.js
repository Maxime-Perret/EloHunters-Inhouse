"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerOnlyPrecondition = void 0;
const discord_js_utilities_1 = require("@sapphire/discord.js-utilities");
const framework_1 = require("@sapphire/framework");
class OwnerOnlyPrecondition extends framework_1.Precondition {
    async chatInputRun(interaction) {
        // for slash command
        return this.checkOwner(interaction);
    }
    async checkOwner(interaction) {
        const role = await interaction.guild?.roles.fetch(process.env.ADMIN);
        if (!role)
            return this.error({ message: 'role doesn\'t exist' });
        if (!(0, discord_js_utilities_1.isGuildMember)(interaction.member))
            return this.error({ message: 'member is not in a guild' });
        // const userRoles = interaction.member?.roles.cache.has(role.id)
        if (!interaction.member?.roles.resolve(role.id))
            return this.error({ message: 'User doesnt have the required perms' });
        return this.ok();
    }
}
exports.OwnerOnlyPrecondition = OwnerOnlyPrecondition;
//# sourceMappingURL=AdminOnly.js.map