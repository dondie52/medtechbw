import { SYSTEM_ACTOR } from '@/data';
import type { BotswanaLocation, EmergencyState } from '@/types';
import type { EmergencyEvent } from './events';

export interface SendEmergencyRequest {
  emergencyId: string;
  patientId: string;
  location: BotswanaLocation;
  /** Non-verbal signals already raised on the device, e.g. cannot speak. */
  communicationFlags: string[];
}

export interface EmergencyStatusResponse {
  emergencyId: string;
  state: EmergencyState;
  acknowledgedAt: string | null;
}

/**
 * The boundary MedLink would implement against a real emergency-service or
 * dispatch backend.
 *
 * Nothing behind this interface exists yet. In particular there is no
 * integration with Botswana's 997 emergency number, and this interface is not
 * a claim that one is planned or available - it is the shape such an
 * integration would take. The only implementation today is the mock below.
 */
export interface EmergencyServiceIntegration {
  readonly name: string;
  /** True only for an implementation talking to real emergency infrastructure. */
  readonly isLiveService: boolean;
  sendEmergency(request: SendEmergencyRequest): Promise<{ accepted: boolean }>;
  getStatus(emergencyId: string): Promise<EmergencyStatusResponse | null>;
}

export interface DispatchServiceOptions {
  /** Delay before the alert engine acknowledges receipt, in ms. */
  acknowledgeDelayMs?: number;
  /** Further delay before the case is queued for a dispatcher, in ms. */
  queueDelayMs?: number;
}

/**
 * Mock MedLink dispatch.
 *
 * Its only real job is to own the *timing of acknowledgements*, which is what
 * lets the patient screen honestly distinguish "Sending" from "Alert Sent" from
 * "Awaiting Dispatch Confirmation". A dispatcher accepting the case is a human
 * action and is never simulated here.
 */
export class MockMedLinkDispatchService implements EmergencyServiceIntegration {
  readonly name = 'MedLink Dispatch (mock)';
  readonly isLiveService = false;

  private readonly acknowledgeDelayMs: number;
  private readonly queueDelayMs: number;
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  private latest: EmergencyStatusResponse | null = null;

  constructor(
    private readonly emit: (event: EmergencyEvent) => void,
    options: DispatchServiceOptions = {},
  ) {
    this.acknowledgeDelayMs = options.acknowledgeDelayMs ?? 2200;
    this.queueDelayMs = options.queueDelayMs ?? 2600;
  }

  async sendEmergency(request: SendEmergencyRequest): Promise<{ accepted: boolean }> {
    this.latest = { emergencyId: request.emergencyId, state: 'sending', acknowledgedAt: null };

    this.schedule(() => {
      const at = new Date().toISOString();
      this.latest = { emergencyId: request.emergencyId, state: 'alert_received', acknowledgedAt: at };
      this.emit({ type: 'alert/acknowledged', at, actor: SYSTEM_ACTOR });

      this.schedule(() => {
        const queuedAt = new Date().toISOString();
        this.latest = {
          emergencyId: request.emergencyId,
          state: 'awaiting_dispatch',
          acknowledgedAt: at,
        };
        this.emit({ type: 'alert/awaiting_dispatch', at: queuedAt, actor: SYSTEM_ACTOR });
      }, this.queueDelayMs);
    }, this.acknowledgeDelayMs);

    return { accepted: true };
  }

  async getStatus(emergencyId: string): Promise<EmergencyStatusResponse | null> {
    return this.latest?.emergencyId === emergencyId ? this.latest : null;
  }

  /** Cancels pending acknowledgements, e.g. when the patient cancels early. */
  dispose(): void {
    for (const timer of this.timers) clearTimeout(timer);
    this.timers.clear();
  }

  private schedule(fn: () => void, delayMs: number): void {
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      fn();
    }, delayMs);
    this.timers.add(timer);
  }
}
