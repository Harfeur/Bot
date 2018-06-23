exports.run = (client, message, args) => {
    let help = ['```xl',
        process.env.prefix + 'site : "Afficher le site de l\'entreprise"',
        process.env.prefix + 'recrutement : "Affixher le formulaire pour rejoindre l\'entreprise"',
        process.env.prefix + 'feuillederoute : "Télécharger une feuille de route vierge"',
        process.env.prefix + 'entreprise : "Accéder au tableur contenant les informations sur les feuilles de route, les camions, et les dépenses de l\'entreprise."',
        process.env.prefix + 'invite : "Affiche un lien permanent pour inviter quelqu\'un"',
        process.env.prefix + 'tb : "Tutoriel TrucksBook et site"',
        process.env.prefix + 'accident : "Signaler un accident avec votre camion"',
        process.env.prefix + 'assistance : "Signaler une demande d\'appel de dépaneuse pour votre camion"',
        process.env.prefix + 'garages : "Afficher les garages de l\'entreprise"',
        '',
        'Commandes pour la musique :'.toUpperCase(),
        process.env.prefix + 'join : "Envoyer le bot dans le canal audio actuel"',
        process.env.prefix + 'leave : "Enlever le bot du canal audio actuel"',
        process.env.prefix + 'add : "Ajouter un lien YouTube dans la queue"',
        process.env.prefix + 'queue : "Affiche la queue actuelle."',
        process.env.prefix + 'play : "Jouer la queue actuelle."',
        '',
        'Ces commandes fonctionnent uniquement en lecture:'.toUpperCase(),
        process.env.prefix + 'pause : "Pause la musique"',
        process.env.prefix + 'resume : "Résume la musique"',
        process.env.prefix + 'skip : "Saute la musique"',
        process.env.prefix + 'temps : "Affiche la durée de la musique"',
        'volume+ : "Augmente le volume de 5%"',
        'volume- : "Diminue le volume de 5%"',
        '```'
    ];

    message.channel.send("Envoyé par message privé");
    message.member.send(help.join('\n'));
}