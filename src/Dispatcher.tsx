import React, { PureComponent, ReactNode } from 'react';
import { ComponentParam, ComponentProps, PromisePortalActions, PromiseComponentResult } from 'types';

/**
 * Dispatcher is a utility that exposes promise-portal functionality to outside
 * React components.
 */
class Dispatcher extends PureComponent<PromisePortalActions> {
  private static instance: Dispatcher;

  static showPortalAsync = <T,>(
    component: ComponentParam,
    props: ComponentProps
  ): Promise<PromiseComponentResult<T>> => {
    return Dispatcher.instance.props.showPortalAsync<T>(component, props);
  }

  static clear = (): void => {
    Dispatcher.instance.props.clear();
  }

  render(): ReactNode {
    Dispatcher.instance = this;

    return <React.Fragment />;
  }
}

export default Dispatcher;
