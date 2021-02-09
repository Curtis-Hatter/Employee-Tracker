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

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    //my function here
    addRol();
});
