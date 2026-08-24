import { RolePlaceholder } from '@/components/RolePlaceholder';

export default function AdministratorPage() {
  return (
    <RolePlaceholder
      role="administrator"
      icon="lock"
      purpose="Operational administration: responder verification, facility onboarding, and the audit trail. Administrators oversee access to patient data without being able to read it themselves."
      wouldSee={[
        'Access-log review across every emergency',
        'Responder and crew verification',
        'Facility connection and participation management',
        'Operating-area configuration for new districts',
      ]}
    />
  );
}
