const mysql = require('mysql');
const inquirer = require("inquirer");
const figlet = require("figlet");
const cTable = require("console.table");

const { whatDo, add, view, update, addDepartment } = require("./questions");
// const addDepot = require("./view");

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port, if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: 'Ch@tt259263',
    database: 'Company_db',
});

const employeeManager = async () => {
    const input = await inquirer.prompt(whatDo);
    // console.log(input.action);
    switch (input.action) {
        case "Add departments, roles, employees":
            addDRE();
            // console.log(1);
            break;
        case "View departments, roles, employees":
            viewDRE();
            // console.log(2);
            break;
        case "Update employee roles":
            updateDRE();
            // console.log(3);
            break;
        case "Exit":
            // console.log(4);
            connection.end();
            break;
    };
};

//ADD, VIEW, OR UPDATE DEPARTMENT, ROLES, OR EMPLOYEES

async function addDRE() {
    const input = await inquirer.prompt(add);
    // console.log(input);
    switch (input.add) {
        case "Departments":
            addDepot();
            // console.log(1);
            break;
        case "Roles":
            addRol()
            break;
        case "Employees":
            addEmployee();
            // console.log(3);
            break;
        case "Exit":
            return employeeManager();
        // console.log(4);
        default:
            return employeeManager();
    };
}

async function viewDRE() {
    const input = await inquirer.prompt(view);
    switch (input.view) {
        case "Departments":
            // console.log(1);
            connection.query("SELECT * FROM Departments", (err, res) => {
                if (err) console.log(err);
                console.table(res);
                return employeeManager();
            });
            break;
        case "Roles":
            connection.query("select Roles.id, title, salary, department_name FROM Roles INNER JOIN Departments ON department_id = departments.id", (err, res) => {
                if (err) console.log(err);
                console.table(res);
                return employeeManager();
            });
            break;
        case "Employees":
            connection.query("SELECT Employees.id, first_name, last_name, title, salary, department_name, manager_id FROM Employees INNER JOIN Roles ON Employees.roles_id = Roles.id INNER JOIN departments ON department_id = departments.id", (err, res) => {
                if (err) console.log(err);
                console.table(res);
                return employeeManager();
            });
            // console.log(3);
            break;
        case "Exit":
            return employeeManager();
        // console.log(4);
        default:
            return employeeManager();
    };
};

async function updateDRE() {
    connection.query("SELECT * FROM Employees", (err, res) => {
        if (err) throw err;
        // console.log(res);
        const employeestochoosefrom = [];
        res.forEach(employee => {
            let employeeName = employee.first_name + " " + employee.last_name;
            employeestochoosefrom.push(employeeName);
        });
        employeestochoosefrom.push("None");
        inquirer.prompt({
            type: "list",
            message: "Which employee would you like to update? ",
            name: "update",
            choices: employeestochoosefrom
        }).then(answers => {
            // console.log(answers);
            if (answers.update === "None") {
                console.log("No Employee assigned!");
                return employeeManager();
            }
            const empName = answers.update.split(" ", 1);
            const lastName = answers.update.slice(empName[0].length + 1);
            empName.push(lastName);
            // console.log(empName);
            updateEmployee(empName);
        });
        // console.log(input);
    });
}
//------------------------------------------------------------------------------------------------------------------------//

//ADD DEPOT ROLES OR EMPLOYEE
async function addDepot() {
    const input = await inquirer.prompt(addDepartment);
    // console.log(input);
    connection.query("INSERT INTO Departments SET ?", (input), (err, res) => {
        if (err) console.log(err);
        console.log(`${res.affectedRows} department created! \n`);
        return employeeManager();
    });
};

//ADD ROLE 
function addRol() {
    // const input = await inquirer.prompt(addRole);
    // console.log(input);
    // console.log(parseFloat(input.salary));
    connection.query("SELECT * FROM Departments", (err, res) => {
        if (err) console.log(err);
        // res.forEach(department => {
        //     departmentstochoosefrom.push(department.department_name);
        // });
        // console.log(departmentstochoosefrom);
        // return employeeManager();
        // console.log(res);
        inquirer.prompt([
            {
                type: "input",
                message: "Title of the role? ",
                name: "title"
            },
            {
                type: "input",
                message: "Salary of the role? ",
                name: "salary"
            },
            {
                name: "add",
                type: "list",
                choices() {
                    const departmentstochoosefrom = [];
                    res.forEach(({ department_name }) => {
                        departmentstochoosefrom.push(department_name);
                    });
                    return departmentstochoosefrom;
                },
                message: "What Department? ",
            }
        ]).then((answers) => {
            // console.log(answers);
            let depot_id = 0;
            res.forEach(department => {
                if (department.department_name === answers.add) {
                    // console.log(depot_id);
                    depot_id = department.id;
                };
            });
            // console.log(depot_id);
            connection.query(
                "INSERT INTO Roles SET ?",
                {
                    title: answers.title,
                    salary: parseFloat(answers.salary),
                    department_id: depot_id
                },
                (err) => {
                    if (err) throw err;
                    console.log(`Role created! \n`);
                    return employeeManager();
                }
            );
        });
    });
};

