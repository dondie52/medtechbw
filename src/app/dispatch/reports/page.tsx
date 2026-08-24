import { SectionPlaceholder } from '@/components/dispatch/SectionPlaceholder';

export default function ReportsPage() {
  return (
    <SectionPlaceholder
      title="Reports"
      icon="analytics"
      purpose="Response-time distributions, unit utilisation and coverage gaps across the operating area."
      needs={[
        'A real event history to measure, rather than a single demo emergency',
        'Agreement on which timestamps define a response time',
      ]}
    />
  );
}
