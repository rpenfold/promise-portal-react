import { type ShallowWrapper, shallow } from "enzyme";
import React, { type ComponentType } from "react";
import PromiseComponent, {
  type Props as InternalPromiseComponentProps,
} from "../PromiseComponent";
import type { Portal, PromiseComponentProps } from "../types";

class MockComponent extends React.Component {}
type Wrapper = ShallowWrapper<
  InternalPromiseComponentProps,
  null,
  PromiseComponent
>;
interface PropsFactoryInput {
  index?: number;
  data?: Partial<Portal>;
}

const getProps = ({
  index = 0,
  data = {},
}: PropsFactoryInput = {}): InternalPromiseComponentProps => ({
  data: {
    Component: MockComponent as ComponentType<PromiseComponentProps>,
    onCancel: jest.fn(),
    onComplete: jest.fn(),
    onError: jest.fn(),
    onRequestClose: jest.fn(),
    id: "123",
    open: true,
    forceShow: false,
    ...data,
  },
  index,
});

describe("<PromiseComponent/>", () => {
  let props: InternalPromiseComponentProps;
  let wrapper: Wrapper;

  beforeEach(() => {
    props = getProps();
    wrapper = shallow(<PromiseComponent {...props} />);
  });

  describe("render", () => {
    it("does not render null", () => {
      expect(wrapper.isEmptyRender()).toBe(false);
    });

    it("renders nothing if not at bottom of stack", () => {
      wrapper.setProps({ index: 1 });
      expect(wrapper.isEmptyRender()).toBe(true);
    });

    it("renders nothing if there was an error", () => {
      wrapper.setState({ hasErrors: true });
      expect(wrapper.isEmptyRender()).toBe(true);
    });

    it("renders if not at the bottom of the stack but is force shown", () => {
      props = getProps({ index: 1, data: { forceShow: true } });
      wrapper.setProps(props);
      expect(wrapper.isEmptyRender()).toBe(false);
    });
  });

  describe("instance.componentDidCatch", () => {
    it("invokes onError callback", () => {
      const error = new Error("mock_error");
      wrapper.simulateError(error);
      expect(props.data.onError).toBeCalledWith(error, expect.anything());
    });

    it("sets state.hasErrors to be true", () => {
      wrapper.simulateError(new Error());
      expect(wrapper.state("hasErrors")).toBe(true);
    });

    it("does not render after error is caught", () => {
      wrapper.simulateError(new Error());
      expect(wrapper.isEmptyRender()).toBe(true);
    });
  });
});
