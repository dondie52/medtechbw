import { SectionPlaceholder } from '@/components/dispatch/SectionPlaceholder';

export default function DispatchSettingsPage() {
  return (
    <SectionPlaceholder
      title="Settings"
      icon="settings"
      purpose="Operating area, escalation rules, shift handover and console preferences."
      needs={['Multi-dispatcher sessions', 'Configurable operating areas beyond Gaborone']}
    />
  );
}
