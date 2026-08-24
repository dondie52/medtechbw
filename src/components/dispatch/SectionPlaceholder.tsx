import Link from 'next/link';
import { Card, Icon, type IconName } from '@/components/ui';

/**
 * Honest placeholder for a route that exists in the information architecture
 * but is not part of this milestone. Better than a dead link, and it says
 * plainly that the screen is not built rather than implying it is empty.
 */
export function SectionPlaceholder({
  title,
  icon,
  purpose,
  needs,
}: {
  title: string;
  icon: IconName;
  purpose: string;
  needs: string[];
}) {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card className="p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand">
          <Icon name={icon} size={24} />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{purpose}</p>

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.08em] text-ink-subtle">
          Not built in this milestone
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-ink-muted">
          {needs.map((need) => (
            <li key={need} className="flex items-start gap-2">
              <Icon name="chevron-right" size={14} className="mt-1 text-ink-subtle" />
              {need}
            </li>
          ))}
        </ul>

        <Link
          href="/dispatch"
          className="mt-6 inline-flex min-h-touch items-center gap-2 text-sm font-semibold text-brand"
        >
          <Icon name="arrow-back" size={18} />
          Back to live emergencies
        </Link>
      </Card>
    </div>
  );
}
