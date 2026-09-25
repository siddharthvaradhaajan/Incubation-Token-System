import { useState } from 'react';
import {
  dailyFoodLists as initialLists,
  students,
  projects,
  type DailyFoodList,
  type EligibilityEntry,
  tomorrowStr,
} from '../data/mockData';
import Badge from '../components/Badge';

export default function DailyFoodList() {
  const [lists, setLists] = useState<DailyFoodList[]>(initialLists);
  const [selectedDate, setSelectedDate] = useState(tomorrowStr);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [foundStudent, setFoundStudent] = useState<typeof students[0] | null | 'not-found'>(null);
  const [selectedProject, setSelectedProject] = useState('');
  const [bulkProject, setBulkProject] = useState('');
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [toast, setToast] = useState('');

  const currentList = lists.find(l => l.date === selectedDate);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const getOrCreateList = (): DailyFoodList => {
    if (currentList) return currentList;
    const newList: DailyFoodList = { date: selectedDate, status: 'Draft', entries: [] };
    setLists(prev => [...prev, newList]);
    return newList;
  };

  const searchStudent = () => {
    if (currentList?.status === 'Finalized') return;
    const s = students.find(st => st.id.toLowerCase() === searchId.toLowerCase());
    if (!s) { setFoundStudent('not-found'); return; }
    setFoundStudent(s);
    const proj = projects.find(p => p.members.some(m => m.studentId === s.id));
    setSelectedProject(proj?.name ?? '');
  };

  const addStudentToList = () => {
    if (!foundStudent || foundStudent === 'not-found') return;
    const list = getOrCreateList();
    if (list.entries.some(e => e.studentId === foundStudent.id)) {
      showToast(`Student ${foundStudent.id} is already in today's list.`);
      setShowAddStudent(false);
      setFoundStudent(null);
      setSearchId('');
      return;
    }
    const entry: EligibilityEntry = {
      studentId: foundStudent.id,
      project: selectedProject,
      addedBy: 'Admin User',
      status: 'Eligible',
    };
    setLists(prev => prev.map(l => l.date === selectedDate
      ? { ...l, entries: [...l.entries, entry] }
      : l
    ));
    showToast('Student added to food list.');
    setShowAddStudent(false);
    setFoundStudent(null);
    setSearchId('');
  };

  const removeEntry = (studentId: string) => {
    setLists(prev => prev.map(l => l.date === selectedDate
      ? { ...l, entries: l.entries.filter(e => e.studentId !== studentId) }
      : l
    ));
  };

  const finalizeList = () => {
    setLists(prev => prev.map(l => l.date === selectedDate
      ? { ...l, status: 'Finalized', finalizedBy: 'Admin User', finalizedTime: new Date().toLocaleString('en-IN') }
      : l
    ));
    setShowFinalizeConfirm(false);
    showToast('Food eligibility list finalized.');
  };

  const bulkProjectStudents = bulkProject
    ? projects.find(p => p.name === bulkProject)?.members.map(m => students.find(s => s.id === m.studentId)).filter(Boolean) ?? []
    : [];

  const addBulkStudents = () => {
    const list = getOrCreateList();
    const newEntries: EligibilityEntry[] = bulkSelected
      .filter(id => !list.entries.some(e => e.studentId === id))
      .map(id => ({ studentId: id, project: bulkProject, addedBy: 'Admin User', status: 'Eligible' }));
    setLists(prev => prev.map(l => l.date === selectedDate
      ? { ...l, entries: [...l.entries, ...newEntries] }
      : l
    ));
    setBulkSelected([]);
    setBulkProject('');
    setShowBulkAdd(false);
    showToast(`${newEntries.length} student(s) added to food list.`);
  };

  const updatedList = lists.find(l => l.date === selectedDate);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Daily Food Eligibility</h2>
          <p className="text-sm text-slate-500">Prepare the list of students eligible for food on a particular date.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {updatedList?.status !== 'Finalized' && (
            <>
              <button onClick={() => setShowBulkAdd(true)} className="border border-indigo-300 text-indigo-700 text-sm px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
                + Add by Project
              </button>
              <button onClick={() => setShowAddStudent(true)} className="bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors font-medium">
                + Add Student
              </button>
            </>
          )}
          {updatedList && updatedList.status === 'Draft' && updatedList.entries.length > 0 && (
            <button onClick={() => setShowFinalizeConfirm(true)} className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
              Finalize List
            </button>
          )}
        </div>
      </div>

      {/* Date selector + status */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Food Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {updatedList && (
          <div className="flex items-center gap-2 text-sm">
            <Badge status={updatedList.status} />
            {updatedList.status === 'Finalized' && (
              <span className="text-slate-400 text-xs">Finalized by {updatedList.finalizedBy} at {updatedList.finalizedTime}</span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {!updatedList || updatedList.entries.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">▤</div>
            <div className="font-medium text-slate-700">No food eligibility list for this date</div>
            <div className="text-sm text-slate-400 mt-1">Add students to create the list for {selectedDate}.</div>
            <button onClick={() => setShowAddStudent(true)} className="mt-4 bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors">+ Add Student</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['#', 'Student ID', 'Name', 'Dept', 'Project', 'Eligibility', 'Added By', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {updatedList.entries.map((entry, i) => {
                const s = students.find(st => st.id === entry.studentId);
                return (
                  <tr key={entry.studentId} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-400">{i + 1}</td>
                    <td className="py-3 px-4 font-mono text-xs text-indigo-700 font-semibold">{entry.studentId}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{s?.name ?? '—'}</td>
                    <td className="py-3 px-4 text-slate-500">{s?.department}</td>
                    <td className="py-3 px-4 text-slate-600">{entry.project || '—'}</td>
                    <td className="py-3 px-4"><Badge status="Eligible" /></td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{entry.addedBy}</td>
                    <td className="py-3 px-4">
                      {updatedList.status !== 'Finalized' && (
                        <button onClick={() => removeEntry(entry.studentId)} className="text-xs text-red-500 hover:underline">Remove</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Add Student to Food List</h3>
              <button onClick={() => { setShowAddStudent(false); setFoundStudent(null); setSearchId(''); }} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student ID</label>
                <div className="flex gap-2">
                  <input
                    value={searchId}
                    onChange={e => { setSearchId(e.target.value); setFoundStudent(null); }}
                    placeholder="Enter Student ID…"
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={e => e.key === 'Enter' && searchStudent()}
                  />
                  <button onClick={searchStudent} className="bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-800">Search</button>
                </div>
              </div>
              {foundStudent === 'not-found' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">Student not found in Student Master.</div>
              )}
              {foundStudent && foundStudent !== 'not-found' && (
                <>
                  <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4">
                    <div className="text-xs font-semibold text-emerald-600 mb-1">Student Found</div>
                    <div className="font-semibold text-slate-800">{foundStudent.name}</div>
                    <div className="text-sm text-slate-500 font-mono">{foundStudent.id}</div>
                    <div className="text-sm text-slate-500">{foundStudent.department} · Year {foundStudent.year}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                    <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">—</option>
                      {projects.filter(p => p.members.some(m => m.studentId === foundStudent.id)).map(p => (
                        <option key={p.code} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-100">
              <button onClick={() => { setShowAddStudent(false); setFoundStudent(null); setSearchId(''); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={addStudentToList} disabled={!foundStudent || foundStudent === 'not-found'} className="px-4 py-2 text-sm bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 text-white rounded-lg font-medium transition-colors">Add to List</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {showBulkAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Add Students by Project</h3>
              <button onClick={() => { setShowBulkAdd(false); setBulkProject(''); setBulkSelected([]); }} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Project</label>
                <select value={bulkProject} onChange={e => { setBulkProject(e.target.value); setBulkSelected([]); }} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">— Select —</option>
                  {projects.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              {bulkProject && (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 uppercase flex justify-between">
                    <span>Students</span>
                    <button onClick={() => setBulkSelected(bulkSelected.length === bulkProjectStudents.length ? [] : bulkProjectStudents.map(s => s!.id))} className="text-indigo-600 normal-case font-normal hover:underline">
                      {bulkSelected.length === bulkProjectStudents.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {bulkProjectStudents.map(s => s && (
                      <label key={s.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bulkSelected.includes(s.id)}
                          onChange={e => setBulkSelected(prev => e.target.checked ? [...prev, s.id] : prev.filter(id => id !== s.id))}
                          className="accent-indigo-600"
                        />
                        <span className="font-mono text-xs text-indigo-700 w-16 shrink-0">{s.id}</span>
                        <span className="text-sm text-slate-700">{s.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-100">
              <button onClick={() => { setShowBulkAdd(false); setBulkProject(''); setBulkSelected([]); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={addBulkStudents} disabled={bulkSelected.length === 0} className="px-4 py-2 text-sm bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 text-white rounded-lg font-medium transition-colors">
                Add Selected ({bulkSelected.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finalize Confirm */}
      {showFinalizeConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-semibold text-slate-800 text-lg mb-2">Finalize Food List?</h3>
            <p className="text-sm text-slate-500 mb-2">Once finalized, changes may require additional permission.</p>
            <p className="text-sm font-medium text-slate-700 mb-5">{updatedList?.entries.length} students are currently eligible.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowFinalizeConfirm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={finalizeList} className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">Finalize List</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg z-50 transition-opacity">
          {toast}
        </div>
      )}
    </div>
  );
}
