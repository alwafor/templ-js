import fs from "fs/promises";
import path from "path";

export async function checkOrCreateTemplatesFolder() {
  const templatesFolderPath = path.resolve("/templates");
  try {
    await fs.opendir(templatesFolderPath);
  } catch (e) {
    console.log(e);
  }
}

export function createTemplateFromPath(pathToTemplate: string) {
  const absolutePathToTemplate = path.join(process.cwd(), pathToTemplate);
  path.basename;
}
