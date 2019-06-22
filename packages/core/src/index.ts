import { createIconDefinition } from "./iconDefinition";
import generateDocsFile from "./generateDocsFile";
import generateIconFile from "./generateIconFile";

export default function convert(filename: string, contents: string) {
  const iconDefinition = createIconDefinition(filename, contents);
  const iconFile = generateIconFile(iconDefinition);
  const iconDocs = generateDocsFile(iconDefinition);
  const folderize = (filename: string) =>
    `${iconDefinition.pascalCaseName}/${filename}`;
  return {
    [folderize("index.js")]: iconFile,
    [folderize("Readme.md")]: iconDocs,
    [folderize(iconDefinition.filename)]: iconDefinition.contents
  };
}
