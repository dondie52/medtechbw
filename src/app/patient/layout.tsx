import type { Metadata } from 'next';
import { PatientShell } from '@/components/patient/PatientShell';

export const metadata: Metadata = {
  title: 'MedLink Botswana',
};

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return <PatientShell>{children}</PatientShell>;
}
