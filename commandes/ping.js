const Discord = require("Discord.js");

const client = new Discord.Client();

const fs = require("fs");



module.exports.run = async (client, message, args) => {

	message.channel.send("Ping!!!!");

}

module.exports.help = {

	name: "ping",

}