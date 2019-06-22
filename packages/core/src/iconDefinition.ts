const ICON_FILENAME_REGEX = /^([a-z0-9-]+)(\.(\d+)x\d+)?\.icon\.svg$/;

export interface IconDefinition {
  name: string;
  size?: number;
  pascalCaseName: string;
  filename: string;
  contents: string;
}

function capitalize(word: string) {
  return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;
}

function spinalToPascalCase(name: string) {
  const spinalRegex = /([a-z0-9]+)-?/g;
  return name.replace(spinalRegex, (_, spine) => capitalize(spine));
}

export function createIconDefinition(
  filename: string,
  contents: string
): IconDefinition {
  const result = filename.match(ICON_FILENAME_REGEX);
  if (!result) {
    throw new Error("Does not match required pattern");
  }
  const [, name, , size] = result;
  return {
    filename: filename,
    name: name,
    size: size ? Number(size) : undefined,
    pascalCaseName: `${spinalToPascalCase(name)}Icon${size || ""}`,
    contents: contents
  };
}
