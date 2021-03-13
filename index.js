const Discord = require('discord.js');
const Client = Discord.Client;
const handlers = require('discord.js').WebSocketManager

Client.prototype.registerCommand = function (data) {
	return this.api.applications(this.user.id).commands.post({data});
}

Client.prototype.registerCommandToGuild = function (guildId, data) {
	return this.api.applications(this.user.id).guilds(guildId).commands.post({data});
}

/**
 * 
 * @param {Discord.Client} client 
 */
module.exports = function (client) {
	client.ws.on('INTERACTION_CREATE', async interaction => {
		client.channels.fetch(interaction.channel_id).then(channel => {
			interaction.member = new Discord.GuildMember(client, interaction.member, channel.guild);
			interaction.channel = channel;
			client.emit('interactionCreate', interaction);
		});
	});
}