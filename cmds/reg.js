var con = require('../DB/conDb');

module.exports = async (bot,message,args,argsF) => {
    const cont = argsF.join(" ") // все что пишеться после !reg
    const res1 = cont.split(" ") // Разделеяем все записи на масив
    
    
   
    function Check_group(callback) {
         
        //Проверка сушествует ли данная группа
       con.query('SELECT * FROM `groups` WHERE `groups`.`name` =?',
    [res1[0]], async (err,res,fields)=>{

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

    function Check_student(grop,callback) {
        //  Проверка сушествует ли Фамилия и Имя студента
     con.query('SELECT * FROM `students` WHERE `students`.`lastname` = ? AND `students`.`firstname` =? AND `students`.`id_g` = ?',
     [res1[1],res1[2],grop], async (err,res,fields)=>{
 
         //Проверка на выполнение запроса
         if(err){
             console.log(err.message);
             
             return callback(0,false)
         }
             
            if(res.length ==0) {
                console.log(res1[0],res1[1],res1[2]);
             message.channel.send("такого студента не существует ")
             return callback(0,false)
           }
           else{
            return callback(res[0].id_s,true)
           }
           
            
    })

    }
    function Insert_reg(student) {
        console.log(student);
          //Строка для добавления пользователя
          con.query('INSERT INTO `users` (`id`, `id_s`, `pass`, `id_r`) VALUES (?, ?, ?, ?)',
          [message.author.id,student,res1[3],1], async (err,res,fields)=>{
      if(err)
         return console.log(err.message);
 
         message.delete()
         message.channel.send("Регистрация прошла успешно")
         
         var role = message.guild.roles.cache.find(role => role.id === "931628294409945138")
         var user = message.guild.members.cache.get(message.author.id);
         user.roles.add(role)    
       
        })
          //Завершение строки добавления
    }

   function regUser() {

    result = true
    grop = 0

    // Вызываем метод для проверки на сущ группы, если результат true, 
    // группа найдена, если нет, то выходим и говорим "Регистрация не была произведена"
    //Так же если группа найдена , то в параметр груп записываем id группы
    Check_group(function (grop,result) {
        console.log(result);
        
        // Если группа найдена
       if(result){
           
        //Тут проблема в том , что параметр !!!!grop!!!! из "Check_group" я не могу выташить отсюда
        //Я создаю новую перменую, и присваиваю туда grop, но когда выхожу почему то не меняет!!
        // Поэтому в этой проверке я вызовую проверку на студента , туда я передаю группу, и в запросе 
        // смотрю есть ли такой студент или нет
        // так же есть параметр student , это id студента, который ищеться по фамили и его имени, и найденому id группы,
        // после чего Insert_reg выполняет запрос на добавление юзера
        
        Check_student(grop,function (student,result) {
            console.log(result);
            if(result){
                Insert_reg(student)
            }
            else
                return console.log("Регистрация не была произведена");
        })
       
        
    }
    // Если группа не найдена
    else
        return console.log("Регистрация не была произведена");
        
    })
    
   
 
}

    con.query('SELECT * FROM `users` WHERE `users`.`id` = ? ',
       [message.author.id], async (err,res,fields)=>{
           if(err)
              return console.log(err.message);
      
              if(!res.length ==0) {
                message.delete()
                  return message.reply("Вы уже зарегистрированы")
                }
                else{
                  
                    if(res1[0]==null || res1[1]==null||res1[2]==null||res1[3]==null){
                         message.delete()
                        
                        return message.channel.send("Для регистрации необходимо повторить данную команду !reg `your_group` `your_lastname` `your_firstname` `your_pass`")
                    }
                       regUser()
                    }
                })

    };
    
