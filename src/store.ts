import { writable } from 'svelte/store';
import type {State} from "./interface";

const defaultState: State = {
  value: null,
  values: [],
  multiple: false
};

export default writable(defaultState)
