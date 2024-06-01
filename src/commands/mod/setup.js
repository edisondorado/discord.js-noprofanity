const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const { DiscordServers } = require("../../models/model");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Launch a bot")
        .addStringOption(option => 
            option
                .setName("language")
                .setDescription("-")
                .setRequired(true)
                .addChoices(
                    { name: "Russian[ru]", value: "ru" },
                    { name: "English[en]", value: "en" },
                    { name: "Polish[pl]", value: "pl" },
                    { name: "Ukrainian[uk]", value: "uk" },
                    { name: "Turkish[tr]", value: "tr" },
                    { name: "Greek[el]", value: "el" }
                )),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.All)) return;
        
        const server = await DiscordServers.findOne({ guildId: interaction.guild.id })
        if (server) return await interaction.reply({
            content: "\`[❌] Your server already configured!`",
            ephemeral :true
        })

        const language = interaction.options.getString("language")

        const channel = await interaction.guild.channels.create({
            name: "NoProfanity | Log",
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                }
            ],
        })

        await DiscordServers.create({
            guildId: interaction.guild.id,
            language: language,
            logChannel: channel.id,
            ignoreWord: [],
            ignoreChannel: [],
        });

        await interaction.reply({
            content: `\`[✅] The server has been successfully configured!\`\n\nTo add a phrase to the ignore list, use: \`/add-ignore word\`\nTo add a channel to the ignore list, use: \`/add-ignore channel\`\nTo change a logging channel, use: \`/change-channel\`\nTo change the language, use: \`/setlanguage\``,
            ephemeral: true
        })
    }
}