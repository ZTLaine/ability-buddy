import { useState, useEffect } from 'react';

interface UseModalHeightProps {
  isOpen: boolean;
  dependencies?: any[];
}

export function useModalHeight({ isOpen, dependencies = [] }: UseModalHeightProps) {
  const [modalHeight, setModalHeight] = useState<string>("auto");

  useEffect(() => {
    if (isOpen) {
      // Use requestAnimationFrame to prevent reflow issues
      const updateHeight = () => {
        const dialogContent = document.querySelector('[data-radix-dialog-content]') as HTMLElement;
        if (dialogContent) {
          const currentHeight = dialogContent.scrollHeight;
          const maxHeight = window.innerHeight * 0.85; // 85% of viewport height
          const newHeight = `${Math.min(currentHeight, maxHeight)}px`;
          
          // Only update if height actually changed to prevent unnecessary rerenders
          setModalHeight(prevHeight => {
            if (prevHeight !== newHeight) {
              return newHeight;
            }
            return prevHeight;
          });
        }
      };

      // Use a small delay to allow DOM to settle, then use requestAnimationFrame
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(updateHeight);
      }, 10);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, ...dependencies]);

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setModalHeight("auto");
    }
  }, [isOpen]);

  return modalHeight;
} 