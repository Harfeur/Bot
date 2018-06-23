const Discord = require('discord.js');
const client = new Discord.Client();

const yt = require('ytdl-core');
const fs = require('fs');
let queue = {};

const musique = {
    'play': (message) => {
        if (queue[message.guild.id] === undefined) return message.channel.send(`Ajoutez d\'abbord des musiques avec ${process.env.prefix}add`);
        if (!message.guild.voiceConnection) return musique.join(message).then(() => musique.play(message));
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
    },
    'add': (message) => {
        let url = message.content.split(' ')[1];
        if (url == '' || url === undefined) return message.channel.send(`Vous devez ajouter un lien YouTube après ${process.env.prefix}add`);
        yt.getInfo(url, (err, info) => {
            if (err) return message.channel.send('Lien YouTube invalide: ' + err);
            if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
            queue[message.guild.id].songs.push({
                url: url,
                title: info.title,
                requester: message.author.username
            });
            message.channel.send(`**${info.title}** ajouté à la queue`);
        });
    },
    'queue': (message) => {
        if (queue[message.guild.id] === undefined) return message.channel.send(`Ajoutez des musiques à la queue avec ${process.env.prefix}add`);
        let tosend = [];
        queue[message.guild.id].songs.forEach((song, i) => {
            tosend.push(`${i + 1}. ${song.title} - Demandé par: ${song.requester}`);
        });
        message.channel.send(`Queue de musiques : Actuellement **${tosend.length}** musiques dans la queue. ${(tosend.length > 15 ? '*[Sueles les 15 prochaines sont affichées]*' : '')}\n\`\`\`${tosend.slice(0, 15).join('\n')}\`\`\``);
    },
    'join': (message) => {
        return new Promise((resolve, reject) => {
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('Je ne peux pas me connecter au canal audio ...');
            voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
        });
    }
};

client.on('ready', async () => {
    client.user.setStatus("online");
    client.user.setActivity('Commandes uniquement', {
        type: 'PLAYING'
    });
    console.log("Bot prêt !");
});


client.on('message', message => {



    if (message.content.indexOf(process.env.prefix) !== 0) return;
    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if ((command === "play") || (command === "add") || (command === "queue")) {
        musique[command](message)
    } else {

        try {
            let commandFile = require(`./commands/${command}.js`);
            commandFile.run(client, message, args);
        } catch (err) {
            console.error(err);
        }
    }
});


client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find('name', 'bienvenue');
    channel.send("Bienvenue <@!" + member.user.id + "> sur le serveur Discord de **International Logistique** ! Afin de rejoindre le serveur, merci de me donner votre prénom en faisant **.prenom** suivi de votre prénom ! \n ``` Exemple : .prenom Léo ```");
});


client.on('guildMemberRemove', member => {
    const channel = member.guild.channels.find('name', 'direction');
    channel.send("**" + member.user.username + "** a quitté le serveur.");
});


client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (oldMember.voiceChannelID == newMember.voiceChannelID) return;
    vocal = client.voiceConnections.array();
    vocal.forEach(function (canal) {
        if (canal.channel.id == oldMember.voiceChannelID) {
            membres = canal.channel.members.array();
            if (membres.length == 1) {
                canal.channel.leave();
            }
        }
    });
});


client.login(process.env.token);