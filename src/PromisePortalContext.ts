import React from 'react';
import { PromisePortalActions } from './types';

export const defaultValue: PromisePortalActions = {
  showPortalAsync: () => new Promise((_resolve, reject) => reject('No provider found')),
  clear: () => new Promise((_resolve, reject) => reject('No provider found')),
};

const PromisePortalContext = React.createContext<PromisePortalActions>(defaultValue);

export default PromisePortalContext;
