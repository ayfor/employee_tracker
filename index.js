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
    let query = 'SELECT employee.id, employee.first_name AS FirstName, employee.last_name AS LastName, manager.first_name AS ManagerFirstName, manager.last_name AS ManagerLastName, role.title AS Title , role.salary AS Salary FROM employee ';

    query += 'LEFT OUTER JOIN employee manager ON (employee.manager_id = manager.id)'
    
    query += 'INNER JOIN role ON (employee.role_id = role.id) ';

    connection.query(query,(err, res)=>{
        if(err) throw err;
        let response = JSON.stringify(res);

        

        let responseArray = JSON.parse(response);

        //console.log(responseArray);

        responseArray.forEach(element => {
            if(element.ManagerFirstName === null){
                element.ManagerFirstName = '-';
                element.ManagerLastName = '-';
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
