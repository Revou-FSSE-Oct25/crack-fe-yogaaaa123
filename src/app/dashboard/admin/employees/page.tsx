import type { Metadata } from 'next';
import { EmployeeManagement } from '@/features/employees/components/EmployeeManagement';

export const metadata: Metadata = {
  title: 'Employee Management — CrackPOS',
};

export default function EmployeesPage() {
  return <EmployeeManagement />;
}
