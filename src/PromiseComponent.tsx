import React, { ErrorInfo } from "react";
import { PromisePortalComponent } from "./PromisePortal";

export interface Props {
  componentKey: string;
  index: number;
  data: PromisePortalComponent;
  onError(key: string, error: Error, info: ErrorInfo): void;
  onCancel(key: string): void;
  onComplete(key: string, data: object): void;
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
    const { onCancel, componentKey } = this.props;
    onCancel(componentKey);
  }

  handleComplete = () => {
    const { onComplete, componentKey, data } = this.props;
    onComplete(componentKey, data);
  }

  render() {
    const { data, index, onCancel, onComplete } = this.props;
    const { hasErrors } = this.state;

    if (hasErrors || (index > 0 && !data.forceShow)) return null;

    const { Component, props } = data;

    return (
      <Component
        {...props}
        cancel={onCancel}
        complete={onComplete}
      />
    );
  }
}

export default PromiseComponent;
