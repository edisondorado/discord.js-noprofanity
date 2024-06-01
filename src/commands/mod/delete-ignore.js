const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { DiscordServers } = require("../../models/model");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-ignore")
        .setDescription("Delete word/channel from ignore-list")
        .addSubcommand(subcommand =>
            subcommand
                .setName("word")
                .setDescription("Delete word from ignore-list")
                .addStringOption(option => option.setName("word").setDescription("-").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("link")
                .setDescription("Delete link from ignore-list")
                .addStringOption(option => option.setName("link").setDescription("-").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("role")
                .setDescription("Delete role from ignore-list")
                .addStringOption(option => option.setName("role").setDescription("-").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("channel")
                .setDescription("Delete channel from ignore-list")
                .addStringOption(option => option.setName("channel").setDescription("Channel ID").setRequired(true))),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.All)) return;

        const server = await DiscordServers.findOne({ guildId: interaction.guild.id })
        if (!server) return await interaction.reply({
            content: "\`[❌] You didn't configure your server yet! Use: /setup\`",
            ephemeral :true
        })

        if (interaction.options.getSubcommand() === "word"){
            const word = interaction.options.getString("word");

            if (server.ignoreWord.indexOf(word) === -1){
                await interaction.reply({
                    content: `\`[❌] This phrase doesn't exists in ignore-list.\``,
                    ephemeral: true
                })
            } else {
                server.ignoreWord = server.ignoreWord.filter(wrd => wrd !== word);;
                await server.save()
                    .then(async () => {
                        await interaction.reply({
                            content: `\`[✅] Your phrase was successfully deleted.\``,
                            ephemeral: true
                        });
                    })
                    .catch(async error => {
                        await interaction.reply({
                            content: "\`[❌] Error occurred while deleting the phrase!\`",
                            ephemeral: true
                        });
                        console.error("/delete-ignore word: ", error);
                    })
            }
        } else if (interaction.options.getSubcommand() === "channel"){
            const channel = interaction.options.getString("channel");

            if (server.ignoreChannel.indexOf(channel) === -1){
                await interaction.reply({
                    content: `\`[❌] This channel doesn't exists in ignore-list.\``,
                    ephemeral: true
                })
            } else {
                server.ignoreChannel = server.ignoreChannel.filter(ch => ch !== channel);;
                await server.save()
                    .then(async () => {
                        await interaction.reply({
                            content: `\`[✅] Your channel was successfully deleted.\``,
                            ephemeral: true
                        });
                    })
                    .catch(async error => {
                        await interaction.reply({
                            content: "\`[❌] Error occurred while deleting the channel!\`",
                            ephemeral: true
                        });
                        console.error("/delete-ignore channel: ", error);
                    })
            }
        } else if (interaction.options.getSubcommand() === "link"){
            const link = interaction.options.getString("link");

            if (server.ignoreLink.indexOf(link) === -1){
                await interaction.reply({
                    content: `\`[❌] This channel doesn't exists in ignore-list.\``,
                    ephemeral: true
                })
            } else {
                server.ignoreLink = server.ignoreLink.filter(l => l !== link);;
                await server.save()
                    .then(async () => {
                        await interaction.reply({
                            content: `\`[✅] Your link was successfully deleted.\``,
                            ephemeral: true
                        });
                    })
                    .catch(async error => {
                        await interaction.reply({
                            content: "\`[❌] Error occurred while deleting the link!\`",
                            ephemeral: true
                        });
                        console.error("/delete-ignore link: ", error);
                    })
            }
        } else if (interaction.options.getSubcommand() === "role"){
            const role = interaction.options.getString("role");

            if (server.ignoreRole.indexOf(role) === -1){
                await interaction.reply({
                    content: `\`[❌] This channel doesn't exists in ignore-list.\``,
                    ephemeral: true
                })
            } else {
                server.ignoreRole = server.ignoreRole.filter(l => l !== role);;
                await server.save()
                    .then(async () => {
                        await interaction.reply({
                            content: `\`[✅] Your role was successfully deleted.\``,
                            ephemeral: true
                        });
                    })
                    .catch(async error => {
                        await interaction.reply({
                            content: "\`[❌] Error occurred while deleting the role!\`",
                            ephemeral: true
                        });
                        console.error("/delete-ignore role: ", error);
                    })
            }
        }
    }
}