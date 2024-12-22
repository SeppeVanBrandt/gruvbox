package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/tidwall/gjson"
	"github.com/tidwall/sjson"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func main() {
	for _, variant := range [2]string{"dark", "light"} {
		theme := fmt.Sprintf(
			`{ "name": "Gruvbox Material Flat %s", "type": "%s" }`,
			cases.Title(language.English).String(variant),
			variant)

		templateDir := "./templates/" + variant + "/"

		colorsFile, err := os.ReadFile(templateDir + "colors.jsonc")
		if err != nil {
			panic(err)
		}
		colors := gjson.Get(string(colorsFile), "colors")

		theme, err = sjson.SetRaw(theme, "colors", colors.Raw)
		if err != nil {
			panic(err)
		}

		tokenColorsFile, err := os.ReadFile(templateDir + "token-colors-sainnhe.json")
		if err != nil {
			panic(err)
		}
		tokenColors := gjson.Get(string(tokenColorsFile), "tokenColors")

		theme, err = sjson.SetRaw(theme, "tokenColors", tokenColors.Raw)
		if err != nil {
			panic(err)
		}

		tokenColorsOverridesFile, err := os.ReadFile(templateDir + "token-colors-greg.json")
		if err != nil {
			panic(err)
		}
		tokenColorsOverrides := gjson.Get(string(tokenColorsOverridesFile), "tokenColors")

		tokenColorsOverrides.ForEach(func(key, value gjson.Result) bool {
			theme, err = sjson.SetRaw(theme, "tokenColors.-1", value.Raw)
			if err != nil {
				panic(err)
			}
			return true
		})

		theme = gjson.Get(theme, "@pretty").Raw

		paletteFile, err := os.ReadFile("./colors/" + variant + ".json")
		if err != nil {
			panic(err)
		}
		palette := gjson.Parse(string(paletteFile))

		palette.ForEach(func(key, value gjson.Result) bool {
			theme = strings.ReplaceAll(theme, "{{"+key.Str+"}}", value.Str)
			return true
		})

		if err := os.WriteFile(
			"../themes/gruvbox-material-flat-"+variant+"-color-theme.json", []byte(theme), 0644); err != nil {
			panic(err)
		}
	}
}
