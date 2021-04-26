import { get, writable } from 'svelte/store';
import type { State } from "./interface";

const defaultState: State = {
  value: "",
  values: [],
  options: [],
  multiple: false
};

// export default writable(defaultState)


function createStore(): {
  update: Function,
  subscribe: Function,
  data: State
} {
  const store = writable(defaultState);

  console.log(store)


  return {
    update: store.update,
    subscribe: store.subscribe,
    data: get(store) as State
  }

}


export default createStore