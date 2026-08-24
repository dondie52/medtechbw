import type { Metadata } from 'next';
import { DispatcherShell } from '@/components/dispatch/DispatcherShell';

export const metadata: Metadata = {
  title: 'MedLink Dispatcher',
};

export default function DispatchLayout({ children }: { children: React.ReactNode }) {
  return <DispatcherShell>{children}</DispatcherShell>;
}
