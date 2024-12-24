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

func read(path string) []byte {
	file, err := os.ReadFile(path)
	if err != nil {
		panic(err)
	}
	return file
}

func get(path string, prop string) gjson.Result {
	return gjson.Get(string(read(path)), prop)
}

func parse(path string) gjson.Result {
	return gjson.Parse(string(read(path)))
}

func set(target string, prop string, source string) string {
	result, err := sjson.SetRaw(target, prop, source)
	if err != nil {
		panic(err)
	}
	return result
}

func build(variant string) {
	theme := fmt.Sprintf(
		`{ "name": "Gruvbox Material Flat %s", "type": "%s" }`,
		cases.Title(language.English).String(variant),
		variant)
	dir := "./" + variant + "/"
	colors := get(dir+"colors.jsonc", "colors")
	theme = set(theme, "colors", colors.Raw)
	tokenColors := get(dir+"token-colors-sainnhe.json", "tokenColors")
	theme = set(theme, "tokenColors", tokenColors.Raw)
	overrides := get(dir+"token-colors-greg.json", "tokenColors")
	overrides.ForEach(func(key, value gjson.Result) bool {
		theme = set(theme, "tokenColors.-1", value.Raw)
		return true
	})
	palette := parse(dir + "palette.json")
	palette.ForEach(func(key, value gjson.Result) bool {
		theme = strings.ReplaceAll(theme, "{{"+key.Str+"}}", value.Str)
		return true
	})
	theme = gjson.Get(theme, "@pretty").Raw
	if err := os.WriteFile(
		"../themes/gruvbox-material-flat-"+variant+"-color-theme.json",
		[]byte(theme),
		0644,
	); err != nil {
		panic(err)
	}
}

func main() {
	for _, variant := range [2]string{"dark", "light"} {
		build(variant)
	}
}
