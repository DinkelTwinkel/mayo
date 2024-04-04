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

    const KimoServer = await client.guilds.fetch('1171795345223716964');


    setInterval(async () => {

        const raceTime = 1;
        
        const result = await Bets.find({});
        if (result) {

            result.forEach(bet => {

                if (activeRaces.has(bet.postID)) {
                    return console.log('raceAlreadyActive');
                }
                activeRaces.set(bet.postID);

                const vegas = KimoServer.channels.cache.get(bet.channelID);
                const thread = vegas.threads.cache.find(x => x.id === bet.postID);

                thread.send ({content: '```' + `NEXT RACE STARTING IN: ${raceTime} MINS` + '```'});
            
                setInterval(async () => {

                    await thread.send ({content: `# RACE START!`});
                    await thread.send ({content: `${turtleRaceGif[Math.floor(Math.random() * turtleRaceGif.length)]}`});

                    const winningTurtle = Math.ceil(Math.random() * 5);

                    const winners = await Bets.find({postID: thread.id, betNumber: winningTurtle});
                    const turtleNameArray = [turtleName1, turtleName2, turtleName3, turtleName4, turtleName5];
                    await thread.send ({content: `...`});
                    await thread.send ({content: `...`});
                    await thread.send ({content: `**${turtleNameArray[winningTurtle-1]} WON!**`});

                    if (winners) {
                        for (let index = 0; index < winners.length; index++) {

                            const winnerWallet = await Point.findOne({userId: winners[index].userID});
                            winnerWallet.points += winners[index].betAmount * 4;
                            await winnerWallet.save();

                            const jianDaoWallet = await Point.findOne({userId: '1171936614965067866' });
                            jianDaoWallet.points -= winners[index].betAmount * 4;
                            await jianDaoWallet.save();

                            thread.send ({content: `AWARDING <@${winnerWallet.userId}> ${winners[index].betAmount * 4} MAYO!`});
                        }
                    }
                    
                    await Bets.deleteMany({});
                    activeRaces.delete(bet.postID);
                    //thread.send ({content: '```' + `NEXT RACE STARTING IN: 10MINS` + '```'});
                    
                }, 1000 * 60 * raceTime);

            });
        }
        
    }, 5000);

    

    client.on(Events.MessageCreate, async (message) => {

        if (message.guild.id != '1171795345223716964') return;

        if (message.content.startsWith('!')) {
            console.log('commandDetected');
            // Extract the command and any arguments
            const args = message.content.slice(1).trim().split(/ +/);
            const command = args.shift().toLowerCase();
        
            // Check the command and respond

            if (command === 'rps') {

                const embed = new EmbedBuilder()
                .setAuthor({
                  name: "Mayo's Gambling House",
                  iconURL: "https://cdn.discordapp.com/attachments/1061965352755544084/1222201371995144253/dd442co-7c629952-16ab-4b6e-82df-622d874200db.gif?ex=66155aba&is=6602e5ba&hm=f50bed09a4fb850b035c296f494c666e19a23e04412d1330f1dec5c1644ec090&",
                })
                .setDescription("```ROCK PAPER SCISSORS\n> PICK ONE OF THE OPTIONS BELOW TO PLAY.\n> 10 MAYO FOR ROCK\n> 100 MAYO FOR PAPER\n> 1000 MAYO FOR SCISSORS```\n*WINNINGS ARE DOUBLED.*")
                .setThumbnail("https://cdn.discordapp.com/emojis/1172488839688880128.gif?size=96&quality=lossless");
              
                const rockButton = new ButtonBuilder ()
                .setCustomId('rock')
                .setLabel('ROCK')
                .setStyle(ButtonStyle.Secondary);
                
                const paperButton = new ButtonBuilder ()
                .setCustomId('paper')
                .setLabel('PAPER')
                .setStyle(ButtonStyle.Primary);

                const scissorButton = new ButtonBuilder ()
                .setCustomId('scissor')
                .setLabel('SCISSOR')
                .setStyle(ButtonStyle.Danger);
        
                const powerRow = new ActionRowBuilder ()
                .addComponents(rockButton,paperButton,scissorButton);

                const casinoMessage = await message.channel.send ({embeds: [embed], components: [powerRow]});

                const thread = await casinoMessage.startThread({
                    name: 'ROCK PAPER SCISSORS',
                    autoArchiveDuration: 1440,
                    // 24 hours
                    type:  ChannelType.PublicThread,
                    // flags: ThreadFlags.FLAGS.CREATED_FROM_MESSAGE,
                });

            }

            if (command === 'catrace') {

                const embed = new EmbedBuilder()
                .setAuthor({
                  name: "MAYO's Gambling House",
                  iconURL: "https://cdn.discordapp.com/attachments/1061965352755544084/1222201371995144253/dd442co-7c629952-16ab-4b6e-82df-622d874200db.gif?ex=66155aba&is=6602e5ba&hm=f50bed09a4fb850b035c296f494c666e19a23e04412d1330f1dec5c1644ec090&",
                })
                .setDescription("```CAT RACE\n> PLACE A BET ON ONE OF THE CATS BELOW FOR 100 MAYO. RACES RUN 1 MIN after first bet has been placed ```\n*x4 Returns on winning bet.*")
                .setThumbnail("https://cdn.discordapp.com/attachments/1224559807889936414/1225501065223340062/IMG_2932.jpg?ex=66215bce&is=660ee6ce&hm=1cb679f6d34cd88bceff096b9dbf3c6d0ee75f3fb470d58fcf39dfd61ccda61b&");
              
                const turtle1 = new ButtonBuilder ()
                .setCustomId('turtle1')
                .setLabel(turtleName1)
                .setStyle(ButtonStyle.Secondary);
                
                const turtle2 = new ButtonBuilder ()
                .setCustomId('turtle2')
                .setLabel(turtleName2)
                .setStyle(ButtonStyle.Secondary);

                const turtle3 = new ButtonBuilder ()
                .setCustomId('turtle3')
                .setLabel(turtleName3)
                .setStyle(ButtonStyle.Secondary);

                const turtle4 = new ButtonBuilder ()
                .setCustomId('turtle4')
                .setLabel(turtleName4)
                .setStyle(ButtonStyle.Secondary);

                const turtle5 = new ButtonBuilder ()
                .setCustomId('turtle5')
                .setLabel(turtleName5)
                .setStyle(ButtonStyle.Secondary);
        
                const powerRow = new ActionRowBuilder ()
                .addComponents(turtle1,turtle2,turtle3,turtle4,turtle5);

                const casinoMessage = await message.channel.send ({embeds: [embed], components: [powerRow]});

                const thread = await casinoMessage.startThread({
                    name: 'THE KITTY RACES',
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
  
        if (interaction.customId === 'rock') {
            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 100;
            const userWallet = await Point.findOne({ userId: interaction.member.id });
            if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient mayo, you need ${cost} mayo to play this`, ephemeral: true });

            const jianDaoWallet = await Point.findOne ({userId: '1171936614965067866'});
            if (jianDaoWallet.points < cost) return thread.send ({ content: `${interaction.member} Mayo is too broke to play this wager`, ephemeral: true });

            const playMessage = await thread.send (`${interaction.member} played **rock**!`);

            const dice = Math.floor(Math.random() * 3);
    
            if (dice === 2) {
                playMessage.reply (`MAYO played paper! You lose ${cost} MAYO!`);
                userWallet.points -= cost;
                jianDaoWallet.points += cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
            else if (dice === 1) {
                playMessage.reply (`MAYO played rock! It's a draw!`);
            }
            else {
                playMessage.reply (`MAYO played scissor! You win ${cost} MAYO!`);
                userWallet.points += cost;
                jianDaoWallet.points -= cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
        }

        if (interaction.customId === 'paper') {
            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 1000;
            const userWallet = await Point.findOne({ userId: interaction.member.id });
            if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient mayo, you need ${cost} mayo to play this`, ephemeral: true });

            const jianDaoWallet = await Point.findOne ({userId: '1171936614965067866'});
            if (jianDaoWallet.points < cost) return thread.send ({ content: `${interaction.member} Mayo is too broke to play this wager`, ephemeral: true });

            const playMessage = await thread.send (`${interaction.member} played **paper**!`);

            const dice = Math.floor(Math.random() * 3);
    
            if (dice === 2) {
                playMessage.reply (`MAYO played scissors! You lose ${cost} MAYO!`);
                userWallet.points -= cost;
                jianDaoWallet.points += cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
            else if (dice === 1) {
                playMessage.reply (`MAYO played paper! It's a draw!`);
            }
            else {
                playMessage.reply (`MAYO played rock! You win ${cost} MAYO!`);
                userWallet.points += cost;
                jianDaoWallet.points -= cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
        }

        if (interaction.customId === 'scissor') {
            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 10000;
            const userWallet = await Point.findOne({ userId: interaction.member.id });
            if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient mayo, you need ${cost} mayo to play this`, ephemeral: true });

            const jianDaoWallet = await Point.findOne ({userId: '1171936614965067866'});
            if (jianDaoWallet.points < cost) return thread.send ({ content: `${interaction.member} Mayo is too broke to play this wager`, ephemeral: true });

            const playMessage = await thread.send (`${interaction.member} played **scissors**!`);

            const dice = Math.floor(Math.random() * 3);
    
            if (dice === 2) {
                playMessage.reply (`MAYO played rock! You lose ${cost} MAYO!`);
                userWallet.points -= cost;
                jianDaoWallet.points += cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
            else if (dice === 1) {
                playMessage.reply (`MAYO played scissors! It's a draw!`);
            }
            else {
                playMessage.reply (`MAYO played paper! You win ${cost} MAYO!`);
                userWallet.points += cost;
                jianDaoWallet.points -= cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
        }

        if (interaction.customId === 'turtle1') {

            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 100;
            const userWallet = await Point.findOne({userId: interaction.member.id });
            if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient MAYO, you need ${cost} MAYO to place this bet`, ephemeral: true });

            let findBet = await Bets.findOne({postID: interaction.message.id, userID: interaction.member.id, betNumber: 1 });
            if (!findBet) {
                findBet = new Bets ({
                    postID: interaction.message.id,
                    channelID: interaction.channel.id,
                    userID: interaction.member.id,
                    betNumber: 1,
                    betAmount: 0,
                })
            }

            findBet.betAmount += cost;

            userWallet.points -= cost;
            const jianDaoWallet = await Point.findOne({userId: '1171936614965067866' });
            jianDaoWallet.points += cost;
            await jianDaoWallet.save();
            await userWallet.save();

            await findBet.save();
            thread.send ({ content: `${interaction.member} placed a bet on **${turtleName1}** for ${findBet.betAmount} MAYO!`});
        }

        if (interaction.customId === 'turtle2') {

            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 100;
            const userWallet = await Point.findOne({userId: interaction.member.id });
            if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient MAYO, you need ${cost} MAYO to place this bet`, ephemeral: true });

            let findBet = await Bets.findOne({postID: interaction.message.id, userID: interaction.member.id, betNumber: 2 });
            if (!findBet) {
                findBet = new Bets ({
                    postID: interaction.message.id,
                    channelID: interaction.channel.id,
                    userID: interaction.member.id,
                    betNumber: 2,
                    betAmount: 0,
                })
            }

            findBet.betAmount += cost;

            userWallet.points -= cost;
            const jianDaoWallet = await Point.findOne({userId: '1171936614965067866' });
            jianDaoWallet.points += cost;
            await jianDaoWallet.save();
            await userWallet.save();

            await findBet.save();
            thread.send ({ content: `${interaction.member} placed a bet on **${turtleName2}** for ${findBet.betAmount} MAYO!`});
        }

        if (interaction.customId === 'turtle3') {

            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 100;
            const userWallet = await Point.findOne({userId: interaction.member.id });
            if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient MAYO, you need ${cost} MAYO to place this bet`, ephemeral: true });

            let findBet = await Bets.findOne({postID: interaction.message.id, userID: interaction.member.id, betNumber: 3 });
            if (!findBet) {
                findBet = new Bets ({
                    postID: interaction.message.id,
                    channelID: interaction.channel.id,
                    userID: interaction.member.id,
                    betNumber: 3,
                    betAmount: 0,
                })
            }

            findBet.betAmount += cost;

            userWallet.points -= cost;
            const jianDaoWallet = await Point.findOne({userId: '1171936614965067866' });
            jianDaoWallet.points += cost;
            await jianDaoWallet.save();
            await userWallet.save();

            await findBet.save();
            thread.send ({ content: `${interaction.member} placed a bet on **${turtleName3}** for ${findBet.betAmount} MAYO!`});
        }

        if (interaction.customId === 'turtle4') {

            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 100;
            const userWallet = await Point.findOne({userId: interaction.member.id });
            if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient MAYO, you need ${cost} MAYO to place this bet`, ephemeral: true });

            let findBet = await Bets.findOne({postID: interaction.message.id, userID: interaction.member.id, betNumber: 4 });
            if (!findBet) {
                findBet = new Bets ({
                    postID: interaction.message.id,
                    channelID: interaction.channel.id,
                    userID: interaction.member.id,
                    betNumber: 4,
                    betAmount: 0,
                })
            }

            findBet.betAmount += cost;

            userWallet.points -= cost;
            const jianDaoWallet = await Point.findOne({userId: '1171936614965067866' });
            jianDaoWallet.points += cost;
            await jianDaoWallet.save();
            await userWallet.save();

            await findBet.save();
            thread.send ({ content: `${interaction.member} placed a bet on **${turtleName4}** for ${findBet.betAmount} MAYO!`});
        }

        if (interaction.customId === 'turtle5') {

            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 100;
            const userWallet = await Point.findOne({userId: interaction.member.id });
            if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient MAYO, you need ${cost} MAYO to place this bet`, ephemeral: true });

            let findBet = await Bets.findOne({postID: interaction.message.id, userID: interaction.member.id, betNumber: 5 });
            if (!findBet) {
                findBet = new Bets ({
                    postID: interaction.message.id,
                    channelID: interaction.channel.id,
                    userID: interaction.member.id,
                    betNumber: 5,
                    betAmount: 0,
                })
            }

            findBet.betAmount += cost;

            userWallet.points -= cost;
            const jianDaoWallet = await Point.findOne({userId: '1171936614965067866' });
            jianDaoWallet.points += cost;
            await jianDaoWallet.save();
            await userWallet.save();

            await findBet.save();
            thread.send ({ content: `${interaction.member} placed a bet on **${turtleName5}** for ${findBet.betAmount} MAYO!`});
        }

    })


};
