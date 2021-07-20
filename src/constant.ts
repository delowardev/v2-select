import type { OptionProps } from "./interface";

export const defaultOptions: OptionProps = {
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
  placement: "bottom",
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
  }
}
