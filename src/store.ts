import { get, writable } from 'svelte/store';
import type {OptionBase, Options, StoreDaddy} from "./interface";

export function createStore(): StoreDaddy {
  
  const search = writable("");
  const value = writable("");
  const values = writable([]);
  const options = writable([]);
  const focusedOption = writable("");

  /**
   * Store Mutation/Setter
   */

  
  function addOption(_opt: OptionBase) {
    const opt = get(options).slice();
    opt.push(_opt);
    options.update(() => opt);
    
  }

  function addOptions(_opt: Options, clean: false) {
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
  
  function setFocusedOption( v: string ) {
    value.update(() => v)
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

  function setSearch(s: string) {
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
    setFocusedOption,
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
    options,
    focusedOption
  }

}
