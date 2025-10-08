import React, { ReactNode } from "react";
import { ShowPortalResult } from "./types";
import usePromisePortal from "./usePromisePortal";

type CloseStrategy = "cancel" | "requestClose";

interface Props {
  closeStrategy?: CloseStrategy;
  children: ReactNode;
}

function Portal(props: Props) {
  const { children, closeStrategy = "cancel" } = props;
  const { showPortal } = usePromisePortal();
  const ref = React.useRef<ShowPortalResult>(undefined);

  React.useEffect(() => {
    ref.current = showPortal(() => <>{children}</>);

    return () => {
      ref.current?.[closeStrategy]();
    };
  }, []);

  return null;
}

export default Portal;
