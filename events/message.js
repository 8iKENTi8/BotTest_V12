module.exports = async (bot, msg,guildMap,connect,Discord) => {

    const msgAr = msg.content.toLowerCase().split(' '),
    cmd = msgAr[0],
    args = msgAr.slice(1),
    msgArFull = msg.content.split(' '),
    argsF= msgArFull.slice(1)
    const user = await bot.users.fetch(msg.author.id)

    if(cmd[0]=='!'){

        if(cmd=="!auth"){
            require('../cmds/aut')(bot,msg,args,argsF,Discord)
            return
        }
        
        if(cmd=="!reg"){
            require('../cmds/reg')(bot,msg,args,argsF)
            return
        }
        
        if(cmd=="!give_elder"){
            require('../cmds/give_elder')(bot,msg,args,argsF)
            return
        }
        
        if(cmd=="!test"){
            require('../cmds/test_ls')(bot,msg,args,argsF)
            return
        }
                
        
        if(cmd=="!join" || cmd =="!leave"){
            require('../cmds/join_leave')(msg,guildMap,connect)
            return
        }

        if(cmd=="!students"){
            require('../cmds/students')(msg,Discord)
            return
        }

        if(cmd=="!all_us"){
            require('../cmds/all_us')(msg,Discord)
            return
        }
        
        user.send("Извините, такой команды не найдено или не существует " + cmd + ".")
    }
}