import React from "react";
import { Portal, PortalComponentType } from "../../types";

export default function getMockPortal(
  id: string,
  componentName?: string
): Portal {
  class MockComponent extends React.Component {
    static displayName = componentName;
  }

  const portal = {
    id,
    Component: MockComponent as PortalComponentType,
    open: true,
    onComplete: jest.fn(),
    onCancel: jest.fn(),
    onError: jest.fn(),
    onRequestClose: jest.fn(),
  } as Portal;

  return portal;
}
