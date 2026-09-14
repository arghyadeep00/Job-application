import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { UserCheck, Users, Search, Briefcase, Mail, Phone, Calendar } from "lucide-react";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ************ this page use for future implement ************** //

  const filteredEmployees = employees.filter((emp) => {
    const name = `${emp?.firstname || ""} ${emp?.lastname || ""}`.toLowerCase();
    const role = (emp?.role || "").toLowerCase();
    const query = searchTerm.toLowerCase();
    return name.includes(query) || role.includes(query);
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Hired Employees
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                {employees.length} Active Hires
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Onboarded team members who successfully completed the recruitment process.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search hired employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {employees.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3 border border-emerald-100">
                <UserCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                No hired employees recorded yet
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                When candidates accept offers and complete onboarding, their employee records will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3.5">Employee</th>
                    <th className="px-5 py-3.5">Contact</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Joined Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredEmployees.map((emp, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">
                          {emp.firstname} {emp.lastname}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        <div>{emp.email}</div>
                        <div className="text-xs text-slate-400">{emp.phone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {emp.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {emp.joinedDate || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Employee;

