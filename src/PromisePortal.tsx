import React, { ErrorInfo, PureComponent, ReactNode, ReactType } from "react";
import { PromiseComponentConfig } from "./types";
import PromiseComponent from "./PromiseComponent";
import ComponentRegistry from "./ComponentRegistry";

interface Props { };

interface State {
  componentKeys: Array<string>;
};

interface PromiseComponentInfo {
  resolve(result: object): void;
  reject(result: object): void;
}

export interface PromisePortalComponent extends PromiseComponentConfig {
  Component: ReactType;
  promiseInfo: PromiseComponentInfo;
}

class PromisePortal extends PureComponent<Props, State> {
  static instance: PromisePortal;

  static show = (component: ReactType | string, config = {}) => {
    if (!PromisePortal.instance) {
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
      PromisePortal.instance.pushComponent(key, component);
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

  pushComponent = (key: string, component: PromisePortalComponent) => {
    const { componentKeys } = this.state;
    this.components[key] = component;
    this.setState({ componentKeys: [key, ...componentKeys] });
  };

  handleCancel = (key: string) => {
    const { promiseInfo } = this.components[key];
    promiseInfo.resolve({ cancelled: true });
    this.removeComponent(key);
  };

  handleComplete = (key: string, data: object) => {
    const { promiseInfo } = this.components[key];
    promiseInfo.resolve({ data });
    this.removeComponent(key);
  };

  handleError = (key: string, error: Error, info: ErrorInfo) => {
    const { promiseInfo } = this.components[key];
    promiseInfo.reject({ key, error, info });
  };

  removeComponent = (key = "") => {
    const { componentKeys } = this.state;
    delete this.components[key];
    this.setState({
      componentKeys: componentKeys.filter(x => x !== key)
    });
  };

  render() {
    const { componentKeys } = this.state;

    return componentKeys.map((key, index) => {
      const componentData = this.components[key];

      return (
        <PromiseComponent
          key={key}
          componentKey={key}
          index={index}
          data={componentData}
          cancel={this.handleCancel}
          complete={this.handleComplete}
          onError={this.handleError}
        />
      );
    });
  }
}

export default PromisePortal;
