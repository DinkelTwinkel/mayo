// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const { token, mongourl } = require('./keys.json');
require('log-timestamp');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const mongoose = require('mongoose');

  mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to mayoDB'))
    .catch((err) => console.log(err));

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'

const registerCommands = require ('./registerCommands');
const Banner = require('./models/bannerimages');
registerCommands;

client.once(Events.ClientReady, async c => {

	console.log(`Ready! Logged in as ${c.user.tag}`);
    client.user.setPresence( { status: "away" });
    client.user.setActivity('running away from denil', { type: ActivityType.Playing });

    const friendshipGuild = client.guilds.cache.get('1171795345223716964');
    const randomimage = await Banner.aggregate([
        {
            $sample: {
                size: 1
            }
        }
    ])
    console.log (randomimage);
    friendshipGuild.setBanner(randomimage.imageLink);

    setInterval(() => {

        setRandomImage(friendshipGuild);
        console.log('changing banner');

    }, 30 * 60 * 1000);

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
        friendshipGuild.setBanner(randomimage.imageLink);
}

// new user join auto role

client.on(Events.GuildMemberAdd, async (member) => {

    member.roles.add('1171797289581424661')

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
        if (command === 'ping') {
          message.channel.send('pong');
        } 
      }
})

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