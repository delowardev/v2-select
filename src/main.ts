import App from './Select.svelte';

export function SelectV2(node: HTMLSelectElement, options = {}) {
	
	if (!node || node.tagName !== "SELECT") {
		throw new Error("Invalid argument!");
	}
	
	// node.style.display = "none";
	const div = document.createElement("div");
	node.parentNode.insertBefore(div, node);
	new App({
		target: div,
		props: {
			select: node,
			selectOptions: options
		}
	})
}

window["SelectV2"] = SelectV2;

const options = {
	classes: {
		container: "hello",
		dropdown: "",
		placeholder: ""
	},
	placeholder: "Seeeeelect...",
	search: true,
	noResultsText: "Noooooo!"
}

// dev preview
document.querySelectorAll("select").forEach(node => window["SelectV2"](node, options))