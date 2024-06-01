const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { DiscordServers } = require("../../models/model");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("change-channel")
        .setDescription("Change log channel")
        .addStringOption(option =>
            option
                .setName("channel")
                .setDescription("Channel ID")
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.All)) return;

        const server = await DiscordServers.findOne({ guildId: interaction.guild.id })
        if (!server) return await interaction.reply({
            content: "\`[❌] You didn't configure your server yet! Use: /setup\`",
            ephemeral :true
        })

        const channel = interaction.options.getString("channel");
        const doesExistChannel = await interaction.guild.channels.cache.get(channel);

        if (!doesExistChannel) return await interaction.reply({
            content: "\`[❌] Channel with this ID doesn't exist!\`",
            ephemeral: true
        })

        server.logChannel = doesExistChannel.id;

        await server.save();

        await interaction.reply({
            content: "\`[✅] Channel was successfully changed!\`",
            ephemeral: true
        })
    }
}