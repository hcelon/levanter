const { bot, sleep } = require('../lib');

bot(
    {
        pattern: 'define ?(.*)',
        fromMe: true,
        desc: 'get meaning of a word',
        type: 'misc',
    },
    async (message, match) => {
        if (!match)
            return await message.send('_Example : define nobita_');
        
        const response = await fetch(`https://api.urbandictionary.com/v0/define?term=${match}`);
        const json = await response.json();
        if (!json.list.length)
            return await message.send('_No results_');  
    
        const data = json.list[0];
        const formattedMessage = `*Word:* \`\`\`${match}\`\`\` \n*Definition:* \`\`\`${data.definition.replace(/\[/g, '').replace(/\]/g, '')}\`\`\` \n*Example:* \`\`\`${data.example.replace(/\[/g, '').replace(/\]/g, '')}\`\`\``;
        
        return await message.send(formattedMessage);
    }
);