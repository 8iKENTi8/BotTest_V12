var con = require('../DB/conDb');
module.exports = async (bot, msg,guildMap,connect,Discord) => {

    const msgAr = msg.content.toLowerCase().split(' '),
    cmd = msgAr[0],
    args = msgAr.slice(1),
    msgArFull = msg.content.split(' '),
    argsF= msgArFull.slice(1)

    
  

    if(cmd=="!auth"){
        require('../cmds/aut')(bot,msg,args,argsF,Discord)
    }

    if(cmd=="!reg"){
        require('../cmds/reg')(bot,msg,args,argsF)
    }
    if(cmd=="!give_elder"){
        require('../cmds/give_elder')(bot,msg,args,argsF)
    }

    if(cmd=="!test"){
        require('../cmds/test_ls')(bot,msg,args,argsF)
    }
   
    
        try {
            if (!('guild' in msg) || !msg.guild) return; // prevent private messages to bot
            const mapKey = msg.guild.id;
            if (msg.content.trim().toLowerCase() == '!join') {
                if (!msg.member.voice.channelID) {
                    msg.reply('Error: please join a voice channel first.')
                } else {
                    if (!guildMap.has(mapKey)){

                         con.query("INSERT INTO `records` (`id`, `speech`, `duration`) VALUES (NULL, '', '0.0')",
                    [], async (err,fields)=>{
                        if(err)
                        return console.log(err.message);
                                
                        })

                        con.query('SELECT `records`.`id` FROM `records` ORDER BY `records`.`id` DESC LIMIT 1',
                        [], async (err,res,fields)=>{

                        if(err)
                            return console.log(err.message);

                        if(res.length ==0)
                            return console.log("Нету записей"); 

                            await connect(msg, mapKey,res[0].id)

                      })
                        }
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