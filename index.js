//DEPENDENCIES
const mysql = require('mysql');
const cTable = require('console.table');


//-----SERVER SETTINGS-----
const connection = mysql.createConnection({
    host: 'localhost',

    port:3306,

    user: 'root',

    password:'A4sqlstud?',
    database: 'employees_db'
});

const readEmployees = () => {
    //Construct query for complete employee information
    let query = 'SELECT employee.id AS ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, employee.role_id, employee.manager_id FROM employee ';

    query += ' INNER JOIN role ON (employee.role_id = role.id) ';

    //query += ' INNER JOIN employee ON (employee.manger_id = employee.id)'

    connection.query(query,(err, res)=>{
        if(err) throw err;
        let response = JSON.stringify(res);

        let responseArray = JSON.parse(response);

        responseArray.forEach(element => {
            if(element.manager_id===null){
                element.manager_id = '[NONE]';
            }
        });

        console.table(responseArray);
    });
};

connection.connect((err)=>{
    if(err) throw err;
    console.log(`Connected as id ${connection.threadId}\n`);
    //Show employees
    readEmployees();
})
