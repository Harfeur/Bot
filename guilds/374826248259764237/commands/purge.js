exports.run = async (client, message, args) => {
    if (message.author.hasPermission('MANAGE_MESSAGES')) {
        if (args[0] === undefined || args[0] < 2 || args[0] > 100)
            return message.reply("Merci de donner un nombre de 2 à 100 messages à supprimer.");
        const fetched = await message.channel.fetchMessages({
            limit: args[0]
        });
        message.channel.bulkDelete(fetched)
            .catch(error => message.reply(`Erreur: ${error}`));
    }
}