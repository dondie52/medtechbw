import Link from 'next/link';
import { APP_ROLE_LABEL, ROLE_DATA_PERMISSIONS, type AppRole } from '@/types';
import { Card, Icon, StatusPill, type IconName } from '@/components/ui';

/**
 * A prepared-but-unbuilt role shell.
 *
 * The route exists so the role separation is real in the routing tree rather
 * than something to retrofit, and so nobody assumes an unbuilt role quietly
 * inherits dispatcher navigation.
 */
export function RolePlaceholder({
  role,
  icon,
  purpose,
  wouldSee,
}: {
  role: AppRole;
  icon: IconName;
  purpose: string;
  wouldSee: string[];
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Link href="/" className="inline-flex min-h-touch items-center gap-2 text-sm font-semibold text-brand">
        <Icon name="arrow-back" size={18} />
        MedLink Botswana
      </Link>

      <Card className="mt-4 p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand">
          <Icon name={icon} size={24} />
        </span>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-ink">{APP_ROLE_LABEL[role]}</h1>
          <StatusPill tone="muted" size="sm">
            Route prepared, not built
          </StatusPill>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{purpose}</p>

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.08em] text-ink-subtle">
          This role would be able to read
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ROLE_DATA_PERMISSIONS[role].map((capability) => (
            <StatusPill key={capability} tone="neutral" size="sm">
              {capability.replace(/_/g, ' ')}
            </StatusPill>
          ))}
        </div>

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.08em] text-ink-subtle">
          Screens it needs
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-ink-muted">
          {wouldSee.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Icon name="chevron-right" size={14} className="mt-1 text-ink-subtle" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
