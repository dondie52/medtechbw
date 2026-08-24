import type {
  AccessedDataCategory,
  BotswanaLocation,
  CommunicationFlagCode,
  ConnectionStatus,
  DataSource,
  EmergencyActor,
  EmergencyState,
} from '@/types';

/**
 * Everything that can happen to an emergency, as a serialisable event.
 *
 * The whole application communicates in these. Today they travel over a
 * BroadcastChannel between browser tabs; tomorrow the identical payloads arrive
 * over a WebSocket from a real backend and nothing above this layer changes.
 */
export type EmergencyEvent =
  | { type: 'sos/hold_started'; at: string }
  | { type: 'sos/hold_cancelled'; at: string }
  | {
      type: 'sos/triggered';
      at: string;
      emergencyId: string;
      patientId: string;
      location: BotswanaLocation;
      actor: EmergencyActor;
    }
  /* Emitted by the alert engine once it has the alert - not by the UI. */
  | { type: 'alert/acknowledged'; at: string; actor: EmergencyActor }
  | { type: 'alert/awaiting_dispatch'; at: string; actor: EmergencyActor }
  | { type: 'dispatch/accepted'; at: string; actor: EmergencyActor }
  | { type: 'dispatch/assignment_started'; at: string; actor: EmergencyActor }
  | {
      type: 'dispatch/ambulance_assigned';
      at: string;
      actor: EmergencyActor;
      ambulanceId: string;
      etaMinutes: number;
    }
  | { type: 'dispatch/facility_selected'; at: string; actor: EmergencyActor; facilityId: string }
  | { type: 'emergency/state_advanced'; at: string; actor: EmergencyActor; to: EmergencyState }
  | { type: 'emergency/eta_updated'; at: string; etaMinutes: number }
  | { type: 'emergency/symptoms_reported'; at: string; text: string; source: DataSource }
  | { type: 'emergency/note_added'; at: string; text: string; source: DataSource }
  | { type: 'comms/flag_raised'; at: string; code: CommunicationFlagCode }
  | {
      type: 'comms/flag_acknowledged';
      at: string;
      code: CommunicationFlagCode;
      actor: EmergencyActor;
    }
  | { type: 'emergency/cancelled'; at: string; actor: EmergencyActor; reason: string }
  | { type: 'connectivity/changed'; at: string; status: ConnectionStatus; simulated: boolean }
  | {
      type: 'access/logged';
      at: string;
      organisation: string;
      userId: string;
      role: EmergencyActor['role'];
      dataAccessed: AccessedDataCategory[];
      reason: string;
    }
  | { type: 'demo/reset'; at: string };

/** Envelope used on the wire so receivers can drop duplicates. */
export interface EmergencyEventEnvelope {
  id: string;
  /** Identifies the sending tab/session, so a client can ignore its own echo. */
  origin: string;
  event: EmergencyEvent;
}
