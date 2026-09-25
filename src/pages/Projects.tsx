import { useState } from 'react';
import { projects as initialProjects, students, type Project } from '../data/mockData';
import Badge from '../components/Badge';

type View = 'list' | 'detail';

export default function Projects() {
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);
  const [view, setView] = useState<View>('list');
  const [selected, setSelected] = useState<Project | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [foundStudent, setFoundStudent] = useState<typeof students[0] | null | 'not-found' | 'already-added'>(null);
  const [memberRole, setMemberRole] = useState('Member');

  const [form, setForm] = useState({ code: '', name: '', description: '', status: 'Active' as Project['status'] });

  const searchStudent = () => {
    const s = students.find(st => st.id.toLowerCase() === searchId.toLowerCase());
    if (!s) { setFoundStudent('not-found'); return; }
    if (selected?.members.some(m => m.studentId === s.id)) { setFoundStudent('already-added'); return; }
    setFoundStudent(s);
  };

  const addMember = () => {
    if (!selected || !foundStudent || foundStudent === 'not-found' || foundStudent === 'already-added') return;
    const updated = projectList.map(p => p.code === selected.code
      ? { ...p, members: [...p.members, { studentId: foundStudent.id, role: memberRole }] }
      : p
    );
    setProjectList(updated);
    setSelected(updated.find(p => p.code === selected.code) ?? null);
    setSearchId('');
    setFoundStudent(null);
    setMemberRole('Member');
    setShowAddMember(false);
  };

  const saveProject = () => {
    if (!form.code || !form.name) return;
    setProjectList(prev => [...prev, { ...form, createdDate: new Date().toISOString().slice(0, 10), members: [] }]);
    setForm({ code: '', name: '', description: '', status: 'Active' });
    setShowCreate(false);
  };

  if (view === 'detail' && selected) {
    const proj = projectList.find(p => p.code === selected.code) ?? selected;
    return (
      <div className="space-y-6">
        <button onClick={() => setView('list')} className="text-sm text-indigo-600 hover:underline">← Back to Projects</button>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{proj.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-mono text-sm text-slate-400">{proj.code}</span>
              <Badge status={proj.status} />
            </div>
          </div>
          <button onClick={() => setShowAddMember(true)} className="bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors">+ Add Student</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">Project Information</h3>
            <div className="space-y-2 text-sm">
              {[
                { l: 'Project Name', v: proj.name },
                { l: 'Project Code', v: proj.code },
                { l: 'Created Date', v: proj.createdDate },
              ].map(r => (
                <div key={r.l} className="flex justify-between">
                  <span className="text-slate-500">{r.l}</span>
                  <span className="text-slate-700 font-medium text-right">{r.v}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Status</span>
                <Badge status={proj.status} />
              </div>
              {proj.description && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-500 block mb-1">Description</span>
                  <p className="text-slate-700 text-xs leading-relaxed">{proj.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800">Project Members ({proj.members.length})</h3>
            </div>
            {proj.members.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-slate-400 text-sm">No students added yet.</p>
                <button onClick={() => setShowAddMember(true)} className="mt-3 text-sm text-indigo-600 hover:underline">+ Add Student</button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-100">
                  {['Student ID', 'Name', 'Department', 'Year', 'Role', 'Status'].map(h => (
                    <th key={h} className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {proj.members.map(m => {
                    const s = students.find(st => st.id === m.studentId);
                    return s ? (
                      <tr key={m.studentId} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-2.5 pr-4 font-mono text-xs text-indigo-700 font-semibold">{s.id}</td>
                        <td className="py-2.5 pr-4 font-medium text-slate-700">{s.name}</td>
                        <td className="py-2.5 pr-4 text-slate-500">{s.department}</td>
                        <td className="py-2.5 pr-4 text-slate-500">Year {s.year}</td>
                        <td className="py-2.5 pr-4 text-slate-600">{m.role}</td>
                        <td className="py-2.5"><Badge status={s.status} /></td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Add Member Modal */}
        {showAddMember && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
              <div className="flex items-center justify-between p-5 border-b border-slate-200">
                <h3 className="font-semibold text-slate-800">Add Student to Project</h3>
                <button onClick={() => { setShowAddMember(false); setFoundStudent(null); setSearchId(''); }} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Student ID</label>
                  <div className="flex gap-2">
                    <input
                      value={searchId}
                      onChange={e => { setSearchId(e.target.value); setFoundStudent(null); }}
                      placeholder="Search by Student ID…"
                      className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onKeyDown={e => e.key === 'Enter' && searchStudent()}
                    />
                    <button onClick={searchStudent} className="bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-800 transition-colors">Search</button>
                  </div>
                </div>

                {foundStudent === 'not-found' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                    Student not found. Please add the student to the Student Master first.
                  </div>
                )}
                {foundStudent === 'already-added' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                    This student is already a member of this project.
                  </div>
                )}
                {foundStudent && foundStudent !== 'not-found' && foundStudent !== 'already-added' && (
                  <>
                    <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4">
                      <div className="text-xs text-emerald-600 font-semibold mb-1">Student Found</div>
                      <div className="font-semibold text-slate-800">{foundStudent.name}</div>
                      <div className="text-sm text-slate-500 font-mono">{foundStudent.id}</div>
                      <div className="text-sm text-slate-500">{foundStudent.department} · Year {foundStudent.year}</div>
                      <div className="mt-1"><Badge status={foundStudent.status} /></div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Project Role</label>
                      <select value={memberRole} onChange={e => setMemberRole(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        {['Lead', 'Lead Developer', 'Developer', 'Member', 'Intern'].map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-100">
                <button onClick={() => { setShowAddMember(false); setFoundStudent(null); setSearchId(''); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button
                  onClick={addMember}
                  disabled={!foundStudent || foundStudent === 'not-found' || foundStudent === 'already-added'}
                  className="px-4 py-2 text-sm bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 text-white rounded-lg font-medium transition-colors"
                >
                  Add to Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Projects</h2>
          <p className="text-sm text-slate-500">{projectList.length} projects</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors font-medium">
          + Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projectList.map(p => (
          <div key={p.code} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-indigo-300 transition-colors">
            <div className="text-xs text-slate-400 font-mono mb-1">{p.code}</div>
            <div className="font-bold text-slate-800">{p.name}</div>
            {p.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>}
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-slate-500">{p.members.length} students</span>
              <Badge status={p.status} />
            </div>
            <div className="text-xs text-slate-400 mt-1">Created {p.createdDate}</div>
            <button
              onClick={() => { setSelected(p); setView('detail'); }}
              className="mt-3 w-full text-sm text-indigo-700 border border-indigo-200 hover:bg-indigo-50 py-1.5 rounded-lg transition-colors font-medium"
            >
              View Project
            </button>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800 text-lg">Create Project</h3>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Project Code *', key: 'code', placeholder: 'AGRI-01' },
                { label: 'Project Name *', key: 'name', placeholder: 'AgriCheck' },
                { label: 'Description', key: 'description', placeholder: 'Brief description…' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                  <input
                    value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Project['status'] }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {['Active', 'Inactive', 'Completed'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={saveProject} className="px-4 py-2 text-sm bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-medium transition-colors">Create Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
