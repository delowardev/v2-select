import { get, writable } from 'svelte/store';
import type { State, SelectOption, StoreDaddy } from "./interface";

const _state: State = {
  value: "",
  values: [],
  options: [],
  multiple: false
};

export function createStore(): StoreDaddy {
  const store = writable(_state);

  function state(): State {
    return get(store); // always get latest value
  };

  function addOption(option: SelectOption) {
    const options = JSON.parse(JSON.stringify(state().options));
    options.push(option);
    store.update((prevState: State) => ({
      ...prevState,
      options
    }))
  }

  function addOptions(options_: SelectOption[], clean: false) {
    const options = clean ? [] : JSON.parse(JSON.stringify(state().options));
    options.push(...options_);
    store.update((prevState: State) => ({
      ...prevState,
      options
    }))
  }


  function setValue(value: String): void {
    if (state().value !== value) {
      store.update((prevState: State) => ({
        ...prevState,
        value
      }))
    }
  }

  function setValues(values: String[]) {
    store.update((prevState: State) => ({
      ...prevState,
      values
    }))
  }

  function setMultiple( multiple = true) {
    if(state().multiple !== multiple) {
      store.update((prevState: State) => ({
        ...prevState,
        multiple
      }))
    }
  }

  function appendValue(value) {
    const st = state();
    if (value) {
      const index = st.values.findIndex(v => v === value);
      const _values = st.values;
      if (index === -1) {
        _values.push(value);
        store.update((prevState: State) => ({
          ...prevState,
          values: _values
        }))
      }
    }
  }

  function clearByIndex(index) {
    const { values: _values } = state();
    const _value = _values[index];
    if (_value) {
      _values.splice(index, 1);
      store.update((prevState: State) => ({
        ...prevState,
        values: _values
      }))
    }
  }


  return {
    update: store.update,
    subscribe: store.subscribe,
    data: store,
    setValue,
    addOption,
    addOptions,
    setValues,
    setMultiple,
    appendValue,
    clearByIndex
  }

}