const { bot, getJson } = require('../lib')

bot(
	{
		pattern: 'lyrics ?(.*)',
		fromMe: true,
		desc: 'search lyrics',
		type: 'search',
	},
	async (message, match) => {
		if (!match)
			return await message.send('*Example : lyrics bhla bhla*')
		const { status ,result } = await getJson(
			`https://levanter.onrender.com/lyrics?name=${match}`
		)
		if (!status) return await message.send('_Not found_')
		return await message.send('```' + result + '```')
	}
)