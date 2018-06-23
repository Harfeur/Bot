exports.run = (client, message) => {
    messageisfile = 0;
    fichiers = message.attachments.array();
    fichiers.forEach(function (fichier) {
        if (fichier.filename.endsWith('.xlsx') || fichier.filename.endsWith('.ods')) {
            messageisfile = 1;
            joueurs = message.channel.members.array();
            joueurs.forEach(function (joueur) {
                role = joueur.roles.array();
                role.forEach(function (comptable) {
                    if (comptable.id == 384377920317161472) {
                        joueur.send("Nouvelle feuille de route à traiter (de **" + message.author.username + "**). <#424673120532561922>");
                    }
                });
            });
        }
        if (fichier.filename.endsWith('.docx') || fichier.filename.endsWith('.odt')) messageisfile = 1;
        if (fichier.filename.endsWith('.png') && message.author.bot) messageisfile = 1;
    })
    if (messageisfile == 0) {
        if (message.content.startsWith('.valide') || message.content.startsWith('.refuse')) {}
        else {
            message.delete();
            if (!message.author.bot) message.member.send("Merci d\'écrire uniquement dans le canal <#374842067983007744>");
        }
    }

}