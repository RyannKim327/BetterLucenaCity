import * as fs from "fs";
import * as path from "path";

const args = process.argv.slice(2);
const param = "--page=";

if (args[0]?.startsWith(param)) {
  const page = args[0].substring(param.length);

  if (!page) {
    console.error("Please provide a page.");
    process.exit(1);
  }

  const source = path.join(
    process.cwd(),
    "script/generator/templates",
    "page.tsx"
  );

  const directory = path.join(
    process.cwd(),
    "src",
    "app",
    page
  );

  const destination = path.join(
    directory,
    "page.tsx"
  );

  // Read template
  let template = fs.readFileSync(source, "utf-8");

  // Replace placeholders
  template = template
    .replaceAll("{{ FUNCTION_NAME }}", page[0].toUpperCase() + page.substring(1))
    .replaceAll("{{PAGE_NAME}}", page);

  // Create directory
  fs.mkdirSync(directory, { recursive: true });

  // Write generated file
  fs.writeFileSync(destination, template);

  console.log(`Successfully created page: ${page}`);
}
