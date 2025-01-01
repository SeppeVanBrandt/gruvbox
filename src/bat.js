import fs from 'node:fs';
import path from 'node:path';
import plist from 'plist';
import { v4 as uuid } from 'uuid';

const findEditorColor = (colors, fieldNames) => {
  for (const field of fieldNames) {
    if (Object.prototype.hasOwnProperty.call(colors, field)) {
      return colors[field];
    }
    continue;
  }
  return '';
};

function convertTokenColorScopeForSublime(tokenColor) {
  if (tokenColor.scope == null || tokenColor.scope === '') {
    return { ...tokenColor };
  }

  return {
    ...tokenColor,
    scope: Array.isArray(tokenColor.scope)
      ? tokenColor.scope.join(', ')
      : tokenColor.scope,
  };
}

const root = path.dirname(path.dirname(process.argv[1]));

const theme = JSON.parse(
  fs.readFileSync(
    root + '/themes/gruvbox-material-flat-dark-color-theme.json',
    'utf8'
  )
);
const { name, author = '', type, colors, tokenColors } = theme;

const sublimePlist = {
  name: name,
  settings: [
    {
      settings: {
        accent: findEditorColor(colors, ['list.highlightForeground']),
        background: findEditorColor(colors, ['editor.background']),
        caret: findEditorColor(colors, [
          'editorCursor.background',
          'editor.foreground',
        ]),
        foreground: findEditorColor(colors, ['editor.foreground']),
        lineHighlight: findEditorColor(colors, [
          'editor.lineHighlightBackground',
        ]),
        selection: findEditorColor(colors, ['editor.selectionBackground']),
        activeGuide: findEditorColor(colors, ['editorIndentGuide.background']),
        findHighlight: findEditorColor(colors, [
          'editor.findMatchHighlightBackground',
        ]),
        misspelling: findEditorColor(colors, ['editorError.foreground']),
      },
    },
    ...tokenColors.map(convertTokenColorScopeForSublime),
  ],
  uuid: uuid(),
  colorSpaceName: 'sRGB',
  semanticClass: `theme.${type}.${name.replace(/\s+/g, '-').toLowerCase()}`,
  author,
  comment: '',
};

fs.writeFileSync(
  root + '/gruvbox-material-dark.tmTheme',
  plist.build(sublimePlist)
);
