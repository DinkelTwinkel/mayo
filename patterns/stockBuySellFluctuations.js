const { Events } = require("discord.js");
const Stock = require("../models/stock");
const Point = require("../models/points");
const Inventory = require("../models/inventory");
const getAllMessagesInChannel = require("./getAllMessagesInChannel");

const stockFluctuationTimer = 10;

module.exports = async (client) => {

  console.log ('StockMarket Module Engaged');

  shiftStock ();

  setInterval(async () => {

    shiftStock ();
    
  }, 1000 * 60 * stockFluctuationTimer);

  client.on(Events.InteractionCreate, async (interaction) => {

    if (interaction.isButton === false) return;

    const stocks = await Stock.find();

    stocks.forEach ( async stock => {

      if (interaction.customId === 'buy' + stock.stockName) {

        //interaction.deferUpdate();

        // buy click deteced.

        const cost = stock.currentValue;
        const checkPouch = await Point.findOne ({userId: interaction.member.id});
        if (checkPouch.points < cost) return interaction.reply (`You do not have enough Mayo! You need ${cost} mayo to perform this action!`);
        checkPouch.points -= cost;
        await checkPouch.save();

        // successfully bought.

        let checkExistingInventory = await Inventory.findOne({
          ownerId: interaction.member.user.id,
          itemName: stock.stockName,
        })

        if (!checkExistingInventory) {
          // no existing inventory item, creating new
          checkExistingInventory = new Inventory ({
            ownerId: interaction.member.user.id,
            itemName: stock.stockName,
            quantity: 0,
          })
        }

        checkExistingInventory.quantity += 1;

        // console.log (checkExistingInventory);

        await checkExistingInventory.save();

        interaction.reply (`Thank you for buying ${stock.stockName}, you currently have ${checkExistingInventory.quantity} shares.`)

      }
      else if (interaction.customId === 'sell' + stock.stockName) {

        let checkExistingInventory = await Inventory.findOne({
          ownerId: interaction.member.user.id,
          itemName: stock.stockName,
        })

        if (!checkExistingInventory || checkExistingInventory.quantity === 0) return interaction.reply({content: 'You must buy the stock first!', ephemeral: true });
        
        // user posesses stock

        checkExistingInventory.quantity -= 1;
        await checkExistingInventory.save();

        const checkPouch = await Point.findOne ({userId: interaction.member.id});
        checkPouch.points += stock.currentValue;
        await checkPouch.save();

        interaction.reply (`${stock.stockName} Stock SOLD for ${stock.currentValue} Mayo, you currently have ${checkExistingInventory.quantity} shares.`)

      }


    })
  
  });

};

async function shiftStock () {

  let stocks = await Stock.find();
  stocks.forEach (async stock => {

    if (0.1 > Math.random()) {
      stock.rising = !stock.rising;
    }
    
    const rising = stock.rising;
    
    let change = stock.passiveFluctuation;

    if (0.01 > Math.random()) {
      change = stock.onePercentChanceFluctuation;
      if (stock.onePercentChanceFluctuation < 0) stock.rising = false;
    }

    change = Math.ceil(change * Math.random());

    stock.currentShift = Math.round((change / stock.currentValue) * 100) / 100;

    if (rising === true) {
      stock.currentValue += change;
      if (stock.currentValue < 1) stock.currentValue = 1;
    }
    else {
      stock.currentValue -= change;
      if (stock.currentValue < 1) {
        //stock death
        console.log (stock.stockName + ' has died, generating new stock');
        await client.guilds.cache.get('1171795345223716964').channels.cache.get('1171804720906641428').send(stock.stockName + ' has died, new stock available.');

        // replace stock with new stock. 

        // pick random stock name.
        stock = Stock ({
          stockName: getStockName(),
          currentValue: Math.ceil(Math.random() * 100),
          passiveFluctuation: Math.ceil(Math.random() * 100),
          onePercentChanceFluctuation: Math.ceil(Math.random() * 1000),
        })

      }
    }

    stock.save();

  })

}

async function getStockName(client) {

  const backRooms = client.guilds.cache.get('1103779676406693981');
  const cookieChannel = backRooms.channels.cache.get('1173936658169745478');

  const messages = await getAllMessagesInChannel(cookieChannel);

  const randomIndex = Math.floor(Math.random() * messages.length);

  const randomMessage = Array.from(messages)[randomIndex];

  return randomMessage.content;

}