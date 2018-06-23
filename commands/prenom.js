exports.run = (client, message, args) => {
    if (message.channel.name === "bienvenue") {
        if (args == undefined) return message.channel.send("Vous n'avez pas de prénom ?");
        if (args[0] != message.author.username) {
            message.member.setNickname(args[0] + ' (' + message.author.username + ')')
                .catch(console.error);
        }
        message.channel.send('Merci beaucoup ' + args[0] + ' ! Une dernière chose, souhaites-tu rejoindre l\'entreprise ? Réponds par oui ou non :)');
    }
}