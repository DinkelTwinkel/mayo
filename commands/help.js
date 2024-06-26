const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Point = require('../models/points');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('mayo commands'),

    async execute(interaction) {

      // ephemeral tell user points

      const findPouch = await Point.findOne({ userId: interaction.member.id });
      const jackPot = await Point.findOne({ userId: '1171936614965067866' });

      const mayo = new EmbedBuilder()
        // .setAuthor({
        //   name: "MAYO HELP!",
        //   //iconURL: "https://cdn.discordapp.com/attachments/1061965352755544084/1171981787065487401/ezgif.com-resize_5.gif?ex=655ea818&is=654c3318&hm=375bef5772a6af3381e23e1b635172e16a57eb658cbc54ee9b5387056b9ccd90&",
        // })
        .setThumbnail("https://cdn.discordapp.com/attachments/1061965352755544084/1171981787065487401/ezgif.com-resize_5.gif?ex=655ea818&is=654c3318&hm=375bef5772a6af3381e23e1b635172e16a57eb658cbc54ee9b5387056b9ccd90&")
        //.setDescription('To Gain Mayo, Simply Talk!')
        .setTitle('MAYO HELP! use /spam to get access to the spam channel for testing commands!')
        .addFields(
          {
            name: "**/addbanner (cost: 100 mayo)**",
            value: "```Permanently adds a new image to the banner rotation```",
            inline: false
          },
          {
            name: "**/changebanner (cost: 10 mayo)**",
            value: "```Temporarily changes the server banner```",
            inline: false
          },
          {
            name: "**/give**",
            value: "```gives another user your mayo\nFeed mayobot for a chance to win jackpot!" + `\nCurrent Jackpot: ${jackPot.points} MAYO` + '```',
            inline: false
          },
          {
            name: "**/rename (cost: 50 for user and 5000 for server)**",
            value: "```renames something on the server!```",
            inline: false
          },
          {
            name: "**/colour (cost: 15 mayo)**",
            value: "```give yourself a custom colour! requires a Hex Colour Code!```This might help: [hexcode finder](https://g.co/kgs/YjmHzd)",
            inline: false
          },
          {
            name: "**/throw (pay more mayo to cover user longer!)**",
            value: "```cover another user in mayo!```",
            inline: false
          },
          {
            name: "**/stocks**",
            value: "```get rich quick```",
            inline: false
          },
          {
            name: "**/stockchannel**",
            value: "```get access to the stock channel!```",
            inline: false
          },
          {
            name: "**/leaderboard**",
            value: "```who should I rob?```",
            inline: false
          },
          {
            name: "**/blackmayo**",
            value: "```send death threats anonymously!```",
            inline: false
          },
          {
            name: "**/dailymayo**",
            value: "```write daily mayo! Mayo are randomly shown in /mayo```",
            inline: false
          },
        )
        .setFooter({
          text: `You currently have ${findPouch.points} Mayo 🤍`,
        });

      interaction.reply ({ embeds: [mayo] , ephemeral: true });

    },
  };

