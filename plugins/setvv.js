const { bot, setVar, getVars, forwardOrBroadCast, parsedJid } = require('../lib/')

bot(
  {
    pattern: 'setvv ?(.*)',
    fromMe: true,
    desc: 'set anti view once',
    type: 'whatsapp',
  },
  async (message, match) => {
    if (!match)
      return await message.send(
        `Example : \nsetvv g - send vv on chat\nsetvv p - send on bot chat\nsetvv jid - send vv on jid chat\nsetvv null - off auto vv`
      )
    match = match.toLocaleLowerCase()
    await setVar({ VV: match })
    await message.send(`VV updated as ${match}\nDon't worry, bot restart.`)
  }
)

bot(
  {
    pattern: 'getvv ?(.*)',
    fromMe: true,
    desc: 'view anti view once',
    type: 'whatsapp',
  },
  async (message, match) => {
    const vars = await getVars()
    const vv = vars['VV']
    if (!vv) return await message.send('Not set anti view once')
    await message.send(`VV = ${vv}`)
  }
)

bot(
  {
    on: 'text',
    fromMe: false,
    type: 'vv',
  },
  async (message, match) => {
    let vvConfig = process.env.VV
    if(!vvConfig) return
    const vvJid =
      vvConfig === 'p'
        ? message.client.user.jid
        : vvConfig === 'g'
        ? message.jid
        : parsedJid(vvConfig)[0] || message.client.user.jid

    if (message.message?.message[message.type]?.viewOnce && vvConfig !== 'null') {
      message.reply_message = null
      await forwardOrBroadCast(vvJid, message, { viewOnce: false, quoted: message.data })
    }
  }
)
