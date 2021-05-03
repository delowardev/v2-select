<script lang="ts">
  
  import { createEventDispatcher } from "svelte";
  import clsx from "clsx";
  const dispatch = createEventDispatcher();
  
  export let search: string;
  export let multiple: boolean;
  // elem binding
  let elemSearch: HTMLSpanElement;
  
  
  export function focus() {
    if (elemSearch) {
      elemSearch.focus();
      elemSearch.removeEventListener("keydown", onDelete);
      elemSearch.addEventListener("keydown", onDelete);
    }
  }
  
  function _search(e) {
    dispatch('update', {
      value: e.target.textContent
    });
  }
  
  function onDelete(e) {
    let char = (typeof e !== 'undefined') ? e.keyCode : e.which
    if (char === 8 && !search) {
      dispatch('backspace');
    }
  }

</script>

<div class="v2select__search">
  <span
      on:input={_search}
      contenteditable="true"
      bind:this={elemSearch}
      bind:textContent={search}
      class={clsx('v2select__search-skeleton', {
        'v2select__is-multi': multiple,
        'v2select__is-single': !multiple,
    })}
  >{search}</span>
</div>


<style type="text/scss">
  @import "scss/search.scss";
</style>