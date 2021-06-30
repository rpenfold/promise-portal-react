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
 */
class Dispatcher extends Component<PromisePortalActions> {
  private static instance: Dispatcher;

  constructor(props: PromisePortalActions) {
    super(props);
    Dispatcher.instance = this;
  }

  static showPortalAsync = <T,>(
    component: ComponentParam,
    props: ComponentProps
  ): Promise<PromiseComponentResult<T>> => {
    return Dispatcher.instance.props.showPortalAsync<T>(component, props);
  };

  static clear = (): void => {
    Dispatcher.instance.props.clear();
  };

  render(): ReactNode {
    if (!Dispatcher.instance) {
      Dispatcher.instance = this;
    }

    return <React.Fragment />;
  }
}

export default Dispatcher;
