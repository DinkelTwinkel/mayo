const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Point = require('../models/points');
const getAllMessagesInChannel = require('../patterns/getAllMessagesInChannel');
const Fortune = require('../models/dailyFortune');
const Stock = require('../models/stock');
const Inventory = require('../models/inventory');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stocks')
    .setDescription('get rich quick'),

    async execute(interaction, client) {

      // generate button row.

      const stocks = await Stock.find();
      
      const playerInventory = await Inventory.find({ ownerId: interaction.member.user.id });

      const actionRowArray = [];

      console.log (stocks);

      stocks.forEach(async stock => {

        // console.log ('creating stock' + stock.stockName);

        const stockNameButton = new ButtonBuilder ()
          .setCustomId('Fake' + stock.stockName)
          .setDisabled(true)
          .setStyle(ButtonStyle.Primary)
          .setLabel(stock.stockName);

        const stockValueButton = new ButtonBuilder ()
          .setCustomId('Fake' + stock.stockName + stock.currentValue)
          .setDisabled(true)
          .setStyle(ButtonStyle.Secondary)
          .setLabel(`Share Price: ${stock.currentValue} VBUCKS`);

        const stockBuyButton = new ButtonBuilder ()
          .setCustomId('buy' + stock.stockName)
          .setDisabled(false)
          .setStyle(ButtonStyle.Secondary)
          .setLabel('BUY');

        let currentlyHave = 0;

        if (playerInventory) {
          const itemCheck = playerInventory.find(playerInventory => playerInventory.itemName === stock.stockName)
          if (itemCheck) {
            currentlyHave = itemCheck.quantity;
          }
        }

        const stockSellButton = new ButtonBuilder ()
          .setCustomId('sell' + stock.stockName)
          .setDisabled(false)
          .setStyle(ButtonStyle.Secondary)
          .setLabel(`SELL: [${currentlyHave}]`);

        const stockRisingButton = new ButtonBuilder ()
          .setCustomId('Fake' + stock.stockName + 'Rising')
          .setDisabled(true)
          .setStyle(ButtonStyle.Success)
          .setLabel(`+${stock.currentShift}%↗`);


        if (stock.rising === false) {
          stockRisingButton.setLabel(`-${stock.currentShift}%↘`)
          stockRisingButton.setStyle(ButtonStyle.Danger);
        }
        
        const newActionRow = new ActionRowBuilder ()
        .addComponents( stockNameButton, stockValueButton, stockBuyButton, stockSellButton, stockRisingButton);

        actionRowArray.push(newActionRow);

      });


      let username = interaction.member.nickname;
      if (!interaction.member.nickname) username = interaction.member.user.globalName;

      interaction.reply ({ content: 'MAYO STOCK MARKET: ' + username, components: actionRowArray , ephemeral: false })

    },
  };

