const fs = require('fs')
const path = require('path')
const { bot, parsedJid, sleep, forwardOrBroadCast } = require('../lib/')

const BROADCAST_FOLDER = path.join(__dirname, 'NabeelXD-Broadcast')

if (!fs.existsSync(BROADCAST_FOLDER)) {
  fs.mkdirSync(BROADCAST_FOLDER)
}

const getFilePath = (name) => path.join(BROADCAST_FOLDER, `${name}.txt`)

bot(
  {
    pattern: 'newbocst ?(.*)',
    desc: 'Create a new broadcast',
    type: 'broadcast',
  },
  async (message, match) => {
    const [name, jids] = match.split("' '").map((s) => s.replace(/['"]/g, ''))
    if (!name || !jids)
      return await message.send("*Example: .newbocst 'My Broadcast' 'jid1,jid2,...'*")

    const filePath = getFilePath(name)
    if (fs.existsSync(filePath)) {
      return await message.send(`*${name}* broadcast already exists.`)
    }

    fs.writeFileSync(filePath, jids)
    await message.send(`Successfully created broadcast *${name}*.`)
  }
)

bot(
  {
    pattern: 'editbocst ?(.*)',
    desc: 'Edit an existing broadcast',
    type: 'broadcast',
  },
  async (message, match) => {
    const [name, newJids] = match.split("' '").map((s) => s.replace(/['"]/g, ''))
    if (!name) return await message.send("*Example: .editbocst 'My Broadcast' 'jid1,jid2,...'*")

    const filePath = getFilePath(name)
    if (!fs.existsSync(filePath)) {
      return await message.send(`Broadcast *${name}* does not exist.`)
    }

    if (!newJids) {
      const jids = fs.readFileSync(filePath, 'utf-8')
      return await message.send(`In *${name}*:\n${jids}`)
    }

    fs.writeFileSync(filePath, newJids)
    await message.send(`Successfully edited broadcast *${name}*.`)
  }
)

bot(
  {
    pattern: 'dtbocst ?(.*)',
    desc: 'Delete an existing broadcast',
    type: 'broadcast',
  },
  async (message, match) => {
    const name = match.replace(/['"]/g, '')
    if (!name) return await message.send("*Example: .dtbocst 'My Broadcast'*")

    const filePath = getFilePath(name)
    if (!fs.existsSync(filePath)) {
      return await message.send(`Broadcast *${name}* does not exist.`)
    }

    fs.unlinkSync(filePath)
    await message.send(`Successfully deleted broadcast *${name}*.`)
  }
)

bot(
  {
    pattern: 'allbocst',
    desc: 'List all broadcasts',
    type: 'broadcast',
  },
  async (message) => {
    const files = fs.readdirSync(BROADCAST_FOLDER).filter((f) => f.endsWith('.txt'))
    if (!files.length) return await message.send('*No broadcasts found.*')

    const broadcastNames = files.map((f) => f.replace('.txt', '')).join('\n')
    await message.send(`*Broadcasts:*\n${broadcastNames}`)
  }
)

bot(
  {
    pattern: 'hbocst',
    desc: 'Show broadcast examples and explanations',
    type: 'broadcast',
  },
  async (message) => {
    const helpMessage = `
*Broadcast Command Examples:*
1. Create a new broadcast: *.newbocst 'My Broadcast' 'jid1,jid2,...'*
2. Edit an existing broadcast: *.editbocst 'My Broadcast' 'jid1,jid2,...'*
3. Delete a broadcast: *.dtbocst 'My Broadcast'*
4. List all broadcasts: *.allbocst*
5. Send a broadcast: *.sndbocst 'My Broadcast''*

*Explanation:*
- Use *.newbocst* to create a new broadcast file with the specified name and JIDs.
- Use *.editbocst* to modify the JIDs in an existing broadcast file.
- Use *.dtbocst* to remove a broadcast file.
- Use *.allbocst* to view all existing broadcast files.
- Use *.sndbocst* to send a message or media to all JIDs listed in a broadcast file.
`
    await message.send(helpMessage)
  }
)

bot({
  pattern: 'sndbocst ?(.*)',
  desc: 'Send a broadcast message',
  type: 'broadcast',
}, async (message, match) => {
  const name = match.trim().replace(/['"]/g, '');
  if (!name) return await message.send('*Example: .sndbocst MyBroadcast*');

  const filePath = getFilePath(name);
  if (!fs.existsSync(filePath)) {
    return await message.send(`Broadcast *${name}* does not exist.`);
  }

  if (!message.reply_message) return await message.send('*Reply to a message to forward it.*');

  const jids = parsedJid(fs.readFileSync(filePath, 'utf-8'));
  if (!jids.length) return await message.send('*No valid JIDs found in the broadcast list.*');

  await message.send('Broadcast is starting...');

  let sentCount = 0;

  for (const jid of jids) {
    try {
      await sleep(3000);
      await forwardOrBroadCast(jid, message);
      sentCount++;
    } catch (e) {
      await message.send(`Failed to send to ${jid}`);
    }
  }

  await message.send(`Successfully Broadcasted to ${sentCount} JIDs.`);
});