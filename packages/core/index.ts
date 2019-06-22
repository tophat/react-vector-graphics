function capitalize(word: string) {
  return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;
}

function spinalToPascalCase(name: string) {
  const spinalRegex = /([a-z0-9]+)-?/g;
  return name.replace(spinalRegex, (_, spine) => capitalize(spine));
}

const ICON_FILENAME_REGEX = /^([a-z0-9-]+)(\.(\d+)x\d+)?\.icon\.svg$/;

interface IconDefinition {
  name: string;
  size: number;
  pascalCaseName: any;
  filename: string;
  contents: string;
}

function createIconDefinition(filename: string, contents: string) {
  const result = filename.match(ICON_FILENAME_REGEX);
  if (!result) {
    throw new Error("Does not match required pattern");
  }
  const [, name, , size] = result;
  return {
    filename: filename,
    name: name,
    size: size ? Number(size) : null,
    pascalCaseName: `${spinalToPascalCase(name)}Icon${size || ""}`,
    contents: contents
  };
}

const messages = Object.freeze({
  noSizePropComment: `Size of the icon using strings e.g. 'sm' or dims e.g. '18px'`,
  sizePropComment: `Fixed icon size, not to be passed when using this component`
});

function generateIconFile(icon: IconDefinition) {
  const size = icon.size && `${icon.size}px`;
  return `/* eslint-disable */
// THIS FILE IS AUTO-GENERATED - DO NOT EDIT

import PropTypes from 'prop-types'
import React from 'react'

import SVGIcon from '../../SVGIcon'
import iconHref from './${icon.filename}'

const ${icon.pascalCaseName} = props => <SVGIcon {...props} href={iconHref} ${
    size ? `size="${size}"` : ""
  }/>

${icon.pascalCaseName}.propTypes = {
    /** HTML class attribute */
    className: PropTypes.string,
    /** Mouse click identifier */
    clickId: PropTypes.string,
    /** Color of the icon used when icon can be tinted */
    color: PropTypes.string,
    /** ${icon.size ? messages.sizePropComment : messages.noSizePropComment} */
    size: PropTypes.string,
}

${icon.pascalCaseName}.defaultProps = {
    className: '',
    clickId: '',
    color: null,
    size: '${size || "md"}',
}

${icon.pascalCaseName}.displayName = '${icon.pascalCaseName}'

export default ${icon.pascalCaseName}
`;
}

function generateIconDocsFile(icon: IconDefinition) {
  const mdCodeTag = "```";
  return `<!-- THIS FILE IS AUTO-GENERATED - DO NOT EDIT -->
${mdCodeTag}js
// import { ${icon.pascalCaseName} } from '@thm/fe-icons'

<${icon.pascalCaseName} size="" />
${mdCodeTag}`;
}

export default function convert(filename: string, contents: string) {
  const iconDefinition = createIconDefinition(filename, contents);
  const iconFile = generateIconFile(iconDefinition);
  const iconDocs = generateIconDocsFile(iconDefinition);
  const folderize = (filename: string) =>
    `${iconDefinition.pascalCaseName}/${filename}`;
  return {
    [folderize("index.js")]: iconFile,
    [folderize("Readme.md")]: iconDocs,
    [folderize(iconDefinition.filename)]: iconDefinition.contents
  };
}
