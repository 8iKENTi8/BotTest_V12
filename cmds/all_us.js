var con = require('../DB/conDb');
module.exports = async (message,Discord) => {
     var user = message.guild.members.cache.get(message.author.id);
     str =""
     message.delete()
     if(user.roles.cache.find(role => role.name == "Преподаватель")){

     con.query('SELECT DISTINCT `students`.`lastname` ,`students`.`firstname` ,`roles`.`Name` ,`groups`.`name`  FROM `users`,`students`,`roles`,`groups` WHERE `users`.`id_s`=`students`.`id_s` AND `users`.`id_r`=`roles`.`id_r` and `groups`.`id_g`=`students`.`id_g`',
     [], async (err,res,fields)=>{
 
         //Проверка на выполнение запроса
         if(err){
             console.log(err.message)
             
         }
            if(!res.length ==0) {
                
                for (let i = 0; i < res.length; i++) {
                  
                   str+=res[i].lastname+" "+res[i].firstname+" "+res[i].Name+" "+res[i].name+"\n"
               }
               
               const embed = new Discord.MessageEmbed()
                   .setColor('#d8a903')
                   .setTitle('Все пользователи')
                   .setFooter(str)
                   return user.send(embed);
                
           }
           else
            user.send("Пользователей нет")
    })
}
else
    user.send("Только преподаватели могут смотреть всех студентов")
}
    
