import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  id?: string;
}

export const Portal = ({ children, id = 'portal' }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This pattern is necessary for Next.js SSR to avoid hydration mismatches
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(children, document.querySelector(`#${id}`) || document.body) : null;
};
