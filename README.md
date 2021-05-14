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

## Referencing
Once a JSelect has been istantiated, it can be references through the global `window.JSELECT_INSTANCES`.
It is a key-value dictionary, so structured:

* the key is the JSelect INSTANCE's `name`. It's the value of the `name` attribute in the `<select>` tag, or, if that attribute was empty or not provided, the UNIX timestamp at the time the JSelect was istantiated.

* the value is the JSelect object.

For example, a JSelect with `name` = `regions`, can be referenced through:

```javascript
var regionsSelect = window.JSELECT_INSTANCES["regions"];
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

## Events
Plugin provides custom events to intercept changes either in structure or in value.

| event name | description |
| ---------- | ---------------- |
| `jselect-create` | let the DOM know that a INSTANCE of JSelect has been created |
| `jselect-change` | user has changed the value (selected or deselected some options) |
| `jselect-reload` | component's properties has changed (by JavaScript) thus, component should reload |

## Languages
At the time I'm writing this document, there are only Italian (`it`) and English (`en`) available.<br/>
I don't use automatic translators. I prefer filling only languages that I know.<br/>
Other translation can be easily added in the `/src/locales.js` file.<br/>
Remeber to use the correct ISO two-letter code. See <a href="https://www.loc.gov/standards/iso639-2/php/code_list.php">here</a>