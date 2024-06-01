const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { DiscordServers } = require("../../models/model");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("list-ignore")
        .setDescription("List of ignored channels/words")
        .addSubcommand(subcommand =>
            subcommand
                .setName("word")
                .setDescription("List of ignored words"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("link")
                .setDescription("List of ignored links"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("role")
                .setDescription("List of ignored roles"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("channel")
                .setDescription("List of ignored channels")),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.All)) return;

        const server = await DiscordServers.findOne({ guildId: interaction.guild.id })
        if (!server) return await interaction.reply({
            content: "\`[❌] You didn't configure your server yet! Use: /setup\`",
            ephemeral :true
        })

        var ignores = [];
        var type;

        if (interaction.options.getSubcommand() === "word"){
            ignores = server.ignoreWord;
            type = "words";
        } else if (interaction.options.getSubcommand() === "channel"){
            ignores = server.ignoreChannel;
            type = "channels";
        } else if (interaction.options.getSubcommand() === "link"){
            ignores = server.ignoreLink;
            type = "links";
        } else if (interaction.options.getSubcommand() === "role"){
            ignores = server.ignoreRole;
            type = "roles";
        }

        let page = 1;

        let totalPages = Math.ceil(ignores.length / 15);
        if (totalPages === 0) {
            totalPages = 1;
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('backwardsInfraction')
                    .setEmoji('◀️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('forwardInfraction')
                    .setEmoji('▶️')
                    .setStyle(ButtonStyle.Success)
        );
        
        const embedMessage = async (page, ignores) => {
            const itemsPerPage = 15

            const start = (page - 1) * itemsPerPage;
            const end = page * itemsPerPage;
            const ignoresOnPage = ignores.slice(start, end);

            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTimestamp()
                .setTitle(`**List of ${type} (${ignores.length}):**`)
                .setDescription(`${ ignoresOnPage.length < 1 ? "-" : ignoresOnPage.map(item => `${type === "channels" ? "<#" : type === "roles" ? "<@&" : ""}${item}${type === "channels" ? ">" : type === "roles" ? ">" : ""}`).join("\n")}\n\nPage ${page}/${totalPages}`)

            return embed;
        }
        row.components[0].setDisabled(true);

        if (page === totalPages) {
            row.components[1].setDisabled(true);
        }

        await interaction.reply({ embeds: [await embedMessage(page, ignores)], components: [row], ephemeral: true  });

        const filter = i => (i.customId === 'forwardInfraction' || i.customId === 'backwardsInfraction') && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async i => {
            try {
            if (i.customId === 'forwardInfraction') {
                page++;
                if (page === 1) {
                    row.components[0].setDisabled(true);
                    row.components[1].setDisabled(false);
                } else if (page === totalPages) {
                    row.components[0].setDisabled(false);
                    row.components[1].setDisabled(true);
                } else {
                    row.components[0].setDisabled(false);
                    row.components[1].setDisabled(false);
                }
                await i.deferUpdate();
                await interaction.editReply({ embeds: [await embedMessage(page, ignores)], components: [row] });
         }  if (i.customId === 'backwardsInfraction') {
                page--;
                if (page === 1) {
                    row.components[0].setDisabled(true);
                    row.components[1].setDisabled(false);
                } else if (page === totalPages) {
                    row.components[0].setDisabled(false);
                    row.components[1].setDisabled(true);
                } else {
                    row.components[0].setDisabled(false);
                    row.components[1].setDisabled(false);
                }
                await i.deferUpdate();
                await interaction.editReply({ embeds: [await embedMessage(page, ignores)], components: [row] });
            }
            } catch (error) {
                console.error(error);
            }
        }); 
    }
}