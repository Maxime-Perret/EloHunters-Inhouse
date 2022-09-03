import type { CommandInteraction } from "discord.js";
import { Precondition } from '@sapphire/framework';
export declare class OwnerOnlyPrecondition extends Precondition {
    chatInputRun(interaction: CommandInteraction): Promise<import("@sapphire/framework").Result<unknown, import("@sapphire/framework").UserError>>;
    private checkOwner;
}
declare module '@sapphire/framework' {
    interface Preconditions {
        AdminOnly: never;
    }
}
//# sourceMappingURL=AdminOnly.d.ts.map