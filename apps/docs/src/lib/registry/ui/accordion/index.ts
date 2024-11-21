import Accordion, { type AccordionProps } from './exports/Accordion.svelte';
import AccordionContent, {
    type AccordionContentProps
} from './exports/AccordionContent.svelte';
import AccordionHeader, {
    type AccordionHeaderProps
} from './exports/AccordionHeader.svelte';
import AccordionItem, {
    type AccordionItemProps
} from './exports/AccordionItem.svelte';
import AccordionTrigger, {
    type AccordionTriggerProps
} from './exports/AccordionTrigger.svelte';
import {
    accordion,
    accordionItem,
    type AccordionVariantProps,
    type AccordionItemVariantProps
} from './styles';

export {
    // components
    Accordion as Root,
    Accordion,
    AccordionContent as Content,
    AccordionHeader as Header,
    AccordionItem as Item,
    AccordionTrigger as Trigger,
    type AccordionProps,
    type AccordionContentProps,
    type AccordionHeaderProps,
    type AccordionItemProps,
    type AccordionTriggerProps,
    // styles
    accordion,
    accordionItem,
    type AccordionVariantProps,
    type AccordionItemVariantProps
};
