'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

const HOLD_DURATION_MS = 2000;
const RING_RADIUS = 122;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export interface SOSButtonProps {
  onHoldStart: () => void;
  onHoldCancel: () => void;
  onTrigger: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * The most important control in the patient application.
 *
 * Deliberate hold rather than a tap, because an accidental brush must not
 * summon an ambulance - and equally, a distressed person must not have to
 * perform anything precise. It works with a mouse, a finger, and the keyboard
 * (hold Space or Enter), reports progress numerically as well as visually, and
 * announces what happened rather than relying on the ring animation.
 */
export function SOSButton({
  onHoldStart,
  onHoldCancel,
  onTrigger,
  disabled,
  className,
}: SOSButtonProps) {
  const [progress, setProgress] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  const frameRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const keyHeldRef = useRef(false);

  const stopLoop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    startedAtRef.current = null;
  }, []);

  useEffect(() => stopLoop, [stopLoop]);

  const vibrate = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(pattern);
    }
  };

  const complete = useCallback(() => {
    completedRef.current = true;
    stopLoop();
    setProgress(1);
    vibrate([60, 40, 120]);
    setAnnouncement('Hold complete. Sending your emergency alert.');
    onTrigger();
  }, [onTrigger, stopLoop]);

  const tick = useCallback(() => {
    if (startedAtRef.current === null) return;
    const elapsed = performance.now() - startedAtRef.current;
    const next = Math.min(1, elapsed / HOLD_DURATION_MS);
    setProgress(next);
    if (next >= 1) {
      complete();
      return;
    }
    frameRef.current = requestAnimationFrame(tick);
  }, [complete]);

  const beginHold = useCallback(() => {
    if (disabled || startedAtRef.current !== null || completedRef.current) return;
    completedRef.current = false;
    startedAtRef.current = performance.now();
    setProgress(0);
    setAnnouncement('Holding. Keep holding to send your emergency alert.');
    vibrate(20);
    onHoldStart();
    frameRef.current = requestAnimationFrame(tick);
  }, [disabled, onHoldStart, tick]);

  const releaseHold = useCallback(() => {
    if (completedRef.current) {
      completedRef.current = false;
      setProgress(0);
      return;
    }
    if (startedAtRef.current === null) return;
    stopLoop();
    setProgress(0);
    setAnnouncement('Released early. Your emergency alert was not sent.');
    onHoldCancel();
  }, [onHoldCancel, stopLoop]);

  const percent = Math.round(progress * 100);

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      {/* Ripple halo. Purely decorative and stopped under reduced motion. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[272px] w-[272px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emergency/15 motion-safe:animate-sos-ripple"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[236px] w-[236px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emergency/15"
      />

      <button
        type="button"
        disabled={disabled}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture?.(event.pointerId);
          beginHold();
        }}
        onPointerUp={releaseHold}
        onPointerCancel={releaseHold}
        onPointerLeave={releaseHold}
        onKeyDown={(event) => {
          if (event.key !== ' ' && event.key !== 'Enter') return;
          event.preventDefault();
          if (event.repeat || keyHeldRef.current) return;
          keyHeldRef.current = true;
          beginHold();
        }}
        onKeyUp={(event) => {
          if (event.key !== ' ' && event.key !== 'Enter') return;
          event.preventDefault();
          keyHeldRef.current = false;
          releaseHold();
        }}
        onBlur={() => {
          if (keyHeldRef.current) {
            keyHeldRef.current = false;
            releaseHold();
          }
        }}
        onContextMenu={(event) => event.preventDefault()}
        aria-label="SOS. Get emergency help. Press and hold for two seconds to send an emergency alert."
        aria-describedby="sos-instruction"
        className={cn(
          'on-emergency relative flex h-[208px] w-[208px] touch-none select-none flex-col items-center justify-center',
          'rounded-full bg-emergency text-white shadow-sos transition-transform',
          'active:scale-[0.97] disabled:opacity-60 disabled:shadow-none',
          'sm:h-[224px] sm:w-[224px]',
        )}
      >
        {/* Progress ring, drawn outside the fill so it never obscures the label */}
        <svg
          viewBox="0 0 260 260"
          className="pointer-events-none absolute -inset-[13px] h-[calc(100%+26px)] w-[calc(100%+26px)] -rotate-90"
          aria-hidden
        >
          <circle
            cx="130"
            cy="130"
            r={RING_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="7"
          />
          <circle
            cx="130"
            cy="130"
            r={RING_RADIUS}
            fill="none"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
            style={{ transition: progress === 0 ? 'stroke-dashoffset 180ms ease-out' : 'none' }}
          />
        </svg>

        <span className="text-[56px] font-black leading-none tracking-tight sm:text-[62px]">SOS</span>
        <span className="mt-2 max-w-[9rem] text-center text-[13px] font-bold uppercase leading-tight tracking-[0.1em]">
          Get emergency help
        </span>
      </button>

      {/* Numeric progress for assistive technology, and for anyone who cannot
          perceive the ring. */}
      <span
        role="progressbar"
        aria-label="Emergency hold progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent} percent held`}
        className="sr-only"
      />
      <span role="status" aria-live="assertive" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}

export { HOLD_DURATION_MS };
