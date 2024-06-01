const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { DiscordServers } = require("../../models/model");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-ignore")
        .setDescription("Add word/channel/link/role to ignore-list")
        .addSubcommand(subcommand =>
            subcommand
                .setName("word")
                .setDescription("Add word to ignore-list")
                .addStringOption(option => option.setName("word").setDescription("-").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("link")
                .setDescription("Add link to ignore-list")
                .addStringOption(option => option.setName("link").setDescription("Ex: tenor.com").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("role")
                .setDescription("Add role to ignore-list")
                .addStringOption(option => option.setName("role").setDescription("Role ID").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("channel")
                .setDescription("Add channel to ignore-list")
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
                server.ignoreWord.push(word);
                await server.save()
                    .then(async () => {
                        await interaction.reply({
                            content: `\`[✅] Your phrase was successfully added.\``,
                            ephemeral: true
                        });
                    })
                    .catch(async error => {
                        await interaction.reply({
                            content: "\`[❌] Error occurred while adding the new phrase!\`",
                            ephemeral: true
                        });
                        console.error("/add-ignore word: ", error);
                    })
            } else {
                await interaction.reply({
                    content: `\`[❌] This phrase already exists in ignore-list. To delete it, use: /delete-ignore word\``,
                    ephemeral: true
                })
            }
        } else if (interaction.options.getSubcommand() === "channel"){
            const channel = interaction.options.getString("channel");

            const doesExistChannel = interaction.guild.channels.cache.get(channel)

            if(!doesExistChannel) return await interaction.reply({
                content: "\`[❌] Channel with this ID doesn't exist!\`",
                ephemeral: true
            })

            if (server.ignoreChannel.indexOf(channel) === -1){
                server.ignoreChannel.push(channel);
                await server.save()
                    .then(async () => {
                        await interaction.reply({
                            content: `\`[✅] Channel was successfully added.\``,
                            ephemeral: true
                        });
                    })
                    .catch(async error => {
                        await interaction.reply({
                            content: "\`[❌] Error occurred while adding the new channel!\`",
                            ephemeral: true
                        });
                        console.error("/add-ignore channel: ", error);
                    })
            } else {
                await interaction.reply({
                    content: `\`[❌] This channel already exists in ignore-list. To delete it, use: /delete-ignore channel\``,
                    ephemeral: true
                })
            }
        } else if (interaction.options.getSubcommand() === "link"){
            const link = interaction.options.getString("link");
            if (server.ignoreLink.indexOf(link) === -1){
                server.ignoreLink.push(link);
                await server.save()
                    .then(async () => {
                        await interaction.reply({
                            content: `\`[✅] Link was successfully added.\``,
                            ephemeral: true
                        });
                    })
                    .catch(async error => {
                        await interaction.reply({
                            content: "\`[❌] Error occurred while adding the new link!\`",
                            ephemeral: true
                        });
                        console.error("/add-ignore link: ", error);
                    })
            } else {
                await interaction.reply({
                    content: `\`[❌] This link already exists in ignore-list. To delete it, use: /delete-ignore link\``,
                    ephemeral: true
                })
            }
        } else if (interaction.options.getSubcommand() === "role"){
            const role = interaction.options.getString("role");
            if (server.ignoreRole.indexOf(role) === -1){
                server.ignoreRole.push(role);
                await server.save()
                    .then(async () => {
                        await interaction.reply({
                            content: `\`[✅] Role was successfully added.\``,
                            ephemeral: true
                        });
                    })
                    .catch(async error => {
                        await interaction.reply({
                            content: "\`[❌] Error occurred while adding the new role!\`",
                            ephemeral: true
                        });
                        console.error("/add-ignore role: ", error);
                    })
            } else {
                await interaction.reply({
                    content: `\`[❌] This role already exists in ignore-list. To delete it, use: /delete-ignore role\``,
                    ephemeral: true
                })
            }
        }
    }
}