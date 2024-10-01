const { bot, jidToNum } = require('../lib/')

bot(
  {
    pattern: 'glist ?(.*)',
    fromMe: true,
    desc: 'list group join requests',
    type: 'whatsapp',
    onlyGroup: true,
  },
  async (message, match) => {
    const result = await message.groupRequestList()
    if(!result.length) return await message.send('no pending requests')
    await message.send(result.map((id) => `+${jidToNum(id.jid)}`).join('\n'))
  }
)

bot(
  {
    pattern: 'gapprove ?(.*)',
    fromMe: true,
    desc: 'accept all group join request',
    onlyGroup: true,
  },
  async (message, match) => {
    const result = await message.groupRequestList()
    await message.groupRequestAction(
      result.map((id) => id.jid),
      'approve'
    )
    await message.send('approved')
  }
)

bot(
  {
    pattern: 'greject ?(.*)',
    fromMe: true,
    desc: 'reject all group request',
    onlyGroup: true,
  },
  async (message, match) => {
    const result = await message.groupRequestList()
    await message.groupRequestAction(
      result.map((id) => id.jid),
      'reject'
    )
    await message.send('rejected')
  }
)
