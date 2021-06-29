import React, { ErrorInfo } from 'react';
import getMockPortal from './mockPortal';
import {
  Portal,
} from "../../types";
import {
  buildPortal,
  clearPortals,
} from '../PromisePortalProvider';

describe('PromisePortalProvider', () => {
  describe('clearPortals()', () => {
    it('cancels each individual component', () => {
      const mockPortals = [getMockPortal(1), getMockPortal(2)];
      clearPortals(mockPortals)();

      mockPortals.forEach((portal: Portal) => expect(portal.onCancel).toBeCalled())
    });
  });

  describe('buildPortal()', () => {
    const resolve = jest.fn();
    const reject = jest.fn();
    let mockInternalContext: any;
    let portal: Portal;

    beforeEach(() => {
      mockInternalContext = {
        countRef: { current: 0 } as React.MutableRefObject<number>,
        removePortal: jest.fn(),
        requestClosePortal: jest.fn(),
        SetPortals: jest.fn(),
      };
      portal = buildPortal(resolve, reject)(1, React.Component, {}, mockInternalContext);
      resolve.mockReset();
      reject.mockReset();
    });

    describe('portal.onCancel()', () => {
      it('returns correct payload', () => {
        const mockPayload = { a: 1 };
        portal.onCancel(mockPayload);
        expect(resolve).toBeCalledWith({ cancelled: true, data: mockPayload });
      });

      it('removes portal', () => {
        portal.onCancel();
        expect(mockInternalContext.removePortal).toBeCalledWith(portal.id);
      });
    });

    describe('portal.onComplete()', () => {
      it('returns correct payload', () => {
        const mockPayload = { a: 1 };
        portal.onComplete(mockPayload);
        expect(resolve).toBeCalledWith({ cancelled: false, data: mockPayload });
      });

      it('removes portal', () => {
        portal.onComplete();
        expect(mockInternalContext.removePortal).toBeCalledWith(portal.id);
      });
    });

    describe('portal.onError()', () => {
      it('rejects promise', () => {
        portal.onError(new Error(), {} as ErrorInfo);
        expect(reject).toBeCalled();
      });

      it('removes portal', () => {
        portal.onError(new Error(), {} as ErrorInfo);
        expect(mockInternalContext.removePortal).toBeCalledWith(portal.id);
      });
    });

    describe('portal.onRequestClose()', () => {
      it('invokes requestClosePortal', () => {
        portal.onRequestClose();
        expect(mockInternalContext.requestClosePortal).toBeCalledWith(portal.id);
      });
    });
  });
});
