const Discord = require('discord.js');

const config = require('./config');
const { getByWorldName, getData } = require('./util/status');
const { worldEmbed, serverEmbed } = require('./util/embeds');

const client = new Discord.Client();

client.on('ready', () => {
    console.log('FFXIV-Status-Bot: Ready');
});

client.on('message', async (message) => {

    // Ignore bots and check for command prefix
    if (message.author.bot || !message.content.startsWith(config.prefix)) return;

    // Delete invoked message if enabled in config
    if (config.deleteInvoke) await message.delete();

    // const prefix = message.content.slice(0, config.prefix.length);
    const msg = message.content.slice(config.prefix.length).split(' ');

    const command = msg[0];
    const args = msg.slice(1);

    // Status commamd
    if (command === 'status') {
        const m = await message.channel.send({
            embed: {
                title: 'Please wait...',
                description: 'Fetching FFXIV status',
            }
        });
        const query = args.length ? args[0] : config.defaultWorld;
        const data = await getData(query);
        await m.delete();

        if (data.type === 'world') {
            return message.channel.send({ 
                embed: worldEmbed(data.data), 
            });
        }

        if (data.type === 'server') {
            return message.channel.send({ 
                embed: serverEmbed(data.data), 
            });
        }

        // if (data.type === 'region') {
        //     return message.channel.send('Region');
        // }

        return message.channel.send({
            embed: {
                title: 'Uh-oh',
                description: 'I was unable to fetch FFXIV status. Make sure your query is valid',
            }
        });
    }
});

client.login(config.token);