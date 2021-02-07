const mysql = require('mysql');
const inquirer = require("inquirer");
const figlet = require("figlet");

const { whatDo, add, view, update } = require("./questions");
const viewing = require("./view");
const { create } = require('domain');

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

async function addDRE() {
    const input = await inquirer.prompt(add);
    console.log(input);
}

async function viewDRE() {
    const input = await inquirer.prompt(view);
    switch (input.view) {
        case "Departments":
            // console.log(1);
            connection.query("SELECT * FROM Departments", (err, res) => {
                if (err) console.log(err);
                console.log(res);
            });
            break;
        case "Roles":
            connection.query("SELECT * FROM Roles", (err, res) => {
                if (err) console.log(err);
                console.log(res);
            });
            // console.log(2);
            break;
        case "Employees":
            connection.query("SELECT * FROM Employees", (err, res) => {
                if (err) console.log(err);
                console.log(res);
            });
            // console.log(3);
            break;
        case "Exit":
            // console.log(4);
            break;
    };
}

async function updateDRE() {
    const input = await inquirer.prompt(update);
    console.log(input);
}


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