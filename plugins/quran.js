const {bot} = require('../lib');
const {PREFIX} = require('../lib/');
const fs = require('fs');

bot(
    {
        pattern: 'quran ?(.*)',
        fromMe: true,
        desc: 'Get quran',
        type: 'quran',
    },
    async (message, match) => {
        const umsg = match.split(' ');

        if (umsg[0].toLowerCase() === 'audio')
        {
            const surah = umsg[1];
        
            if (!surah)
            return await message.send('Please provide surah number \n Ex: .quran audio 1');
            
            if(surah > 114 || surah < 1)
            return await message.send('Please provide valid surah number');

            //https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/{number}.mp3
            await message.sendFromUrl(`https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surah}.mp3`, {mimetype: 'audio/mp3', filename: `${surah}.mp3`});
            
            //delete the file from storage after sending
            if(fs.existsSync(`${surah}.mp3`)){
                setTimeout(() => {
                    fs.unlinkSync(`${surah}.mp3`);
                }, 50000);
            }
            

        }
        else if(umsg[0].toLowerCase() === 'surah')
        {
            const surah = parseInt(umsg[1]);
            if(surah > 114 || surah < 1)
            return await message.send('Please provide valid surah number');

            const json = await fetch(`https://api.alquran.cloud/v1/surah/${surah}/editions/quran-uthmani,en.pickthall`);
            const data = await json.json();

            
            const surahNumber = data.data[0].number;
            const surahName = data.data[0].name;
            const surahEnglishName = data.data[0].englishName;
            const surahRevelationType = data.data[0].revelationType;
            const surahAyahs = data.data[0].numberOfAyahs;

            let arabic = '';
            let english = '';

            for (let i = 0; i < surahAyahs; i++) {
                arabic += `${data.data[0].ayahs[i].text}\n\n`;
                english += `${data.data[1].ayahs[i].text}\n\n`;
            }

            await message.send(`*${surahName}*\n*Surah*: ${surahNumber}\n*Revelation Type*: ${surahRevelationType}\n*Ayahs*: ${surahAyahs}\n\n*Arabic*\n${arabic}\n*English*\n${english}`);
        }
        else if(umsg[0].toLowerCase() === 'ayah')
        {
            const res = umsg[1].split(':');
            const surah = res[0];
            const ayah = res[1];
            if (!surah || !ayah)
            return await message.send('Please provide surah and ayah number \n Ex: .quran ayah 1:1');
            if(surah > 114 || surah < 1)
            return await message.send('Please provide valid surah number');

            const url = `http://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad`;
            const json = await fetch(url);
            const data = await json.json();

            const ayahText = data.data.text;
            const ayahNumber = data.data.numberInSurah;
            const ayahSurah = data.data.surah.englishName;
            const ayahEdition = data.data.edition.englishName;

            const msg = `*${ayahEdition}*\n*Surah*: ${ayahSurah}\n*Ayah*: ${ayahNumber}\n\n${ayahText}`;
            return await message.send(msg);
        }
        else if(umsg[0].toLowerCase() === 'how')
        {
            // all commands 
            const surah = `*To get surah from quran*\n\n ` + `${PREFIX}` + `quran surah {surah number}\n*Ex*: `+ `${PREFIX}` + `quran surah 1\n\n*Note*: Surah number should be between 1 to 114\n\n*Example*: `+`${PREFIX}`+`quran surah 1`;
            const ayah = `*To get ayah from quran*\n\n ` + `${PREFIX}` + `quran ayah {surah number}:{ayah number}\n*Ex*: `+ `${PREFIX}` + `quran ayah 1:1\n\n*Note*: Surah number should be between 1 to 114.\n\n*Example*: `+`${PREFIX}`+`quran ayah 1:1`;
            const audio = `*To get audio from quran*\n\n ` + `${PREFIX}` + `quran audio {surah number}\n*Ex*: `+ `${PREFIX}` + `quran audio 1\n\n*Note*: Surah number should be between 1 to 114\n\n*Example*: `+`${PREFIX}`+`quran audio 1`;
            const random = `*To get random ayah from quran*\n\n ` + `${PREFIX}` + `quran\n\n*Example*: `+`${PREFIX}`+`quran`;

            await message.send(surah + '\n\n' + ayah + '\n\n' + audio + '\n\n' + random);

        }
        else
        {
            let data;
            while (true) {
                const surah = Math.floor(Math.random() * 114) + 1;
                const ayah = Math.floor(Math.random() * 286) + 1;
                const url = `http://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad`;
                
                const json = await fetch(url);
                data = await json.json();
                if(data.code == 200)
                {
                    break;
                }
            } 
                const ayahText = data.data.text;
                const ayahNumber = data.data.numberInSurah;
                const ayahSurah = data.data.surah.englishName;
                const ayahEdition = data.data.edition.englishName;
    
                const msg = `*${ayahEdition}*\n*Surah*: ${ayahSurah}\n*Ayah*: ${ayahNumber}\n\n${ayahText}`;
                return await message.send(msg);
            }
    }
)
