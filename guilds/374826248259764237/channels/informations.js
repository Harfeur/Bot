exports.run = (client, message) => {
    joueurs = message.channel.members.array();
    joueurs.forEach(function (joueur) {
        if (!joueur.user.bot) {
            joueur.send("Nouveau message de l'entreprise par **" + message.author.username + "** :\n" + message.content);
        }
    });
    if (message.content.startsWith('VOTE')) {
		message.react(message.guild.emojis.get('418752447557795842'))
			.catch(console.error);
		message.react(message.guild.emojis.get('418752462263025665'))
			.catch(console.error);
	}
}