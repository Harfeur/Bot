exports.run = (client, message, args) => {
    if (args[0] == undefined) return message.channel.send("Les radios disponibles sont : **Skyrock, Funradio, RTL, TFM, RFM**");
    message.member.voiceChannel.leave();
    switch (args[0]) {
        case 'skyrock':
            message.member.voiceChannel.join().then(connection => {
                    require('http').get("http://icecast.skyrock.net/s/natio_mp3_128k", (res) => {
                        connection.playStream(res, {
                            volume: 0.1
                        });
                    })
                })
                .catch(console.error);
            break;
        case 'funradio':
            message.member.voiceChannel.join().then(connection => {
                    require('http').get("http://streaming.radio.funradio.fr/fun-pam-44-128", (res) => {
                        connection.playStream(res, {
                            volume: 0.1
                        });
                    })
                })
                .catch(console.error);
            break;
        case 'rtl':
            message.member.voiceChannel.join().then(connection => {
                    require('http').get("http://streaming.radio.rtl.fr/rtl-1-48-192", (res) => {
                        connection.playStream(res, {
                            volume: 0.1
                        });
                    })
                })
                .catch(console.error);
            break;
        case 'tfm':
            message.member.voiceChannel.join().then(connection => {
                    require('https').get("https://radio.truckers.fm", (res) => {
                        connection.playStream(res, {
                            volume: 0.1
                        });
                    })
                })
                .catch(console.error);
            break;
        case 'rfm':
            message.member.voiceChannel.join().then(connection => {
                    require('http').get("http://vipicecast.yacast.net/rfm_128", (res) => {
                        connection.playStream(res, {
                            volume: 0.1
                        });
                    })
                })
                .catch(console.error);
            break;
        default:
            message.channel.send("Cette radio n\'est pas disponible. Contactez Maxime pour plus d\'informations.");
    }
}