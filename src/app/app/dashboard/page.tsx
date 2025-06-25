import { redirect } from 'next/navigation';

const Dashboard = () => {
  redirect('/app/campaigns');
  return <div>Dashboard</div>;
};

export default Dashboard;
