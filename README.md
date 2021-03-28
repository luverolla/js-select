# JS Select

Pure JavaScript (VanillaJS) dropdown menu, with multiple select and searching support

## How to use
To use the select plugins, two main file must be included.
The stylesheet:
```html
<link rel="stylesheet" href="/js-select/dist/css/select.min.css" />
```
And the script file (inclusive of all language files)
```html
<script src="/js-select/dist/select.min.js"></script>
```
The component must follow this structure
```html
<select data-replace="jselect" data-locale="en" data-search="true" data-multiple="false" data-placeholder="Choose">
    <optgroup label="Group 1">
        <option value="loremIpsum" data-img="/path/to/img" data-desc="Lorem ipsum">Lorem ipsum</option>
        <!-- other options -->
    </optgroup>
    <option value="single" data-img="/path/to/img" data-desc="Single">Single</option>
    <!-- other options -->
</select>
```

## Options
Options for the `select` tag:

| attribute name | data type | description |
| -------------- | ----------| ----------- |
| `disabled` | `boolean` | tells if select is disabled |
| `data-locale` | `string` | lowercase two-letters ISO language code |
| `data-search` | `boolean` | tells if table should be searchable |
| `data-placeholder` | `string` | placeholder text |
| `data-multiple` | `boolean` | tells if user can choose multiple options |

Options for the `option` tag:

| attribute name | data type | description |
| -------------- | --------- | ----------- |
| `disabled` | `boolean` | tells if option is disabled |
| `selected` | `boolean` | tells if option is selected |
| `data-img` | `string` | image's path (shown at the left) |
| `data-desc` | `string` | option's description (shown at the bottom with muted text color)

## Languages
At the time I'm writing this document, there are only Italian (`it`) and English (`en`) available.<br/>
I don't use automatic translators. I prefer filling only languages that I know.<br/>
Other translation can be easily added in the `/src/locales.js` file.<br/>
Remeber to use the correct ISO two-letter code. See <a href="https://www.loc.gov/standards/iso639-2/php/code_list.php">here</a>