*Looking for live preview? Go here --> [https://v2-select.vercel.app/](https://v2-select.vercel.app/)*


### How to use?

```javascript
    const selectInstance = SelectV2(document.querySelector("select"), {});
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
    renderOption: null,
    renderValue: null,
    clearable: true,
    callback: {
        onBeforeOpen: null,
        onOpen: null,
        onBeforeClose: null,
        onClose: null,
        onBeforeChange: null,
        onChange: null,
        onFocus: null,
        onBlur: null,
        // keyboard
        onKeyDown: null,
        onKeyUp: null,
        onKeyPress: null,
        // scroll
        onMenuScrollTop: null,
        onMenuScrollEnd: null
    }
}
```

### Methods

```typescript

const selectInstance = SelectV2(element, options);

// using select.methods
const {
    open,
    close,
    toggle,
    focus,
    blur,
    select,
    clearByIndex,
    clear
} = selectInstance.methods;

// or access directly
selectInstance.__open,
selectInstance.__close,
selectInstance.__toggle,
selectInstance.__focus,
selectInstance.__blur,
selectInstance.__select,
selectInstance.__clearByIndex,
selectInstance.__clear

// Example
selectInstance.methods.clearByIndex(2)
selectInstance.__clearByIndex(2)

// Method interface
interface Methods {
    focus: () => boolean;
    blur: () => boolean;
    toggle: () => boolean;
    close: () => boolean;
    open: () => boolean;
    select: ( value: string ) => boolean;
    clearByIndex: ( index: number ) => boolean;
    clear: () => void;
}

```