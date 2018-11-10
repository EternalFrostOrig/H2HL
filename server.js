const Eris = require('eris');
 
var DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

const bot = new Eris(DISCORD_BOT_TOKEN);   // Replace DISCORD_BOT_TOKEN in .env with your bot accounts token
 
var prefix = '?',
    mute = [],
    msgs = []

bot.on('ready', () => {                                // When the bot is ready
    console.log('Ready!');                             // Log "Ready!"
});
 
function deleteMsg() {
  msgs.forEach(function(msg) {
    msg.delete()
  })
  msgs = []
}

bot.on('messageCreate', (msg) => {
  
    if (/((glitch)\s?\.\s?(?:me)|(?:com))/g.exec(msg.content)) {
      console.log(msg.author.username, msg.author.id, 'tried to post a glitch link')
      msg.delete().then(
        bot.createMessage(msg.channel.id, 'Sorry, '  + msg.author.username + ', glitch links are not allowed in this server, in order to prevent advertising and potential server stealing, sorry.')
      )
    }
  
    if (msg.author.id == 502241878683549729) {
      msgs.push(msg)
      setTimeout(deleteMsg, 5000)
    }
  
    if (mute.includes('<@' + msg.author.id + '>')) {
      console.log(msg.author.username, msg.author.id, 'tried to talk while muted: ')
      console.log(msg.content, '\n')
      console.log('Message deleted')
      msg.delete()
    }
    
    if (/(?:https?:\/\/)?diep.io\/(?:\s+)?#.+/g.exec(msg.content)) {
      console.log(msg.author.username, msg.author.id, 'tried to post a diep link')
      msg.delete().then(
        bot.createMessage(msg.channel.id, 'Sorry, '  + msg.author.username + ', Diep.io links are not allowed in this server')
      )
    }
    
    if (msg.content == prefix + 'list') {
      mute.forEach(function(muteid) {
        bot.createMessage(msg.channel.id, muteid);
      })
    }
    if (msg.content == prefix + 'clear' && msg.author.id == 345346351875358721) {
      mute = []
      bot.createMessage(msg.channel.id, 'Mute list cleared!');
    }
    if (msg.content.startsWith(prefix + 'mute ') && msg.author.id == 345346351875358721) {
      var ida = msg.content.split("mute ").pop()
      if (ida != '<@345346351875358721>' && ida != '<@502241878683549729>') {
        mute.push(ida)
        bot.createMessage(msg.channel.id, 'User added to mute list! Use `> unmute <id>` to unmute them.');
      } else{
        bot.createMessage(msg.channel.id, "Oops, something went wrong!")
      }
    }
      if (msg.content.startsWith(prefix + 'unmute ') && msg.author.id == 345346351875358721) {
      var ida = msg.content.split("mute ").pop()
      if (typeof(Number(ida)) == 'number' && Number(ida) != 345346351875358721) {
        delete mute[mute.indexOf(ida)]
        bot.createMessage(msg.channel.id, 'User removed from mute list! Use `> mute <id>` to mute them.');
      } else{
        var mentions = msg.mentions
        mentions.forEach(function (item) {
          bot.createMessage(msg.channel.id, 'OOPS! try using their ID')
        })
      }
    }
});
 
bot.editStatus('online', {
  name: 'PREFIX: "' + prefix + '"',
  type: 0
});

bot.connect();                                         // Get the bot to connect to Discord


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});