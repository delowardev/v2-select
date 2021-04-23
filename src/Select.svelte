<script lang="ts">
	import state from "./store";
	export let select: HTMLSelectElement;

	let value;


	state.subscribe(data => {
		value = data.value?.value || "";
	})

	/**
	 * Set initial value
	 */
	state.update(prevState => {
		const options: HTMLCollectionOf<HTMLOptionElement> = select.selectedOptions;
		const values = Array.from(options).map(({ value, text }) => ({value, text}));
		const value = {
			text: select.innerHTML,
			value: select.value
		};
		const multiple = select.multiple;
		return {
			...prevState,
			value,
			values,
			multiple
		}
	});

</script>

<main>
	<div class="select-v2">
		<input type="text" bind:value={value}>
	</div>
</main>

<style>

</style>