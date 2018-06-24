exports.run = (client, message, args) => {
    message.channel.send('http://trucksbook.eu/', {
        files: [{
            attachment: './assets/Tutoriel_TruckBook.pdf',
            name: 'Tutoriel TruckBook.pdf'
        }]
    });
}