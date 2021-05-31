import "./main";

export const options = {
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

export {}