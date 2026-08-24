/**
 * Emergency case references look like BW-ML-1028: country, MedLink, sequence.
 * The prototype continues the demo sequence locally; production allocates these
 * server-side so they are globally unique and auditable.
 */
const CASE_PREFIX = 'BW-ML-';

export function formatCaseReference(sequence: number): string {
  return `${CASE_PREFIX}${sequence}`;
}

export function nextCaseReference(previous: string | null): string {
  if (!previous?.startsWith(CASE_PREFIX)) return formatCaseReference(1028);
  const parsed = Number.parseInt(previous.slice(CASE_PREFIX.length), 10);
  return formatCaseReference(Number.isNaN(parsed) ? 1028 : parsed + 1);
}

let counter = 0;

/** Local identifier for transitions, log rows and flags. Not a security token. */
export function localId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`;
}
