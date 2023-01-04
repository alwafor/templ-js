import fs from "fs/promises";
import path from "path";
import { POSSIBLE_ARGS } from "./constants";
import { Args } from "./types";

interface IFileData {
  name: string;
  content: string;
}

function getArgsFromCLI() {
  const rawArgs = process.argv.slice(2);
  const args: Args = {};

  let isArgumentParsingNow = false;
  let argumentKey = "";

  for (let i = 0; i < rawArgs.length; ++i) {
    if (isArgumentParsingNow) {
      if (rawArgs[i].startsWith("-")) {
        console.error(`It's not possible to use template options as values`);
        process.exit();
      }
      args[argumentKey as keyof Args] = rawArgs[i];
      isArgumentParsingNow = false;
      continue;
    }
    if (POSSIBLE_ARGS.includes(rawArgs[i] as keyof Args)) {
      isArgumentParsingNow = true;
      argumentKey = rawArgs[i];
    }
  }

  if (isArgumentParsingNow) {
    console.error(`You have not provided value for ${argumentKey}!`);
    process.exit();
  }

  return args;
}

function executeOperation(args: Args) {
  if (args["--create"]) {
  }
}

async function main() {
  const args = getArgsFromCLI();
  const result = executeOperation(args);
}

async function oldMain() {
  const templateName = process.argv
    .slice(2)
    .find((s) => s.startsWith("--template="))
    ?.slice("--template=".length);

  if (!templateName) {
    console.error("Cannot find template with such name!");
    return;
  }

  const fileNameReplacer = process.argv
    .slice(2)
    .find((s) => s.startsWith("--filename="))
    ?.slice("--filename=".length);

  const templatesFolders = await fs.readdir(path.resolve("templates"));

  if (!templatesFolders.includes(templateName)) {
    console.error(`No such template with name ${templateName}`);
    return;
  }

  const fileNamesFromTemplate = await fs.readdir(
    path.resolve("templates", templateName)
  );
  const filesData: IFileData[] = [];

  for (const fileName of fileNamesFromTemplate) {
    let name = fileName,
      content = "";
    if (fileName.includes("$FILENAME")) {
      if (!fileNameReplacer) {
        console.error("$FILENAME was not provided!");
        process.exit(1);
      }
      name = fileName.replaceAll("$FILENAME", fileNameReplacer);
    }

    let fileContent = await fs.readFile(
      path.resolve("templates", templateName, fileName),
      "utf-8"
    );

    if (fileContent.includes("$FILENAME")) {
      if (!fileNameReplacer) {
        console.error("$FILENAME was not provided!");
        process.exit(1);
      }
      content = fileContent.replaceAll("$FILENAME", fileNameReplacer);
    }

    filesData.push({ name, content });
  }

  const outDirName = fileNameReplacer || "folder";

  await fs.mkdir(path.resolve(outDirName));
  for (const fileData of filesData) {
    fs.writeFile(
      path.resolve(outDirName, fileData.name),
      fileData.content,
      "utf-8"
    );
  }
}

main();
