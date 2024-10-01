const { bot, parsedJid, getRandom, setVar } = require('../lib/')

bot(
  {
    pattern: 'areact ?(.*)',
    fromMe: true,
    desc: 'auto react to messages',
    type: 'misc',
  },
  async (message, match) => {
    if (!match)
      return await message.send(
        '> Example :\n- areact on | off\n- areact not_react 2364723@g.us\n- areact react_only 72534823@g.us\n- areact only_pm\n- areact only_group'
      )
    await setVar({ AREACT: match })
    await message.send('AREACT updated, bot restarts')
  }
)
const emojis =
  '😁,😆,😅,😂,🥹,🤣,🥲,☺️,😇,🙂,🙃,😘,😉,😙,🥸,🤓,😜,🙁,😞,☹️,😣,🥳,😫,😖,😒,😢,🤯,😤,🥵,😤,🥶,🫢,😰,🤔,🫤,😑,🫨,🙄,🤫,🤥,😶,🫥,😶‍🌫,🥶'.split(
    ','
  )

bot({ on: 'text', fromMe: false, type: 'ar' }, async (message, match) => {
  const on_off = process.env.AREACT ? process.env.AREACT.includes('off') : true
  if (on_off) return
  const not_react_jids = process.env.AREACT && process.env.AREACT.includes('not_react')
  const not_gids = (not_react_jids && parsedJid(not_react_jids)) || []
  if (not_gids.length) {
    if (not_gids.includes(message.jid)) return
  }
  const react_jids = process.env.AREACT && process.env.AREACT.includes('react_only')
  const gids = (react_jids && parsedJid(react_jids)) || []
  if (gids.length) {
    if (!gids.includes(message.jid)) return
  }
  const onlyPm = process.env.AREACT && process.env.AREACT.includes('only_pm')
  const onlyGroup = process.env.AREACT && process.env.AREACT.includes('only_group')
  const isReact =
    !message.fromMe &&
    (onlyPm ? !message.isGroup : !onlyPm) &&
    (onlyGroup ? message.isGroup : !onlyGroup)

  if (!isReact) return

  const react = {
    text: getRandom(emojis),
    key: message.message.key,
  }
  return await message.send(react, {}, 'react')
})
