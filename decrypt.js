ill be sent from the users but I have a problem. How I can get the password that the user will be set for the encryption/decryption process? I've done some test and When a document is sent there is no ability for the user to add captions like with photos. Any suggestion?

#!/usr/bin/env node

const process = require('process');
const fs = require('fs');
const path = require('path');
const { Buffer } = require('buffer');
const crypto = require('crypto');
const dataURI = require('dauria');
const TelegramBot = require('node-telegram-bot-api');

let password;

const token = process.env.TELEGRAM_BOT_TOKEN || '5xxxxxxxx';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});  

bot.onText(/\/echo(.+)/, async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  //const chatId = msg.chat.id;

});

bot.on('message', async (msg) => {

  console.log(msg);
  if( msg.entities && msg.entities[0].type === 'bot_command' && msg.text === '/encrypt'){
    bot.sendMessage(msg.chat.id, 'Please send me the file you want to encrypt and in a separate message the password you want to use.');
  }
  if( msg.entities && msg.entities[0].type === 'bot_command' && msg.text === '/decrypt'){
    bot.sendMessage(msg.chat.id, 'Please send me the file you want to decrypt and in a separate message the password you have used to encrypt the file.');
  }
  if( msg.entities && msg.entities[0].type === 'bot_command' && msg.text === '/password'){
    password = msg.text;
  }
});

bot.on('document', async (file) => {
  console.log(file);  
  const stream = await bot.getFileStream(file.document.file_id);
  const downloadedFile = stream.pipe(fs.createWriteStream(file.document.file_name));
  const data = {
    filePath: `${process.cwd()}/${downloadedFile.path}`,
    password: password,
    fileType: file.document.mime_type,
    fileName: file.document.file_name
  }
  const eData = await encryptData(data)

  await bot.sendDocument(file.chat.id, eData);
});

//

bot.on('photo', async (data) => {
  console.log(data);

});
