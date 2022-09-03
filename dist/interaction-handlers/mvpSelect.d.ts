import { InteractionHandler, Listener } from "@sapphire/framework";
import type { SelectMenuInteraction } from "discord.js";
export declare class MvpSelect extends InteractionHandler {
    constructor(context: Listener.Context);
    run(interaction: SelectMenuInteraction, mvp: string): Promise<void>;
    parse(interaction: SelectMenuInteraction): Promise<import("@sapphire/framework").Maybe<string>>;
}
//# sourceMappingURL=mvpSelect.d.ts.map