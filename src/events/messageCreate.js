const { Events, InteractionCollector, EmbedBuilder } = require("discord.js");
const { DiscordServers } = require("../models/model");
const doesIncludeProfanity = require("../system/doesIncludeProfanity");

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        const server = await DiscordServers.findOne({ guildId: message.guild.id });
        if (!server) return;

        let isIgnoreChannel = false;
        server.ignoreChannel.forEach(item => {
            if (item === message.channel.id || item === message.channel.parentId){
                isIgnoreChannel = true;
            }
        });

        if (isIgnoreChannel) return;

        var hasProhibitedRole = false;
        for (const roleId of server.ignoreRole) {
            const role = message.member.guild.roles.cache.find(r => r.id === roleId);
            if (role && message.member.roles.cache.has(role.id)) {
                hasProhibitedRole = true;
                break;
            }
        }
        
        if (hasProhibitedRole) return;

        const [status, type, phrase] = await doesIncludeProfanity(message.content, message.guild.id, message);

        if (status){
            const channelLog = await message.guild.channels.cache.get(server.logChannel);
            if(!channelLog) return;

            if (type === "link") {
                await message.delete(1);
                await message.member.timeout(300000, "NoProfanity | Warning: Link")
            }

            const embed = new EmbedBuilder()
                .setTitle(`⚖ | ${message.author.displayName}`)
                .setColor(0xFF0000)
                .setDescription(`**Phrase:**\n\`\`\`${phrase}\`\`\`\n**Text:**\n\`\`\`${message.content}\`\`\`\n\n**User:** ${message.author} (\`${message.author.id}\`)\n**Link:** https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)

            channelLog.send({
                content: `${server.rolePing !== "0" ? `<@&${server.rolePing}>` : ""}`,
                embeds: [embed]
            })
        }
    }
}