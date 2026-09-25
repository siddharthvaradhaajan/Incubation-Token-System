import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { students, projects, foodTokens, dailyFoodLists, todayStr, FoodToken } from '../data/mockData';
import Badge from '../components/Badge';

export default function Dashboard() {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Used' | 'Printed' | 'Generated'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Daily food list calculations
  const todayList = dailyFoodLists.find(l => l.date === todayStr);
  const eligibleCount = todayList?.entries.length ?? 0;
  const todayTokensList = useMemo(() => foodTokens.filter(t => t.date === todayStr), []);
  const tokensGeneratedCount = todayTokensList.length;
  const tokensUsedCount = todayTokensList.filter(t => t.status === 'Used').length;
  const tokensPrintedCount = todayTokensList.filter(t => t.status === 'Printed').length;
  const tokensGeneratedPendingPrint = todayTokensList.filter(t => t.status === 'Generated').length;
  
  // Find which eligible students haven't generated a token yet
  const claimedStudentIds = new Set(todayTokensList.map(t => t.studentId));
  const unclaimedEligible = (todayList?.entries ?? []).filter(e => !claimedStudentIds.has(e.studentId));

  // Project distribution
  const projectStats = useMemo(() => {
    return projects.map(proj => {
      const eligibleInProj = (todayList?.entries ?? []).filter(e => e.project === proj.name).length;
      const tokensInProj = todayTokensList.filter(t => t.project === proj.name);
      const usedInProj = tokensInProj.filter(t => t.status === 'Used').length;
      return {
        project: proj,
        eligible: eligibleInProj,
        tokensIssued: tokensInProj.length,
        used: usedInProj,
      };
    });
  }, [todayList, todayTokensList]);

  // Filtered token feed
  const filteredTokens = useMemo(() => {
    return todayTokensList.filter(t => {
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const student = students.find(s => s.id === t.studentId);
      const matchesSearch =
        searchTerm === '' ||
        t.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.project.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [todayTokensList, statusFilter, searchTerm]);

  const issuanceRate = eligibleCount > 0 ? Math.round((tokensGeneratedCount / eligibleCount) * 100) : 0;
  const redemptionRate = tokensGeneratedCount > 0 ? Math.round((tokensUsedCount / tokensGeneratedCount) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
          <p className="text-sm text-slate-500 mt-0.5">Overview of incubation students and today's food activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/scan-token"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg transition-colors shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span>Scan & Issue Token</span>
          </Link>
          <Link
            to="/daily-food-list"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-xs rounded-lg transition-colors shadow-xs"
          >
            <span>Food List</span>
          </Link>
        </div>
      </div>

      {/* 2. Primary KPI Metric Cards in Structured Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Eligible Students */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-indigo-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Eligible Today</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              ✓
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{eligibleCount}</span>
            <span className="text-xs text-slate-500">students approved</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">List Status:</span>
            <Badge status={todayList?.status ?? 'Draft'} />
          </div>
        </div>

        {/* Metric 2: Tokens Issued */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-indigo-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tokens Issued</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              🎫
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-indigo-700">{tokensGeneratedCount}</span>
            <span className="text-xs font-medium text-emerald-600">{issuanceRate}% of eligible</span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${issuanceRate}%` }}
              ></div>
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-slate-400">
              <span>{tokensGeneratedCount} generated</span>
              <span>{eligibleCount - tokensGeneratedCount} remaining</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Meals Redeemed (Used) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-indigo-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Redeemed / Used</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              🍽
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{tokensUsedCount}</span>
            <span className="text-xs font-medium text-emerald-600">{redemptionRate}% consumed</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>In Dining Progress:</span>
            <span className="font-semibold text-slate-700">{tokensPrintedCount + tokensGeneratedPendingPrint} pending</span>
          </div>
        </div>

        {/* Metric 4: Active Incubation Registry */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-indigo-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Students Registry</span>
            <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
              👥
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{students.length}</span>
            <span className="text-xs text-slate-500">{students.filter(s => s.status === 'Active').length} active</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Active Projects:</span>
            <span className="font-semibold text-slate-700">{projects.filter(p => p.status === 'Active').length} teams</span>
          </div>
        </div>
      </div>

      {/* 3. Operational Overview & Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Food Service Pipeline & Pending Alerts */}
        <div className="space-y-6">
          {/* Service Flow Pipeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                Daily Service Lifecycle
              </h3>
              <span className="text-xs text-slate-400">{todayStr}</span>
            </div>

            <div className="space-y-3.5">
              {/* Step 1: List Eligibility */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">1</div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Approved List</div>
                    <div className="text-[11px] text-slate-500">Students pre-cleared by staff</div>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-800">{eligibleCount}</span>
              </div>

              {/* Step 2: Tokens Generated */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">2</div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Tokens Generated</div>
                    <div className="text-[11px] text-slate-500">ID scanned or verified</div>
                  </div>
                </div>
                <span className="text-sm font-bold text-sky-700">{tokensGeneratedCount}</span>
              </div>

              {/* Step 3: Tokens Printed */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">3</div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Printed Slips</div>
                    <div className="text-[11px] text-slate-500">Thermal paper slip dispatched</div>
                  </div>
                </div>
                <span className="text-sm font-bold text-amber-700">{tokensPrintedCount}</span>
              </div>

              {/* Step 4: Used / Consumed */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">4</div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-900">Meal Redeemed</div>
                    <div className="text-[11px] text-emerald-700">Validated at food counter</div>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-700">{tokensUsedCount}</span>
              </div>
            </div>
          </div>

          {/* Pending / Unclaimed Eligible Alert */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Unclaimed Eligibility ({unclaimedEligible.length})
              </h3>
            </div>

            {unclaimedEligible.length > 0 ? (
              <div className="space-y-2.5">
                {unclaimedEligible.map(e => {
                  const s = students.find(stud => stud.id === e.studentId);
                  return (
                    <div key={e.studentId} className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/70 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{s?.name ?? e.studentId}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{e.studentId} · {e.project}</div>
                      </div>
                      <Link
                        to={`/scan-token?student=${e.studentId}`}
                        className="px-2.5 py-1 text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-xs transition-colors"
                      >
                        Issue
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-slate-50 text-center text-xs text-slate-500 border border-dashed border-slate-200">
                All eligible students have generated their food token for today.
              </div>
            )}
          </div>

          {/* Incubation Projects Quota & Status */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-sm">Project Breakdown</h3>
              <Link to="/projects" className="text-xs text-indigo-600 hover:underline">View all</Link>
            </div>

            <div className="space-y-3">
              {projectStats.map(({ project, eligible, tokensIssued, used }) => (
                <div key={project.code} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{project.name}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{tokensIssued} / {eligible} tokens ({used} used)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${eligible > 0 ? (tokensIssued / eligible) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Token Activity Feed with Filter & Search */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            {/* Header + Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Today's Token Activity</h3>
                <p className="text-xs text-slate-400 mt-0.5">Live log of tokens issued and dining scans</p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {(['All', 'Used', 'Printed', 'Generated'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      statusFilter === tab
                        ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                    <span className="ml-1 text-[10px] opacity-75">
                      ({tab === 'All' ? todayTokensList.length : todayTokensList.filter(t => t.status === tab).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="py-3 flex items-center gap-2">
              <div className="relative flex-1">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Filter by Student ID, Name, or Token #..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Table Stream */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="text-left py-2.5 pr-3 font-semibold">Token No</th>
                    <th className="text-left py-2.5 pr-3 font-semibold">Student</th>
                    <th className="text-left py-2.5 pr-3 font-semibold">Project</th>
                    <th className="text-left py-2.5 pr-3 font-semibold">Time</th>
                    <th className="text-left py-2.5 pr-3 font-semibold">Status</th>
                    <th className="text-right py-2.5 pl-3 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTokens.length > 0 ? (
                    filteredTokens.map(token => {
                      const student = students.find(s => s.id === token.studentId);
                      return (
                        <tr key={token.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 pr-3 font-mono font-semibold text-indigo-700">
                            {token.tokenNumber}
                          </td>
                          <td className="py-3 pr-3">
                            <div className="font-medium text-slate-800">{student?.name ?? 'Unknown'}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{token.studentId} · {student?.department}</div>
                          </td>
                          <td className="py-3 pr-3 text-slate-600">
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                              {token.project}
                            </span>
                          </td>
                          <td className="py-3 pr-3 text-slate-500">
                            <div>{token.time}</div>
                            {token.usedTime && (
                              <div className="text-[10px] text-emerald-600 font-medium">Used at {token.usedTime}</div>
                            )}
                          </td>
                          <td className="py-3 pr-3">
                            <Badge status={token.status} />
                          </td>
                          <td className="py-3 pl-3 text-right">
                            <Link
                              to="/food-tokens"
                              className="text-indigo-600 hover:text-indigo-800 font-medium text-[11px] inline-flex items-center gap-0.5"
                            >
                              View
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                        No tokens found matching the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Showing {filteredTokens.length} of {todayTokensList.length} total tokens</span>
              <Link to="/food-tokens" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Manage All Food Tokens →
              </Link>
            </div>
          </div>

          {/* Quick Informational Notice Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3.5 text-xs text-slate-600">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-sm">
              ℹ
            </div>
            <div>
              <div className="font-semibold text-slate-800">Incubation Canteen Policy Guidelines</div>
              <p className="mt-0.5 text-slate-500 leading-relaxed">
                Eligible students must scan their College ID card at the terminal or present their unique token number at the canteen counter. Printed slips are valid only for the designated lunch window (12:00 PM – 2:30 PM). Tokens cannot be transferred or shared.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
