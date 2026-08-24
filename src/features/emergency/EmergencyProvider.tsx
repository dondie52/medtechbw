'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  DEMO_AMBULANCES,
  DEMO_DISPATCHER,
  DEMO_PATIENT_ACTOR,
  DEMO_PATIENT_PROFILE,
  DEMO_PLACES,
  findFacility,
} from '@/data';
import { nextCaseReference } from '@/lib/id';
import { mockRouteEstimator } from '@/lib/geo';
import type {
  AccessedDataCategory,
  Ambulance,
  CommunicationFlagCode,
  ConnectionStatus,
  DataSource,
  EmergencyActor,
  EmergencyState,
  ReceivingFacility,
} from '@/types';
import { MockMedLinkDispatchService } from './dispatch-service';
import type { EmergencyEvent } from './events';
import { emergencyReducer, initialSession, type EmergencySession } from './reducer';
import { canPatientCancel } from './states';
import { createTransport, clearSnapshot, readSnapshot, writeSnapshot, type RealtimeTransport } from './transport';

interface EmergencyActions {
  /* Patient */
  startSosHold(): void;
  cancelSosHold(): void;
  triggerSos(): void;
  raiseCannotSpeak(): void;
  cancelEmergency(reason: string): void;

  /* Dispatcher */
  acceptEmergency(): void;
  startAssignment(): void;
  assignAmbulance(ambulanceId: string): void;
  selectFacility(facilityId: string): void;
  advanceTo(state: EmergencyState): void;
  acknowledgeCommunicationFlag(code: CommunicationFlagCode): void;
  reportSymptoms(text: string, source: DataSource): void;
  addDispatcherNote(text: string): void;
  logDataAccess(categories: AccessedDataCategory[], reason: string, actor?: EmergencyActor): void;

  /* Demo controls */
  setConnectivity(status: ConnectionStatus, simulated: boolean): void;
  resetDemo(): void;
}

interface EmergencyContextValue {
  session: EmergencySession;
  actions: EmergencyActions;
  /** Candidate units, re-costed against the current emergency location. */
  ambulanceCandidates: Ambulance[];
  assignedAmbulance: Ambulance | null;
  receivingFacility: ReceivingFacility | null;
  /** False until the persisted snapshot has been read, to avoid hydration drift. */
  ready: boolean;
}

const EmergencyContext = createContext<EmergencyContextValue | null>(null);

