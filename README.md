*Looking for live preview? Go here --> [https://v2-select.vercel.app/](https://v2-select.vercel.app/)*


### How to use?

```javascript

    const select = document.querySelector("select");
    const options = {};

    SelectV2(select, options);

```


### Default Options

```javascript
const defaultOptions = {
    classes: {
      container: "",
      controls: "",
      dropdownRoot: "",
      dropdown: ""
    },
    placeholder: "Select",
    search: true,
    noResultsText: "No options found!",
    renderOption: null, // or (option_text) => option_text
    renderValue: null, // or (value) => value
    clearable: true
  }
```