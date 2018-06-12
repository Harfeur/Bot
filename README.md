# Bot International Logistique

[![dependencies Status](https://david-dm.org/Harfeur/Bot/status.svg)](https://david-dm.org/Harfeur/Bot)

Ce bot a été créé dans le but de servir à une entreprise virtuelle (VTC). Il peut être testé sur le [Discord](https://discord.gg/kkT3U5G) car il est actuellement en utilisation privée.

## Fichiers API

Utilisation de l'API de Discord.js, de FFMPEG et de Google Sheets

## Organistation du index.js

La constante 'commands' définie permet de stocker les commandes basiques.
Parmi ces commandes, la commande .prenom permet d'attribuer au nouvel arrivant un prénom dans son pseudo et un rôle afin qu'il puisse rejoindre les différents canaux de discussion.

Après l'évènement 'message', le bot est programmé pour envoyer (par message privé) toutes les nouvelles informations du canal #informations. En cas de nouvelle feuille de route à traiter, le bot va envoyer un message aux différents comptables de l'entreprise.

Le bot dispose du canal 'bienvenue' pour demander à chaque personne son nom et s'il souhaite rejoindre l'entreprise ou non. Il attribue automatique ce nom à l'utilisateur, dans le but de faciliter les échanges entre les membres du serveur.

## Aide au développement

Vous êtes le bienvenu si vous souahitez aider au développement du Bot. Venez voir @Maxime sur le Discord du Bot (lien en haut de page).
La future version apportera les logs dans un canal spécifique du serveur.

## Remerciements

Ce bot a été inspiré de [OhGodMusic](https://github.com/bdistin/OhGodMusicBot) par [bdistin](https://github.com/bdistin).
