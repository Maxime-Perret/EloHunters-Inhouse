import type { UserError, ChatInputCommandDeniedPayload } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
export declare class CommandDeniedListener extends Listener {
    run(error: UserError, { interaction }: ChatInputCommandDeniedPayload): void;
}
//# sourceMappingURL=error.d.ts.map