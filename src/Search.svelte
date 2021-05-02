<script lang="ts">

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let search: string;
    // elem binding
    let elemSearch: HTMLSpanElement;


    export function focus() {
        if (elemSearch) {
            elemSearch.focus();
        }
    }

    function _search(e) {
        dispatch('update', {
            value: e.target.textContent
        });
    }


</script>

<div class="v2select__search">
    <span
        on:input={_search}
        contenteditable="true"
        bind:this={elemSearch}
        bind:textContent={search}
        class="v2select__search-skeleton"
    >{search}</span>
</div>


<style type="text/scss">
  @import "scss/search.scss";
</style>