const Discord = require('discord.js');
const client = new Discord.Client();
const yt = require('ytdl-core');

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
			if (song === undefined) return msg.channel.send('La queue est vide').then(() => {
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
					if (Math.round(dispatcher.volume * 50) >= 100) return msg.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.min((dispatcher.volume * 50 + (5 * (m.content.split('+').length - 1))) / 50, 2));
					msg.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith('volume-')) {
					if (Math.round(dispatcher.volume * 50) <= 0) return msg.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.max((dispatcher.volume * 50 - (5 * (m.content.split('-').length - 1))) / 50, 0));
					msg.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(process.env.prefix + 'temps')) {
					msg.channel.send(`Temps: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
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
	'join': (msg) => {
		return new Promise((resolve, reject) => {
			const voiceChannel = msg.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('Je ne peux pas me connecter au canal audio ...');
			voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
		});
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
			tosend.push(`${i+1}. ${song.title} - Demandé par: ${song.requester}`);
		});
		msg.channel.send(`Queue de musiques : Actuellement **${tosend.length}** musiques dans la queue. ${(tosend.length > 15 ? '*[Sueles les 15 prochaines sont affichées]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
	},
	'site': (msg) => {
		msg.channel.send('https://internationallogis60.wixsite.com/inter-logistic');
	},
	'recrutement': (msg) => {
		msg.channel.send('```Pour être recruté, rien de plus simple. Il vous suffit de remplir le Google Forms et une réponse vous sera donnée dans les plus brefs délais.\n\n```https://goo.gl/forms/ncAFvOXsOkj8mRGr2');
	},
	'feuillederoute': (msg) => {
		msg.channel.send({
				files: ['https://cdn.discordapp.com/attachments/399979689558409237/432233905236607036/Feuille_de_route.xlsx']
			})
			.catch(console.error);
		msg.channel.send({
				files: ['https://cdn.discordapp.com/attachments/399979689558409237/432233904905125888/Comment_faire_une_feuille_de_route.pdf']
			})
			.catch(console.error);
		msg.channel.send('Une fois terminée, vous devez poster la feuille de route dans le canal #feuilles-de-route et les comptables s\'en occuperont !');
	},
	'entreprise': (msg) => {
		msg.channel.send('https://drive.google.com/open?id=17iusTta_JgnQXh35GMUxoYXOMRqXa7xuD_QoUjJRkIk');
	},
	'tb': (msg) => {
		msg.channel.send({
				files: ['https://cdn.discordapp.com/attachments/399979689558409237/432236647959101441/Tutoriel_TruckBook.pdf']
			})
			.catch(console.error);
		msg.channel.send('http://trucksbook.eu/');
	},
	'accident': (msg) => {
		msg.channel.send('```Vous avez eu un accident ?! Vous allez bien ?!\n\nPour les constats, rendez-vous dans le canal #feuilles-de-route. Ensuite, vous devez mettre la date, l\'heure à laquelle c\'est arrivée et une description détaillée de ce qui est arrivé (photos conseillées).\n\n/!\\ MAIS ATTENTION /!\\\nPour repartir il faut respecter l\'article du règlement qui dit : \" En cas de dégâts importants, c’est à dire plus de 15 % vous devrez rejoindre le garage le plus proche et faire une demande d’assistance. Vous devrez également annuler votre mission actuelle. Après réception de cette demande, une démarche sera engagé pour faire revenir le camion à l’entreprise. Vous devrez alors rejoindre un des garages de l’entreprise, le plus proche. Vous ne devez en aucun cas continuer de rouler avec le camion abîmé et cela pour se rapprocher le plus à la réalité. \"```');
	},
	'assistance': (msg) => {
		msg.channel.send('```Ouille, ouille, ouille !\nAïe, aïe, aïe !\n\nSi vous faites une demande d\'assistance c\'est que le camion a 15% de dégats ou plus. \nPour cela, commencé par suivre les instructions de l\'article du règlement qui dit : \" En cas de dégâts importants, c’est à dire plus de 15 % vous devrez rejoindre le garage le plus proche et faire une demande d’assistance. Vous devrez également annuler votre mission actuelle.  Après réception de cette demande, une démarche sera engagé pour faire revenir le camion à l’entreprise. Vous devrez alors rejoindre un des garages de l’entreprise, le plus proche. Vous ne devez en aucun cas continuer de rouler avec le camion abîmé et cela pour se rapprocher le plus à la réalité.\"\n\nEnsuite prenez contact avec une personne hiérarchiquement supérieure à vous et elle vous dira la marche à suivre.```');
	},
	'help': (msg) => {
		let tosend = ['```xl', process.env.prefix + 'site : "Afficher le site de l\'entreprise"', process.env.prefix + 'recrutement : "Affixher le formulaire pour rejoindre l\'entreprise"', process.env.prefix + 'feuillederoute : "Télécharger une feuille de route vierge"', process.env.prefix + 'entreprise : "Accéder au tbleur contenant les informations sur les feuilles de route, les camions, et les dépenses de l\'entreprise."', process.env.prefix + 'tb : "Tutoriel TrucksBook et site"', process.env.prefix + 'accident : "Signaler un accident avec votre camion"', process.env.prefix + 'assistance : "Signaler une demande d\'appel de dépaneuse pour votre camion"', '', 'Commandes pour la musique, uniquement si le bot est sur le PC :'.toUpperCase(), process.env.prefix + 'join : "Envoyer le bot dans le canal audio actuel"', process.env.prefix + 'add : "Ajouter un lien YouTube dans la queue"', process.env.prefix + 'queue : "Affiche la queue actuelle."', process.env.prefix + 'play : "Jouer la queue actuelle."', '', 'Ces commandes fonctionnent uniquement en lecture:'.toUpperCase(), process.env.prefix + 'pause : "Pause la musique"', process.env.prefix + 'resume : "Résume la musique"', process.env.prefix + 'skip : "Saute la musique"', process.env.prefix + 'temps : "Affiche la durée de la musique"', 'volume+ : "Augmente le volume de 5%"', 'volume- : "Diminue le volume de 5%"', '```'];
		msg.channel.send(tosend.join('\n'));
	},
	'ping': (msg) => {
		msg.channel.send('Ping !\nPong !\nÀ jour !');
	},
	'reboot': (msg) => {
		if (msg.author.id == process.env.MaxouCraft) {
			msg.channel.send("Redémarrage...");
			process.exit();
		}
	}
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
		fichiers = msg.attachments.array();
		console.log(fichiers);
		fichiers.forEach(function (fichier) {
			if (fichier.filename.endsWith('.xlsx') || fichier.filename.endsWith('.ods')) {
				joueurs = msg.channel.members.array();
				joueurs.forEach(function (joueur) {
					role = joueur.roles.array();
					role.forEach(function (comptable) {
						if (comptable.id == 384377920317161472) {
							joueur.send("Nouvelle feuille de route à traiter (de **" + msg.author.username + "**).");
						}
					});
				});
			}
		})
	}

if (msg.content.startsWith === 'VOTE') {
	msg.react(msg.guild.emojis.get('418752447557795842'))
		.catch(console.error);
	msg.react(msg.guild.emojis.get('418752462263025665'))
		.catch(console.error);
}

if (msg.content.startsWith("Bonjour") || msg.content.startsWith("bonjour")) {
	msg.reply("Bonjour !");
}

if (msg.content.startsWith("Bonsoir") || msg.content.startsWith("bonsoir")) {
	msg.reply("Bonsoir !");
}

if (command === 'purge') {
	if (msg.author.id == process.env.MaxouCraft || msg.author.id == process.env.Teddy) {
		const deleteCount = parseInt(args[0], 10);
		if (!deleteCount || deleteCount < 2 || deleteCount > 100)
			return msg.reply("Merci de donner un nombre de 2 à 100 messages à supprimer");

		// So we get our messages, and delete them. Simple enough, right?
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
	const channel = member.guild.channels.find('name', 'general');
	channel.send("Bienvenue à <@" + member.user.id + "> sur le Discord !");
});

client.on('guildMemberRemove', member => {
	const channel = member.guild.channels.find('name', 'general');
	channel.send("Aurevoir **" + member.user.username + "** ...");
});

client.login(process.env.token)