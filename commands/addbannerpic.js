const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Banner = require('../models/bannerimages')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('addbanner')
    .setDescription('add a image into the banner rotation')
    .addStringOption(option =>
      option
        .setName('imagelink')
        .setDescription('must be cdn')
        .setRequired(true)),

    async execute(interaction) {

     // check if cdn
     const link = interaction.options.getString('imagelink');

     if (link.startsWith('https://cdn.discordapp.com/attachments/')) {

      const imageExtensions = /\.(png|jpeg|jpg|jpg|webp)/i;
      if (imageExtensions.test(link)) {
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

