import { SectionPlaceholder } from '@/components/dispatch/SectionPlaceholder';

export default function EmergencyHistoryPage() {
  return (
    <SectionPlaceholder
      title="Emergency history"
      icon="history"
      purpose="Closed and cancelled emergencies with their full transition trail, for review and handover."
      needs={[
        'Persistent storage of emergencies beyond the current browser session',
        'Retention rules for how long medical context is kept after closure',
      ]}
    />
  );
}
