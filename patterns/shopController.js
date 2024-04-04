// const KimoTracker = require('../models/kimoTracker');
const { ActivityType, Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionCollector, ChannelType} = require('discord.js');
// const UserData = require('../models/userData');
// const Bets = require('../models/bets');
const Point = require('../models/points');
const Bets = require('../models/bets');
const activeRaces = new Map();

const turtleName1 = 'SAHEE';
const turtleName2 = 'SALEM';
const turtleName3 = 'JALEBI';
const turtleName4 = 'DENIL';
const turtleName5 = 'NOLAN';

const turtleRaceGif = [
    'https://tenor.com/view/cat-drift-catdrift-gif-16095187850320735968',
    'https://tenor.com/view/awww-cuteness-kitten-gif-20026484',
    'https://tenor.com/view/tama-and-friends-race-cats-cat-race-slipping-gif-7796759160506363308',
    'https://tenor.com/view/kitty-cat-driving-car-cute-gif-16109266'
]

module.exports = async (client) => {

    // race cycle
    
    client.on(Events.MessageCreate, async (message) => {

        if (message.guild.id != '1171795345223716964') return;

        if (message.content.startsWith('!')) {
            console.log('commandDetected');
            // Extract the command and any arguments
            const args = message.content.slice(1).trim().split(/ +/);
            const command = args.shift().toLowerCase();
        
            // Check the command and respond

            if (command === 'invitestore') {

                const embed = new EmbedBuilder()
                .setAuthor({
                  name: "MAYOLAND VISITOR'S PASS 🎫",
                })
                .setDescription("```Buy a mayoland invite for 1000 Mayo!```\n*invite link is single use.*")
                .setColor("#fff3b8")
                .setThumbnail("https://cdn.discordapp.com/attachments/1061965352755544084/1225540610241597470/71ALEDbXA9L.png?ex=662180a2&is=660f0ba2&hm=01565883a99bed89eedd6e68bdc1e5d1e7a7c4590826db87b6cca71554c7b296&");
              
                const button = new ButtonBuilder ()
                .setCustomId('buyinvite')
                .setLabel('buy pass')
                .setStyle(ButtonStyle.Success);

                const powerRow = new ActionRowBuilder ()
                .addComponents(button);

                const casinoMessage = await message.channel.send ({embeds: [embed], components: [powerRow]});

                const thread = await casinoMessage.startThread({
                    name: 'MAYOLAND VISITOR\'S PASS 🎫',
                    autoArchiveDuration: 1440,
                    // 24 hours
                    type:  ChannelType.PublicThread,
                    // flags: ThreadFlags.FLAGS.CREATED_FROM_MESSAGE,
                });

            }

        }

    })

    client.on(Events.InteractionCreate, async (interaction) => {

        if (!interaction.isButton()) return;
  
        console.log ('buttonclick detected')
  
        if (interaction.customId === 'buyinvite') {
            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 1000;
            const userWallet = await Point.findOne({ userId: interaction.member.id });
            if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient mayo, you need ${cost} mayo to buy this`, ephemeral: true });
            userWallet.points -= cost;
            await userWallet.save();

            const playMessage = await thread.send (`${interaction.member.displayName} bought a ticket!`);

            const hellMartServer = interaction.guild;
            const inviteChannel = hellMartServer.channels.cache.get('1171795345697669142');
    
            let invite = await inviteChannel.createInvite({
              maxAge: 10 * 60 * 1000,
              maxUses: 1,
            });
    
            interaction.followUp({content: `travel pass obtained: https://discord.gg/${invite.code} (SINGLE USE, EXPIRES in one WEEK)`, ephemeral: true});
    
        }

 
    })


};
