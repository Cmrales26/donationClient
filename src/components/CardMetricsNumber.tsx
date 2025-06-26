type DashboardCardProps = {
  title: string;
  value: number;
  bgColor?: string;
};

const DashboardCard = ({
  title,
  value,
  bgColor = 'bg-blue-600'
}: DashboardCardProps) => {
  return (
    <div className={`p-6 rounded-xl shadow-md text-white ${bgColor} w-full`}>
      <h2 className='text-lg font-semibold'>{title}</h2>
      <p className='text-3xl font-bold mt-2'>{value}</p>
    </div>
  );
};

export default DashboardCard;
