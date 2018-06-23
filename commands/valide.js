exports.run = (client, message, args) => {
    message.delete(1000);
    if (args == []) return message.channel.send('Merci de mentionner la personne dont la facture est validée.');
    message.channel.send(args[0] + ' : validé par <@!' + message.author.id + '> !', {
        files: [{
            attachment: './assets/valide.png',
            name: 'valide.png'
        }]
    });
}