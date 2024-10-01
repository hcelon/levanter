//test 3
const { addExif, bot, cropsticker } = require('../lib/');

const sharp = require('sharp');

const fs = require('fs');

const path = require('path');

const os = require('os');

bot(

  {

    pattern: 'cc',

    fromMe: true,

    desc: 'create sticker as 1:1 with rounded corners',

    type: 'sticker',

  },

  async (message) => {

    if (!message.reply_message || (!message.reply_message.video && !message.reply_message.image))

      return await message.send('*Reply to image/video*');

    const isVideo = !!message.reply_message.video;

    const aspectRatio = 1;

    const mediaPath = await message.reply_message.downloadAndSaveMediaMessage('sticker');

    const roundedCorners = Buffer.from(

      `<svg><rect x="0" y="0" width="512" height="512" rx="50%" ry="50%"/></svg>`

    );

    const processedImageBuffer = await sharp(mediaPath)

      .resize(512, 512)

      .composite([{ input: roundedCorners, blend: 'dest-in' }])

      .png()

      .toBuffer();

    const tempFilePath = path.join(os.tmpdir(), `processed_${Date.now()}.png`);

    fs.writeFileSync(tempFilePath, processedImageBuffer);

    try {

      const result = await cropsticker('str', tempFilePath, aspectRatio);

      await message.send(result, { isAnimated: isVideo, quoted: message.quoted }, 'sticker');

    } catch (error) {

      console.error('Error processing sticker:', error);

      await message.send('*Error creating sticker*');

    } finally {

      // Check if the file exists before attempting to delete it

      if (fs.existsSync(tempFilePath)) {

        fs.unlinkSync(tempFilePath);

      }

    }

  }

);