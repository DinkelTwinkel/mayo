const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Point = require('../models/points');
const Colour = require('../models/customColour');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('colour')
    .setDescription('give yourself a custom colour! (15 mayo)')
    .addStringOption(option =>
      option
        .setName('colour')
        .setDescription('hex colour code only!')
        .setRequired(true)),

    async execute(interaction) {

      if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(interaction.options.getString('colour'))) {
        return message.reply('Please provide a valid color in the format #RRGGBB or #RGB.');
      }

      const cost = 15;
      const checkPouch = await Point.findOne ({userId: interaction.member.id});
      if (checkPouch.points < cost) return interaction.reply (`You do not have enough Mayo! You need ${cost} mayo to perform this action!`);
      checkPouch.points -= cost;
      await checkPouch.save();

      console.log (interaction.member);

      // check if already have custom colour.
      let colour = await Colour.findOne ({ userId: interaction.member.id });
      if (colour) {
        interaction.guild.roles.cache.get(colour.roleID).setColor(interaction.options.getString('colour'));
        interaction.guild.roles.cache.get(colour.roleID).setPosition(interaction.guild.roles.cache.size - 2);
      }
      else {
        let rolecreate = await interaction.guild.roles.create({ 
          name: interaction.member.user.username, 
          permissions: [], 
          position: (interaction.guild.roles.cache.size - 2),
          reason: "", 
          color: interaction.options.getString('colour')
        })

          interaction.member.roles.add(rolecreate),
          console.log ('created new colour role')

        colour = new Colour ({
          userId: interaction.member.id,
          roleID: rolecreate.id,
        })

        await colour.save();
      }
      interaction.reply ('new colour applied!')
    },
  };

