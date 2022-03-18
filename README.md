# Reaver CMS 🏴‍☠️
MySQL database content manage from the comfort of your local command line. Written in NodeJS using an Express backend, Inquirer and Gradient-String for beautiful prompting, and environment variables tucked safely away for security.

## 📚 Table of Contents
- [Reaver CMS 🏴‍☠️](#reaver-cms-️)
  - [📚 Table of Contents](#-table-of-contents)
  - [🧾 Features](#-features)
  - [📖 Developer Journey](#-developer-journey)
  - [🛠️ Installation](#️-installation)
  - [👨‍🏫 Usage](#-usage)
  - [🥂 Credits](#-credits)
  - [� How to Contribute](#-how-to-contribute)

## 🧾 Features
- Built for non-developers
- Easily view and interact with information stored in a database
- Manage multiple departments, roles, and employees
- Relational data with linked tables for dynamic content generation
- Formatted tables
- CRUD functionality
- Update employee's roles and managers
- View employees by manager, or department
- View totalized budget by department
- Delete departments, roles, and employees
- Beautiful gradient strings and ASCII art
- Manage huge stores of data without having to look at chunky SQL code

## 📖 Developer Journey

📓 This project was originally created for a business owner seeking to view and interact with the departments, roles, and employess in their company via a command line application. It was clear from the start that this would be a NodeJS application that uses Inquirer for prompts and Express to handle the backend. The app also needed to interact with data stored in a MySQL database, so I used th mysql2 package from npm to interact with and write queries to the database. Overall, it was an incredible learning experience working with SQL and NodeJS in tandem, however, having now learned ORM (Object Relational Mapping) since the creation of this project, I am both excited to use those new tools in the future, and also astonished that I was able to utilize some Object-Oriented Programming principles from the start without knowing this would be where my learning journey would take me in the future. 

🦟 Bugs in this project were like true cockroaches in an infested apartment. I'd get rid of one, only to find three more in other places, continously popping up in the smallest corners of the app, left and right. It became clear after a point that the current way of handling the situation resulted from a lack of code organization and modularization of queries between objects and their respective CRUD functions. I had a great difficulty trying to create classes for each data table. I wanted seperate JS classes for Departments, Roles, and Employees, and one Organization object to pull them all through. I wasn't able to get things working this way, and ultimately in the interest of getting an MVP in the necessary amount of time, I scrapped that ambition, and hacked the program together the way I knew how at the time. I created one Organization object with various functions that represent the CRUD functions for each table. Admittedly the code is bloated in one file, and may or may not be compared to some form of pasta or another, but now with ORM tools like Sequelize that allow the developer to create models for SQL tables and interact with them using OOP principles I know my next projects using will be 10x as powerful. I am especially interested in learning about the MVC (Model View Controller) paradigm that will really make working with SQL tables as classes much easier, and finally combine the beauty of functional programming with dynamically generated HTML to make awesome full-stack applications. Until then, I am ultimately proud of where I was able to take this product in such a short amount of time and I hope others get a good use out of this super cool CMS!

## 🛠️ Installation
Locate the dropdown menu labeled 'Code' to the left of the About section in the main page of this repository. From there, select your preferred cloning method from HTTPS, SSH, or the GitHub CLI. For this demonstration, we will be using the SSH method. Copy the link and head to your terminal. From the command line you should enter:

    git clone <INSERT_SSH_KEY_HERE>

Replacing the above placeholder with the link copied from GitHub. This will clone the repository into a local directory on your machine. And that's it! Happy Hacking! 🚀

## 👨‍🏫 Usage
This code is strictly for use by reavers and the various interpretations that moniker bears among denizens of various real and/or fantastical environments and is only provided as material for study and otherwise double-checking implementation of various server-side and back-end functionality such as but not limited to express servers, node module exports, inquirer prompts, MySQL database queries, Content Management Systems, Node command line interfaces and other shenanigans. Any violations of these use cases will see the offender jettisoned to the nearest marooned store of corrupted data to cycle endlessly through prompting, queuing, building, deploying, deprecating, and recursive calling.

Link to walkthrough video included below.

   [Video Demo of Reaver CMS (not yo momma's hacker tracker).](https://www.youtube.com/watch?v=1OlIXnaXYYc)

## 🥂 Credits
UT Austin Coding Boot Camp https://techbootcamps.utexas.edu/coding/

Kyle Ferguson https://github.com/kferguson52

Stack Overflow https://stackoverflow.com/

MDN Web Docs https://developer.mozilla.org/en-US/


## 👋 How to Contribute
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

See the [Contributor Covenant](https://www.contributor-covenant.org/) for details on how to contribute
