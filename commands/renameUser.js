const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Banner = require('../models/bannerimages');
const Point = require('../models/points');
const increaseJackPot = require('../patterns/increaseJackPot');

const serverCost = 200;
const userCost = 50;
const channelCost = 100;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('change the name of something!')
    .addSubcommand(subcommand =>
      subcommand
        .setName('user')
        .setDescription(`change user\'s name (${userCost} mayo)`)
        .addUserOption(option => option.setName('target').setDescription('The user to rename').setRequired(true))
        .addStringOption(option => option.setName('name').setDescription('new name!').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('server')
        .setDescription(`change server\'s name (${serverCost} mayo)`)
        .addStringOption(option => option.setName('name').setDescription('new name!').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('channel')
        .setDescription(`change channel\'s name (${channelCost} mayo)`)
        .addChannelOption(option => option.setName('target').setDescription('The channel to rename').setRequired(true))
        .addStringOption(option => option.setName('name').setDescription('new name!').setRequired(true))),

    // .addUserOption(option =>
		// 	option
		// 		.setName('user')
		// 		.setDescription('target to rename!')
		// 		.setRequired(false))
    // .addChannelOption(option => option
    //     .setName('channel')
    //     .setDescription('text channel')
    //     .addChannelTypes(ChannelType.GuildText)
    //     .setRequired(false)
    // )

    async execute(interaction) {

      // if (interaction.)

      if (interaction.options.getSubcommand() === 'user') {

        const cost = userCost;
        const checkPouch = await Point.findOne ({userId: interaction.member.id});
        if (checkPouch.points < cost) return interaction.reply (`You do not have enough Mayo! You need ${cost} mayo to perform this action!`);
        checkPouch.points -= cost;
        increaseJackPot(cost);
        await checkPouch.save();

        const target = interaction.options.getMember('target');

        if (target.user.id === interaction.guild.ownerId) return interaction.reply ('Server Owner is too powerful, I cannot rename them!');

        target.setNickname(interaction.options.getString('name')).catch((err) => interaction.channel.send(err));
        return interaction.reply ('target name changed!');

      }
      else if (interaction.options.getSubcommand() === 'server') {
        // change the name of the server

        const cost = serverCost;
        const checkPouch = await Point.findOne ({userId: interaction.member.id});
        if (checkPouch.points < cost) return interaction.reply (`You do not have enough Mayo! You need ${cost} mayo to perform this action!`);
        checkPouch.points -= cost;
        increaseJackPot(cost);
        await checkPouch.save();

        interaction.guild.setName(interaction.options.getString('name')).catch((err) => interaction.channel.send(err));
        interaction.reply ('server name changed!');

      }
      else if (interaction.options.getSubcommand() === 'channel') {
        // change the name of the channel
        const cost = channelCost;
        const checkPouch = await Point.findOne ({userId: interaction.member.id});
        if (checkPouch.points < cost) return interaction.reply (`You do not have enough Mayo! You need ${cost} mayo to perform this action!`);
        checkPouch.points -= cost;
        increaseJackPot(cost);
        await checkPouch.save();

        const channelToRename = interaction.options.getChannel('target');

        channelToRename.setName(interaction.options.getString('name')).catch((err) => interaction.channel.send(err));
        interaction.reply ('channel name changed!');

      }

    },
  };

