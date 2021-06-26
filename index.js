//DEPENDENCIES
const mysql = require('mysql');
const cTable = require('console.table');
const inquirer = require('inquirer');


//-----SERVER SETTINGS-----
const connection = mysql.createConnection({
    host: 'localhost',

    port:3306,

    user: 'root',

    password:'A4sqlstud?',
    database: 'employees_db'
});

//-----PERSISTING DATA-----

var currentRoles = [];

var currentDepartments = [];

//-----SERVER REQUESTS-----

const showEmployees = () => {
    //Construct query for complete employee information
    let query = 'SELECT employee.id, employee.first_name AS FirstName, employee.last_name AS LastName, manager.first_name AS ManagerFirstName, manager.last_name AS ManagerLastName, role.title AS Title , role.salary AS Salary FROM employee ';

    query += 'LEFT OUTER JOIN employee manager ON (employee.manager_id = manager.id)'
    
    query += 'INNER JOIN role ON (employee.role_id = role.id) ';

    connection.query(query,(err, res)=>{
        if(err) throw err;
        let response = JSON.stringify(res);

        let responseArray = JSON.parse(response);

        //reformat null entries
        responseArray.forEach(element => {
            if(element.ManagerFirstName === null){
                element.ManagerFirstName = '-';
                element.ManagerLastName = '-';
            }
        });

        console.table(responseArray);
    });
};

const showRoles = () => {
    let query = 'SELECT * FROM role';

    connection.query(query, (err, res)=>{
        let response = JSON.stringify(res);

        let responseArray = JSON.parse(response);

        console.table(responseArray);
    })
}

const showDepartments = () => {
    let query = 'SELECT department.id AS ID, department.name AS Department_Name FROM department';

    connection.query(query, (err, res)=>{
        let response = JSON.stringify(res);

        let responseArray = JSON.parse(response);

        console.table(responseArray);
    })
}

//QUERIES FOR UPDATING PERSISTING DATA

const updateRoles = () => {

    connection.query(
        'SELECT title FROM role',
        (err, res) => {
            if(err){
                throw err;
            }else{
                let response = JSON.stringify(res);
                let responseArray = JSON.parse(response);

                currentRoles = [];

                responseArray.forEach(element => {
                    currentRoles.push(element.title)
                });   
            }
        }
    );
}

const

//-----INQUIRER PROMPTS-----

const runInquiries = () => {
    inquirer
    .prompt({
        name:'action',
        type:'list',
        message:'What would you like to do?',
        choices: [
            'View Employees',
            'View Departments',
            'View Roles',
            'Add Department',
            'Add Role',
            '[Exit]'
        ]
    })
    .then((answer)=>{
        switch (answer.action) {
            case 'View Employees':
                showEmployees();
                break;
            
            case 'View Departments':
                showDepartments();
                break;
            
            case 'View Roles':
                showRoles();
                break;
            
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case '[Exit]':
                return;

            default:
                break;
        }
    })
    
}

const addEmployee = () => {
    let roles = []

    console.log('Adding Employee...');
    inquirer
    .prompt(
        {
            type: 'input',
            message: "What is the employee's first name?",
            name: 'firstName',
        },
        {
            type: 'input',
            message: "What is the employee's last name?",
            name: 'lastName',
        },
        {
            type: 'list', 
            message: "What is the employee's role?",
            choices: roles,
            name: 'role'
        }


    )
}

const addDepartment = () => {
    inquirer
    .prompt(
        {
            type: 'input',
            message: "What is the name of the department?",
            name: 'departmentName',
        }
    )
    .then((answers)=>{
        if(answers.departmentName && !(answers.departmentName==="")){

            connection.query(
                'INSERT INTO department SET ?',
                {
                  name: answers.departmentName
                },
                (err, res) => {
                  if (err) throw err;
                  console.log(`Department added!\n`);
                }
            );


        }else{
            console.error("Invalid Deparment Name. Please start the application again.");
        }
    })
    .then(() => {runInquiries()});
}


//-----INIT-----

connection.connect((err)=>{
    if(err) throw err;
    console.log(`Connected as id ${connection.threadId}\n`);
    updateRoles();
    runInquiries();
})