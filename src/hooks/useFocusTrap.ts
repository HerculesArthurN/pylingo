/**
 * useFocusTrap.ts
 * 
 * Custom hook for trapping keyboard focus inside modals/drawers (WCAG 2.4.3 / 2.1.2).
 * 
 * - Traps Tab/Shift+Tab within the container
 * - Closes on Escape key press
 * - Saves and restores focus to the trigger element
 * - Auto-focuses the first focusable element on mount
 */
import { useEffect, useRef, useCallback } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
].join(', ');

interface UseFocusTrapOptions {
  /** Whether the trap is currently active */
  isActive: boolean;
  /** Called when user presses Escape */
  onEscape?: () => void;
}

export function useFocusTrap({ isActive, onEscape }: UseFocusTrapOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!containerRef.current) return;

    // Handle Escape
    if (event.key === 'Escape') {
      event.preventDefault();
      onEscape?.();
      return;
    }

    // Handle Tab trapping
    if (event.key !== 'Tab') return;

    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift+Tab: wrap to last element
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab: wrap to first element
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }, [onEscape]);

  useEffect(() => {
    if (!isActive) return;

    // Save current focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus first focusable element inside the container
    const timeout = setTimeout(() => {
      if (!containerRef.current) return;
      const firstFocusable = containerRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        // If no focusable children, focus the container itself
        containerRef.current.focus();
      }
    }, 50); // Small delay to wait for animation/render

    // Attach keydown listener
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus to the trigger element
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        // Wrap in rAF to ensure DOM is ready after modal closes
        requestAnimationFrame(() => {
          previousFocusRef.current?.focus();
        });
      }
    };
  }, [isActive, handleKeyDown]);

  return containerRef;
}
