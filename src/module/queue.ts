import { TextChannel, VoiceChannel, Message } from 'discord.js';

import { Collection } from '@discordjs/collection';

import { Node, Player, TsumiInstance } from 'tsumi';
import { log } from './log.ts';

export interface GuildQueueOptions {
	guildId: string;
}

export class GuildQueue {
	constructor(options: GuildQueueOptions) {
		this.guildId = options.guildId || '';
	}

	guildId: string;

	queue: any[];
	index: number;

	textChannel: TextChannel | null | any;
	voiceChannel: VoiceChannel | null | any;

	node: Node;
	player: Player;

	log: log;

	init = async (ti: TsumiInstance, l: log): Promise<void> => {
		const n: Node | undefined = ti.getIdealNode();
		if (!n) throw new Error('No available nodes');
		this.node = n;
		this.log = l;
		return;
	};

	pause = async (): Promise<Object> => {
		return await this.player.pause();
	};

	resume = async (): Promise<Object> => {
		return await this.player.resume();
	};

	stop = async (): Promise<Object> => {
		return await this.player.stop();
	};

	skip = async (i: number | undefined): Promise<Object> => {
		if (!i) {
			this.index++;
			return await this.player.play({
				track: {
					encoded: this.queue[this.index as number].data.encoded,
				},
			});
		}
		this.index += i;
		return await this.player.play({
			track: {
				encoded: this.queue[this.index as number].data.encoded,
			},
		});
	};

	back = async (i: number | undefined): Promise<Object> => {
		if (!i) {
			this.index--;
			return await this.player.play({
				track: {
					encoded: this.queue[this.index as number].data.encoded,
				},
			});
		}
		this.index -= i;
		return await this.player.play({
			track: {
				encoded: this.queue[this.index as number].data.encoded,
			},
		});
	};

	seek = async (position: number): Promise<Object> => {
		return await this.player.seek(position);
	};

	join = async (channelId: string): Promise<Object> => {
		const player: Player = await this.node.joinVoiceChannel({
			guildId: this.guildId,
			channelId: channelId,
			options: {
				deaf: true,
				mute: false,
			},
		});
		this.player = player;
		this.player.removeAllListeners();
		this.handlePlayerEvent(this.player);
		return player;
	};

	handlePlayerEvent = async (p: Player): Promise<void> => {
		p.on('start', async (data: any) => {});
		p.on('end', async (data: any) => {});
	};
}

export class Queue {
	constructor() {
		this.guilds = new Collection();
	}

	guilds: Collection<string, GuildQueue>;

	get = (guildId: string): GuildQueue | undefined => {
		const guild: GuildQueue | undefined = this.guilds.get(guildId);
		if (!guild) {
			this.guilds.set(guildId, new GuildQueue({ guildId }));
		}
		return this.guilds.get(guildId);
	};

	remove = (guildId: string): boolean => {
		return this.guilds.delete(guildId);
	};
}
