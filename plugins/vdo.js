const { bot, forwardOrBroadCast } = require('../lib')

 bot({
        pattern: 'vdo ?(.*)',
        fromMe: true,
        desc: 'whatsapp',
        use: 'owner',
    },
    async (m, match) => {

        if (!m.reply_message.video) return m.send('_Reply to a video_')
        const pvt = {
            ptvMessage: m.reply_message.message.message['videoMessage']
        }
        m.reply_message.message.message = pvt
        await forwardOrBroadCast(match || m.jid, m, {
            contextInfo: {
                isForwarded: false
            },
        })
    }
)