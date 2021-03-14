const Discord = require('discord.js');
const Client = Discord.Client;
const {APPLICATION_COMMAND_OPTION_TYPE : types} = require('./Constants');

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
		client.channels.fetch(interaction.channel_id).then(async channel => {
			interaction.member = new Discord.GuildMember(client, interaction.member, channel.guild);
			interaction.channel = channel;
			if (interaction.data.options) {
				for (const i in interaction.data.options) {
					const option = interaction.data.options[i];
					if (option.type === types.USER) option.value = await client.users.fetch(option.value);
					else if (option.type === types.CHANNEL) option.value = await client.channels.fetch(option.value);
					else if (option.type === types.ROLE) option.value = await channel.guild.roles.fetch(option.value);
				}
			}
			client.emit('interactionCreate', interaction);
		});
	});
}