/*
bot(
	{
		pattern: 'pmblocko',
		fromMe: fm,
		desc: 'Block a person',
		type: 'user',
	},
	*/
const { bot, jidToNum } = require('../lib/')
const allowed = '919876543210' // add numbers with , not to block
bot(
	{
		on: 'text',
		fromMe: false,
		type: 'antipm',
	},
	async (message, match) => {
		if (
			!message.isGroup &&
			!message.fromMe &&
			!message.sudo &&
			!allowed.split(',').includes(jidToNum(message.participant))
		) {
			await message.send('_Personal Message Not Allowed_')
			await message.Block(message.participant)
		}
	}
)