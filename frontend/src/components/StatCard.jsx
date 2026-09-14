import React from "react";

const StatCard = ({ title, value, icon, subtitle, color = "text-gray-900", iconBg = "bg-purple-50 text-purple-600" }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className={`text-2xl font-bold mt-1.5 ${color}`}>{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl ${iconBg} flex items-center justify-center`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
