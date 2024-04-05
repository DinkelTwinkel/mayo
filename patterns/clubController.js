const { Events, ChannelType } = require('discord.js');
const messageDeletionTimer = 10;

module.exports = async (client) => {

    client.on(Events.MessageCreate, async (message) => {

        if (message.member.user.bot) return;
        // last channel is clubs.
        if (message.channel.id === '1225579640740122766') {

            if (attachmentTest(message) != null) {
                // successful image post.
                const thread = await message.startThread({
                    name: limitString(message.content, 99),
                    autoArchiveDuration: 1440,
                    // 24 hours
                    type:  ChannelType.PublicThread,
                    // flags: ThreadFlags.FLAGS.CREATED_FROM_MESSAGE,
                  });
                // create a thread.
            }
            
        }
        else {
            return;
        }

    });

};

function limitString(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    } else {
        return str.substring(0, maxLength);
    }
}

function attachmentTest(message) {
    const imageExtensions = /\.(png|jpeg|jpg|jpg|webp|gif)/i;

    if (message.attachments.size > 0) {
        const attachment = message.attachments.first(); // Get the first attachment (usually the most recent one)

        // Regular expression to match image file extensions anywhere in the string

        if (imageExtensions.test(attachment.url)) {
            console.log('Valid image attachment found.');
            return attachment.url;
        }
        else {
            console.log('No valid image extension found in the attachment URL.');
            deleteMessageAndReply (message);
            return null;
        }
    }
    else if (message.content.startsWith('https://cdn.discordapp.com/attachments/')) {

        if (imageExtensions.test(message.content)) {
            console.log('Valid image attachment found. Link CDN Edition');
            return message.content;

        }
        else {
            console.log('No valid image extension found in the attachment URL.');
            deleteMessageAndReply (message);
            return null;
        }
    }
    else {
        deleteMessageAndReply (message);
        return null;
    }
}

async function deleteMessageAndReply(message) {
    
    const utcEpochTimestamp = Math.floor(Date.now() / 1000) + messageDeletionTimer;

    const response = await message.reply ({ content: 'Club chat submission failed. Be sure it is uploaded or sent as a `https://cdn.discordapp.com/attachments/` Link\n' + `Self deleteing in <t:${utcEpochTimestamp}:R>`, ephemeral: true });
    setTimeout(() => {

        response.delete();
    }, messageDeletionTimer * 1000);

    if (!message.member.roles.cache.get('1202555128352346143')) {
        message.delete();
    }

}