const mongoose = require("mongoose");

const DiscordServers = mongoose.model("DiscordServers_NoProfanity", new mongoose.Schema({
    guildId: String,
    language: String,
    logChannel: String,
    rolePing: {
        type: String,
        default: "0",
    },
    ignoreWord: {
        type: [String],
        default: []
    },
    ignoreRole: {
        type: [String],
        default: []
    },
    ignoreChannel: {
        type: [String],
        default: []
    },
    ignoreLink: {
        type: [String],
        default: []
    }
}));

module.exports = { DiscordServers };
