module.exports = async (oldMember,newMember,guildMap) => {
   
  if(oldMember.channel && !newMember.channel && global.user_id == newMember.member.user.id ) { //если пользователь вышел из канала
       
         require('../global_fun/leave')(guildMap,global.Map_Key_global,"msg")
  } 
    }
