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
          name: "WELCOME TO MAYO!",
          iconURL: "https://cdn.discordapp.com/attachments/1061965352755544084/1171981787065487401/ezgif.com-resize_5.gif?ex=655ea818&is=654c3318&hm=375bef5772a6af3381e23e1b635172e16a57eb658cbc54ee9b5387056b9ccd90&",
        })
        .setDescription('To Gain Mayo, Simply Talk!')
        .addFields(
          {
            name: "/addbanner (cost: 100 mayo)",
            value: "(Permanently adds a new image to the banner rotation)",
            inline: false
          },
          {
            name: "/changebanner (cost: 10 mayo)",
            value: "(Temporarily changes the server banner)",
            inline: false
          },
          {
            name: "/givemayo",
            value: "(gives another user your mayo)",
            inline: false
          },
          {
            name: "/servername (cost: 50 mayo)",
            value: "(changes server name!)",
            inline: false
          },
        )
        .setFooter({
          text: `You have [${findPouch.points} Mayo] 🤍`,
        });

      interaction.reply ({ embeds: [mayo] });

    },
  };

