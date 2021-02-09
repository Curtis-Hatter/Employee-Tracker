// Initial questions 

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

//------------------------------------------------//

// Add Department Roles or Employee Questions

const addDepartment = [{
    type: "input",
    message: "Name of the Department you would like to add? ",
    name: "department_name"
}];

// const addRole = [{
//     type: "input",
//     message: "Title of the role? ",
//     name: "title"
// },
// {
//     type: "input",
//     message: "Salary of the role? ",
//     name: "salary"
// },
// {
//     type: "list",
//     message: "What would you like to add? ",
//     name: "add",
//     choices: departmentstochoosefrom
// }];

module.exports = { whatDo, add, view, addDepartment };