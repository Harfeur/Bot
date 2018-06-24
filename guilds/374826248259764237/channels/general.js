exports.run = (client, message) => {
    if (message.content.startsWith("Bonjour") || message.content.startsWith("bonjour")) {
        message.reply("Bonjour !");
    }

    if (message.content.startsWith("Bonsoir") || message.content.startsWith("bonsoir")) {
        message.reply("Bonsoir !");
    }

    if (message.content.startsWith("Bonne nuit") || message.content.startsWith("bonne nuit")) {
        message.reply("Bonne nuit !");
    }
}