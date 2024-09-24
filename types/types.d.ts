import discord from 'discord.js';

declare module 'discord.js' {
	export interface Client {
		commands: discord.Collection<string, command>;
		buttons: discord.Collection<string, command>;
	}
}

export interface command {
	data: discord.SlashCommandBuilder;
	info: Object;
	autocomplete: Function | undefined;
	execute: Function;
}
