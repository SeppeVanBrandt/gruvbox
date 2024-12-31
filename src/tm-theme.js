import fs from "node:fs";
import { v4 as uuid } from "uuid";
import plist from "plist";

const findEditorColor = (colors, fieldNames) => {
  for (const field of fieldNames) {
    if (Object.prototype.hasOwnProperty.call(colors, field)) {
      return colors[field];
    }
    continue;
  }
  return "";
};

function convertTokenColorScopeForSublime(tokenColor) {
  if (tokenColor.scope == null || tokenColor.scope === "") {
    return { ...tokenColor };
  }

  return {
    ...tokenColor,
    scope: Array.isArray(tokenColor.scope)
      ? tokenColor.scope.join(", ")
      : tokenColor.scope,
  };
}

const theme = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const { name, author = "", type, colors, tokenColors } = theme;

const sublimePlist = {
  name: name,
  settings: [
    {
      settings: {
        accent: findEditorColor(colors, ["list.highlightForeground"]),
        background: findEditorColor(colors, ["editor.background"]),
        caret: findEditorColor(colors, [
          "editorCursor.background",
          "editor.foreground",
        ]),
        foreground: findEditorColor(colors, ["editor.foreground"]),
        lineHighlight: findEditorColor(colors, [
          "editor.lineHighlightBackground",
        ]),
        selection: findEditorColor(colors, ["editor.selectionBackground"]),
        activeGuide: findEditorColor(colors, ["editorIndentGuide.background"]),
        findHighlight: findEditorColor(colors, [
          "editor.findMatchHighlightBackground",
        ]),
        misspelling: findEditorColor(colors, ["editorError.foreground"]),
      },
    },
    ...tokenColors.map(convertTokenColorScopeForSublime),
  ],
  uuid: uuid(),
  colorSpaceName: "sRGB",
  semanticClass: `theme.${type}.${name.replace(/\s+/g, "-").toLowerCase()}`,
  author,
  comment: "",
};

fs.writeFileSync(process.argv[3], plist.build(sublimePlist));
