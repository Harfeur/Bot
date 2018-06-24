exports.run = (client, message) => {
    if (message.content.startsWith('Oui') || message.content.startsWith('oui')) {
        message.member.send('```Pour être recruté, rien de plus simple. Il vous suffit de remplir le Google Forms et une réponse vous sera donnée dans les plus brefs délais.```\n\nhttps://goo.gl/forms/ncAFvOXsOkj8mRGr2')
        message.member.setRoles(['426780618647404555'])
            .catch(console.error);
        const channel = message.guild.channels.find('name', 'general');
        channel.send("Bienvenue à <@!" + message.author.id + "> sur le Discord !");
    }
    if (message.content.startsWith('Non') || message.content.startsWith('non')) {
        message.member.setRoles(['426780618647404555'])
            .catch(console.error);
        const channel = message.guild.channels.find('name', 'general');
        channel.send("Bienvenue à <@!" + message.author.id + "> sur le Discord !");
    }

}