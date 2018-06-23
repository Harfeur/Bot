exports.run = (client, message, args) => {
    return new Promise((resolve, reject) => {
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('Je ne peux pas me connecter au canal audio ...');
        voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
    });
}