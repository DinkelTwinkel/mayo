const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Stock = require('../models/stock');
const Inventory = require('../models/inventory');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('spam')
    .setDescription('get the spam channel'),

    async execute(interaction, client) {

      const kimoServer =  await client.guilds.fetch('1171795345223716964');
      const therapyRole = kimoServer.roles.cache.get('1225518821175988367');
      const member = interaction.member;

      if (member.roles.cache.has(therapyRole.id)) {
          member.roles.remove(therapyRole);
          return interaction.reply ({ content: 'spam channel removed!', ephemeral: true })
      }
      else {
          member.roles.add(therapyRole);
          return interaction.reply ({ content: 'spam channel added!', ephemeral: true })
      }

    },
  };

