import ProtectedLayout from '@/shared/components/ProtectedLayout';
import DashboardPage from '../modules/dashboard/pages/index';

export default function Dashboard() {
  return (
    <ProtectedLayout>
      <DashboardPage />
    </ProtectedLayout>
  );
}