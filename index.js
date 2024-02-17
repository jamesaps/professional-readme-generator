import fs from "fs";
import path from "path";
import inquirer from "inquirer";

import generateMarkdown from "./utils/generateMarkdown.js";

const questionTypes = {
  title: 0,
  default: 1,
  list: 2,
  tableOfContents: 3,
};

// array of questions for user
const questions = [
  {
    question: "Please provide the title for this project",
    name: "Title",
    type: questionTypes.title,
  },
  {
    question: "Please provide a description of this project",
    name: "Description",
    type: questionTypes.default,
  },
  {
    question: "Please provide installation details for this project",
    name: "Installation",
    type: questionTypes.default,
  },
  {
    question: "Please provide license details for this project",
    name: "License",
    type: questionTypes.default,
  },
  {
    question: "Please provide contribution details for this project",
    name: "Contributing",
    type: questionTypes.default,
  },
  {
    question: "Please provide test details for this project",
    name: "Tests",
    type: questionTypes.default,
  },
  {
    question: "Please provide question details for this project",
    name: "Questions",
    type: questionTypes.default,
  },
  {
    question: "Please provide details of the features for this project",
    listQuestion: "Enter a feature",
    name: "Features",
    type: questionTypes.list,
  },
  {
    // question:
    //   "Would you like a table of contents to be generated for this project?",
    name: "Table of Contents",
    type: questionTypes.tableOfContents,
  },
];

// function to write README file
function writeToFile(fileName, data) {}

// function to initialize program
function init() {
  const readmeSections = generateReadmeSectionsFromQuestions();
}

// function to create readme sections from the answers provided from questions asked
async function generateReadmeSectionsFromQuestions() {
  const sections = [];

  // loop through questions
  for (const question of questions) {
    const section = { name: question.name };
    let answer;

    const includeSection = await inquirer.prompt({
      type: "confirm",
      name: "answer",
      message: `Would you like the README to have a ${question.name} section?`,
    });

    if (!includeSection.answer) {
      continue;
    }

    switch (question.type) {
      case questionTypes.list:
        const listItems = [];

        // Ask initial question without prompting user to respond
        console.log(question.question);

        while (
          (answer = await askQuestion(
            `${question.listQuestion}. Type "done" when you're finished`
          )) !== "done"
        ) {
          listItems.push(answer);
        }
        break;
      case questionTypes.tableOfContents:
        answer = await inquirer.prompt({
          type: "list",
          name: "answer",
          message: `Please select the section you want the ${question.name} to appear before`,
          choices: [...sections.map((section) => section.name), "[END]"],
        });

        if (answer.answer === "[END]") {
          sections.push(section);
        } else {
          const indexToInsertAt = sections.findIndex(
            (section) => section.name === answer.answer
          );

          sections.splice(indexToInsertAt, 0, section);
        }

        break;
      case questionTypes.title:
        answer = await askQuestion(question.question);

        section.markdown = generateMarkdown({
          type: "title",
          name: question.name,
          content: answer,
        });

        sections.push(section);

        break;
      case questionTypes.default:
      default:
        answer = await askQuestion(question.question);

        section.markdown = generateMarkdown({
          type: "default",
          name: question.name,
          content: answer,
        });

        sections.push(section);

        break;
    }
  }
}

// function to ask user a question
async function askQuestion(question) {
  const response = await inquirer.prompt({
    type: "input",
    name: "answer",
    message: question,
  });

  return response.answer;
}

// function call to initialize program
init();
