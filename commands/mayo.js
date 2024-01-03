const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Point = require('../models/points');
const getAllMessagesInChannel = require('../patterns/getAllMessagesInChannel');
const Fortune = require('../models/dailyFortune');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mayo')
    .setDescription('see your mayo soul'),

    async execute(interaction, client) {

      // ephemeral tell user points

      // generate daily fortune:

      let userFortune = await Fortune.findOne ({ userId: interaction.member.id });

      if (userFortune) {
        if (userFortune.lastFortuneDay != new Date ().getDate()) {
          userFortune.Fortune = await getFortuneCookie(client);
          userFortune.lastFortuneDay = new Date ().getDate();
          await userFortune.save();
        }
      }
      else {
        userFortune = new Fortune ({
          userId: interaction.member.id,
          Fortune: await getFortuneCookie(client),
          lastFortuneDay: new Date ().getDate(),
        })
        await userFortune.save();
      }

      const findPouch = await Point.findOne({ userId: interaction.member.id });

      const mayo = new EmbedBuilder()
        .setAuthor({
          name: "WELCOME TO MAY-0!",
          //iconURL: "https://cdn.discordapp.com/attachments/1061965352755544084/1171981787065487401/ezgif.com-resize_5.gif?ex=655ea818&is=654c3318&hm=375bef5772a6af3381e23e1b635172e16a57eb658cbc54ee9b5387056b9ccd90&",
        })
        .setThumbnail("https://cdn.discordapp.com/attachments/1061965352755544084/1171981787065487401/ezgif.com-resize_5.gif?ex=655ea818&is=654c3318&hm=375bef5772a6af3381e23e1b635172e16a57eb658cbc54ee9b5387056b9ccd90&")
        //.setDescription()
        // .setTitle(`You have **『 ${findPouch.points} Mayo 』**`)
        .setColor("#fff3b8")
        .addFields(
          {
            name: '\n',
            value: '▂ <a:emoji_10:1172398802750156843> **Daily Mayo** ▂▂▂▂▂▂ \n```' + `'${userFortune.Fortune.toLowerCase()}'` + '```' ,
            inline: true
          },
          {
            name: '❖\n',
            value: '\n',
            inline: true
          },
          {
            name: '\n',
            value: `You have:\n**『 ${findPouch.points} VBUCKS 』**`,
            inline: true
          },
        )
        .setFooter({
          text: `To Gain Mayo, Simply Talk! /help to see mayo commands!`,
        });

      interaction.reply ({ embeds: [mayo] });

    },
  };

  async function getFortuneCookie(client) {

    const backRooms = client.guilds.cache.get('1103779676406693981');
    const cookieChannel = backRooms.channels.cache.get('1172011335597436998');

    const messages = await getAllMessagesInChannel(cookieChannel);

    const randomIndex = Math.floor(Math.random() * messages.length);

    const randomMessage = Array.from(messages)[randomIndex];

    return randomMessage.content;

  }