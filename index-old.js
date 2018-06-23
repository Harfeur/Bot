const Discord = require('discord.js');
const client = new Discord.Client();
const yt = require('ytdl-core');
new Discord.RichEmbed();

let queue = {};

const commands = {
	'play': (msg) => {
		if (queue[msg.guild.id] === undefined) return msg.channel.send(`Ajoutez d\'abbord des musiques avec ${process.env.prefix}add`);
		if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
		if (queue[msg.guild.id].playing) return msg.channel.send('Déja en lecture');
		let dispatcher;
		queue[msg.guild.id].playing = true;

		console.log(queue);
		(function play(song) {
			console.log(song);
			if (song === undefined) return msg.channel.send('La file d\'attente est vide').then(() => {
				queue[msg.guild.id].playing = false;
				msg.member.voiceChannel.leave();
			});
			msg.channel.send(`Lecture de: **${song.title}** comme demandé par: **${song.requester}**`);
			dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, {
				audioonly: true
			}), {
				passes: process.env.passes
			});
			let collector = msg.channel.createCollector(m => m);
			dispatcher.setVolume(0.2);
			collector.on('message', m => {
				if (m.content.startsWith(process.env.prefix + 'pause')) {
					msg.channel.send('Mis en pause').then(() => {
						dispatcher.pause();
					});
				} else if (m.content.startsWith(process.env.prefix + 'resume')) {
					msg.channel.send('Reprise').then(() => {
						dispatcher.resume();
					});
				} else if (m.content.startsWith(process.env.prefix + 'skip')) {
					msg.channel.send('Passée').then(() => {
						dispatcher.end();
					});
				} else if (m.content.startsWith('volume+')) {
					if (Math.round(dispatcher.volume * 50) >= 100) return msg.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
					dispatcher.setVolume(Math.min((dispatcher.volume * 50 + (5 * (m.content.split('+').length - 1))) / 50, 2));
					msg.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
				} else if (m.content.startsWith('volume-')) {
					if (Math.round(dispatcher.volume * 50) <= 0) return msg.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
					dispatcher.setVolume(Math.max((dispatcher.volume * 50 - (5 * (m.content.split('-').length - 1))) / 50, 0));
					msg.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
				} else if (m.content.startsWith(process.env.prefix + 'temps')) {
					msg.channel.send(`Temps: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000) / 1000) < 10 ? '0' + Math.floor((dispatcher.time % 60000) / 1000) : Math.floor((dispatcher.time % 60000) / 1000)}`);
				}
			});
			dispatcher.on('end', () => {
				collector.stop();
				play(queue[msg.guild.id].songs.shift());
			});
			dispatcher.on('error', (err) => {
				return msg.channel.send('error: ' + err).then(() => {
					collector.stop();
					play(queue[msg.guild.id].songs.shift());
				});
			});
		})(queue[msg.guild.id].songs.shift());
	},
	'add': (msg) => {
		let url = msg.content.split(' ')[1];
		if (url == '' || url === undefined) return msg.channel.send(`Vous devez ajouter un lien YouTube après ${process.env.prefix}add`);
		yt.getInfo(url, (err, info) => {
			if (err) return msg.channel.send('Lien YouTube invalide: ' + err);
			if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
			queue[msg.guild.id].songs.push({
				url: url,
				title: info.title,
				requester: msg.author.username
			});
			msg.channel.send(`**${info.title}** ajouté à la queue`);
		});
	},
	'queue': (msg) => {
		if (queue[msg.guild.id] === undefined) return msg.channel.send(`Ajoutez des musiques à la queue avec ${process.env.prefix}add`);
		let tosend = [];
		queue[msg.guild.id].songs.forEach((song, i) => {
			tosend.push(`${i + 1}. ${song.title} - Demandé par: ${song.requester}`);
		});
		msg.channel.send(`Queue de musiques : Actuellement **${tosend.length}** musiques dans la queue. ${(tosend.length > 15 ? '*[Sueles les 15 prochaines sont affichées]*' : '')}\n\`\`\`${tosend.slice(0, 15).join('\n')}\`\`\``);
	},

};

client.on('ready', () => {
	console.log('Bot pret');
});

