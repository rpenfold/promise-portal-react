import React from "react";
import { Portal } from "./types";

export interface Props {
  index: number;
  data: Portal;
}

const PromiseComponent: React.FC<Props> = ({ index, data }) => {
  const {
    Component,
    forceShow,
    forwardRef,
    open,
    props,
    onCancel,
    onComplete,
    onRequestClose,
  } = data;

  if (index > 0 && !forceShow) return null;

  const Comp = Component as React.ComponentType<any>;

  return (
    <Comp
      {...props}
      cancel={onCancel}
      complete={onComplete}
      open={open}
      requestClose={onRequestClose}
      ref={forwardRef}
    />
  );
};

export default PromiseComponent;
