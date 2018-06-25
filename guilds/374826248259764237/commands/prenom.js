exports.run = (client, message, args) => {
    if (message.channel.name === "bienvenue") {
        if (args[0] == undefined) return message.channel.send("Vous n'avez pas de prénom ?");
        if (args[0] != message.author.username) {
            message.member.setNickname(args[0] + ' (' + message.author.username + ')')
                .catch(console.error);
        }
        message.member.setRoles(['426780618647404555'])
            .catch(console.error);
        const channel = message.guild.channels.find('name', 'general');
        channel.send("Bienvenue à <@!" + message.author.id + "> sur le Discord !");
    }
}