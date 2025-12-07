import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function AutocompletePortal({
  children,
  anchorRef,
  isOpen,
}) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const portalRoot = useRef(null);

  // Create portal container on mount, cleanup on unmount
  useEffect(() => {
    if (!portalRoot.current) {
      portalRoot.current = document.createElement('div');
      portalRoot.current.id = 'autocomplete-portal-root';
      document.body.appendChild(portalRoot.current);
    }

    return () => {
      if (portalRoot.current && document.body.contains(portalRoot.current)) {
        document.body.removeChild(portalRoot.current);
        portalRoot.current = null;
      }
    };
  }, []);

  // Calculate position based on input element
  const updatePosition = () => {
    if (!anchorRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownMaxHeight = 280;

    let top;

    // Flip to above if insufficient space below
    if (spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow) {
      top = rect.top + scrollY - dropdownMaxHeight - 4;
    } else {
      top = rect.bottom + scrollY + 4;
    }

    setPosition({
      top,
      left: rect.left + scrollX,
      width: rect.width,
    });
  };

  // Update position on open and when window changes
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleUpdate = () => {
      updatePosition();
    };

    // Passive listeners for performance
    window.addEventListener('scroll', handleUpdate, { passive: true });
    window.addEventListener('resize', handleUpdate, { passive: true });

    // iOS Safari viewport changes (keyboard)
    window.visualViewport?.addEventListener('resize', handleUpdate);
    window.visualViewport?.addEventListener('scroll', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
      window.visualViewport?.removeEventListener('resize', handleUpdate);
      window.visualViewport?.removeEventListener('scroll', handleUpdate);
    };
  }, [isOpen, anchorRef]);

  if (!isOpen || !portalRoot.current) return null;

  return createPortal(
    <div
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        zIndex: 9999,
      }}
    >
      {children}
    </div>,
    portalRoot.current
  );
}
