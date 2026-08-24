import { SectionPlaceholder } from '@/components/dispatch/SectionPlaceholder';

export default function PatientsPage() {
  return (
    <SectionPlaceholder
      title="Patients"
      icon="person"
      purpose="Search registered MedLink users and review their emergency history. Patient records are only ever opened in the context of an emergency the dispatcher is handling."
      needs={[
        'Authenticated dispatcher sessions and a real permission model',
        'Server-side search that never returns medical data in list results',
        'An access-log entry for every record opened, as in Activity',
      ]}
    />
  );
}
