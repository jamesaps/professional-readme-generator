import fs from "fs";
import path from "path";
import inquirer from "inquirer";

import generateMarkdown from "./utils/generateMarkdown.js";

// array of questions for user
const questions = [
  {
    question: "Please provide the title for this project",
    name: "Title",
    type: "title",
  },
  {
    question: "Please provide a description of this project",
    name: "Description",
    type: "default",
  },
  {
    question: "Please provide installation details for this project",
    name: "Installation",
    type: "default",
  },
  {
    question: "Please provide license details for this project",
    name: "License",
    type: "default",
  },
  {
    question: "Please provide contribution details for this project",
    name: "Contributing",
    type: "default",
  },
  {
    question: "Please provide test details for this project",
    name: "Tests",
    type: "default",
  },
  {
    question: "Please provide question details for this project",
    name: "Questions",
    type: "default",
  },
  {
    question: "Please provide details of the features for this project",
    name: "Features",
    type: "list",
  },
  {
    question:
      "Would you like a table of contents to be generated for this project?",
    name: "Table of Contents",
    type: "table-of-contents",
  },
];

// function to write README file
function writeToFile(fileName, data) {
}

// function to initialize program
function init() {

}

// function call to initialize program
init();
