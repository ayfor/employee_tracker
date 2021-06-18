const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',

    port:3306,

    user: 'root',

    password:'A4sqlstud?',
    database: 'employees_db'
});

// const readEmployees = () => {
//     connection.query('',(err, res)=>{
//         if(err) throw err;

//         console.log(res);
//         connection.end();
//     });
// };

connection.connect((err)=>{
    if(err) throw err;
    console.log(`Connected as id ${connection.threadId}\n`);
    //readEmployees();
})
