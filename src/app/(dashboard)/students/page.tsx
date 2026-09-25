'use client';

import { useState } from 'react';
import { students as initialStudents, projects, type Student } from '@/data/mockData';
import Badge from '@/components/Badge';

const depts = ['All', 'CSE', 'ME', 'ECE', 'EEE', 'Civil'];
const years = ['All', '1', '2', '3', '4'];

type View = 'list' | 'detail';

export default function Students() {
  const [studentList, setStudentList] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [view, setView] = useState<View>('list');
  const [selected, setSelected] = useState<Student | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({ id: '', name: '', department: 'CSE', year: '3', email: '', phone: '', status: 'Active' as const });
  const [formError, setFormError] = useState('');

  const filtered = studentList.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchDept = deptFilter === 'All' || s.department === deptFilter;
    const matchYear = yearFilter === 'All' || String(s.year) === yearFilter;
    return matchQ && matchDept && matchYear;
  });

  const saveStudent = () => {
    if (!form.id || !form.name || !form.department || !form.year) {
      setFormError('Student ID, Name, Department, and Year are required.');
      return;
    }
    if (studentList.find(s => s.id === form.id)) {
      setFormError('Student ID already exists.');
      return;
    }
    setStudentList(prev => [...prev, { ...form, year: Number(form.year), projects: [] }]);
    setForm({ id: '', name: '', department: 'CSE', year: '3', email: '', phone: '', status: 'Active' });
    setFormError('');
    setShowAdd(false);
  };

  if (view === 'detail' && selected) {
    const studentProjects = projects.filter(p => p.members.some(m => m.studentId === selected.id));
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
            ← Back to Students
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xl font-bold">
                {selected.name[0]}
              </div>
              <div>
                <div className="font-bold text-slate-800 text-lg">{selected.name}</div>
                <div className="text-sm text-slate-500 font-medium tracking-wide">{selected.id}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { l: 'Department', v: selected.department },
                { l: 'Year', v: `Year ${selected.year}` },
                { l: 'Email', v: selected.email },
                { l: 'Phone', v: selected.phone },
              ].map(row => (
                <div key={row.l} className="flex justify-between">
                  <span className="text-slate-500">{row.l}</span>
                  <span className="text-slate-700 font-medium">{row.v}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Status</span>
                <Badge status={selected.status} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-3">Project Membership</h3>
              {studentProjects.length === 0 ? (
                <p className="text-sm text-slate-400">Not a member of any project.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-100">
                    {['Project', 'Code', 'Role', 'Status'].map(h => <th key={h} className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {studentProjects.map(p => {
                      const member = p.members.find(m => m.studentId === selected.id);
                      return (
                        <tr key={p.code} className="border-b border-slate-50">
                          <td className="py-2 pr-4 font-medium text-slate-700">{p.name}</td>
                          <td className="py-2 pr-4 text-xs text-slate-400 font-medium">{p.code}</td>
                          <td className="py-2 pr-4 text-slate-600">{member?.role}</td>
                          <td className="py-2"><Badge status={p.status} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-3">Food Token History</h3>
              <p className="text-sm text-slate-400">No recent food records available.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Students</h2>
          <p className="text-sm text-slate-500">{studentList.length} students registered</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by Student ID, name, or email…"
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72"
        />
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : `Year ${y}`}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-3xl mb-3">👤</div>
            <div className="font-medium text-slate-700">No students found</div>
            <div className="text-sm text-slate-400 mt-1">Try adjusting your search or filters.</div>
            <button onClick={() => setShowAdd(true)} className="mt-4 bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors">+ Add Student</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Student ID', 'Name', 'Department', 'Year', 'Email', 'Projects', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-xs text-indigo-700 font-semibold tracking-wide">{s.id}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{s.name}</td>
                  <td className="py-3 px-4 text-slate-600">{s.department}</td>
                  <td className="py-3 px-4 text-slate-600">Year {s.year}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{s.email}</td>
                  <td className="py-3 px-4 text-slate-500">{s.projects.length} Project{s.projects.length !== 1 ? 's' : ''}</td>
                  <td className="py-3 px-4"><Badge status={s.status} /></td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => { setSelected(s); setView('detail'); }}
                      className="text-xs text-indigo-600 hover:underline mr-3"
                    >View</button>
                    <button className="text-xs text-slate-400 hover:text-slate-600">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Student Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800 text-lg">Add Student</h3>
              <button onClick={() => { setShowAdd(false); setFormError(''); }} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Student ID *', key: 'id', type: 'text', placeholder: '23CS101' },
                { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Siddharth V' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'student@college.edu' },
                { label: 'Phone', key: 'phone', type: 'text', placeholder: '9876543210' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
                  <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {['CSE', 'ME', 'ECE', 'EEE', 'Civil'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Year *</label>
                  <select value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {['1', '2', '3', '4'].map(y => <option key={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>
              {formError && <p className="text-sm text-red-600">{formError}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={() => { setShowAdd(false); setFormError(''); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={saveStudent} className="px-4 py-2 text-sm bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg transition-colors font-medium">Save Student</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