client.on('message', async msg => {
	const args = msg.content.slice(process.env.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (msg.channel.name === "informations" && !msg.author.bot) {
		joueurs = msg.channel.members.array();
		joueurs.forEach(function (joueur) {
			if (!joueur.user.bot) {
				joueur.send("Nouveau message de l'entreprise par **" + msg.author.username + "** :\n" + msg.content);
			}
		});
	}

	if (msg.channel.name === "feuilles-de-route") {
		msgisfile = 0;
		fichiers = msg.attachments.array();
		fichiers.forEach(function (fichier) {
			if (fichier.filename.endsWith('.xlsx') || fichier.filename.endsWith('.ods')) {
				msgisfile = 1;
				joueurs = msg.channel.members.array();
				joueurs.forEach(function (joueur) {
					role = joueur.roles.array();
					role.forEach(function (comptable) {
						if (comptable.id == 384377920317161472) {
							joueur.send("Nouvelle feuille de route à traiter (de **" + msg.author.username + "**). <#424673120532561922>");
						}
					});
				});
			}
			if (fichier.filename.endsWith('.docx') || fichier.filename.endsWith('.odt')) msgisfile = 1;
			if (fichier.filename.endsWith('.png') && msg.author.bot) msgisfile = 1;
		})
		if (msgisfile == 0) {
			if (msg.content.startsWith('.valide') || msg.content.startsWith('.refuse')) {}
			else {
				msg.delete();
				if (!msg.author.bot) msg.member.send("Merci d\'écrire uniquement dans le canal <#374842067983007744>");
			}
		}
	}

	if (msg.channel.name === "bienvenue") {
		if (msg.content.startsWith('Oui') || msg.content.startsWith('oui')) {
			msg.member.send('```Pour être recruté, rien de plus simple. Il vous suffit de remplir le Google Forms et une réponse vous sera donnée dans les plus brefs délais.```\n\nhttps://goo.gl/forms/ncAFvOXsOkj8mRGr2')
			msg.member.setRoles(['426780618647404555'])
				.catch(console.error);
			const channel = msg.guild.channels.find('name', 'general');
			channel.send("Bienvenue à <@!" + msg.author.id + "> sur le Discord !");
		}
		if (msg.content.startsWith('Non') || msg.content.startsWith('non')) {
			msg.member.setRoles(['426780618647404555'])
				.catch(console.error);
			const channel = msg.guild.channels.find('name', 'general');
			channel.send("Bienvenue à <@!" + msg.author.id + "> sur le Discord !");
		}
	}

	if (msg.channel.name === "reglement") {
		msg.member.removeRole('440542013348118548')
			.catch(console.error);
		msg.member.addRole('374844057631064066')
			.catch(console.error);
		msg.member.send('__**Bienvenue en tant que CDD !**__\nVous pouvez effectuer la commande **' + process.env.prefix + 'help** afin de connaitre les commandes nécessaires à l\'obtention des documents de travail.');
	}

	if (msg.content.startsWith('VOTE')) {
		msg.react(msg.guild.emojis.get('418752447557795842'))
			.catch(console.error);
		msg.react(msg.guild.emojis.get('418752462263025665'))
			.catch(console.error);
	}

	if (!msg.author.bot) {
		if (msg.content.startsWith("Bonjour") || msg.content.startsWith("bonjour")) {
			msg.reply("Bonjour !");
		}

		if (msg.content.startsWith("Bonsoir") || msg.content.startsWith("bonsoir")) {
			msg.reply("Bonsoir !");
		}

		if (msg.content.startsWith("Bonne nuit") || msg.content.startsWith("bonne nuit")) {
			msg.reply("Bonne nuit !");
		}
	}

	if (command === 'purge') {
		if (msg.author.id == process.env.MaxouCraft || msg.author.id == process.env.Teddy) {
			const deleteCount = parseInt(args[0], 10);
			if (!deleteCount || deleteCount < 2 || deleteCount > 100)
				return msg.reply("Merci de donner un nombre de 2 à 100 messages à supprimer.");
			const fetched = await msg.channel.fetchMessages({
				limit: deleteCount
			});
			msg.channel.bulkDelete(fetched)
				.catch(error => msg.reply(`Erreur: ${error}`));
		}
	}

	if (!msg.content.startsWith(process.env.prefix)) return;
	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(process.env.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(process.env.prefix.length).split(' ')[0]](msg);
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

client.destroy((err) => {
	console.log(err);
});