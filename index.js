// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Events, GatewayIntentBits, ActivityType, PermissionsBitField } = require('discord.js');
const { token, mongourl } = require('./keys.json');
require('log-timestamp');
const lurkHour = 24 * 7;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });

const mongoose = require('mongoose');

  mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to mayoDB'))
    .catch((err) => console.log(err));

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'

const registerCommands = require ('./registerCommands');
const Banner = require('./models/bannerimages');
const Point = require('./models/points');
const Colour = require('./models/customColour');
const Fortune = require('./models/dailyFortune');
const Lurker = require('./models/lurker');
const sushiConveyor = require('./patterns/sushiConveyor');
const Stock = require('./models/stock');
const stockBuySellFluctuations = require('./patterns/stockBuySellFluctuations');
registerCommands;

client.once(Events.ClientReady, async c => {

	console.log(`Ready! Logged in as ${c.user.tag}`);
    client.user.setPresence( { status: "away" });

    let mayoPoints = await Point.findOne ({ userId: '1171936614965067866' });
    client.user.setActivity(`JACKPOT: ${mayoPoints.points} MAYO`, { type: ActivityType.Watching });

    const friendshipGuild = await client.guilds.fetch('1171795345223716964');
    const mushiesRole = friendshipGuild.roles.cache.get('1171796100223615056');
    mushiesRole.setPosition(friendshipGuild.roles.cache.size - 2);
    const randomimage = await Banner.aggregate([
        {
            $sample: {
                size: 1
            }
        }
    ])
    // console.log (randomimage[0].imageLink);
    await friendshipGuild.setBanner(randomimage[0].imageLink);

    (await friendshipGuild.members.fetch ('865147754358767627')).roles.remove('1171796100223615056');

    // const newStock = new Stock ({
    //   stockName: "pasha's",
    //   currentValue: 10,
    //   passiveFluctuation: 10,
    //   onePercentChanceFluctuation:-1000,
    // })
    // newStock.save();

    
    stockBuySellFluctuations(client);


    setInterval(() => {

        setRandomImage(friendshipGuild);
        console.log('changing banner');

    }, 30 * 60 * 1000);

    const members = await friendshipGuild.members.fetch();

    // lurker document check
    const now = new Date();
    // Add 24 hours to the current date and time
    now.setUTCHours(now.getUTCHours() + lurkHour);
    // Get the UTC milliseconds for the date 7 days from now
    const utcMilliseconds = now.getTime();

    members.forEach (async (member) => {
      let checkLurk = await Lurker.findOne({ userId: member.user.id })
      if (!checkLurk) {
        checkLurk = new Lurker ({
          userId: member.user.id,
          lurkTime: utcMilliseconds,
        })
        await checkLurk.save();
      }
    })

    // intervaled lurker check
    setInterval(async () => {

      // check database lurk time for any that is greater than current time. if so, set user roles.
      const result = await Lurker.find({ lurkTime: { $lt: new Date().getTime() } });
      // console.log (result);
      if (result.length > 0) {
        console.log ('found result');
        result.forEach (async (r) => {
          // turn user into a ghost.
          (await friendshipGuild.members.fetch(r.userId)).roles.set(['1172197535922798644']).catch((err) => {});

          const deletCustomColour = await Colour.findOne({ userId: r.userId });
          if (deletCustomColour) {
            await friendshipGuild.roles.fetch(deletCustomColour.roleID).delete();
            await Colour.deleteOne ({ userId: r.userId });
          }

          const now = new Date();
          // Add 24 hours to the current date and time
          now.setUTCHours(now.getUTCHours() + lurkHour);
          // Get the UTC milliseconds for the date 7 days from now
          const utcMilliseconds = now.getTime();

          r.lurkTime = utcMilliseconds

          await r.save();
        })
      }
      
    }, 10000);
    
    // mayo-ed role cleanup
    members.forEach((member) => {
      if (member.roles.cache.get('1172041699783098452')) member.roles.remove ('1172041699783098452');
    })

    // sushiConveyer 

    const sushiChannel = friendshipGuild.channels.cache.get('1172436511057268747');
    sushiChannel.setName (await sushiConveyor(sushiChannel.name));

    setInterval(async () => {

      sushiChannel.setName (await sushiConveyor(sushiChannel.name));
      
    }, 1000 * 60 * 5);
});

