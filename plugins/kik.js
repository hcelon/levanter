const { isAdmin, bot, jidToNum } = require('../lib/')

bot(
	{
		pattern: 'kik ?(.*)',
		fromMe: true,
		desc: 'Remove members from Group.',
		type: 'group',
		onlyGroup: true,
	},
	async (message, match) => {
		if (!match) return await message.send('kik 994\nkik 994 kick')
		const participants = await message.groupMetadata(message.jid)
		const isImAdmin = await isAdmin(participants, message.client.user.jid)
		if (!isImAdmin) return await message.send(`_I'm not admin._`)
		const kik = match.includes('kick')
		if (kik) match = match.replace('kick', '').trim()
		const users = participants
			.filter((user) => user.id.startsWith(match))
			.map(({ id }) => id)
		if (kik) return await message.Kick(users)
		let msg = ''
		for (const user of users) msg += `○ ${jidToNum(user)}\n`
		return await message.send(msg)
	}
)
