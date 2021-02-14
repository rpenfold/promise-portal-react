import React from 'react';
import { PromisePortalActions } from './types';

const PromisePortalContext = React.createContext<PromisePortalActions | null>(null);

export default PromisePortalContext;
