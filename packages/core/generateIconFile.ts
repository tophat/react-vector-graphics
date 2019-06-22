import { IconDefinition } from "./iconDefinition";

const messages = Object.freeze({
  noSizePropComment: `Size of the icon using strings e.g. 'sm' or dims e.g. '18px'`,
  sizePropComment: `Fixed icon size, not to be passed when using this component`
});

export default function generateIconFile(icon: IconDefinition) {
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
