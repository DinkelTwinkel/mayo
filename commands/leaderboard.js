const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Point = require('../models/points');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('who has the most MAYO?'),

    async execute(interaction, client) {

      await interaction.deferReply();

      const players = await Point.find().sort({ points: -1 });
      const firstPlace = await client.guilds.cache.get('1171795345223716964').members.fetch(players[0].userId);

      let firstPlaceName = firstPlace.displayName;
      if (!firstPlace.nickname) 
      firstPlaceName = firstPlace.user.username;

      const embed = new EmbedBuilder()
      .setTitle(' LEADERBOARD: TOP 25 ')
      .setDescription(`# 👑『 FIRST PLACE 』 ${firstPlaceName}\n  # ▬▶ ${players[0].points} MAYONAISE\n ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡`)
      .setThumbnail(firstPlace.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
      .setColor("#f5f3b8")

      for (let index = 1; index < 25; index++) {

        // console.log(players[index])

        // const player = await client.guilds.cache.get('1171795345223716964').members.fetch(players[index].userId);

        //   let username = player.nickname;
        //   if (!player.nickname) 
        //   username = player.user.username;
  
          embed.addFields({
            name: `\n`,
            value: `『${index + 1}』<@${players[index].userId}>\n-▶ ${players[index].points.toString()} MAYO`,
            inline: true
          })
  

        // console.log(player)


        
      }

      
    interaction.followUp({ embeds: [embed] });
    

    },
  };
