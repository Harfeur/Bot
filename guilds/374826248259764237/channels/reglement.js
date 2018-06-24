exports.run = (client, message) => {
    message.member.removeRole('440542013348118548')
        .catch(console.error);
    message.member.addRole('374844057631064066')
        .catch(console.error);
    message.member.send('__**Bienvenue en tant que CDD !**__\nVous pouvez effectuer la commande **' + process.env.prefix + 'help** afin de connaitre les commandes nécessaires à l\'obtention des documents de travail.');
}