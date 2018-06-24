exports.run = (client, message, args) => {
    message.member.voiceChannel.leave();
}