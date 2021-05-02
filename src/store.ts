import { get, writable } from 'svelte/store';
import type { State, SelectOption, StoreDaddy } from "./interface";

const _state: State = {
  search: "",
  value: "",
  values: [],
  options: [],
  multiple: false
};

export function createStore(): StoreDaddy {
  const store = writable(_state);

  /**
   * Store Getter
   */

  function state(): State {
    return get(store); // always get latest value
  };

  function getFilteredOptions() {
    const { values, options, search } = state();
    return options.filter(option => {
      if (values.includes(option.value)) {
        return false;
      }

      if (!option.value.toLowerCase().trim().startsWith(search.toLowerCase().trim())) {
        return false;
      }

      return true;
    });
  }


  /**
   * Store Mutation/Setter
   */

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


  function setValue(value: string): void {
    if (state().value !== value) {
      store.update((prevState: State) => ({
        ...prevState,
        value,
        values: []
      }))
    }
  }

  function setValues(values: string[]) {
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
    const { values } = state();
    if (values[index]) {
      values.splice(index, 1);
      store.update((prevState: State) => ({
        ...prevState,
        values
      }))
    }
  }

  function clearValues() {
    store.update((prevState: State) => ({
      ...prevState,
      value: "",
      values: []
    }))
  }

  function setSearch(value) {
    store.update((prevState: State) => ({
      ...prevState,
      search: value
    }))
  }

  function backspace() {
    const { values } = state();

    values.pop();

    store.update((prevState: State) => ({
      ...prevState,
      values,
      value: ""
    }))


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
    clearByIndex,
    getFilteredOptions,
    clearValues,
    setSearch,
    backspace
  }

}