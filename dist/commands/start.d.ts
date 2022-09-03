import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";
export declare class Start extends Command {
    constructor(context: Command.Context);
    chatInputRun(interaction: CommandInteraction): Promise<void>;
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=start.d.ts.map