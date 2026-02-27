import { Component, ReactNode } from "react";
import {
  ComponentParam,
  ComponentProps,
  PromisePortalActions,
  PromiseComponentResult,
  ShowPortalResult,
} from "types";
import { MatchPortalPredicate } from "./PromisePortalProvider/types";

/**
 * Dispatcher is a utility that exposes promise-portal functionality to outside
 * React components.
 *
 * @invariant singleton instance is always mounted as long as the provider is mounted
 */
class Dispatcher extends Component<PromisePortalActions> {
  private static instance: Dispatcher | undefined;
  private prevInstance: Dispatcher | undefined;

  constructor(props: PromisePortalActions) {
    super(props);
    this.prevInstance = Dispatcher.instance;
    Dispatcher.instance = this;
  }

  componentWillUnmount(): void {
    if (Dispatcher.instance === this) {
      Dispatcher.instance = this.prevInstance;
    }
  }

  private static ensureProviderMounted(): Dispatcher {
    const instance = Dispatcher.instance;
    if (!instance) {
      throw new Error("PromisePortal: no provider mounted. Wrap your app in <PromisePortalProvider>.");
    }
    return instance;
  }

  static showPortal = (
    component: ComponentParam,
    props?: ComponentProps
  ): ShowPortalResult => {
    const instance = Dispatcher.ensureProviderMounted();
    return instance.props.showPortal(component, props);
  };

  static showPortalAsync = async <T,>(
    component: ComponentParam,
    props?: ComponentProps
  ): Promise<PromiseComponentResult<T>> => {
    const instance = Dispatcher.ensureProviderMounted();
    return await instance.props.showPortalAsync<T>(component, props);
  };

  static clear = (predicate?: MatchPortalPredicate): void => {
    const instance = Dispatcher.ensureProviderMounted();
    instance.props.clear(predicate);
  };

  render(): ReactNode {
    return null;
  }
}

export default Dispatcher;
