/**
 * `React.startTransition` was introduced in v18. If it's available then we can use it.
 * Otherwise we just ignore it.
 */

/* @ts-ignore */ // eslint-disable-line @typescript-eslint/ban-ts-comment
import { startTransition } from 'react';

export default startTransition ?? ((fn: () => void) => fn());
