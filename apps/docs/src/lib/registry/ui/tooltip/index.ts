import TooltipRoot, {
    type TooltipRootProps
} from './exports/TooltipRoot.svelte';
import TooltipContent, {
    type TooltipContentProps
} from './exports/TooltipContent.svelte';
import TooltipTrigger, {
    type TooltipTriggerProps
} from './exports/TooltipTrigger.svelte';
import { popover, type PopoverVariantProps } from './styles';
import { Tooltip } from 'bits-ui';

const { Provider } = Tooltip;

export {
    // components
    Provider,
    TooltipRoot,
    TooltipRoot as Root,
    TooltipContent as Content,
    TooltipTrigger as Trigger,
    type TooltipRootProps,
    type TooltipContentProps,
    type TooltipTriggerProps,
    // styles
    popover as tooltip,
    type PopoverVariantProps as TooltipVariantProps
};
