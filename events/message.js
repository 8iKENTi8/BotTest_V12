module.exports = async (bot, msg,guildMap,connect,Discord) => {

    const msgAr = msg.content.toLowerCase().split(' '),
    cmd = msgAr[0],
    args = msgAr.slice(1),
    msgArFull = msg.content.split(' '),
    argsF= msgArFull.slice(1)

    if(cmd=="!auth"){
        require('../cmds/aut')(bot,msg,args,argsF,Discord)
    }
   
    
    
 

   
        try {
            if (!('guild' in msg) || !msg.guild) return; // prevent private messages to bot
            const mapKey = msg.guild.id;
            if (msg.content.trim().toLowerCase() == '!join') {
                if (!msg.member.voice.channelID) {
                    msg.reply('Error: please join a voice channel first.')
                } else {
                    if (!guildMap.has(mapKey))
                        await connect(msg, mapKey)
                    else
                        msg.reply('Already connected')
                }
            } else if (msg.content.trim().toLowerCase() == '!leave') {
                if (guildMap.has(mapKey)) {
                    let val = guildMap.get(mapKey);
                    if (val.voice_Channel) val.voice_Channel.leave()
                    if (val.voice_Connection) val.voice_Connection.disconnect()
                    guildMap.delete(mapKey)
                    msg.reply("Disconnected.")
                } else {
                    msg.reply("Cannot leave because not connected.")
                }
            }

         
        } catch (e) {
            console.log('discordClient message: ' + e)
            msg.reply('Error#180: Something went wrong, try again or contact the developers if this keeps happening.');
        }
    }