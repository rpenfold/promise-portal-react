import React, { ErrorInfo } from "react";
import { Portal } from "../../types";
import { buildAwaitablePortal } from "../portalFactory";

describe("portalFactory", () => {
  describe("buildAwaitablePortal()", () => {
    const resolve = jest.fn();
    const reject = jest.fn();
    let mockInternalContext: any;
    let portal: Portal;

    beforeEach(() => {
      mockInternalContext = {
        removePortal: jest.fn(),
        requestClosePortal: jest.fn(),
        SetPortals: jest.fn(),
      };
      portal = buildAwaitablePortal(resolve, reject)(
        React.Component,
        {},
        mockInternalContext
      );
      resolve.mockReset();
      reject.mockReset();
    });

    describe("portal.onCancel()", () => {
      it("returns correct payload", () => {
        const mockPayload = { a: 1 };
        portal.onCancel(mockPayload);
        expect(resolve).toBeCalledWith({ cancelled: true, data: mockPayload });
      });

      it("removes portal", () => {
        portal.onCancel();
        expect(mockInternalContext.removePortal).toBeCalledWith(portal.id);
      });
    });

    describe("portal.onComplete()", () => {
      it("returns correct payload", () => {
        const mockPayload = { a: 1 };
        portal.onComplete(mockPayload);
        expect(resolve).toBeCalledWith({ cancelled: false, data: mockPayload });
      });

      it("removes portal", () => {
        portal.onComplete();
        expect(mockInternalContext.removePortal).toBeCalledWith(portal.id);
      });
    });

    describe("portal.onError()", () => {
      it("rejects promise", () => {
        portal.onError(new Error(), {} as ErrorInfo);
        expect(reject).toBeCalled();
      });

      it("removes portal", () => {
        portal.onError(new Error(), {} as ErrorInfo);
        expect(mockInternalContext.removePortal).toBeCalledWith(portal.id);
      });
    });

    describe("portal.onRequestClose()", () => {
      it("invokes requestClosePortal", () => {
        portal.onRequestClose();
        expect(mockInternalContext.requestClosePortal).toBeCalledWith(
          portal.id
        );
      });
    });
  });
});
