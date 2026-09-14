import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

const Employee = () => {
  const [employees, setEmployees] = useState([]);

  // ************ this page use for future implement ************** //

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6 text-gray-700">
          Hired Employees
        </h1>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-center border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Role</th>
                <th className="p-3">Joined Date</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-700">

              <tr className="hover:bg-gray-50 transition">
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
              </tr>
              {employees.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-400">
                    No hired employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Employee;
