const region = {
    jp: {
        longName: 'Japan',
        emoji: '🇯🇵'
    },
    na: {
        longName: 'North America',
        emoji: '🇺🇸'
    },
    eu: {
        longName: 'Europe',
        emoji: '🇪🇺'
    },
};

const status = {
    'Online': {
        color: 8047698,
        emoji: '<:green:678340717327941652>',
    },
    'Partial Maintenance': {
        color: 13414963,
        emoji: '<:yellow:678340744791982110>',
    },
    'Maintenance': {
        color: 14566211,
        emoji: '<:red:678340757601648696>',
    },
};

module.exports = {
    worldEmbed: (world) => {
        const embed = {
            title: world.name,
            description: `${world.server} | ${region[world.region].emoji}`,
            color: status[world.status].color,
            fields: [
                {
                    name: 'Status',
                    value: `${status[world.status].emoji} ${world.status}`,
                },
                {
                    name: 'New Character Creation',
                    value: world.createCharacter ? '<:chgreen:678340775398080540> Available'  : '<:chred:678340885116878872> Unavailable',
                },
                {
                    name: 'Category',
                    value: world.category,
                },
            ],
            footer: {
                text: `Region: ${region[world.region].longName}`,
            },
            timestamp: Date.now(),
        };

        return embed;
    },

    serverEmbed: (server) => {
        const fields = [];
        for (const world of server.worlds) {
            fields.push(`${status[world.status].emoji}${world.createCharacter ? '<:chgreen:678340775398080540>' : '<:chred:678340885116878872>'} **${world.name}** - ${world.category}`);
        }
        const embed = {
            title: server.name,
            description: `${region[server.region].emoji} ${region[server.region].longName} \n\n ${fields.join('\n')}`,
            timestamp: Date.now(),
        };

        return embed;
    },

    // regionEmbed: (region) => {
    //     const fields = [];
    //     for (const world of region.server) {
    //         fields.push(`${status[world.status].emoji}${world.createCharacter ? '<:chgreen:678340775398080540>' : '<:chred:678340885116878872>'} **${world.name}** - ${world.category}`);
    //     }
    //     const embed = {
    //         title: `${region[region.region].emoji} ${region[region.region].longName}`,
    //         description: `${region[region.region].emoji} ${region[region.region].longName} \n\n ${fields.join('\n')}`,
    //         timestamp: Date.now(),
    //     };

    //     return embed;
    // },
};