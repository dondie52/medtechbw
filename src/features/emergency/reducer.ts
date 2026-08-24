import { localId } from '@/lib/id';
import type {
  CommunicationFlag,
  ConnectionState,
  Emergency,
  EmergencyActor,
  EmergencyDataAccessLog,
  EmergencyState,
} from '@/types';
import type { EmergencyEvent } from './events';
import { canTransition } from './states';

export interface EmergencySession {
  /** Authoritative status. Both role shells read from this and nothing else. */
  state: EmergencyState;
  /** Exists from `sending` onward. Null while idle or holding the SOS button. */
  emergency: Emergency | null;
  connection: ConnectionState;
  accessLog: EmergencyDataAccessLog[];
  lastCaseReference: string | null;
}

/**
 * A restore is local-only and is never published: the transitions it carries
 * already happened and must not be re-attributed to whoever opened the tab.
 */
export type SessionAction =
  | EmergencyEvent
  | { type: 'session/restored'; session: EmergencySession };

export const initialSession: EmergencySession = {
  state: 'idle',
  emergency: null,
  connection: { status: 'online', simulated: false, changedAt: '1970-01-01T00:00:00.000Z' },
  accessLog: [],
  lastCaseReference: null,
};

function recordTransition(
  emergency: Emergency,
  to: EmergencyState,
  at: string,
  actor: EmergencyActor,
  note?: string,
): Emergency {
  return {
    ...emergency,
    state: to,
    transitions: [
      ...emergency.transitions,
      { from: emergency.state, to, at, actor, ...(note ? { note } : {}) },
    ],
  };
}

/**
 * Applies one event.
 *
 * Two rules hold everywhere in here:
 *  1. Any state change is checked against the machine first. An event that
 *     would make an illegal jump is dropped, not applied - a dropped event is
 *     always safer than showing a patient a status that has not happened.
 *  2. Nothing ever copies medical-profile information onto the emergency.
 *     `symptomsReported` is only ever set by an explicit report event.
 */
