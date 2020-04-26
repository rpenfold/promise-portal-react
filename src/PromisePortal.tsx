import React, { ErrorInfo, PureComponent, ReactType, ReactNode } from "react";
import { PromisePortalProps as Props, PromiseComponentConfig, PromiseComponentResult } from "./types";
import PromiseComponent from "./PromiseComponent";
import ComponentRegistry from "./ComponentRegistry";

interface State {
  componentKeys: Array<string>;
}

interface PromiseComponentInfo {
  resolve(result: PromiseComponentResult): void;
  reject(result: PromiseComponentResult): void;
}

export interface PromisePortalComponent extends PromiseComponentConfig {
  Component: ReactType;
  promiseInfo: PromiseComponentInfo;
}

class PromisePortal extends PureComponent<Props, State> {
  static instance: PromisePortal | undefined;

  static show = (component: ReactType | string, config = {}): Promise<PromiseComponentResult> => {
    const portal = PromisePortal.instance;
    
    if (!portal) {
      throw Error("PromisePortal not found");
    }

    const Component = typeof component === "string"
      ? ComponentRegistry.find(component)
      : component;

    if (!Component) {
      throw Error("Component not found");
    }

    return new Promise((resolve, reject) => {
      const key = Date.now().toString();
      const component: PromisePortalComponent = {
        ...config,
        Component,
        promiseInfo: { resolve, reject }
      };
      portal.pushComponent(key, component);
    });
  };

  private components: Record<string, PromisePortalComponent>;

  constructor(props: Props) {
    super(props);
    this.components = {};
    this.state = {
      componentKeys: []
    };

    PromisePortal.instance = this;
  }

  handleCancel = (key: string): void => {
    const { promiseInfo } = this.components[key];
    promiseInfo.resolve({ cancelled: true });
    this.removeComponent(key);
  };

  handleComplete = (key: string, data: object): void => {
    const { promiseInfo } = this.components[key];
    promiseInfo.resolve({ cancelled: false, data });
    this.removeComponent(key);
  };

  handleError = (key: string, error: Error, errorInfo: ErrorInfo): void => {
    const { promiseInfo } = this.components[key];
    promiseInfo.reject({ cancelled: false, error, errorInfo });
  };

  pushComponent = (key: string, component: PromisePortalComponent): void => {
    const { componentKeys } = this.state;
    this.components[key] = component;
    this.setState({ componentKeys: [key, ...componentKeys] });
  };

  removeComponent = (key: string): void => {
    const { componentKeys } = this.state;
    delete this.components[key];
    this.setState({
      componentKeys: componentKeys.filter(x => x !== key)
    });
  };

  render(): ReactNode {
    const { componentKeys } = this.state;

    return componentKeys.map((key, index) => {
      const componentData = this.components[key];

      return (
        <PromiseComponent
          key={key}
          componentKey={key}
          index={index}
          data={componentData}
          onCancel={this.handleCancel}
          onComplete={this.handleComplete}
          onError={this.handleError}
        />
      );
    });
  }
}

export default PromisePortal;
