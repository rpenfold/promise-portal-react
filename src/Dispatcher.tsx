import { Component, type ReactNode } from "react";
import type {
  ComponentParam,
  ComponentProps,
  DispatcherProps,
  PromiseComponentResult,
  PromisePortalActions,
  ShowPortalResult,
} from "types";
import type { MatchPortalPredicate } from "./PromisePortalProvider/types";

/**
 * Dispatcher is a utility that exposes promise-portal functionality to outside
 * React components. Tracks all mounted provider instances; "current" is the
 * most recently mounted. Unmount always restores current to a still-mounted
 * instance (no LIFO assumption).
 */
class Dispatcher extends Component<DispatcherProps> {
  private static instances: Dispatcher[] = [];
  private static registry = new Map<string, Dispatcher>();

  private static get current(): Dispatcher | undefined {
    const list = Dispatcher.instances;
    return list.length > 0 ? list[list.length - 1] : undefined;
  }

  constructor(props: DispatcherProps) {
    super(props);
    Dispatcher.instances.push(this);
    Dispatcher.registry.set(props.providerKey, this);
  }

  componentWillUnmount(): void {
    Dispatcher.instances = Dispatcher.instances.filter((d) => d !== this);
    Dispatcher.registry.delete(this.props.providerKey);
  }

  private getActions(): PromisePortalActions {
    return this.props;
  }

  private static ensureProviderMounted(providerKey?: string): Dispatcher {
    if (providerKey !== undefined && providerKey !== "") {
      const byKey = Dispatcher.registry.get(providerKey);
      if (!byKey) {
        throw new Error(
          `PromisePortal: no provider mounted for key "${providerKey}".`,
        );
      }
      if (!Dispatcher.instances.includes(byKey)) {
        throw new Error(
          `PromisePortal: provider for key "${providerKey}" is no longer mounted.`,
        );
      }
      return byKey;
    }
    const instance = Dispatcher.current;
    if (!instance) {
      throw new Error(
        "PromisePortal: no provider mounted. Wrap your app in <PromisePortalProvider>.",
      );
    }
    return instance;
  }

  static showPortal = (
    component: ComponentParam,
    props?: ComponentProps,
    options?: { providerKey?: string },
  ): ShowPortalResult => {
    const instance = Dispatcher.ensureProviderMounted(options?.providerKey);
    return instance.getActions().showPortal(component, props);
  };

  static showPortalAsync = async <T,>(
    component: ComponentParam,
    props?: ComponentProps,
    options?: { providerKey?: string },
  ): Promise<PromiseComponentResult<T>> => {
    const instance = Dispatcher.ensureProviderMounted(options?.providerKey);
    return await instance.getActions().showPortalAsync<T>(component, props);
  };

  static clear = (
    predicate?: MatchPortalPredicate,
    options?: { providerKey?: string },
  ): void => {
    const instance = Dispatcher.ensureProviderMounted(options?.providerKey);
    instance.getActions().clear(predicate);
  };

  render(): ReactNode {
    return null;
  }
}

export default Dispatcher;
