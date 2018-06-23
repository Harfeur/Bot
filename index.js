const Discord = require('discord.js');
const client = new Discord.Client();
client.cmds = new Discord.Collection();

client.login(process.env.token);

var prefix = process.env.prefix;

const fs = require('fs');


client.on('ready', async () => {
    client.user.setStatus("idle");
    client.user.setActivity('Maintenance', {type: 'PLAYING'});
    console.log("Bot prêt !");
});

fs.readdir("./commandes/", (err, files) => {
    if (err) throw (err);

    let jsf = files.filter(f => f.split(".").pop() === "js");

    if (jsf.lenght == 0) return;

    jsf.forEach((f, i) => {
        let props = require("./comandes/${f}");
        client.cmds.Set(props.help.name, props);
    });
});

client.on('message', message => {



    if (message.content.indexOf(prefix) !== 0) return;
    let msg = message.content.split(" ");
    let cmd = msg[0].toLowerCase();
    let args = msg.slice(1);

    cmdf = client.cmds.get(cmd.slice(prefix.lenght));
    if (cmdf) cmdf.run(client, message, args)
})