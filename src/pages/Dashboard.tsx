import { students, projects, foodTokens, dailyFoodLists, todayStr } from '../data/mockData';
import Badge from '../components/Badge';

const kpis = [
  { label: 'Total Students', value: students.length, sub: `${students.filter(s => s.status === 'Active').length} active`, color: 'bg-indigo-50 text-indigo-700', icon: '👤' },
  { label: 'Active Projects', value: projects.filter(p => p.status === 'Active').length, sub: `${projects.length} total`, color: 'bg-sky-50 text-sky-700', icon: '🗂' },
  { label: "Today's Eligible", value: dailyFoodLists.find(l => l.date === todayStr)?.entries.length ?? 0, sub: 'students for food', color: 'bg-emerald-50 text-emerald-700', icon: '✅' },
  { label: 'Tokens Today', value: foodTokens.filter(t => t.date === todayStr).length, sub: 'issued today', color: 'bg-amber-50 text-amber-700', icon: '🎫' },
];

const todayList = dailyFoodLists.find(l => l.date === todayStr);
const todayTokens = foodTokens.filter(t => t.date === todayStr);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-0.5">Overview of incubation students and today's food activity</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-lg mb-3 ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div className="text-2xl font-bold text-slate-800">{kpi.value}</div>
            <div className="text-sm font-medium text-slate-700 mt-0.5">{kpi.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's food summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Today's Food Summary</h3>
            <Badge status={todayList?.status ?? 'Draft'} />
          </div>
          <div className="space-y-3">
            {[
              { label: 'Eligible Students', value: todayList?.entries.length ?? 0 },
              { label: 'Total Tokens', value: todayTokens.length },
              { label: 'Remaining (Eligible)', value: (todayList?.entries.length ?? 0) - todayTokens.length },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center text-sm">
                <span className="text-slate-600">{row.label}</span>
                <span className="font-semibold text-slate-800">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent token activity */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Recent Token Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Token', 'Student', 'ID', 'Time'].map(h => (
                    <th key={h} className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todayTokens.slice(0, 5).map(t => {
                  const student = students.find(s => s.id === t.studentId);
                  return (
                    <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 pr-4 font-mono text-xs text-indigo-700 font-medium">{t.tokenNumber}</td>
                      <td className="py-2.5 pr-4 text-slate-700">{student?.name}</td>
                      <td className="py-2.5 pr-4 text-slate-500">{t.studentId}</td>
                      <td className="py-2.5 pr-4 text-slate-500">{t.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">Active Projects</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.filter(p => p.status === 'Active').map(p => (
            <div key={p.code} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="text-xs text-slate-400 font-mono mb-1">{p.code}</div>
              <div className="font-semibold text-slate-800 text-sm">{p.name}</div>
              <div className="text-xs text-slate-500 mt-1">{p.members.length} students</div>
              <div className="mt-2"><Badge status={p.status} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
