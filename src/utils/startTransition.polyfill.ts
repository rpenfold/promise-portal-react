/**
 * `React.startTransition` was introduced in v18. If it's available then we can use it.
 * Otherwise we just ignore it.
 */

// @ts-expect-error startTransition may not exist on React in older versions
import { startTransition } from "react";

export default startTransition ?? ((fn: () => void) => fn());
