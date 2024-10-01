const { bot, getRandom, jidToNum } = require('../lib/')

bot(
  {
    pattern: 'slap ?(.*)',
    fromMe: true,
    desc: 'random slap',
    type: 'fun',
  },
  async (message, match) => {
    let a = message.reply_message.jid || message.mention[0]
    const b = message.participant
    if (!a) {
      const p = await message.groupMetadata(message.jid)
      a = getRandom(p).id
    }

    const caption = `@${jidToNum(b)} slapped @${jidToNum(a)}`
    return await message.sendFromUrl('https://telegra.ph/file/a8bb7fe158227a6f7d8ef.mp4', {
      caption,
      contextInfo: { mentionedJid: [b, a] },
      gifPlayback: true,
    })
  }
)
