const { Events } = require('discord.js');
const ReactionLimit = require('../models/reactionRewardTracker');
const Point = require('../models/points');

module.exports = async (client) => {

        client.on(Events.MessageReactionAdd, async (reaction, user) => {

        console.log ('emoji add detected');
      
        reaction.message.guild.members.fetch();

        if (reaction.message.channel.id != '1224559807889936414') return;
      
        if (reaction.partial) {
              // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
              try {
                  await reaction.fetch();
              } catch (error) {
                  console.error('Something went wrong when fetching the message:', error);
                  // Return as `reaction.message.author` may be undefined/null
                  return;
              }
          }
      
        const messageAuthor = reaction.message.author;
        const messageAuthorMember = await reaction.message.guild.members.cache.get(messageAuthor.id); // the GuildMember object for the member who created the message
      
        if (messageAuthor.id === user.id) return;
        
        const result = await ReactionLimit.findOne({
          messageId: reaction.message.id,
          reactorId: user.id,
        })

        console.log (user);

        const member = reaction.message.guild.members.cache.get(user.id);
        const thread = reaction.message.channel.threads.cache.find(x => x.id === reaction.message.id);
        thread.send (`${member.displayName} planted a ${reaction.emoji} in this flower bed!`);

        if (result) return console.log ('already reacted to this post before, reward cancelled.');

        thread.send (`${messageAuthorMember.displayName} & ${member.displayName} gained 10 Mayo!`);

        const newReactionTracker = new ReactionLimit ({
          messageId: reaction.message.id,
          reactorId: user.id,
        })

        await newReactionTracker.save();
      
        let userData = await Point.findOne({ userId: messageAuthor.id });
        if (!userData) {
          userData = new Point({
            userId: messageAuthor.id,
          })
        }
        userData.points += 10;
        await userData.save();

        userData = await Point.findOne({ userId: member.id });
        if (!userData) {
          userData = new Point({
            userId: member.id,
          })
        }
        userData.points += 10;
        await userData.save();

        console.log ('Not reacted to this post before, reward gained');
      
      })
      
      // client.on(Events.MessageReactionRemove, async (reaction, user) => {
      
      //   console.log ('emoji remove detected');
      
      //   reaction.message.guild.members.fetch();
      
      //   if (reaction.partial) {
      //         // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
      //         try {
      //             await reaction.fetch();
      //         } catch (error) {
      //             console.error('Something went wrong when fetching the message:', error);
      //             // Return as `reaction.message.author` may be undefined/null
      //             return;
      //         }
      //     }
      
      //   const messageAuthor = reaction.message.author;
      
      //   if (messageAuthor.id === user.id) return;
      
      //   let userData = await UserData.findOne({ userID: messageAuthor.id });
      //   if (!userData) {
      //     userData = new UserData({
      //       userID: messageAuthor.id,
      //     })
      //   }
      //   userData.money -= 1;
      //   await userData.save();
      
      // })

};
