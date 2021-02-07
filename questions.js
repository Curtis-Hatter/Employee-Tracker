const whatDo = [{
    type: "list",
    message: "What would you like to do? ",
    name: "action",
    choices: ["Add departments, roles, employees", "View departments, roles, employees", "Update employee roles", "Exit"]
}];

const add = [{
    type: "list",
    message: "What would you like to add? ",
    name: "add",
    choices: ["Departments", "Roles", "Employees", "Exit"]
}];

const view = [{
    type: "list",
    message: "What would you like to View? ",
    name: "view",
    choices: ["Departments", "Roles", "Employees", "Exit"]
}];

const update = [{
    type: "input",
    message: "Which employee would you like to update? ",
    name: "update"
}];

module.exports = { whatDo, add, view, update };