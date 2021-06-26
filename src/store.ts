import { get, writable } from 'svelte/store';
import type { SelectOption, StoreDaddy } from "./interface";

export function createStore(): StoreDaddy {
  
  const search = writable("");
  const value = writable("");
  const values = writable([]);
  const options = writable([]);
  // const multiple = writable(false);

  /**
   * Store Mutation/Setter
   */

  
  function addOption(_opt: SelectOption) {
    const opt = get(options).slice();
    opt.push(_opt);
    options.update(() => opt);
    
  }

  function addOptions(_opt: SelectOption[], clean: false) {
    const opt = clean ? [] : get(options).slice();
    opt.push(..._opt);
    options.update(() => opt);
  }


  function setValue(val: string): void {
    value.update(() => val);
  }

  function setValues(v: string[]) {
    values.update(() => v);
  }

  // function setMultiple( multi = true) {
  //   multiple.update(() => multi);
  // }

  function appendValue(value: string) {
    if (value) {
      const _values = get(values).slice();
      const index = _values.findIndex(item => item === value);
      if (index < 0) {
        _values.push(value);
        values.update(() => _values);
      }
    }
    
  }

  function clearByIndex(index) {
    const _values = get(values).slice();
    if (_values[index]) {
      _values.splice(index, 1);
      values.update(() => _values);
      return true
    }
    console.warn(`No element found at index ${index}`)
    return false
  }

  function clearValues() {
    values.update(() => []);
    value.update(() => "");
  }

  function setSearch(s) {
    search.update(() => s);
  }

  function backspace() {
    const _values = get(values).slice();
    _values.pop();
    values.update(() => _values);
  }


  return {
    setValue,
    addOption,
    addOptions,
    setValues,
    // setMultiple,
    appendValue,
    clearByIndex,
    clearValues,
    setSearch,
    backspace,
    
    // vals
    search,
    value,
    values,
    // multiple,
    options
  }

}