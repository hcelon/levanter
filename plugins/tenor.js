const { bot, getJson, getBuffer, sticker } = require('../lib')

bot(
  {
    pattern: 'tenor ?(.*)',
    desc: 'sticker from tenor',
    type: 'sticker',
  },
  async (message, match) => {
    if (!match)
      return await message.send('> *Example :*\n- tenor cat dancing\n- tenor cat dancing, 3')
    const [q, limit] = match.split(',')
    const res = await getJson(
      `https://g.tenor.com/v1/search?q=${q}&key=LIVDSRZULELA&limit=${
        limit && !isNaN(limit) ? limit : 1
      }`
    )
    const resultLength = res.results.length
    if (resultLength > 1) await message.send(`_Sending ${resultLength} stickers from tenor..._`)
    for (const r of res.results) {
      try {
        const mp4 = r.media[0].mp4.url
        const mp4Buffer = await getBuffer(mp4, true)
        const mp4Sticker = await sticker(mp4Buffer.name, mp4Buffer.name, 2)
        await message.send(mp4Sticker, { quoted: message.data, isAnimated:true }, 'sticker')
      } catch (error) {}
    }
  }
)
