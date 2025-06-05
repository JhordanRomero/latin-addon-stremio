
const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");
const cheerio = require("cheerio");

const builder = new addonBuilder({
    id: "org.pelispanda.torrents",
    version: "1.0.0",
    name: "Pelispanda Streaming",
    description: "Stream de películas desde Pelispanda con torrent",
    types: ["movie"],
    resources: ["stream"],
});

async function extractMagnetFromPage(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const magnet = $('a[href^="magnet:?xt="]').attr('href');
        return magnet || null;
    } catch (e) {
        console.error("Error al extraer magnet:", e);
        return null;
    }
}

builder.defineStreamHandler(async ({ id }) => {
    const magnet = await extractMagnetFromPage(id);
    if (magnet) {
        return { streams: [{ title: "Pelispanda Torrent", url: magnet }] };
    } else {
        return { streams: [] };
    }
});

module.exports = builder.getInterface();
