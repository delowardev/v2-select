import type { SelectOption } from "./interface"

export function offClick (elementToCompare: HTMLElement, selector: any, callback: Function): void {
    if (!document) return;

    function clickEvent(e: MouseEvent) {
        const element = document.querySelector(selector);
        if ( element !== elementToCompare || element !== (<HTMLElement>e.target).closest(selector)) {
            e.preventDefault();
            callback && callback(e);
            document.removeEventListener("click", clickEvent);
        }
    }

    document.addEventListener("click" , clickEvent, false)
}

export function findText(options: SelectOption[], value: string): string {
    return options.find((option: SelectOption): boolean => option.value === value)?.text || "";
}