export function EmergencyProvider({ children }: { children: ReactNode }) {
  const [session, applyLocal] = useReducer(emergencyReducer, initialSession);
  const [ready, setReady] = useState(false);
  const transportRef = useRef<RealtimeTransport | null>(null);
  const serviceRef = useRef<MockMedLinkDispatchService | null>(null);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  /** Apply locally and broadcast, so every open role sees the same event. */
  const emit = useCallback((event: EmergencyEvent) => {
    applyLocal(event);
    transportRef.current?.publish(event);
  }, []);

  const emitRef = useRef(emit);
  emitRef.current = emit;

  /* Transport + persisted snapshot. */
  useEffect(() => {
    const transport = createTransport();
    transportRef.current = transport;
    const unsubscribe = transport.subscribe((envelope) => applyLocal(envelope.event));

    /* Restored after mount rather than as the reducer's initial state, so the
     * server-rendered markup and the first client render agree. */
    const snapshot = readSnapshot<EmergencySession>();
    if (snapshot) applyLocal({ type: 'session/restored', session: snapshot });
    setReady(true);

    return () => {
      unsubscribe();
      transport.close();
      transportRef.current = null;
    };
  }, []);

  /* Persist every change so a tab opened later joins the same emergency. */
  useEffect(() => {
    if (!ready) return;
    writeSnapshot(session);
  }, [session, ready]);

  /* Mock dispatch service owns acknowledgement timing only. */
  useEffect(() => {
    const service = new MockMedLinkDispatchService((event) => emitRef.current(event));
    serviceRef.current = service;
    return () => {
      service.dispose();
      serviceRef.current = null;
    };
  }, []);

  /* Real browser connectivity, unless the demo controls have pinned a value. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => {
      if (sessionRef.current.connection.simulated) return;
      emitRef.current({
        type: 'connectivity/changed',
        at: new Date().toISOString(),
        status: navigator.onLine ? 'online' : 'offline',
        simulated: false,
      });
    };
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  const now = () => new Date().toISOString();

  const actions = useMemo<EmergencyActions>(
    () => ({
      startSosHold: () => emitRef.current({ type: 'sos/hold_started', at: now() }),
      cancelSosHold: () => emitRef.current({ type: 'sos/hold_cancelled', at: now() }),

      triggerSos: () => {
        const at = now();
        const emergencyId = nextCaseReference(sessionRef.current.lastCaseReference);
        emitRef.current({
          type: 'sos/triggered',
          at,
          emergencyId,
          patientId: DEMO_PATIENT_PROFILE.patient.id,
          location: { ...DEMO_PLACES.block8, capturedAt: at },
          actor: DEMO_PATIENT_ACTOR,
        });
        void serviceRef.current?.sendEmergency({
          emergencyId,
          patientId: DEMO_PATIENT_PROFILE.patient.id,
          location: DEMO_PLACES.block8,
          communicationFlags: [],
        });
      },

      raiseCannotSpeak: () =>
        emitRef.current({
          type: 'comms/flag_raised',
          at: now(),
          code: 'patient_may_be_unable_to_speak',
        }),

      cancelEmergency: (reason) => {
        if (!canPatientCancel(sessionRef.current.state)) return;
        serviceRef.current?.dispose();
        emitRef.current({
          type: 'emergency/cancelled',
          at: now(),
          actor: DEMO_PATIENT_ACTOR,
          reason,
        });
      },

      acceptEmergency: () =>
        emitRef.current({ type: 'dispatch/accepted', at: now(), actor: DEMO_DISPATCHER }),

      startAssignment: () =>
        emitRef.current({ type: 'dispatch/assignment_started', at: now(), actor: DEMO_DISPATCHER }),

      assignAmbulance: (ambulanceId) => {
        const emergency = sessionRef.current.emergency;
        const ambulance = DEMO_AMBULANCES.find((unit) => unit.id === ambulanceId);
        if (!emergency || !ambulance) return;
        const estimate = mockRouteEstimator.estimate(
          ambulance.position,
          emergency.location.coordinates,
        );
        emitRef.current({
          type: 'dispatch/ambulance_assigned',
          at: now(),
          actor: DEMO_DISPATCHER,
          ambulanceId,
          etaMinutes: estimate.etaMinutes,
        });
      },

      selectFacility: (facilityId) =>
        emitRef.current({
          type: 'dispatch/facility_selected',
          at: now(),
          actor: DEMO_DISPATCHER,
          facilityId,
        }),

      advanceTo: (state) =>
        emitRef.current({
          type: 'emergency/state_advanced',
          at: now(),
          actor: DEMO_DISPATCHER,
          to: state,
        }),

      acknowledgeCommunicationFlag: (code) =>
        emitRef.current({
          type: 'comms/flag_acknowledged',
          at: now(),
          code,
          actor: DEMO_DISPATCHER,
        }),

      reportSymptoms: (text, source) =>
        emitRef.current({ type: 'emergency/symptoms_reported', at: now(), text, source }),

      addDispatcherNote: (text) =>
        emitRef.current({
          type: 'emergency/note_added',
          at: now(),
          text,
          source: 'dispatcher',
        }),

      logDataAccess: (categories, reason, actor = DEMO_DISPATCHER) =>
        emitRef.current({
          type: 'access/logged',
          at: now(),
          organisation: actor.organisation ?? 'Unknown organisation',
          userId: actor.id,
          role: actor.role,
          dataAccessed: categories,
          reason,
        }),

      setConnectivity: (status, simulated) =>
        emitRef.current({ type: 'connectivity/changed', at: now(), status, simulated }),

      resetDemo: () => {
        serviceRef.current?.dispose();
        clearSnapshot();
        emitRef.current({ type: 'demo/reset', at: now() });
      },
    }),
    [],
  );

  /*
   * Candidate units are re-costed against the actual emergency location, so
   * the drawer's distances and ETAs are derived rather than hard-coded. Sorted
   * by availability, then travel time, then distance.
   */
  const ambulanceCandidates = useMemo(() => {
    const emergency = session.emergency;
    const rank: Record<Ambulance['availability'], number> = {
      available: 0,
      assigned: 1,
      busy: 2,
      off_duty: 3,
    };
    return DEMO_AMBULANCES.map((unit) => {
      if (!emergency) return unit;
      const estimate = mockRouteEstimator.estimate(unit.position, emergency.location.coordinates);
      return { ...unit, distanceKm: estimate.distanceKm, etaMinutes: estimate.etaMinutes };
    }).sort(
      (a, b) =>
        rank[a.availability] - rank[b.availability] ||
        a.etaMinutes - b.etaMinutes ||
        a.distanceKm - b.distanceKm,
    );
  }, [session.emergency]);

  const assignedAmbulance = useMemo(
    () =>
      ambulanceCandidates.find((unit) => unit.id === session.emergency?.assignedAmbulanceId) ??
      null,
    [ambulanceCandidates, session.emergency?.assignedAmbulanceId],
  );

  const receivingFacility = useMemo(
    () => findFacility(session.emergency?.receivingFacilityId ?? null) ?? null,
    [session.emergency?.receivingFacilityId],
  );

  const value = useMemo<EmergencyContextValue>(
    () => ({
      session: session,
      actions,
      ambulanceCandidates,
      assignedAmbulance,
      receivingFacility,
      ready,
    }),
    [session, actions, ambulanceCandidates, assignedAmbulance, receivingFacility, ready],
  );

  return <EmergencyContext.Provider value={value}>{children}</EmergencyContext.Provider>;
}

export function useEmergency(): EmergencyContextValue {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used inside <EmergencyProvider>.');
  }
  return context;
}

/** Ticking clock for elapsed timers. One interval per consumer, cleaned up. */
export function useNowMs(intervalMs = 1000): number {
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return nowMs;
}
