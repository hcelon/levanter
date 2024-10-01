const { levanterTimeout, getQuote } = require('../lib/')
/*
{
    pattern: 'auto_about ?(.*)',
    fromMe: true,
    desc: 'auto about',
    type: 'bot',
},*/

const time = 60 * 1000 * 30 // 30 minute gap
const about = async () => {
	const quote = await getQuote()
	//write any thing that u want here and return string
  return quote || 'this is an example of auto bio - levanter'
}

levanterTimeout(about, time)