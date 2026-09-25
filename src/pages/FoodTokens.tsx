import { useState } from 'react';
import { foodTokens, students, todayStr } from '../data/mockData';

export default function FoodTokens() {
  const [dateFilter, setDateFilter] = useState(todayStr);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof foodTokens[0] | null>(null);

  const filtered = foodTokens.filter(t => {
    const s = students.find(st => st.id === t.studentId);
    const matchDate = !dateFilter || t.date === dateFilter;
    const matchQ = !search || t.tokenNumber.toLowerCase().includes(search.toLowerCase()) || t.studentId.toLowerCase().includes(search.toLowerCase()) || (s?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchDate && matchQ;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Food Tokens</h2>
        <p className="text-sm text-slate-500">{filtered.length} tokens</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search token, student ID, or name…"
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-3xl mb-3">🎫</div>
            <div className="font-medium text-slate-700">No food tokens found</div>
            <div className="text-sm text-slate-400 mt-1">Try adjusting your filters.</div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Token', 'Student', 'Student ID', 'Project', 'Date', 'Time', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const s = students.find(st => st.id === t.studentId);
                return (
                  <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-indigo-700">{t.tokenNumber}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{s?.name ?? '—'}</td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">{t.studentId}</td>
                    <td className="py-3 px-4 text-slate-600">{t.project || '—'}</td>
                    <td className="py-3 px-4 text-slate-500">{t.date}</td>
                    <td className="py-3 px-4 text-slate-500">{t.time}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => setSelected(t)} className="text-xs text-indigo-600 hover:underline">View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Token Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Token Details</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="text-center bg-indigo-50 rounded-lg p-4">
                <div className="text-xs text-indigo-500 uppercase tracking-wide mb-1">Token Number</div>
                <div className="text-xl font-bold font-mono text-indigo-700">{selected.tokenNumber}</div>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { l: 'Student', v: students.find(s => s.id === selected.studentId)?.name },
                  { l: 'Student ID', v: selected.studentId },
                  { l: 'Project', v: selected.project || '—' },
                  { l: 'Food Date', v: selected.date },
                  { l: 'Issued At', v: selected.time },
                  { l: 'Issued By', v: selected.generatedBy },
                ].map(r => (
                  <div key={r.l} className="flex justify-between">
                    <span className="text-slate-400">{r.l}</span>
                    <span className="font-medium text-slate-700">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-100">
              <button className="px-4 py-2 text-sm border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">Print Again</button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 text-sm bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
