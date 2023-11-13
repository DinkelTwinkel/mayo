const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Point = require('../models/points');
const getAllMessagesInChannel = require('../patterns/getAllMessagesInChannel');
const Fortune = require('../models/dailyFortune');
const Stock = require('../models/stock');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stocks')
    .setDescription('get rich quick'),

    async execute(interaction, client) {

      // generate button row.

      const stocks = await Stock.find();
      const actionRowArray = [];

      // console.log (stocks);

      stocks.forEach(async stock => {

        const stockNameButton = new ButtonBuilder ()
          .setCustomId('Fake' + stock.stockName)
          .setDisabled(true)
          .setStyle(ButtonStyle.Primary)
          .setLabel(stock.stockName);

        const stockValueButton = new ButtonBuilder ()
          .setCustomId('Fake' + stock.stockName + stock.currentValue)
          .setDisabled(true)
          .setStyle(ButtonStyle.Secondary)
          .setLabel(`Share Price: ${stock.currentValue} Mayo`);

        const stockBuyButton = new ButtonBuilder ()
          .setCustomId('buy' + stock.stockName)
          .setDisabled(false)
          .setStyle(ButtonStyle.Secondary)
          .setLabel('BUY');

        const stockSellButton = new ButtonBuilder ()
          .setCustomId('sell' + stock.stockName)
          .setDisabled(false)
          .setStyle(ButtonStyle.Secondary)
          .setLabel('SELL');

        const stockRisingButton = new ButtonBuilder ()
          .setCustomId('Fake' + stock.stockName + 'Rising')
          .setDisabled(true)
          .setStyle(ButtonStyle.Success)
          .setLabel('↗');

        if (stock.rising === false) {
          stockRisingButton.setLabel('↘')
          stockRisingButton.setStyle(ButtonStyle.Danger);
        }
        
        const newActionRow = new ActionRowBuilder ()
        .addComponents( stockNameButton, stockValueButton, stockBuyButton, stockSellButton, stockRisingButton);

        actionRowArray.push(newActionRow);

      });

      interaction.reply ({ components: actionRowArray , ephemeral: false })

    },
  };

