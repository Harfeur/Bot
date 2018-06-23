exports.run = (client, message, args) => {
	if (queue[message.guild.id] === undefined) return message.channel.send(`Ajoutez des musiques à la queue avec ${process.env.prefix}add`);
	let tosend = [];
	queue[message.guild.id].songs.forEach((song, i) => {
		tosend.push(`${i + 1}. ${song.title} - Demandé par: ${song.requester}`);
	});
	message.channel.send(`Queue de musiques : Actuellement **${tosend.length}** musiques dans la queue. ${(tosend.length > 15 ? '*[Sueles les 15 prochaines sont affichées]*' : '')}\n\`\`\`${tosend.slice(0, 15).join('\n')}\`\`\``);

}