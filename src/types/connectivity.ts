/**
 * Connectivity is a first-class part of the MedLink emergency experience, not a
 * cosmetic indicator: a patient in Botswana on a weak rural link must still be
 * able to understand what is happening to their alert.
 */
export type ConnectionStatus = 'online' | 'weak' | 'reconnecting' | 'offline';

export interface ConnectionState {
  status: ConnectionStatus;
  /** Set when the user has pinned a status via the demo controls. */
  simulated: boolean;
  changedAt: string;
}
