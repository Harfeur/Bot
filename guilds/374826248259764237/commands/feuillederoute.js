exports.run = (client, message, args) => {
    message.channel.send('Une fois terminée, vous devez poster la feuille de route dans le canal <#424673120532561922> et les comptables s\'en occuperont !', {
        files: [{
            attachment: './assets/Feuille_de_route.xlsx',
            name: 'Feuille de route.xlsx'
        }]
    });
    message.channel.send({
        files: [{
            attachment: './assets/Comment_faire_une_feuille_de_route.pdf',
            name: 'Comment faire une feuille de route.pdf'
        }]
    });
}