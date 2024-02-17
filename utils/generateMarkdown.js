// function to generate markdown for README
function generateMarkdown(data) {
  let markdown = "";

  // create heading with heading ID
  switch (data.type) {
    // titles use a H1 tag
    case "title":
      markdown += `# ${data.content} {#${convertStringToId(data.name)}}\n`;
      break;
    case "badge":
      // badges have no heading
      break;
    // all other sections use a H2 tag
    default:
      markdown += `## ${data.name} {#${convertStringToId(data.name)}}\n\n`;
      break;
  }

  switch (data.type) {
    case "title":
      // titles have no content (only headings as generated above)
      break;
    case "badge":
      markdown += `[![${data.name}](${data.choice.image})](${data.choice.url})\n`;
      break;
    case "list":
      for (const listItem of data.listItems) {
        markdown += ` - ${listItem}\n`;
      }
      break;
    case "table-of-contents":
      for (const section of data.sections) {
        markdown += `\t * [${section}](#${convertStringToId(section)})\n`;
      }
      break;
    case "default":
    default:
      markdown += `${data.content}\n`;
      break;
  }

  return markdown;
}

function convertStringToId(string) {
  return string.replaceAll(" ", "-").toLowerCase();
}

export default generateMarkdown;
