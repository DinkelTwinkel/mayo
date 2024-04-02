// const KimoTracker = require('../models/kimoTracker');
const { ActivityType, Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionCollector, ChannelType} = require('discord.js');
// const UserData = require('../models/userData');
// const Bets = require('../models/bets');
const Point = require('../models/points');

const turtleName1 = 'Jeremy';
const turtleName2 = 'Ferdinand';
const turtleName3 = 'Mochi';
const turtleName4 = 'DWAYNE';
const turtleName5 = 'John Cena';

const turtleRaceGif = [
    'https://tenor.com/view/normal-day-lame-tortoise-slow-motion-here-i-come-gif-17090395',
    'https://tenor.com/view/emannuel-emanuel-emmanuel-emannuel-turtle-emannuel-tartaruga-gif-16318642',
    'https://tenor.com/view/jet-turtle-jet-turtle2-fast-race-gif-15706533'
]

module.exports = async (client) => {

    // race cycle

    //const KimoServer = await client.guilds.fetch('1193663232041304134');
    // const vegas = KimoServer.channels.cache.get('1216049778358751342');
    // const thread = vegas.threads.cache.find(x => x.id === '1222235110254841936');

    // thread.send ({content: '```' + `NEXT RACE STARTING IN: 10MINS` + '```'});
    
    // setInterval(async () => {

    //     await thread.send ({content: `# RACE START!`});
    //     await thread.send ({content: `${turtleRaceGif[Math.floor(Math.random() * turtleRaceGif.length)]}`});

    //     const winningTurtle = Math.ceil(Math.random() * 5);

    //     const winners = await Bets.find({postID: thread.id, betNumber: winningTurtle});
    //     const turtleNameArray = [turtleName1, turtleName2, turtleName3, turtleName4, turtleName5];
    //     await thread.send ({content: `...`});
    //     await thread.send ({content: `...`});
    //     await thread.send ({content: `**${turtleNameArray[winningTurtle-1]} WON!**`});

    //     if (winners) {
    //         for (let index = 0; index < winners.length; index++) {

    //             const winnerWallet = await UserData.findOne({userID: winners[index].userID});
    //             winnerWallet.points += winners[index].betAmount * 4;
    //             await winnerWallet.save();

    //             const jianDaoWallet = await UserData.findOne({ userID: '865147754358767627' });
    //             jianDaoWallet.points -= winners[index].betAmount * 4;
    //             await jianDaoWallet.save();

    //             thread.send ({content: `AWARDING <@${winnerWallet.userID}> ${winners[index].betAmount * 4} MAYO!`});
    //         }
    //     }
        
    //     await Bets.deleteMany({});
    //     thread.send ({content: '```' + `NEXT RACE STARTING IN: 10MINS` + '```'});
        
    // }, 1000 * 60 * 10.1);

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

            // if (command === 'turtlerace') {

            //     const embed = new EmbedBuilder()
            //     .setAuthor({
            //       name: "Goblin's Gambling House",
            //       iconURL: "https://cdn.discordapp.com/attachments/1061965352755544084/1222201371995144253/dd442co-7c629952-16ab-4b6e-82df-622d874200db.gif?ex=66155aba&is=6602e5ba&hm=f50bed09a4fb850b035c296f494c666e19a23e04412d1330f1dec5c1644ec090&",
            //     })
            //     .setDescription("```TURTLE RACE\n> PLACE A BET ON ONE OF THE TURTLES BELOW FOR 10 MAYO. RACES RUN EVERY 10Mins```\n*x4 Returns on winning bet.*")
            //     .setThumbnail("https://cdn.discordapp.com/attachments/1061965352755544084/1222223685289513080/image.png?ex=66156f82&is=6602fa82&hm=65e15f955d0c4a87ff6819512622923aee94be0f039eb337165a0b660d0cd23f&");
              
            //     const turtle1 = new ButtonBuilder ()
            //     .setCustomId('turtle1')
            //     .setLabel(turtleName1)
            //     .setStyle(ButtonStyle.Secondary);
                
            //     const turtle2 = new ButtonBuilder ()
            //     .setCustomId('turtle2')
            //     .setLabel(turtleName2)
            //     .setStyle(ButtonStyle.Secondary);

            //     const turtle3 = new ButtonBuilder ()
            //     .setCustomId('turtle3')
            //     .setLabel(turtleName3)
            //     .setStyle(ButtonStyle.Secondary);

            //     const turtle4 = new ButtonBuilder ()
            //     .setCustomId('turtle4')
            //     .setLabel(turtleName4)
            //     .setStyle(ButtonStyle.Secondary);

            //     const turtle5 = new ButtonBuilder ()
            //     .setCustomId('turtle5')
            //     .setLabel(turtleName5)
            //     .setStyle(ButtonStyle.Secondary);
        
            //     const powerRow = new ActionRowBuilder ()
            //     .addComponents(turtle1,turtle2,turtle3,turtle4,turtle5);

            //     const casinoMessage = await message.channel.send ({embeds: [embed], components: [powerRow]});

            //     const thread = await casinoMessage.startThread({
            //         name: 'THE GREAT TURTLE RACES',
            //         autoArchiveDuration: 1440,
            //         // 24 hours
            //         type:  ChannelType.PublicThread,
            //         // flags: ThreadFlags.FLAGS.CREATED_FROM_MESSAGE,
            //     });

            // }
        }

    })

    client.on(Events.InteractionCreate, async (interaction) => {

        if (!interaction.isButton()) return;
  
        console.log ('buttonclick detected')
  
        if (interaction.customId === 'rock') {
            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 10;
            const userWallet = await Point.findOne({ userId: interaction.member.id });
            if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient mayo, you need ${cost} mayo to play this`, ephemeral: true });

            const jianDaoWallet = await Point.findOne ({userId: '1171936614965067866'});
            if (jianDaoWallet.points < cost) return thread.send ({ content: `${interaction.member} Mayo is too broke to play this wager`, ephemeral: true });

            const playMessage = await thread.send (`${interaction.member} played **rock**!`);

            const dice = Math.floor(Math.random() * 3);
    
            if (dice === 2) {
                playMessage.reply (`Goblin played paper! You lose ${cost} MAYO!`);
                userWallet.points -= cost;
                jianDaoWallet.points += cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
            else if (dice === 1) {
                playMessage.reply (`Goblin played rock! It's a draw!`);
            }
            else {
                playMessage.reply (`Goblin played scissor! You win ${cost} MAYO!`);
                userWallet.points += cost;
                jianDaoWallet.points -= cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
        }

        if (interaction.customId === 'paper') {
            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 100;
            const userWallet = await Point.findOne({ userId: interaction.member.id });
            if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient mayo, you need ${cost} mayo to play this`, ephemeral: true });

            const jianDaoWallet = await Point.findOne ({userId: '1171936614965067866'});
            if (jianDaoWallet.points < cost) return thread.send ({ content: `${interaction.member} Mayo is too broke to play this wager`, ephemeral: true });

            const playMessage = await thread.send (`${interaction.member} played **paper**!`);

            const dice = Math.floor(Math.random() * 3);
    
            if (dice === 2) {
                playMessage.reply (`Goblin played scissors! You lose ${cost} MAYO!`);
                userWallet.points -= cost;
                jianDaoWallet.points += cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
            else if (dice === 1) {
                playMessage.reply (`Goblin played paper! It's a draw!`);
            }
            else {
                playMessage.reply (`Goblin played rock! You win ${cost} MAYO!`);
                userWallet.points += cost;
                jianDaoWallet.points -= cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
        }

        if (interaction.customId === 'scissor') {
            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 1000;
            const userWallet = await Point.findOne({ userId: interaction.member.id });
            if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient mayo, you need ${cost} mayo to play this`, ephemeral: true });

            const jianDaoWallet = await Point.findOne ({userId: '1171936614965067866'});
            if (jianDaoWallet.points < cost) return thread.send ({ content: `${interaction.member} Mayo is too broke to play this wager`, ephemeral: true });

            const playMessage = await thread.send (`${interaction.member} played **scissors**!`);

            const dice = Math.floor(Math.random() * 3);
    
            if (dice === 2) {
                playMessage.reply (`Goblin played rock! You lose ${cost} MAYO!`);
                userWallet.points -= cost;
                jianDaoWallet.points += cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
            else if (dice === 1) {
                playMessage.reply (`Goblin played scissors! It's a draw!`);
            }
            else {
                playMessage.reply (`Goblin played paper! You win ${cost} MAYO!`);
                userWallet.points += cost;
                jianDaoWallet.points -= cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
        }

        // if (interaction.customId === 'turtle1') {

        //     await interaction.deferUpdate();
        //     const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

        //     const cost = 10;
        //     const userWallet = await UserData.findOne({ userID: interaction.member.id });
        //     if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient MAYO, you need ${cost} MAYO to place this bet`, ephemeral: true });

        //     let findBet = await Bets.findOne({postID: interaction.message.id, userID: interaction.member.id, betNumber: 1 });
        //     if (!findBet) {
        //         findBet = new Bets ({
        //             postID: interaction.message.id,
        //             userID: interaction.member.id,
        //             betNumber: 1,
        //             betAmount: 0,
        //         })
        //     }

        //     findBet.betAmount += cost;

        //     userWallet.points -= cost;
        //     const jianDaoWallet = await UserData.findOne({ userID: '865147754358767627' });
        //     jianDaoWallet.points += cost;
        //     await jianDaoWallet.save();
        //     await userWallet.save();

        //     await findBet.save();
        //     thread.send ({ content: `${interaction.member} placed a bet on **${turtleName1}** for ${findBet.betAmount} MAYO!`});
        // }

        // if (interaction.customId === 'turtle2') {

        //     await interaction.deferUpdate();
        //     const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

        //     const cost = 10;
        //     const userWallet = await UserData.findOne({ userID: interaction.member.id });
        //     if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient MAYO, you need ${cost} MAYO to place this bet`, ephemeral: true });

        //     let findBet = await Bets.findOne({postID: interaction.message.id, userID: interaction.member.id, betNumber: 2 });
        //     if (!findBet) {
        //         findBet = new Bets ({
        //             postID: interaction.message.id,
        //             userID: interaction.member.id,
        //             betNumber: 2,
        //             betAmount: 0,
        //         })
        //     }

        //     findBet.betAmount += cost;

        //     userWallet.points -= cost;
        //     const jianDaoWallet = await UserData.findOne({ userID: '865147754358767627' });
        //     jianDaoWallet.points += cost;
        //     await jianDaoWallet.save();
        //     await userWallet.save();

        //     await findBet.save();
        //     thread.send ({ content: `${interaction.member} placed a bet on **${turtleName2}** for ${findBet.betAmount} MAYO!`});
        // }

        // if (interaction.customId === 'turtle3') {

        //     await interaction.deferUpdate();
        //     const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

        //     const cost = 10;
        //     const userWallet = await UserData.findOne({ userID: interaction.member.id });
        //     if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient MAYO, you need ${cost} MAYO to place this bet`, ephemeral: true });

        //     let findBet = await Bets.findOne({postID: interaction.message.id, userID: interaction.member.id, betNumber: 3 });
        //     if (!findBet) {
        //         findBet = new Bets ({
        //             postID: interaction.message.id,
        //             userID: interaction.member.id,
        //             betNumber: 3,
        //             betAmount: 0,
        //         })
        //     }

        //     findBet.betAmount += cost;

        //     userWallet.points -= cost;
        //     const jianDaoWallet = await UserData.findOne({ userID: '865147754358767627' });
        //     jianDaoWallet.points += cost;
        //     await jianDaoWallet.save();
        //     await userWallet.save();

        //     await findBet.save();
        //     thread.send ({ content: `${interaction.member} placed a bet on **${turtleName3}** for ${findBet.betAmount} MAYO!`});
        // }

        // if (interaction.customId === 'turtle4') {

        //     await interaction.deferUpdate();
        //     const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

        //     const cost = 10;
        //     const userWallet = await UserData.findOne({ userID: interaction.member.id });
        //     if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient MAYO, you need ${cost} MAYO to place this bet`, ephemeral: true });

        //     let findBet = await Bets.findOne({postID: interaction.message.id, userID: interaction.member.id, betNumber: 4 });
        //     if (!findBet) {
        //         findBet = new Bets ({
        //             postID: interaction.message.id,
        //             userID: interaction.member.id,
        //             betNumber: 4,
        //             betAmount: 0,
        //         })
        //     }

        //     findBet.betAmount += cost;

        //     userWallet.points -= cost;
        //     const jianDaoWallet = await UserData.findOne({ userID: '865147754358767627' });
        //     jianDaoWallet.points += cost;
        //     await jianDaoWallet.save();
        //     await userWallet.save();

        //     await findBet.save();
        //     thread.send ({ content: `${interaction.member} placed a bet on **${turtleName4}** for ${findBet.betAmount} MAYO!`});
        // }

        // if (interaction.customId === 'turtle5') {

        //     await interaction.deferUpdate();
        //     const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

        //     const cost = 10;
        //     const userWallet = await UserData.findOne({ userID: interaction.member.id });
        //     if (userWallet.points < cost) return thread.send ({ content: `${interaction.member} Insufficient MAYO, you need ${cost} MAYO to place this bet`, ephemeral: true });

        //     let findBet = await Bets.findOne({postID: interaction.message.id, userID: interaction.member.id, betNumber: 5 });
        //     if (!findBet) {
        //         findBet = new Bets ({
        //             postID: interaction.message.id,
        //             userID: interaction.member.id,
        //             betNumber: 5,
        //             betAmount: 0,
        //         })
        //     }

        //     findBet.betAmount += cost;

        //     userWallet.points -= cost;
        //     const jianDaoWallet = await UserData.findOne({ userID: '865147754358767627' });
        //     jianDaoWallet.points += cost;
        //     await jianDaoWallet.save();
        //     await userWallet.save();

        //     await findBet.save();
        //     thread.send ({ content: `${interaction.member} placed a bet on **${turtleName5}** for ${findBet.betAmount} MAYO!`});
        // }

    })


};
