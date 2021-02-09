const mysql = require('mysql');
const inquirer = require("inquirer");
const figlet = require("figlet");
const cTable = require("console.table");

const { whatDo, add, view, update, addDepartment } = require("./questions");

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

async function addDepot() {
    const input = await inquirer.prompt(addDepartment);
    console.log(input);
    connection.query("INSERT INTO Departments SET ?", { input }, (err, res) => {
        if (err) console.log(err);
        console.log(`${res.affectedRows} department created! \n`);
        return employeeManager();
    });
};

async function addRol() {
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
        console.log(res);
        inquirer
            .prompt([
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
            ])
            .then((answers) => {
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
        inquirer
            .prompt([
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



connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    //my function here
    // addRol();
    addEmployee();
    // updateEmployee(["Curt", "Hatt"]);
});
