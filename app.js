const { Client, GatewayIntentBits, Partials } = require('discord.js');

// Replace with your bot token
const TOKEN = '';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    const TARGET_CHANNEL_ID = '1320403601721655306';
    let parameter_delete = true;
    // Ignore bot messages
    if (message.author.bot) return;

    // Check if the message is from the target channel
    if (message.channel.id === TARGET_CHANNEL_ID) {
        // Get all mentioned channels
        const mentionedChannels = message.mentions.channels;
        console.log(message.content);
        if (mentionedChannels.size > 0) {
            // Valid channel mentions
            mentionedChannels.forEach(channel => {
                console.log(`Valid mention: ${channel.name}`);
            });
        } else {
            if (startsWithChannelMention(message.content)) {
                console.log(`semi valid mention: ${message.content}`);
            }
            else {
                // Delete message if no valid channel mentions
                message.delete()
                    .then(() => {
                        message.channel.send(`${message.author}, please mention a valid channel!`).then(msg => {
                            setTimeout(() => msg.delete(), 5000); // Auto-delete warning
                        });
                    })
                    .catch(console.error);
                parameter_delete = false;
            }
        }

        if (parameter_delete) {
            setTimeout(() => {
                message.delete().catch((err) => console.error(`Failed to delete message: ${err}`));
            }, 10000);
        }
    } else {
        // Optionally, ignore messages in other channels
        console.log(`Message ignored from channel: ${message.channel.id}`);
    }
});

function startsWithChannelMention(str) {
    return str.startsWith('<#');
}

client.login(TOKEN);
