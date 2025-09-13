import React from 'react';
import { Department } from '../../../types';

interface CampusGroup { campusId: number; campusName: string; departments: Department[] }
interface Props { departments: CampusGroup[] }

const DepartmentsSection: React.FC<Props> = ({ departments }) => {
  if (!departments || departments.length === 0) return <div className="p-4">No departments available.</div>;

  return (
    <div className="space-y-6">
      {/* small style block to rotate chevron when details are open */}
      <style>{`
        details[open] summary .chev { transform: rotate(180deg); }
        summary .chev { transition: transform .18s ease; }
      `}</style>

      {departments.map(cg => (
        <section key={cg.campusId} className="bg-white rounded-lg shadow-sm p-5">
          <header className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">{cg.campusName.split(' ')[0].charAt(0) || 'C'}</div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">{cg.campusName} — Departments</h4>
                <div className="text-xs text-gray-500">{cg.departments.length} department{cg.departments.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">&nbsp;</div>
          </header>

          <div className="space-y-3">
            {cg.departments.map(d => (
              <details key={d.id} className="group border border-gray-100 rounded-lg overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer px-4 py-3 bg-white hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="font-medium text-gray-800">{d.name}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-500">{d.courses ? d.courses.length : 0} courses</div>
                    <svg className="chev w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </summary>

                <div className="px-4 py-4 bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      {d.description && <p className="mb-3 text-gray-600">{d.description}</p>}
                      <ul className="space-y-2">
                        {d.courses && d.courses.length > 0 ? d.courses.map(c => (
                          <li key={c.courseCode} className="flex items-center justify-between">
                            <div className="truncate">
                              <span className="font-medium text-gray-800">{c.courseCode}</span>
                              <span className="ml-2 text-gray-600">— {c.courseName}</span>
                            </div>
                            <div className="ml-4 flex-shrink-0 text-xs text-gray-500">
                              <span className="px-2 py-1 rounded-full bg-white border border-gray-200 shadow-sm">{c.nqfLevel ? `NQF ${c.nqfLevel}` : (c.duration || '')}</span>
                            </div>
                          </li>
                        )) : <li className="text-gray-500">No courses available.</li>}
                      </ul>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      {d.email && <div><strong className="text-gray-800">Email:</strong> <span className="ml-2">{d.email}</span></div>}
                      {d.contactNumber && <div><strong className="text-gray-800">Phone:</strong> <span className="ml-2">{d.contactNumber}</span></div>}
                      {d.buildingNumber && <div><strong className="text-gray-800">Building:</strong> <span className="ml-2">{d.buildingNumber}</span></div>}
                      {/* small action row */}
                      <div className="mt-3">
                        <button className="text-indigo-600 text-sm font-medium hover:underline">Manage Department</button>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default DepartmentsSection;
