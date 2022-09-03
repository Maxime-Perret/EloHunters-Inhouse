import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { CommandInteraction } from "discord.js";
export declare class Cancel extends Command {
    constructor(context: Command.Context);
    chatInputRun(interaction: CommandInteraction): Promise<void>;
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
}
//# sourceMappingURL=cancel.d.ts.map