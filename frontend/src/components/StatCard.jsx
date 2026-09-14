const StatCard = ({ title, value, color }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className={`text-xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
};

export default StatCard;
