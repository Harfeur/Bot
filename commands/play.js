exports.run = (client, message, args) => {
    if (queue[message.guild.id] === undefined) return message.channel.send(`Ajoutez d\'abbord des musiques avec ${process.env.prefix}add`);
    if (!message.guild.voiceConnection) return commands.join(message).then(() => commands.play(message));
    if (queue[message.guild.id].playing) return message.channel.send('Déja en lecture');
    let dispatcher;
    queue[message.guild.id].playing = true;

    console.log(queue);
    (function play(song) {
        console.log(song);
        if (song === undefined) return message.channel.send('La file d\'attente est vide').then(() => {
            queue[message.guild.id].playing = false;
            message.member.voiceChannel.leave();
        });
        message.channel.send(`Lecture de: **${song.title}** comme demandé par: **${song.requester}**`);
        dispatcher = message.guild.voiceConnection.playStream(yt(song.url, {
            audioonly: true
        }), {
            passes: process.env.passes
        });
        let collector = message.channel.createCollector(m => m);
        dispatcher.setVolume(0.2);
        collector.on('message', m => {
            if (m.content.startsWith(process.env.prefix + 'pause')) {
                message.channel.send('Mis en pause').then(() => {
                    dispatcher.pause();
                });
            } else if (m.content.startsWith(process.env.prefix + 'resume')) {
                message.channel.send('Reprise').then(() => {
                    dispatcher.resume();
                });
            } else if (m.content.startsWith(process.env.prefix + 'skip')) {
                message.channel.send('Passée').then(() => {
                    dispatcher.end();
                });
            } else if (m.content.startsWith('volume+')) {
                if (Math.round(dispatcher.volume * 50) >= 100) return message.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
                dispatcher.setVolume(Math.min((dispatcher.volume * 50 + (5 * (m.content.split('+').length - 1))) / 50, 2));
                message.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
            } else if (m.content.startsWith('volume-')) {
                if (Math.round(dispatcher.volume * 50) <= 0) return message.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
                dispatcher.setVolume(Math.max((dispatcher.volume * 50 - (5 * (m.content.split('-').length - 1))) / 50, 0));
                message.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
            } else if (m.content.startsWith(process.env.prefix + 'temps')) {
                message.channel.send(`Temps: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000) / 1000) < 10 ? '0' + Math.floor((dispatcher.time % 60000) / 1000) : Math.floor((dispatcher.time % 60000) / 1000)}`);
            }
        });
        dispatcher.on('end', () => {
            collector.stop();
            play(queue[message.guild.id].songs.shift());
        });
        dispatcher.on('error', (err) => {
            return message.channel.send('error: ' + err).then(() => {
                collector.stop();
                play(queue[message.guild.id].songs.shift());
            });
        });
    })(queue[message.guild.id].songs.shift());
}