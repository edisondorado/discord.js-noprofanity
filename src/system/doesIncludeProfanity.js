const profanity = require('../config/profanity.json');
const { DiscordServers } = require('../models/model');

const acceptedLinks = [
    "tenor.com",
    "discord.com",
    "media.discordapp.net",
    "cdn.discordapp.com",
    "imgur.com",
    "discordapp.com",
    "discord.new",
    "descord.dev",
    "discord.media",
    "discordcdn.com",
    "discord.gift",
    "discordstatus.com",
    "dis.gd",
    "craig.horse",
    "images-ext-1.discordapp.net",
    "media.giphy.com",
    "giphy.com"
]

async function doesIncludeProfanity(content, guildId, message){
    const server = await DiscordServers.findOne({ guildId: guildId });
    if (!server) return;

    var bannedWords = profanity[server.language];
    content = content.toLowerCase();

    for (var i = 0; i < bannedWords.length; i++) {
        if (
            content.includes(` ${bannedWords[i].toLowerCase()} `) ||
            content.startsWith(`${bannedWords[i].toLowerCase()} `) ||
            content.startsWith(`${bannedWords[i].toLowerCase()}.`) ||
            content.startsWith(`${bannedWords[i].toLowerCase()},`) ||
            content.startsWith(`${bannedWords[i].toLowerCase()}!`) ||
            content.endsWith(` ${bannedWords[i].toLowerCase()}.`) ||
            content.endsWith(`, ${bannedWords[i].toLowerCase()}.`) ||
            content.endsWith(`,${bannedWords[i].toLowerCase()}.`) ||
            content.endsWith(` ${bannedWords[i].toLowerCase()},`) ||
            content.endsWith(`,${bannedWords[i].toLowerCase()},`) ||
            content.endsWith(`, ${bannedWords[i].toLowerCase()},`) ||
            content.endsWith(`.${bannedWords[i].toLowerCase()},`) ||
            content.endsWith(`. ${bannedWords[i].toLowerCase()},`) ||
            content.endsWith(` ${bannedWords[i].toLowerCase()}!`) ||
            content === (`${bannedWords[i].toLowerCase()}`) ||
            content.includes(`, ${bannedWords[i].toLowerCase()} `) ||
            content.includes(`. ${bannedWords[i].toLowerCase()}, `) ||
            content.includes(`, ${bannedWords[i].toLowerCase()}, `) ||
            content.includes(`, ${bannedWords[i].toLowerCase()}!`) ||
            content.includes(` ${bannedWords[i].toLowerCase()}!`) ||
            content.includes(`. ${bannedWords[i].toLowerCase()}!`) ||
            content.includes(` ${bannedWords[i].toLowerCase()}?`) ||
            content.includes(`. ${bannedWords[i].toLowerCase()}?`) ||
            content.includes(`, ${bannedWords[i].toLowerCase()}?`) 
        ) {
            var ignoreWord = server.ignoreWord.some(item => item.toLowerCase() === bannedWords[i].toLowerCase());
            if (!ignoreWord) {
                return [true, "word", bannedWords[i]];
            }
        }
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const match = content.match(urlRegex);

    if (match) {
        let acceptedLink = false;
        const link = match[0];
        server.ignoreLink.forEach(item => {
            if (link.includes(item)) {
                acceptedLink = true;
            }
        })

        acceptedLinks.forEach(item => {
            if (link.includes(item)) {
                acceptedLink = true;
            }
        })

        if (acceptedLink === true) return [false, null]
        return [true, "link", link]
    }

    return [false, null, null];
}

module.exports = doesIncludeProfanity;