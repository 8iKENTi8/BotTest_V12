module.exports = async (bot, msg,guildMap,connect,Discord) => {

    const msgAr = msg.content.toLowerCase().split(' '),
    cmd = msgAr[0],
    args = msgAr.slice(1),
    msgArFull = msg.content.split(' '),
    argsF= msgArFull.slice(1)


    if(cmd=="!auth")
        require('../cmds/aut')(bot,msg,args,argsF,Discord)
    
    if(cmd=="!reg")
        require('../cmds/reg')(bot,msg,args,argsF)
    
    if(cmd=="!give_elder")
        require('../cmds/give_elder')(bot,msg,args,argsF)
    
    if(cmd=="!test")
        require('../cmds/test_ls')(bot,msg,args,argsF)
    
    if(cmd=="!join" || cmd =="!leave")
        require('../cmds/join_leave')(msg,guildMap,connect)
    
    }