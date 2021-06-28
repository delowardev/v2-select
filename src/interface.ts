export interface OptionBase {
  text: string;
  value: string;
  disabled?: boolean;
  dataset?: DOMStringMap
}

export interface StoreDaddy {
  setValue: Function;
  addOption: Function;
  addOptions: Function;
  setValues: Function;
  // setMultiple: Function;
  appendValue: Function;
  clearByIndex: Function;
  clearValues: Function;
  setSearch: Function;
  backspace: Function;
  
  // writable
  search: any;
  value: any;
  values: any;
  options: any;
  // multiple: any
}
