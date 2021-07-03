import React, { Component, ReactNode } from "react";
import {
  ComponentParam,
  ComponentProps,
  PromisePortalActions,
  PromiseComponentResult,
} from "types";

/**
 * Dispatcher is a utility that exposes promise-portal functionality to outside
 * React components.
 *
 * @invariant singleton instance is always mounted as long as the provider is mounted
 */
class Dispatcher extends Component<PromisePortalActions> {
  private static instance: Dispatcher;

  constructor(props: PromisePortalActions) {
    super(props);
    Dispatcher.instance = this;
  }

  static showPortalAsync = async <T,>(
    component: ComponentParam,
    props?: ComponentProps
  ): Promise<PromiseComponentResult<T>> => {
    return await Dispatcher.instance.props.showPortalAsync<T>(component, props);
  };

  static clear = (): void => {
    Dispatcher.instance.props.clear();
  };

  render(): ReactNode {
    return null;
  }
}

export default Dispatcher;
