type ClickOutsideEvent = CustomEvent<{ sourceEvent: Event; }>;

type ClickOutsideOptions = {
    onEvent: (event: ClickOutsideEvent) => void;
    ignoredNodes?: HTMLElement[];
    once?: boolean;
};

export function clickOutside(node: HTMLElement, { onEvent, ignoredNodes, once }: ClickOutsideOptions) {
    
    function handleClick(event: Event) {
        const target = event.target as HTMLElement;
        if (!target) {
            return;
        }

        if (ignoredNodes) {
            for (const node of ignoredNodes) {
                if (node.contains(target)) {
                    return;
                }
            }
        }

        if (node && !event.defaultPrevented && !node.contains(target)) {
            if (once) {
                document.removeEventListener('click', handleClick, true);
            }

            onEvent(new CustomEvent('clickoutside', { detail: { sourceEvent: event } }));
        }
    };

    document.addEventListener('click', handleClick, true);

    return {
        update(options: ClickOutsideOptions) {
            onEvent = options.onEvent;
            ignoredNodes = options.ignoredNodes;
            once = options.once;
        },
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    };
};
