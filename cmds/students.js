var con = require('../DB/conDb');
module.exports = async (message,Discord) => {
     var user = message.guild.members.cache.get(message.author.id);

    // 'SELECT `students`.`id_g` FROM `users`,`students` WHERE `users`.`id_s`=`students`.`id_s` AND `users`.`id` = ?'

    function get_idG(callback) {
         
        //Проверка сушествует ли данная группа
       con.query('SELECT `students`.`id_g` FROM `users`,`students` WHERE `users`.`id_s`=`students`.`id_s` AND `users`.`id` = ?',
    [message.author.id], async (err,res,fields)=>{

        //Проверка на выполнение запроса
        if(err){
            console.log(err.message);
            
            return callback(0,false)
        }
            
           if(res.length ==0) {
          
            message.channel.send("такой группы не существует")
            
            return callback(0,false)
          }else{
            
            // берем id группы если такая существует
            return callback(res[0].id_g,true)
           
           
          } 
           
   })
   
    }
    
   

    str =""
    id_gg=0

    get_idG(function (grop,result) {
        if(user.roles.cache.find(role => role.name == "Преподаватель")||user.roles.cache.find(role => role.name == "Староста")){

            con.query('SELECT * FROM `students` WHERE `students`.`id_g`=?',
            [grop], async (err,res,fields)=>{
                if(err)
                   return console.log(err.message);
           
                   if(!res.length ==0) {
                     message.delete()
                     for (let i = 0; i < res.length; i++) {
                       
                        str+=res[i].lastname+" "+res[i].firstname+" "+res[i].phone+"\n"
                    }
                    
                    const embed = new Discord.MessageEmbed()
                        .setColor('#22467d')
                        .setTitle('Студенты группы')
                        .setFooter(str)
                        return user.send(embed);
                     }
                     else{
                         message.delete()
                         return user.send("Студентов нет")
                         
                     }})
        
                    }
                    else{
                       
                            message.delete()
                            
                           return user.send("Только старосты или преподователи могут смотреть студентов")
                    }
    
    })
}

    
