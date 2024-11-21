import Card, { type CardProps } from './exports/Card.svelte';
import CardHeader, { type CardHeaderProps } from './exports/CardHeader.svelte';
import CardBody, { type CardBodyProps } from './exports/CardBody.svelte';
import CardFooter, { type CardFooterProps } from './exports/CardFooter.svelte';
import { card, type CardVariantProps } from './styles';

export {
    // components
    Card as Root,
    CardHeader as Header,
    CardBody as Body,
    CardFooter as Footer,
    type CardProps,
    type CardHeaderProps,
    type CardBodyProps,
    type CardFooterProps,
    // styles
    card,
    type CardVariantProps
};
