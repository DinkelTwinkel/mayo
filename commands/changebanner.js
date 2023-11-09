const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Point = require('../models/points');



module.exports = {
    data: new SlashCommandBuilder()
    .setName('changebanner')
    .setDescription('change current banner Temporarily (10 mayo)')
    .addStringOption(option =>
      option
        .setName('imagelink')
        .setDescription('must be cdn')
        .setRequired(true)),

    async execute(interaction) {

      const cost = 10;
      const checkPouch = await Point.findOne ({userId: interaction.member.id});
      if (checkPouch.points < cost) return interaction.reply (`You do not have enough Mayo! You need ${cost} mayo to perform this action!`);
      checkPouch.points -= cost;
      await checkPouch.save();

        // check if cdn
        const link = interaction.options.getString('imagelink');

        if (link.startsWith('https://cdn.discordapp.com/attachments/')) {

          const imageExtensions = /\.(png|jpeg|jpg|jpg|webp)/i;
          if (imageExtensions.test(link)) {

            interaction.guild.setBanner(link);
            interaction.reply('Successfully changed banner image!');

          }

        }
        else {
          interaction.reply('invalid link! must be CDN image!').then((msg) => {
            setTimeout(() => {
              msg.delete();
            }, 5000);
          })
        }

    },
  };

