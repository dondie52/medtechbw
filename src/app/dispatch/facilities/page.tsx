import { DEMO_FACILITIES } from '@/data';
import { Card, DemoNotice, Icon } from '@/components/ui';
import { ReceivingFacilityCard } from '@/components/dispatch/ReceivingFacilityCard';

export default function FacilitiesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Facilities</h1>
        <p className="text-sm text-ink-muted">Receiving facilities configured for this area.</p>
      </div>

      <Card tone="caution" className="flex items-start gap-2.5 p-4">
        <Icon name="warning" size={18} className="mt-0.5 text-caution" />
        <p className="text-sm leading-relaxed text-caution-on-container">
          None of these facilities is technically connected to MedLink, and no commercial or clinical
          partnership is implied. Connection, participation and availability are tracked separately so
          the difference is always visible.
        </p>
      </Card>

      <ul className="space-y-3">
        {DEMO_FACILITIES.map((facility) => (
          <ReceivingFacilityCard key={facility.id} facility={facility} />
        ))}
      </ul>

      <DemoNotice />
    </div>
  );
}
