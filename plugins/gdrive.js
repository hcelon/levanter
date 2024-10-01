const { bot, isUrl } = require('../lib/index');

// Use dynamic import for node-fetch
import('node-fetch')
  .then((module) => {
    const nodeFetch = module.default;

    bot(
      {
        pattern: 'gdrive ?(.*)', // Updated plugin name to gdrive
        fromMe: true,
        desc: 'google drive downloader',
        type: 'downloader',
      },
      async (message, match) => {
        match = isUrl(match || message.reply_message.text);
        if (!match) return await message.send('_Example : gdrive <url>_');

        try {
          const urls = await getFolderUrls(match, nodeFetch);
          if (!urls || urls.length === 0) throw 'No valid URLs found in the folder';

          for (const url of urls) {
            let res = await fdrivedl(url, nodeFetch);
            if (res) {
              await message.send(`≡ *Google Drive DL by ᳀֎ᴛᴀʏʏᴀʙ༈֎⸔*
    ▢ *Name:* ${res.fileName}
    ▢ *Size:* ${formatBytes(res.sizeBytes)}
    ▢ *Type:* ${res.mimetype}
    
_*Follow Me On Instagram:*_ instagram.com/tayyabali7616`);
              await message.sendFromUrl(res.downloadUrl);
            } else {
              await message.send('*Not found*', {
                quoted: message.quoted,
              });
            }
          }
        } catch (error) {
          await message.send(`Error: ${error}`);
        }
      }
    );

    async function getFolderUrls(folderUrl, fetch) {
      const res = await fetch(folderUrl);
      const text = await res.text();
      const matches = text.match(/https:\/\/drive.google.com\/file\/d\/([^\s]+)/g);
      return matches;
    }

    async function fdrivedl(url, fetch) {
      let id;
      if (!(url && url.match(/drive\.google/i))) throw 'Invalid URL';
      id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1];
      if (!id) throw 'ID Not Found';
      let res = await fetch(
        `https://drive.google.com/uc?id=${id}&authuser=0&export=download`,
        {
          method: 'post',
          headers: {
            'accept-encoding': 'gzip, deflate, br',
            'content-length': 0,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            origin: 'https://drive.google.com',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
            'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
            'x-drive-first-party': 'DriveWebUi',
            'x-json-requested': 'true',
          },
        }
      );
      let { fileName, sizeBytes, downloadUrl } = JSON.parse(
        (await res.text()).slice(4)
      );
      if (!downloadUrl) throw 'Límite de descarga del link';
      let data = await fetch(downloadUrl);
      if (data.status !== 200) throw data.statusText;
      return {
        downloadUrl,
        fileName,
        sizeBytes,
        mimetype: data.headers.get('content-type'),
      };
    }

    function formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
  })
  .catch((error) => {
    console.error('Error during dynamic import:', error);
  });