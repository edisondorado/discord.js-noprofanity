const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()){
            const command = interaction.client.commands.get(interaction.commandName);
            try{
                await command.execute(interaction)
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: '\`[❌] Error occured while using command!\`', ephemeral: true });
                } else {
                    await interaction.reply({ content: '\`[❌] Error occured while using command!\`', ephemeral: true });
                }
            }
        }
    }
};