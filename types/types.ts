import * as discord from 'discord.js';

export interface command {
	data: discord.SlashCommandBuilder;
	info: Object;
	autocomplete: Function | undefined;
	execute: Function;
}

export interface rawTrack {
	track: encoded;
}

export interface encoded {
	encoded: string;
}

export interface track {
	data: encoded;
}