export function emergencyReducer(
  session: EmergencySession,
  event: SessionAction,
): EmergencySession {
  switch (event.type) {
    case 'session/restored':
      return event.session;

    case 'sos/hold_started': {
      if (!canTransition(session.state, 'holding_sos')) return session;
      return { ...session, state: 'holding_sos' };
    }

    case 'sos/hold_cancelled': {
      if (session.state !== 'holding_sos') return session;
      return { ...session, state: 'idle' };
    }

    case 'sos/triggered': {
      if (!canTransition(session.state, 'sending')) return session;
      const emergency: Emergency = {
        id: event.emergencyId,
        patientId: event.patientId,
        state: 'sending',
        createdAt: event.at,
        acknowledgedAt: null,
        location: event.location,
        /* Explicitly null. The patient pressed a button; nobody has described
         * what is happening to them. */
        symptomsReported: null,
        dispatcherNotes: [],
        communicationFlags: [],
        acceptedBy: null,
        acceptedAt: null,
        assignedAmbulanceId: null,
        assignedAt: null,
        etaMinutes: null,
        receivingFacilityId: null,
        transitions: [
          { from: 'holding_sos', to: 'sending', at: event.at, actor: event.actor },
        ],
        cancellation: null,
        completedAt: null,
      };
      return {
        ...session,
        state: 'sending',
        emergency,
        lastCaseReference: event.emergencyId,
      };
    }

    case 'alert/acknowledged': {
      if (!session.emergency || !canTransition(session.state, 'alert_received')) return session;
      const emergency = recordTransition(
        { ...session.emergency, acknowledgedAt: event.at },
        'alert_received',
        event.at,
        event.actor,
        'Alert received by the MedLink alert engine',
      );
      return { ...session, state: 'alert_received', emergency };
    }

    case 'alert/awaiting_dispatch': {
      if (!session.emergency || !canTransition(session.state, 'awaiting_dispatch')) return session;
      return {
        ...session,
        state: 'awaiting_dispatch',
        emergency: recordTransition(
          session.emergency,
          'awaiting_dispatch',
          event.at,
          event.actor,
          'Queued for a dispatcher',
        ),
      };
    }

    case 'dispatch/accepted': {
      if (!session.emergency || !canTransition(session.state, 'dispatch_confirmed')) return session;
      const emergency = recordTransition(
        { ...session.emergency, acceptedBy: event.actor, acceptedAt: event.at },
        'dispatch_confirmed',
        event.at,
        event.actor,
        'Emergency accepted by dispatcher',
      );
      return { ...session, state: 'dispatch_confirmed', emergency };
    }

    case 'dispatch/assignment_started': {
      if (!session.emergency || !canTransition(session.state, 'assigning_response')) return session;
      return {
        ...session,
        state: 'assigning_response',
        emergency: recordTransition(
          session.emergency,
          'assigning_response',
          event.at,
          event.actor,
        ),
      };
    }

    case 'dispatch/ambulance_assigned': {
      if (!session.emergency || !canTransition(session.state, 'response_assigned')) return session;
      const emergency = recordTransition(
        {
          ...session.emergency,
          assignedAmbulanceId: event.ambulanceId,
          assignedAt: event.at,
          etaMinutes: event.etaMinutes,
        },
        'response_assigned',
        event.at,
        event.actor,
        'Response unit assigned',
      );
      return { ...session, state: 'response_assigned', emergency };
    }

    case 'dispatch/facility_selected': {
      if (!session.emergency) return session;
      return {
        ...session,
        emergency: { ...session.emergency, receivingFacilityId: event.facilityId },
      };
    }

    case 'emergency/state_advanced': {
      if (!session.emergency || !canTransition(session.state, event.to)) return session;
      const base =
        event.to === 'completed'
          ? { ...session.emergency, completedAt: event.at }
          : session.emergency;
      return {
        ...session,
        state: event.to,
        emergency: recordTransition(base, event.to, event.at, event.actor),
      };
    }

    case 'emergency/eta_updated': {
      if (!session.emergency) return session;
      return { ...session, emergency: { ...session.emergency, etaMinutes: event.etaMinutes } };
    }

    case 'emergency/symptoms_reported': {
      if (!session.emergency) return session;
      return {
        ...session,
        emergency: {
          ...session.emergency,
          symptomsReported: { value: event.text, source: event.source, recordedAt: event.at },
        },
      };
    }

    case 'emergency/note_added': {
      if (!session.emergency) return session;
      return {
        ...session,
        emergency: {
          ...session.emergency,
          dispatcherNotes: [
            ...session.emergency.dispatcherNotes,
            { value: event.text, source: event.source, recordedAt: event.at },
          ],
        },
      };
    }

    case 'comms/flag_raised': {
      if (!session.emergency) return session;
      if (session.emergency.communicationFlags.some((flag) => flag.code === event.code)) {
        return session;
      }
      const flag: CommunicationFlag = {
        code: event.code,
        raisedAt: event.at,
        acknowledgedAt: null,
        acknowledgedBy: null,
      };
      return {
        ...session,
        emergency: {
          ...session.emergency,
          communicationFlags: [...session.emergency.communicationFlags, flag],
        },
      };
    }

    case 'comms/flag_acknowledged': {
      if (!session.emergency) return session;
      return {
        ...session,
        emergency: {
          ...session.emergency,
          communicationFlags: session.emergency.communicationFlags.map((flag) =>
            flag.code === event.code && flag.acknowledgedAt === null
              ? { ...flag, acknowledgedAt: event.at, acknowledgedBy: event.actor }
              : flag,
          ),
        },
      };
    }

    case 'emergency/cancelled': {
      if (!session.emergency || !canTransition(session.state, 'cancelled')) return session;
      const emergency = recordTransition(
        {
          ...session.emergency,
          cancellation: { at: event.at, actor: event.actor, reason: event.reason },
        },
        'cancelled',
        event.at,
        event.actor,
        event.reason,
      );
      return { ...session, state: 'cancelled', emergency };
    }

    case 'connectivity/changed': {
      return {
        ...session,
        connection: { status: event.status, simulated: event.simulated, changedAt: event.at },
      };
    }

    case 'access/logged': {
      const entry: EmergencyDataAccessLog = {
        id: localId('log'),
        emergencyId: session.emergency?.id ?? 'none',
        organisation: event.organisation,
        userId: event.userId,
        role: event.role,
        dataAccessed: event.dataAccessed,
        timestamp: event.at,
        reason: event.reason,
      };
      return { ...session, accessLog: [entry, ...session.accessLog].slice(0, 100) };
    }

    case 'demo/reset': {
      return {
        ...initialSession,
        connection: session.connection,
        lastCaseReference: session.lastCaseReference,
      };
    }

    default: {
      /* Exhaustiveness guard: adding an event without handling it fails the build. */
      const unhandled: never = event;
      void unhandled;
      return session;
    }
  }
}
