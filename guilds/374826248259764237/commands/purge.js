exports.run = async (client, message) => {
    if (message.author.id == process.env.MaxouCraft || message.author.id == process.env.Teddy) {
        const deleteCount = parseInt(args[0], 10);
        if (!deleteCount || deleteCount < 2 || deleteCount > 100)
            return message.reply("Merci de donner un nombre de 2 à 100 messages à supprimer.");
        const fetched = await message.channel.fetchMessages({
            limit: deleteCount
        });
        message.channel.bulkDelete(fetched)
            .catch(error => message.reply(`Erreur: ${error}`));
    }
}