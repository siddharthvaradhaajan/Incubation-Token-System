import { foodTokens, students, projects, dailyFoodLists, todayStr } from '../data/mockData';

const todayList = dailyFoodLists.find(l => l.date === todayStr);
const todayTokens = foodTokens.filter(t => t.date === todayStr);

const projectSummary = projects.map(p => {
  const eligible = todayList?.entries.filter(e => e.project === p.name).length ?? 0;
  const tokens = todayTokens.filter(t => t.project === p.name).length;
  return { name: p.name, code: p.code, eligible, tokens };
});

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Reports</h2>
        <p className="text-sm text-slate-500">Food token and eligibility summary reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Food Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Daily Food Summary</h3>
            <span className="text-xs text-slate-400">{todayStr}</span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Eligible Students', value: todayList?.entries.length ?? 0, color: 'text-indigo-700' },
              { label: 'Total Tokens', value: todayTokens.length, color: 'text-sky-700' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-600">{row.label}</span>
                <span className={`text-lg font-bold ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project-wise Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Project-wise Summary</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Project', 'Eligible', 'Tokens'].map(h => (
                  <th key={h} className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projectSummary.map(p => (
                <tr key={p.code} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2.5 pr-4 font-medium text-slate-700">{p.name}</td>
                  <td className="py-2.5 pr-4 text-slate-600">{p.eligible}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-indigo-700">{p.tokens}</span>
                      {p.eligible > 0 && (
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5 max-w-16">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, (p.tokens / p.eligible) * 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Tokens Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">All Tokens — Today ({todayStr})</h3>
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100">
            <tr>
              {['Token', 'Student', 'ID', 'Project', 'Time'].map(h => (
                <th key={h} className="text-left py-2 pr-6 text-xs font-semibold text-slate-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {todayTokens.map(t => {
              const s = students.find(st => st.id === t.studentId);
              return (
                <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2.5 pr-6 font-mono text-xs text-indigo-700 font-semibold">{t.tokenNumber}</td>
                  <td className="py-2.5 pr-6 font-medium text-slate-700">{s?.name}</td>
                  <td className="py-2.5 pr-6 font-mono text-xs text-slate-400">{t.studentId}</td>
                  <td className="py-2.5 pr-6 text-slate-600">{t.project}</td>
                  <td className="py-2.5 pr-6 text-slate-500">{t.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
