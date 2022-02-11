const mysql = require("mysql");

 process.argv[1]= 0

const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    database: "bot_discrod",
    password: "root"
  });
  
   connection.connect(function(err){
      if (err) {
        return console.error("Ошибка: " + err.message);
      }
      else{
        console.log("Подключение к серверу MySQL успешно установлено");
        
      }
   });

   module.exports = connection