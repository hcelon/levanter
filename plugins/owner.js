const { bot, getBuffer, genThumbnail, jidToNum } = require('../lib/')

const url = 'https://i.pinimg.com/236x/16/22/2a/16222a14b08235dd1d795e4152a8f8d5.jpg'
bot(
	{
		pattern: 'owner ?(.*)',
		fromMe: true,
		desc: 'contact',
		type: 'whatsapp',
	},
	async (message, match) => {
		const thumbnail = await genThumbnail(
			await (
				await getBuffer(url)
			).buffer
		)
		const owner = jidToNum(message.participant)
		const name = message.pushName
		const vcard =
			'BEGIN:VCARD\n' +
			'VERSION:3.0\n' +
			`FN:${name}\n` +
			`ORG:${name};\n` +
			`TEL;type=CELL;type=VOICE;waid=${owner}:+${owner}\n` +
			'END:VCARD'
		await message.send(
			{
				displayName: `${name}`,
				contacts: [{ vcard }],
			},
			{
				linkPreview: {
					head: `${name}`,
					body: '',
					mediaType: 2,
					thumbnail: thumbnail,
					showAdAttribution: true,
					sourceUrl: `https://wa.me/${owner}`,
				},
				quoted: {
					key: {
						fromMe: false,
						participant: '0@s.whatsapp.net',
						remoteJid: 'status@broadcast',
					},
					message: {
						imageMessage: {
							jpegThumbnail: thumbnail,
							caption: 'Im the one and only Owner',
						},
					},
				},
			},
			'contacts'
		)
	}
)
