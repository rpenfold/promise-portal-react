import React from "react";
import { render, screen } from "@testing-library/react";
import PromiseComponent, {
  Props as InternalPromiseComponentProps,
} from "../PromiseComponent";
import { Portal } from "../types";

const MockComponent: React.FC = () => <div>mock</div>;

interface PropsFactoryInput {
  index?: number;
  data?: Partial<Portal>;
}

const getProps = ({
  index = 0,
  data = {},
}: PropsFactoryInput = {}): InternalPromiseComponentProps => ({
  data: {
    Component: MockComponent,
    onCancel: jest.fn(),
    onComplete: jest.fn(),
    onError: jest.fn(),
    onRequestClose: jest.fn(),
    id: "123",
    open: true,
    forceShow: false,
    props: {},
    ...data,
  },
  index,
});

describe("<PromiseComponent/>", () => {
  let props: InternalPromiseComponentProps;

  beforeEach(() => {
    props = getProps();
  });

  describe("render", () => {
    it("renders the component", () => {
      render(<PromiseComponent {...props} />);
      expect(screen.getByText("mock")).toBeTruthy();
    });

    it("renders nothing if not at bottom of stack", () => {
      render(<PromiseComponent {...props} index={1} />);
      expect(screen.queryByText("mock")).toBeNull();
    });

    it("renders if not at the bottom of the stack but is force shown", () => {
      props = getProps({ index: 1, data: { forceShow: true } });
      render(<PromiseComponent {...props} />);
      expect(screen.getByText("mock")).toBeTruthy();
    });
  });
});
