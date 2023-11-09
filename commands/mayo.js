const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Point = require('../models/points');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mayo')
    .setDescription('see your coins'),

    async execute(interaction) {

      // ephemeral tell user points

      const findPouch = await Point.findOne({ userId: interaction.member.id });

      const mayo = new EmbedBuilder()
        .setAuthor({
          name: "*WELCOME TO MAYO!*",
          //iconURL: "https://cdn.discordapp.com/attachments/1061965352755544084/1171981787065487401/ezgif.com-resize_5.gif?ex=655ea818&is=654c3318&hm=375bef5772a6af3381e23e1b635172e16a57eb658cbc54ee9b5387056b9ccd90&",
        })
        .setThumbnail("https://cdn.discordapp.com/attachments/1061965352755544084/1171981787065487401/ezgif.com-resize_5.gif?ex=655ea818&is=654c3318&hm=375bef5772a6af3381e23e1b635172e16a57eb658cbc54ee9b5387056b9ccd90&")
        //.setDescription()
        .addFields(
          {
            name: `You have **『 ${findPouch.points} Mayo 』**`,
            value: 'To Gain Mayo, Simply Talk!',
            inline: false
          },
        )
        .setFooter({
          text: `/help to see mayo commands!`,
        });

      interaction.reply ({ embeds: [mayo] });

    },
  };

