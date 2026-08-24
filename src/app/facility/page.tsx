import { RolePlaceholder } from '@/components/RolePlaceholder';

export default function ReceivingFacilityPage() {
  return (
    <RolePlaceholder
      role="receiving_facility"
      icon="hospital"
      purpose="The receiving facility's advance view of an inbound patient, so the emergency department knows what is arriving and when."
      wouldSee={[
        'Inbound emergencies with ETA and assigned unit',
        'Emergency medical summary for inbound patients only',
        'Accept or decline an inbound patient based on current capacity',
        'Arrival confirmation, which closes the transport stage',
      ]}
    />
  );
}
