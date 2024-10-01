const { bot, setVar } = require('../lib')
bot(
  {
    pattern: 'setantibroadcastmsg ?(.*)',
    fromMe: true,
    desc: 'set anti broadcast msg',
    type: 'whatsapp',
  },
  async (message, match) => {
    if (!match) await message.send('*Example :* setantibroadcastmsg dont send broadcast please!')
    await setVar({ ANTI_BROADCAST_MSG: match })
    await message.send(`_new var ANTI_BROADCAST_MSG added as ${match}_`)
  }
)
bot({ on: 'text', fromMe: false, type: 'antibroadcast' }, async (message, match) => {
  if (message.jid.endsWith('@broadcast')) {
    await message.send(
      process.env.ANTI_BROADCAST_MSG || 'remove me from broadcast',
      {
        quoted: message.data,
      },
      'text',
      message.message.key.participant
    )
  }
})
