const { bot, setVar } = require('../lib/index')

bot(
	{
		pattern: 'setcookie ?(.*)',
		fromMe: true,
		desc: 'set bing cookie',
		type: 'misc',
	},
	async (message, match) => {
		const key = 'BING_COOKIE'
		if (!match)
			return await message.send(`*Example : setcookie copied_cookie* \n Tutorial videos:-\nhttps://telegra.ph/file/f5b4cd7d8385b483106ab.mp4\nhttps://i.imgur.com/up7jeco.mp4`)
		await setVar({ [key]: match })
		await message.send(`_new var ${key} added as ${match}_`)
	}
)