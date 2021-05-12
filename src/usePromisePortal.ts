import React from 'react';
import PromisePortalContext from './PromisePortalContext';
import { PromisePortalActions } from './types';

export default function usePromisePortal(): PromisePortalActions | null {
  return React.useContext<PromisePortalActions>(PromisePortalContext);
}
