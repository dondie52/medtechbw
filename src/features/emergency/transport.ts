import { localId } from '@/lib/id';
import type { EmergencyEvent, EmergencyEventEnvelope } from './events';

/**
 * The seam between the prototype and a real backend.
 *
 * Today: a BroadcastChannel, so two browser tabs behave like two real roles
 * looking at one emergency. Tomorrow: a WebSocket, SSE stream or push channel
 * implementing this same interface. No component imports a transport directly -
 * they all go through the provider.
 */
export interface RealtimeTransport {
  publish(event: EmergencyEvent): void;
  subscribe(handler: (envelope: EmergencyEventEnvelope) => void): () => void;
  close(): void;
}

const CHANNEL_NAME = 'medlink.emergency.v1';

class BroadcastChannelTransport implements RealtimeTransport {
  private readonly channel: BroadcastChannel;
  private readonly origin = localId('tab');

  constructor() {
    this.channel = new BroadcastChannel(CHANNEL_NAME);
  }

  publish(event: EmergencyEvent): void {
    const envelope: EmergencyEventEnvelope = { id: localId('evt'), origin: this.origin, event };
    this.channel.postMessage(envelope);
  }

  subscribe(handler: (envelope: EmergencyEventEnvelope) => void): () => void {
    const listener = (message: MessageEvent<EmergencyEventEnvelope>) => {
      /* BroadcastChannel does not echo to the sender, but guard anyway so a
       * future same-tab transport cannot double-apply an event. */
      if (message.data.origin === this.origin) return;
      handler(message.data);
    };
    this.channel.addEventListener('message', listener);
    return () => this.channel.removeEventListener('message', listener);
  }

  close(): void {
    this.channel.close();
  }
}

/** Used during server rendering and wherever BroadcastChannel is unavailable. */
class NoopTransport implements RealtimeTransport {
  publish(): void {}
  subscribe(): () => void {
    return () => {};
  }
  close(): void {}
}

export function createTransport(): RealtimeTransport {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
    return new NoopTransport();
  }
  return new BroadcastChannelTransport();
}

/*
 * Snapshot persistence.
 *
 * Events keep open tabs in step; the snapshot is what a tab opened *later*
 * reads so it does not start from an empty emergency. A real backend replaces
 * this with a fetch of the current case.
 */
const SNAPSHOT_KEY = 'medlink.session.v1';

export function readSnapshot<T>(): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SNAPSHOT_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    /* Private browsing or a corrupt value - start clean rather than crash. */
    return null;
  }
}

export function writeSnapshot(value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(value));
  } catch {
    /* Storage full or blocked. The in-memory session is still correct. */
  }
}

export function clearSnapshot(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(SNAPSHOT_KEY);
  } catch {
    /* Nothing useful to do. */
  }
}
