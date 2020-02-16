const axios = require('axios');
const cheerio = require('cheerio');

const getStatus = async () => {

    const data = {};

    const regionNames = ['jp', 'na', 'eu'];

    const { data: html } = await axios.get('https://na.finalfantasyxiv.com/lodestone/worldstatus/');

    let $ = cheerio.load(html, {
        normalizeWhitespace: true,
        decodeEntities: false
    });

    const regions = $('div > .js--tab-content');


    /*
    * Hierachy: Region > Server > World
    */
    
    /*
    * Regions (JP, NA, EU)
    */
    regions.each(async (i, e) => {
        const servers = $('li[class="world-dcgroup__item"]', e);
        const serversData = {};

        const regionName = regionNames[i];

        /*
        * Each World Server per Data Center
        */
        servers.each((i, el) => {
            const serverName = $('h2[class="world-dcgroup__header"]', el).first().text();

            const worlds = $('div[class="world-list__item"]', el);
            const worldsData = [];

            /*
            * Each Home World per World Server
            */
            worlds.each((i, ele) => {
                worldsData.push({
                    name: $('div[class="world-list__world_name"]', ele).children('p').text(),
                    status: $('i[class="world-ic__1 js__tooltip"]', ele).attr('data-tooltip').trim(),
                    category: $('div[class="world-list__world_category"]', ele).children('p').text(),
                    createCharacter: $('i[class="world-ic__available js__tooltip"]', ele).attr('data-tooltip') === 'Creation of New Characters Available',
                    server: serverName,
                    region: regionName,
                });
            });

            serversData[serverName] = worldsData;

        });

        data[regionNames[i]] = serversData;
    });

    return data;

};

const typeCheck = async (name) => {
    const data = await getStatus();

    let names = {};

    for (const region in data) {
        names[region] = 'region';
        for (const server in data[region]) {
            names[server] = 'server';
            for (const world of data[region][server]) {
                names[world.name] = 'world';
            }
        }
    }

    const namesKeys = Object.keys(names);
    const search = namesKeys.find(nameKey => nameKey.toLowerCase() === name.toLowerCase())
    if (!search) return undefined;

    return names[search];
}

const getAllWorlds = async () => {
    const data = await getStatus();
    let worlds = [];

    for (const region in data) {
        for (const server in data[region]) {
            worlds = worlds.concat(data[region][server]);
        }
    }

    return worlds;
};

const getByWorldName = async (name) => {
    const worlds = await getAllWorlds();
    return worlds.find(world => world.name.toLowerCase() === name.toLowerCase());
};

const getByServerName = async (name) => {
    const worlds = await getAllWorlds();
    const serverWorlds = worlds.filter(world => world.server.toLowerCase() === name.toLowerCase());
    return {
        name: serverWorlds[0].server,
        region: serverWorlds[0].region,
        worlds: serverWorlds,
    };
};

const getData = async (query) => {
    const type = await typeCheck(query);
    if (!type) return undefined;

    if (type === 'world') {
        return {
            type,
            data: await getByWorldName(query),
        };
    }

    if (type === 'server') {
        return {
            type,
            data: await getByServerName(query),
        };
    }

    if (type === 'region') {
        const status = await getStatus();
        return {
            type,
            data: status[region],
        };
    }

}

module.exports = {
    // getStatus,
    // getServers,
    typeCheck,
    getByWorldName,
    getData,
};