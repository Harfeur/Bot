exports.run = (client, message, args) => {
    let joueur = message.content.split(' ')[1];
    message.delete(1000);
    if (joueur == undefined) return message.channel.send('Merci de mentionner la personne dont la facture est validée.');
    message.channel.send(joueur + ' : validé par <@!' + message.author.id + '> !', {
        files: [{
            attachment: '../assets/valide.png',
            name: 'valide.png'
        }]
    });
}