//ADD EMPLOYEE FUNCTION
function addEmployee() {
    connection.query("SELECT * FROM Roles", (err, res) => {
        if (err) console.log(err);
        // console.table(res);
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "First Name? ",
                    name: "first_name"
                },
                {
                    type: "input",
                    message: "Last Name? ",
                    name: "last_name"
                },
                {
                    name: "role",
                    type: "list",
                    choices() {
                        const rolestochoosefrom = [];
                        res.forEach(({ title }) => {
                            rolestochoosefrom.push(title);
                        });
                        return rolestochoosefrom;
                    },
                    message: "What Role? ",
                }
            ]).then(answers => {
                // console.log(answers);
                let rolesid = 0;
                res.forEach(role => {
                    if (role.title === answers.role) {
                        // console.log(depot_id);
                        rolesid = role.id;
                    };
                });
                console.log(rolesid);
                connection.query(
                    "INSERT INTO Employees SET ?",
                    {
                        first_name: answers.first_name,
                        last_name: answers.last_name,
                        roles_id: rolesid,
                    },
                    (err) => {
                        if (err) throw err;
                        console.log(`Employee created! \n`);
                        return updateEmployee([answers.first_name, answers.last_name]);
                    }
                );
            });
    });
};

//UPDATE EMPLOYEE
function updateEmployee(employName) {
    //*********PLUG FOR UPDATING EMPLOYEE */
    connection.query("SELECT * FROM Employees", (err, res) => {
        if (err) throw err;
        // console.log(res);
        const employeestochoosefrom = [];
        res.forEach(employee => {
            let employeeName = employee.first_name + " " + employee.last_name;
            employeestochoosefrom.push(employeeName);
        });
        employeestochoosefrom.push("None");
        // console.log(employeestochoosefrom);
        inquirer.prompt([
            {
                name: "hasManager",
                type: "list",
                choices: employeestochoosefrom,
                message: "Assign a manager? ",

            }]).then(answers => {
                // console.log(answers);
                if (answers.hasManager === "None") {
                    console.log("No manager assigned!");
                    return employeeManager();
                }
                const empName = answers.hasManager.split(" ", 1);
                const lastName = answers.hasManager.slice(empName[0].length + 1);
                empName.push(lastName);
                // console.log(firstName);
                // console.log([lastName]);
                let employeeID = 0;
                // console.log(employName);
                connection.query("SELECT id FROM Employees WHERE first_name=? AND last_name=?", employName, (err, res) => {
                    if (err) throw err;
                    // console.log(res);
                    // console.log(res.id);
                    employeeID = res[0].id;
                    // console.log(employeeID);
                });
                connection.query("SELECT id FROM Employees WHERE first_name=? AND last_name=?", empName, (err, res) => {
                    // console.log(res);
                    connection.query("UPDATE Employees SET ? WHERE ?",
                        [
                            {
                                manager_id: res[0].id || null,
                            },
                            {
                                id: employeeID,
                            },
                        ], (err, res) => {
                            if (err) throw err;
                            // console.log(res);
                            console.log("Manager Set!");
                            return employeeManager();
                        });
                });
            });
    });
};

// async function addRole() {
//     const input = await inquirer.prompt(addDepartment);
//     // console.log(input);
//     connection.query("INSERT INTO Departments SET ?", (input), (err, res) => {
//         if (err) console.log(err);
//         console.log(`${res.affectedRows} department created! \n`);
//         return employeeManager();
//     });
// };

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    // function viewing(userChoice) {
    //     connection.query("SELECT * FROM ?", (connection.database.userChoice), (err, res) => {
    //         if (err) console.log(err);
    //         console.log(res);
    //     });
    // };

    // viewing("departments");
    // title;
    // const userChoice = {
    //     name: "Departments"
    // }
    // // console.log(userChoice);
    // viewing(userChoice);

    createTemplate();
});

function createTemplate() {
    figlet("Employee Manager", function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);

        employeeManager();
    });
};