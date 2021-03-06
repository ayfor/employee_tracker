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

var currentRoleTitles = [];

var currentDepartments = [];

var currentDepartmentNames = [];

var currentEmployees = [];

var currentEmployeeNames = [];

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

        console.log(`\n`)
        console.table(responseArray);
        runInquiries();
    })

};

const showRoles = () => {
    let query = 'SELECT * FROM role';

    connection.query(query, (err, res)=>{
        let response = JSON.stringify(res);

        let responseArray = JSON.parse(response);

        console.log(`\n`)
        console.table(responseArray);
        runInquiries();
    })

}

const showDepartments = () => {
    let query = 'SELECT department.id AS ID, department.name AS Department_Name FROM department';

    connection.query(query, (err, res)=>{
        let response = JSON.stringify(res);

        let responseArray = JSON.parse(response);

        console.log(`\n`)
        console.table(responseArray);
        runInquiries();
    })

}

//QUERIES FOR UPDATING PERSISTING DATA

const updateRoles = () => {

    connection.query(
        'SELECT * FROM role',
        (err, res) => {
            if(err){
                throw err;
            }else{
                let response = JSON.stringify(res);
                let responseArray = JSON.parse(response);

                currentRoles = [];
                currentRoleTitles = [];

                currentRoles = responseArray;

                responseArray.forEach(element => {
                    currentRoleTitles.push(element.title)
                });
                
            }
        }
    );
}

const updateDepartments = () => {

    connection.query(
        'SELECT * FROM department',
        (err, res) => {
            if(err){
                throw err;
            }else{
                let response = JSON.stringify(res);
                let responseArray = JSON.parse(response);

                currentDepartments = [];
                currentDepartmentNames = [];

                currentDepartments = responseArray;

                responseArray.forEach(element => {
                    currentDepartmentNames.push(element.name)
                });  

            }
        }
    );
}


const updateEmployees = () => {
    connection.query(
        'SELECT * FROM employee',
        (err, res) => {
            if(err){
                throw err;
            }else{
                let response = JSON.stringify(res);
                let responseArray = JSON.parse(response);

                currentEmployees = [];
                currentEmployeeNames = [];

                responseArray.forEach(element => {
                    let employee = {};
                    let name = element.first_name +" "+ element.last_name;
                    let id = element.id;

                    employee.name = name;
                    employee.id = id;

                    currentEmployeeNames.push(name);
                    currentEmployees.push(employee);
                });  

                //Add null selection to current employee names
                currentEmployeeNames.push("None");
            }
        }
    );
}


//-----INQUIRER PROMPTS-----

const runInquiries = () => {

    updatePersistingData();

    inquirer
    .prompt({
        name:'action',
        type:'list',
        message:'What would you like to do?',
        choices: [
            'View Employees',
            'View Departments',
            'View Roles',
            'Add Employee',
            'Add Department',
            'Add Role',
            'Update Employee Role',
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
            case 'Add Role':
                addRole();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            
            default:
                break;
        }
    })


    
}

const addEmployee = () => {

    console.log('Adding Employee...');
    inquirer
    .prompt([
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
            choices: currentRoleTitles,
            name: 'role'
        },
        {
            type: 'list', 
            message: "Who is the manager of this employee?",
            choices: currentEmployeeNames,
            name: 'manager'
        },

    ])
    .then((answers)=>{
        if((answers.firstName && !(answers.firstName===""))&&(answers.lastName && !(answers.lastName===""))){

            connection.query(
                'INSERT INTO employee SET ?',
                {
                  first_name: answers.firstName,
                  last_name: answers.lastName,
                  role_id: getRoleId(answers.role),
                  manager_id: getEmployeeId(answers.manager)
                },
                (err, res) => {
                  if (err) throw err;
                  console.log(`\nEmployee added!\n`);
                }
            );


        }else{
            console.error("Invalid Employee Name. Please start the application again.");
        }
    })
    .then(() => {runInquiries()});

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
                  console.log(`\nDepartment added!\n`);
                }
            );


        }else{
            console.error("Invalid Deparment Name. Please start the application again.");
        }
    })
    .then(() => {runInquiries()});


}

const addRole = () => {
    inquirer
    .prompt([
        {
            type: 'input',
            message: "What is the name of the role?",
            name: 'roleTitle',
        },
        {
            type: 'input',
            message: "What is the salary of the role?",
            name: 'roleSalary',
        },
        {
            type: 'list',
            message: "What department is the role a part of?",
            choices: currentDepartmentNames,
            name: 'roleDepartment',
        },
        

    ])
    .then((answers)=>{
        if((answers.roleTitle && !(answers.roleTitle===""))&&(answers.roleSalary && !(answers.roleSalary===""))){

            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answers.roleTitle,
                    salary: answers.roleSalary,
                    department_id: getDepartmentId(answers.roleDepartment)
                },
                (err, res) => {
                  if (err) throw err;
                  console.log(`\nRole added!\n`);
                }
            );


        }else{
            console.error("Invalid Role Name. Please start the application again.");
        }
    })
    .then(() => {runInquiries()});

}

const updateEmployeeRole = () => {

    inquirer
    .prompt([
        {
            type: 'list', 
            message: "What employee would you like to update?",
            choices: currentEmployeeNames,
            name: 'selectedEmployee'
        },
        {
            type: 'list', 
            message: "What is the employee's new role?",
            choices: currentRoleTitles,
            name: 'role'
        },
    ])
    .then((answers)=>{
        
        connection.query(
            'UPDATE employee SET ? WHERE ?',
            [
                {
                    role_id: getRoleId(answers.role),
                },
                {
                    id: getEmployeeId(answers.selectedEmployee)
                }
            ],
            (err, res) => {
                if (err) throw err;
                console.log(`\nEmployee added!\n`);
            }
        );

    })
    .then(() => {runInquiries()});


}

//-----HELPER FUNCTIONS-----

const updatePersistingData = () => {
    updateDepartments();
    updateRoles();
    updateEmployees();
}

const getDepartmentId = (departmentName) => {
    for (const department of currentDepartments) {
        if(departmentName === department.name){
            return department.id;
        }
    }
}

const getRoleId = (roleTitle) => {
    for (const role of currentRoles) {
        if(roleTitle === role.title){
            return role.id;
        }
    }
}

const getEmployeeId = (employeeName) => {
    for (const employee of currentEmployees){
        if(employeeName === employee.name){
            return employee.id;
        }
    }

    return null;
}

//-----INIT-----

connection.connect((err)=>{
    if(err) throw err;
    console.log(`Connected as id ${connection.threadId}\n`);
    runInquiries();
})