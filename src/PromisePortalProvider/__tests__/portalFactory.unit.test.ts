import React, { ErrorInfo, RefObject } from "react";
import { ProviderInternalContext } from "../types";
import { Portal } from "../../types";
import { buildPortal, buildAwaitablePortal } from "../portalFactory";

describe("portalFactory", () => {
  describe("buildAwaitablePortal()", () => {
    const resolve = jest.fn();
    const reject = jest.fn();
    let mockInternalContext: ProviderInternalContext;
    let portal: Portal;

    beforeEach(() => {
      mockInternalContext = {
        removePortal: jest.fn(),
        requestClosePortal: jest.fn(),
        setPortals: jest.fn(),
      };
      portal = buildAwaitablePortal(resolve, reject)(
        React.Component,
        {},
        mockInternalContext,
      );
      resolve.mockReset();
      reject.mockReset();
    });

    it("uses key prop for id if provided", () => {
      const mockKey = "some_key";
      portal = buildAwaitablePortal(resolve, reject)(
        React.Component,
        { key: mockKey },
        mockInternalContext,
      );
      expect(portal.id).toEqual(mockKey);
    });

    describe("portal.onCancel()", () => {
      it("returns correct payload", () => {
        const mockPayload = { a: 1 };
        portal.onCancel(mockPayload);
        expect(resolve).toHaveBeenCalledWith({
          cancelled: true,
          data: mockPayload,
        });
      });

      it("removes portal", () => {
        portal.onCancel();
        expect(mockInternalContext.removePortal).toHaveBeenCalledWith(
          portal.id,
        );
      });
    });

    describe("portal.onComplete()", () => {
      it("returns correct payload", () => {
        const mockPayload = { a: 1 };
        portal.onComplete(mockPayload);
        expect(resolve).toHaveBeenCalledWith({
          cancelled: false,
          data: mockPayload,
        });
      });

      it("removes portal", () => {
        portal.onComplete();
        expect(mockInternalContext.removePortal).toHaveBeenCalledWith(
          portal.id,
        );
      });
    });

    describe("portal.onError()", () => {
      it("rejects promise", () => {
        portal.onError(new Error(), {} as ErrorInfo);
        expect(reject).toHaveBeenCalled();
      });

      it("removes portal", () => {
        portal.onError(new Error(), {} as ErrorInfo);
        expect(mockInternalContext.removePortal).toHaveBeenCalledWith(
          portal.id,
        );
      });
    });

    describe("portal.onRequestClose()", () => {
      it("invokes requestClosePortal", () => {
        portal.onRequestClose();
        expect(mockInternalContext.requestClosePortal).toHaveBeenCalledWith(
          portal.id,
        );
      });
    });
  });

  describe("buildPortal()", () => {
    const forwardRef = {} as RefObject<unknown>;
    let mockInternalContext: ProviderInternalContext;
    let portal: Portal;

    beforeEach(() => {
      mockInternalContext = {
        removePortal: jest.fn(),
        requestClosePortal: jest.fn(),
        setPortals: jest.fn(),
      };
      portal = buildPortal(forwardRef)(
        React.Component,
        {},
        mockInternalContext,
      );
    });

    it("uses key prop for id if provided", () => {
      const mockKey = "some_key";
      portal = buildPortal(forwardRef)(
        React.Component,
        { key: mockKey },
        mockInternalContext,
      );
      expect(portal.id).toEqual(mockKey);
    });

    describe("portal.onCancel()", () => {
      it("removes portal", () => {
        portal.onCancel();
        expect(mockInternalContext.removePortal).toHaveBeenCalledWith(
          portal.id,
        );
      });
    });

    describe("portal.onComplete()", () => {
      it("removes portal", () => {
        portal.onComplete();
        expect(mockInternalContext.removePortal).toHaveBeenCalledWith(
          portal.id,
        );
      });
    });

    describe("portal.onError()", () => {
      it("throws error", () => {
        const mockError = new Error();
        expect(() => portal.onError(mockError, {} as ErrorInfo)).toThrow(
          mockError,
        );
      });

      it("removes portal", () => {
        expect(() => portal.onError(new Error(), {} as ErrorInfo)).toThrow();
        expect(mockInternalContext.removePortal).toHaveBeenCalledWith(
          portal.id,
        );
      });
    });

    describe("portal.onRequestClose()", () => {
      it("invokes requestClosePortal", () => {
        portal.onRequestClose();
        expect(mockInternalContext.requestClosePortal).toHaveBeenCalledWith(
          portal.id,
        );
      });
    });
  });
});
