import { TextChannel, VoiceChannel } from 'discord.js';

import { Collection } from '@discordjs/collection';

export class GuildQueue {
	guildId: string;

	queue: object[];
	queueSize: number;
	index: number;

	textChannel: TextChannel | null;
	voiceChannel: VoiceChannel | null;
}

export class Queue {
	guilds: Collection<string, GuildQueue>;

	get = (guildId: string): GuildQueue | undefined => {
		const guild: GuildQueue | undefined = this.guilds.get(guildId);
		if (!guild) {
			this.guilds.set(guildId, new GuildQueue());
		}
		return this.guilds.get(guildId);
	};

	remove = (guildId: string): boolean => {
		return this.guilds.delete(guildId);
	};
}
