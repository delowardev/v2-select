import App from './Select.svelte';

export function SelectV2(node: HTMLSelectElement, options = {}) {
	
	if (!node || node.tagName !== "SELECT") {
		throw new Error("Invalid argument!");
	}
	
	// node.style.display = "none";
	const div = document.createElement("div");
	node.parentNode.insertBefore(div, node);
	return new App({
		target: div,
		props: {
			select: node,
			selectOptions: options
		}
	})
}

window["SelectV2"] = SelectV2;