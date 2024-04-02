const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Banner = require('../models/bannerimages');
const Point = require('../models/points');
const increaseJackPot = require('../patterns/increaseJackPot');
const Lurker = require('../models/lurker');



module.exports = {
    data: new SlashCommandBuilder()
    .setName('reviveall')
    .setDescription('revive everyone'),
    async execute(interaction) {

      await interaction.deferReply();

      const cost = 10000;
      const checkPouch = await Point.findOne ({userId: interaction.member.id});
      if (checkPouch.points < cost) return interaction.editReply (`You do not have enough Mayo! You need ${cost} mayo to perform this action!`);
      checkPouch.points -= cost;
      increaseJackPot(cost);
      await checkPouch.save();

      const now = new Date().getTime();
      now.setUTCHours(now.getUTCHours() + (24 * 7));

      await interaction.editReply(`10000 MAYO SACRIFICED.`);

      interaction.channel.send({ content: '# BEGINNING RESURRECTION.'});

      const members = await interaction.guild.members.fetch();

        const membersArray = Array.from(members);

        for (let index = 0; index < membersArray.length; index++) {

          if (membersArray[index].roles.cache.get('1172197535922798644')) {

            interaction.channel.send({ content: `RESURRECTING ${membersArray[index]}`});
            const lurkResult = await Lurker.findOne({userId: membersArray[index].id});
            lurkResult.lurkTime = now.getTime();
            await lurkResult.save();
            membersArray[index].roles.set(['1171797289581424661']).catch((err) => {});

          }
          
        }

        return interaction.channel.send({ content: '# RESURRECTION COMPLETE.'});

    },
  };

