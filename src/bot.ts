import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import discord from 'discord.js';
import * as types from '../types/types.ts';

import { TsumiInstance } from 'tsumi';
const config = {
	bot: {
		applicationId: '123456789',
	},
	config: {
		log: {
			filePath: './logs/log.txt',
			folderPath: './logs',
		},
		userAgent: 'Mue/0.0.1',
	},
};

import { Queue as q } from './module/queue.ts';
import { log as l } from './module/log.ts';
const log: l = new l({
	logFilePath: config.config.log.filePath,
	logLevel: 0,
	fileLogThreshold: 0,
	logFolderPath: config.config.log.folderPath,
});
log.init();

const client: discord.Client = new discord.Client({
	intents: [
		discord.GatewayIntentBits.GuildEmojisAndStickers,
		discord.GatewayIntentBits.GuildIntegrations,
		discord.GatewayIntentBits.GuildMembers,
		//discord.GatewayIntentBits.GuildMessageReactions,
		//discord.GatewayIntentBits.GuildMessageTyping,
		discord.GatewayIntentBits.GuildMessages,
		discord.GatewayIntentBits.GuildVoiceStates,
		//discord.GatewayIntentBits.GuildWebhooks,
		discord.GatewayIntentBits.Guilds,
		discord.GatewayIntentBits.MessageContent,
	],
	partials: [
		discord.Partials.Channel,
		discord.Partials.GuildMember,
		//discord.Partials.GuildScheduledEvent,
		discord.Partials.Message,
		//discord.Partials.Reaction,
		discord.Partials.ThreadMember,
		discord.Partials.User,
	],
	shards: 'auto',
});

const Tsumi: TsumiInstance = new TsumiInstance({
	botId: config.bot.applicationId,
	sendPayload: (guildId: string, payload: any): any => {
		client.guilds.cache.get(guildId)?.shard.send(payload);
	},
	userAgent: config?.config?.userAgent || 'Mue/0.0.1',
});

const Queue: q = new q();

declare module 'discord.js' {
	export interface Client {
		commands: discord.Collection<string, types.command>;
		buttons: discord.Collection<string, types.command>;
	}
}
client.commands = new discord.Collection();
client.buttons = new discord.Collection();

/*
const commandsFolder = fs.readdirSync(path.join(__dirname, 'commands'));
for (const folder of commandsFolder) {
	const commandsPath = path.join(path.join(__dirname, 'commands'), folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.ts'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			log.log(
				`The command at ${filePath} is missing a required "data" or "execute" property.`,
				2
			);
		}
	}
}
*/

client.once('ready', async () => {
	log.log(`Logged in as ${client.user?.tag}`, 1);
});
