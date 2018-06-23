const yt = require('ytdl-core');

exports.run = (client, message, args, queue) => {
    if (args[0] === undefined) return message.channel.send(`Vous devez ajouter un lien YouTube après ${process.env.prefix}add`);
    yt.getInfo(args[0], (err, info) => {
        if (err) return message.channel.send('Lien YouTube invalide: ' + err);
        if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
        queue[message.guild.id].songs.push({
            url: args[0],
            title: info.title,
            requester: message.author.username
        });
        message.channel.send(`**${info.title}** ajouté à la queue`);
    });
}