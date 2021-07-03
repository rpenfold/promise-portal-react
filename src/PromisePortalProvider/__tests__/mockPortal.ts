import React from "react";
import { Portal } from "../../types";

export default function getMockPortal(id: string) {
  return {
    id,
    Component: React.Component,
    open: true,
    onComplete: jest.fn(),
    onCancel: jest.fn(),
    onError: jest.fn(),
    onRequestClose: jest.fn(),
  } as Portal;
}
