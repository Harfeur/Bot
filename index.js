const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');


client.on('ready', async () => {
    client.user.setStatus("idle");
    client.user.setActivity('Maintenance', {
        type: 'PLAYING'
    });
    console.log("Bot prêt !");
});


client.on('message', message => {



    if (message.content.indexOf(process.env.prefix) !== 0) return;
    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args);
    } catch (err) {
        console.error(err);
    }
});


client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find('name', 'bienvenue');
	channel.send("Bienvenue <@!" + member.user.id + "> sur le serveur Discord de **International Logistique** ! Afin de rejoindre le serveur, merci de me donner votre prénom en faisant **.prenom** suivi de votre prénom ! \n ``` Exemple : .prenom Léo ```");
});


client.on('guildMemberRemove', member => {
	const channel = member.guild.channels.find('name', 'direction');
	channel.send("**" + member.user.username + "** a quitté le serveur.");
});


client.on('voiceStateUpdate', (oldMember, newMember) => {
	if (oldMember.voiceChannelID == newMember.voiceChannelID) return;
	vocal = client.voiceConnections.array();
	vocal.forEach(function (canal) {
		if (canal.channel.id == oldMember.voiceChannelID) {
			membres = canal.channel.members.array();
			if (membres.length == 1) {
				canal.channel.leave();
			}
		}
	});
});


client.login(process.env.token);