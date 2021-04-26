import { get, writable } from 'svelte/store';
import type { State, SelectOption } from "./interface";

const defaultState: State = {
  value: "",
  values: [],
  options: [],
  multiple: false
};


function createStore(): {
  update: Function,
  subscribe: Function,
  setValue: Function,
  data: State
} {
  const store = writable(defaultState);
  const state = get(store);

  function setValue(value: String): void {
    if (state.value !== value) {
      store.update((prevState: State) => ({
        ...prevState,
        value
      }))
    }
  }

  function addOption(option: SelectOption) {
    const options = JSON.parse(JSON.stringify(state.options));
    options.push(option);
    store.update((prevState: State) => ({
      ...prevState,
      options
    }))
  }

  function addOptions(options_: SelectOption[], clean: false) {
    const options = clean ? [] : JSON.parse(JSON.stringify(state.options));
    options.push(...options_);
    store.update((prevState: State) => ({
      ...prevState,
      options
    }))
  }


  return {
    update: store.update,
    subscribe: store.subscribe,
    setValue,
    data: state as State
  }

}


export default createStore