const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { DiscordServers } = require("../../models/model");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping-role")
        .setDescription("Add role that will be used in warnings")
        .addStringOption(option => option.setName("roleid").setDescription("Write \"0\" to delete ping").setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.All)) return;

        const server = await DiscordServers.findOne({ guildId: interaction.guild.id })
        if (!server) return await interaction.reply({
            content: "\`[❌] You didn't configure your server yet! Use: /setup\`",
            ephemeral :true
        })

        const roleId = interaction.options.getString("roleid");
        if (roleId === "0"){
            server.rolePing = "0"
            await server.save();

            await interaction.reply({
                content: `\`[✅] Ping was successfully removed.\``,
                ephemeral: true
            })
        } else {
            const roleExist = await interaction.guild.roles.cache.has(roleId);
            if (!roleExist) return await interaction.reply({
                content: "\`[❌] Role with this ID doesn't exist.\`",
                ephemeral: true
            })

            server.rolePing = roleId;
            await server.save();
            await interaction.reply({
                content: `\`[✅] Ping was successfully added.\``,
                ephemeral: true
            })
        }
    }
}