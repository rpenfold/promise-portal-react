import React, { ErrorInfo } from "react";
import { PromisePortalComponent } from "./PromisePortal";

interface Props {
  componentKey: string;
  index: number;
  data: PromisePortalComponent;
  onError(key: string, error: Error, info: ErrorInfo): void;
  cancel(key: string): void;
  complete(key: string, data: object): void;
}

interface State {
  hasErrors: boolean;
}

class PromiseComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasErrors: false
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { componentKey, onError } = this.props;
    this.setState({ hasErrors: true }, () => {
      onError(componentKey, error, info);
    });
  }

  handleCancel = () => {
    const { cancel, componentKey } = this.props;
    cancel(componentKey);
  }

  handleComplete = () => {
    const { complete, componentKey, data } = this.props;
    complete(componentKey, data);
  }

  render() {
    const { data, index } = this.props;
    const { hasErrors } = this.state;

    if (hasErrors || !data || (index > 0 && !data.forceShow)) return null;

    const { Component, props } = data;

    return (
      <Component
        {...props}
        cancel={this.props.cancel}
        complete={this.props.complete}
      />
    );
  }
}

export default PromiseComponent;
