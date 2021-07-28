import React, { Component, ErrorInfo, ReactNode } from "react";
import { Portal } from "./types";

export interface Props {
  index: number;
  data: Portal;
}

interface State {
  hasErrors: boolean;
}

class PromiseComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasErrors: false,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const { onError } = this.props.data;
    this.setState({ hasErrors: true }, () => {
      onError(error, info);
    });
  }

  render(): ReactNode {
    const {
      data: {
        Component,
        forceShow,
        forwardRef,
        open,
        props,
        onCancel,
        onComplete,
        onRequestClose,
      },
      index,
    } = this.props;
    const { hasErrors } = this.state;

    if (hasErrors || (index > 0 && !forceShow)) return null;

    return (
      <Component
        {...props}
        cancel={onCancel}
        complete={onComplete}
        open={open}
        requestClose={onRequestClose}
        ref={forwardRef}
      />
    );
  }
}

export default PromiseComponent;
