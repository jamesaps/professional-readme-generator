import fs from "fs";
import path from "path";
import inquirer from "inquirer";

import generateMarkdown from "./utils/generateMarkdown.js";

const questionTypes = {
  title: 0,
  default: 1,
  list: 2,
  tableOfContents: 3,
  options: 4,
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
    type: questionTypes.options,
    optionType: "badge",
    choices: [
      {
        name: "Apache 2.0",
        image: "https://img.shields.io/badge/License-Apache_2.0-blue.svg",
        url: "https://opensource.org/licenses/Apache-2.0",
      },
      {
        name: "MIT",
        image: "https://img.shields.io/badge/License-MIT-yellow.svg",
        url: "https://opensource.org/licenses/MIT",
      },
      {
        name: "Unlicense",
        image: "https://img.shields.io/badge/license-Unlicense-blue.svg",
        url: "http://unlicense.org/",
      },
    ],
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
async function init() {
  const readmeSections = await generateReadmeSectionsFromQuestions();

  console.log(readmeSections);
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
      case questionTypes.options:
        answer = await askQuestion(question.question, "options", {
          choices: question.choices.map((choice) => choice.name),
        });

        const choice = question.choices.find(
          (choice) => choice.name === answer
        );

        section.markdown = generateMarkdown({
          type: question.optionType,
          name: question.name,
          choice,
        });

        if (question.name === "License") {
          sections.unshift(section);
        } else {
          sections.push(section);
        }
        break;
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

        if (listItems.length === 0) {
          console.log(
            `No values were provided to generate a ${question.name} section`
          );
          continue;
        }

        section.markdown = generateMarkdown({
          type: "list",
          name: question.name,
          listItems,
        });

        sections.push(section);
        break;
      case questionTypes.tableOfContents:
        if (sections.length === 0) {
          console.log(
            `There are no sections in your README to generate a ${question.name}`
          );
          continue;
        }

        const tableOfContentsSections = sections.map((section) => section.name);

        answer = await inquirer.prompt({
          type: "list",
          name: "answer",
          message: `Please select the section you want the ${question.name} to appear before`,
          choices: [...tableOfContentsSections, "[END]"],
        });

        section.markdown = generateMarkdown({
          type: "table-of-contents",
          name: question.name,
          sections: tableOfContentsSections,
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

  return sections.map((section) => section.markdown).join("\n");
}

// function to ask user a question
async function askQuestion(question, type = "default", options = {}) {
  if (type === "default") {
    const response = await inquirer.prompt({
      type: "input",
      name: "answer",
      message: question,
    });

    return response.answer;
  } else if (type === "options") {
    const response = await inquirer.prompt({
      type: "list",
      name: "answer",
      message: question,
      choices: options.choices,
    });

    return response.answer;
  }
}

// function call to initialize program
init();
