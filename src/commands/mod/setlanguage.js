const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { DiscordServers } = require("../../models/model");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setlanguage")
        .setDescription("Change language of profanity check")
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
        if (!server) return await interaction.reply({
            content: "\`[❌] You didn't configure your server yet! Use: /setup\`",
            ephemeral :true
        })

        const language = interaction.options.getString("language");

        server.language = language;

        await server.save();

        await interaction.reply({
            content: "\`[✅] Language was successfully changed.\`",
            ephemeral: true
        })
    }
}