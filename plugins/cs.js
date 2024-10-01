const { addExif, bot, cropsticker } = require('../lib/');

bot(
  {
    pattern: 'cs',
    fromMe: true,
    desc: 'create sticker as 1:1',
    type: 'sticker',
  },
  async (message) => {
    if (!message.reply_message || (!message.reply_message.video && !message.reply_message.image))
      return await message.send('*Reply to image/video*');

    const isVideo = !!message.reply_message.video;
    const aspectRatio = message.reply_message.image ? 1 : 2;

    return await message.send(
      await cropsticker('str', await message.reply_message.downloadAndSaveMediaMessage('sticker'), aspectRatio),
      { isAnimated: isVideo, quoted: message.quoted },
      'sticker'
    );
  }
);