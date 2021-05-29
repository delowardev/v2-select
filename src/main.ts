import App from './Select.svelte';

function SelectV2(node: HTMLSelectElement) {
	
	if (!node || node.tagName !== "SELECT") {
		throw new Error("Invalid argument!");
	}
	
	// node.style.display = "none";
	const div = document.createElement("div");
	node.parentNode.insertBefore(div, node);
	new App({
		target: div,
		props: {
			select: node
		}
	})
}

window["SelectV2"] = SelectV2;

// dev preview
document.querySelectorAll("select").forEach(node => window["SelectV2"](node))