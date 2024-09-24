import { TextChannel, VoiceChannel } from 'discord.js';

import { Collection } from '@discordjs/collection';

import { Node, Player } from 'tsumi';

export class GuildQueue {
	guildId: string;

	queue: Object[];
	queueSize: number;
	index: number;

	textChannel: TextChannel | null;
	voiceChannel: VoiceChannel | null;

	node: Node;
	player: Player;

	pause = async (): Promise<Object> => {
		return await this.player.pause();
	};

	resume = async (): Promise<Object> => {
		return await this.player.resume();
	};

	stop = async (): Promise<Object> => {
		return await this.player.stop();
	};
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
