import fs from 'node:fs';
import path from 'node:path';
import plist from 'plist';
import { v4 as uuid } from 'uuid';

const convert = (variant) => {
  const dir = `${path.dirname(process.argv[1])}/../themes/`;
  const vscodeTheme = JSON.parse(
    fs.readFileSync(
      `${dir}/gruvbox-material-flat-${variant}-color-theme.json`,
      'utf8',
    ),
  );
  const { name, colors, tokenColors } = vscodeTheme;
  const tmTheme = plist.build({
    author: 'greg',
    uuid: uuid(),
    name: name.replace(' Flat', ''),
    semanticClass: `theme.${variant}.gruvbox-material-${variant}`,
    colorSpaceName: 'sRGB',
    settings: [
      {
        settings: {
          // used by bat
          background: colors['editor.background'],
          foreground: colors['editor.foreground'],
          gutterForeground: colors['editorLineNumber.foreground'],
          // not used
          caret: colors['editorCursor.foreground'],
          selection: colors['editor.selectionBackground'],
          lineHighlight: colors['editor.lineHighlightBackground'],
          findHighlight: colors['editor.findMatchHighlightBackground'],
        },
      },
      ...tokenColors.map((tokenColor) => {
        return {
          ...tokenColor,
          scope: tokenColor.scope
            ? Array.isArray(tokenColor.scope)
              ? tokenColor.scope.join(', ')
              : tokenColor.scope
            : undefined,
        };
      }),
    ],
  });
  fs.writeFileSync(`${dir}/gruvbox-material-${variant}.tmTheme`, tmTheme);
};

for (const variant of ['dark', 'light']) {
  convert(variant);
}
