const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');


client.on('ready', async () => {
    client.user.setStatus("idle");
    client.user.setActivity('Maintenance', {type: 'PLAYING'});
    console.log("Bot prêt !");
});
/*
fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let commandFunction = require('./commands/${file}');
        let commandName = file.split(".")[0];
        client.on(commandName, (...args) => commandFunction.run(client, ...args));
    });
});
*/
client.on('message', message => {



    if (message.content.indexOf(process.env.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args);
      } catch (err) {
        console.error(err);
      }
});

client.login(process.env.token);