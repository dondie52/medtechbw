import { RolePlaceholder } from '@/components/RolePlaceholder';

export default function AmbulanceCrewPage() {
  return (
    <RolePlaceholder
      role="ambulance_crew"
      icon="ambulance"
      purpose="The in-vehicle view for an assigned crew: navigation to the patient, the emergency medical summary, and one-tap status updates from en route through to facility handover."
      wouldSee={[
        'Assigned emergency with turn-by-turn navigation',
        'Emergency medical summary, released for this emergency only',
        'Status updates: en route, arriving, on scene, transporting, at facility',
        'On-scene reporting of what is actually happening, recorded as ambulance_crew',
      ]}
    />
  );
}
