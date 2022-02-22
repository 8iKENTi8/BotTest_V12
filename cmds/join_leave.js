var con = require('../DB/conDb');
module.exports = async (msg,guildMap,connect) => {

    var user = msg.guild.members.cache.get(msg.author.id)
    

    if(user.roles.cache.find(role => role.name == "Преподаватель") || user.roles.cache.find(role => role.name == "Староста")){

        try {
        if (!('guild' in msg) || !msg.guild) return; // prevent private messages to bot
        const mapKey = msg.guild.id;
        global.Map_Key_global = mapKey
        global.user_id = msg.author.id
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
        } 
        else if (msg.content.trim().toLowerCase() == '!leave') 
            require('../global_fun/leave')(guildMap,mapKey,msg)
        

     
    } catch (e) {
        console.log('discordClient message: ' + e)
        msg.reply('Error#180: Something went wrong, try again or contact the developers if this keeps happening.');
    }
}
       else
       user.send('Пригласить или выгнать бота в конференцию может только староста или преподователь')

      
    
}