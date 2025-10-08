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
  private static instance: Dispatcher;

  constructor(props: PromisePortalActions) {
    super(props);
    Dispatcher.instance = this;
  }

  static showPortal = <P extends ComponentProps>(
    component: ComponentParam<P>,
    props?: P,
  ): ShowPortalResult => {
    return Dispatcher.instance.props.showPortal<P>(component, props);
  };

  static showPortalAsync = async <P extends ComponentProps, T>(
    component: ComponentParam<P>,
    props?: P,
  ): Promise<PromiseComponentResult<T>> => {
    return await Dispatcher.instance.props.showPortalAsync<P, T>(
      component,
      props,
    );
  };

  static clear = (predicate?: MatchPortalPredicate): void => {
    Dispatcher.instance.props.clear(predicate);
  };

  render(): ReactNode {
    return null;
  }
}

export default Dispatcher;
