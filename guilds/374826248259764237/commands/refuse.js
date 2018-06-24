exports.run = (client, message, args) => {
    message.delete(1000);
    if (args[0] == undefined) return message.channel.send('Merci de mentionner la personne dont la facture est refusée.');
    message.channel.send(args[0] + ' : refusé par <@!' + message.author.id + '> !', {
        files: [{
            attachment: './assets/refuse.png',
            name: 'refuse.png'
        }]
    });
}