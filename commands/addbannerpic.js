const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Banner = require('../models/bannerimages');
const Point = require('../models/points');



module.exports = {
    data: new SlashCommandBuilder()
    .setName('addbanner')
    .setDescription('add a image into the banner rotation (100 mayo)')
    .addStringOption(option =>
      option
        .setName('imagelink')
        .setDescription('must be cdn')
        .setRequired(true)),

    async execute(interaction) {

      const cost = 100;
      const checkPouch = await Point.findOne ({userId: interaction.member.id});
      if (checkPouch.points < cost) return interaction.reply (`You do not have enough Mayo! You need ${cost} mayo to perform this action!`);
      checkPouch.points -= cost;
      await checkPouch.save();

        // check if cdn
        const link = interaction.options.getString('imagelink');

        if (link.startsWith('https://cdn.discordapp.com/attachments/')) {

          const imageExtensions = /\.(png|jpeg|jpg|jpg|webp|gif)/i;
          if (imageExtensions.test(link)) {

            const checkImageDupe = await Banner.findOne({imageLink: link});
            if (checkImageDupe) return interaction.reply ('Link Already Exists!');

            const newBannerLink = new Banner ({
              imageLink: link,
              submissionUser: interaction.member.id,
            })

            try {
            newBannerLink.save();
            interaction.guild.setBanner(link);
            interaction.reply('Successfully added new banner image!');
            }
            catch (err){
              interaction.reply(err);
            }

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