async function setRandomImage(friendshipGuild) {
        const randomimage = await Banner.aggregate([
            {
                $sample: {
                    size: 1
                }
            }
        ])
        console.log (randomimage);
        friendshipGuild.setBanner(randomimage[0].imageLink);
}

// new user join auto role

client.on(Events.GuildMemberAdd, async (member) => {

  member.roles.add('1171797289581424661')
  member.guild.systemChannel.send(`Hello ${member}, I am MAY-O, to become mayo try **/mayo**`);

  // lurker checker 
  const now = new Date();
  // Add 24 hours to the current date and time
  now.setUTCHours(now.getUTCHours() + lurkHour);
  // Get the UTC milliseconds for the date 7 days from now
  const utcMilliseconds = now.getTime();
  const checkLurk = new Lurker ({
    userId: member.user.id,
    lurkTime: utcMilliseconds,
  })
  await checkLurk.save().catch((err) => {console.log (err)});

});

client.on(Events.GuildMemberRemove, async (member) => {

  await Point.deleteOne({ userId: member.user.id });
  const deletCustomColour = await Colour.findOne({ userId: member.user.id });
  if (deletCustomColour) {
    await member.guild.roles.cache.get(deletCustomColour.roleID).delete();
    await Colour.deleteOne ({ userId: member.user.id });
  }
  await Fortune.deleteOne({ userId: member.user.id });
  await Lurker.deleteOne({ userId: member.user.id });

});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  // console.log (newState);
  // Check if the user joined a voice channel
  if (!oldState.channel && newState.channel && newState.channel.id === '1172195956985446460') {
    // Disconnect the user immediately
    newState.member.roles.set(['1171797289581424661']).catch((err) => {});

    // reset lurk time.
    const now = new Date();
    // Add 24 hours to the current date and time
    now.setUTCHours(now.getUTCHours() + lurkHour);
    // Get the UTC milliseconds for the date 7 days from now
    const utcMilliseconds = now.getTime();
    const checkLurk = await Lurker.findOne ({ userId: newState.member.user.id });
    checkLurk.lurkTime = utcMilliseconds;
    await checkLurk.save();

    newState.member.voice.disconnect();
    console.log(`User ${newState.member.user.tag} joined a voice channel and was immediately disconnected.`);

  }
});

//Regular Secret Commands 
//Check if user is also in the hell mart discord. Only work if so.
client.on(Events.MessageCreate, async (message) => {

  if (message.content.startsWith('!')) {
      console.log('commandDetected');
      // Extract the command and any arguments
      const args = message.content.slice(1).trim().split(/ +/);
      const command = args.shift().toLowerCase();
  
      // Check the command and respond
      if (command === 'fixmayo') {
        const members = await message.guild.members.fetch();
        // console.log (members);
        members.forEach(async member => {
          if (await Point.findOne({userId:member.id})) return;
          const newPouch = new Point ({
            userId: member.id,
            points: 0,
          })
          await newPouch.save();
          message.channel.send(`creating mayo for ${member}`);
        });
      } 
    }
})

// give user point and reset lurk time
client.on(Events.MessageCreate, async (message) => {

  // reset lurk time.
  const now = new Date();
  // Add 24 hours to the current date and time
  now.setUTCHours(now.getUTCHours() + lurkHour);
  // Get the UTC milliseconds for the date 7 days from now
  const utcMilliseconds = now.getTime();
  const checkLurk = await Lurker.findOne ({ userId: message.member.user.id });
  checkLurk.lurkTime = utcMilliseconds;
  await checkLurk.save();

  let userPouch = await Point.findOne ({ userId: message.member.id });

  if (message.author.bot) {
    client.user.setActivity(`JACKPOT: ${userPouch.points} MAYO`, { type: ActivityType.Watching });
  }

  if (!userPouch) {
    userPouch = new Point ({
      userId: message.member.id,
      points: 0,
    })
  }
  userPouch.points += 1;
  await userPouch.save();

});

// Define a collection to store your commands
client.commands = new Map();

// Read the command files and register them
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  }
  catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
  }
});

// Log in to Discord with your client's token

client.login(token);