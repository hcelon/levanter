const { getFilter, bot, setFilter, deleteFilter } = require('../lib/')
const example = `*Example :*\n'ikigai' 'Keep going; dont change your path'\nnote remove ikigai`
bot(
  {
    pattern: 'note ?(.*)',
    fromMe: true,
    desc: 'note',
    type: 'whatsapp',
  },
  async (message, match) => {
    if (match.startsWith('remove')) {
      match = match.replace('remove', '').trim()
      const isDel = await deleteFilter('note', match)
      if (!isDel) return await message.send(`${match} not found in notes`)
      return await message.send(`_${match} removed_`)
    }
    match = match.match(/[\'\"](.*?)[\'\"]/gms)
    if (!match) {
      const filters = await getFilter('note')
      if (!filters) return await message.send(example)
      let msg = `*Example :* 'ikigai' 'Keep going; dont change your path'\nnote remove ikigai\n\n> notes\n`
      filters.map(({ pattern }) => {
        msg += `- ${pattern}\n`
      })
      return await message.send(msg.trim())
    } else {
      if (match.length < 2) {
        return await message.send(example)
      }
      const k = match[0].replace(/['"]+/g, '')
      const v = match[1].replace(/['"]+/g, '')
      if (k && v) await setFilter('note', k, v, match[0][0] === "'" ? true : false)
      await message.send(`_${k} added_`)
    }
  }
)

bot({ on: 'text', fromMe: true, type: 'notefrome' }, async (message, match) => {
  const filters = await getFilter('note')
  if (filters) {
    filters.map(async ({ pattern, regex, text }) => {
      pattern = new RegExp(`(?:^|\\W)${pattern}(?:$|\\W)`, 'i')
      if (pattern.test(message.text)) {
        await message.send(text, {
          quoted: message.data,
        })
      }
    })
  }
})
bot({ on: 'text', fromMe: false, type: 'notenotfrome' }, async (message, match) => {
  if (!message.sudo) return
  const filters = await getFilter('note')
  if (filters) {
    filters.map(async ({ pattern, regex, text }) => {
      pattern = new RegExp(`(?:^|\\W)${pattern}(?:$|\\W)`, 'i')
      if (pattern.test(message.text)) {
        await message.send(text, {
          quoted: message.data,
        })
      }
    })
  }
})
