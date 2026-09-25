import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import sairamLogo from '../assets/sairam-engineering-college-logo.png';

const navItems = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/students', icon: '◉', label: 'Students' },
  { to: '/projects', icon: '◈', label: 'Projects' },
  { to: '/daily-food-list', icon: '▤', label: 'Daily Food List' },
  { to: '/scan-token', icon: '⊙', label: 'Scan & Token' },
  { to: '/food-tokens', icon: '▣', label: 'Food Tokens' },
  { to: '/reports', icon: '◫', label: 'Reports' },
];

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/students': 'Students',
  '/projects': 'Projects',
  '/daily-food-list': 'Daily Food List',
  '/scan-token': 'Scan & Generate Token',
  '/food-tokens': 'Food Tokens',
  '/reports': 'Reports',
};

export default function Layout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  const currentTitle = Object.entries(pageTitles).find(([path]) =>
    window.location.pathname.startsWith(path)
  )?.[1] ?? 'Dashboard';

  const handleLogout = () => navigate('/login');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className="flex flex-col bg-indigo-900 text-white transition-all duration-200 shrink-0"
        style={{ width: sidebarOpen ? 240 : 64 }}
      >
        {/* Logo */}
        <div className="px-3 py-4 border-b border-indigo-800">
          {sidebarOpen ? (
            <div>
              <div className="bg-white rounded-lg px-2 py-1.5">
                <img
                  src={sairamLogo}
                  alt="Sri Sairam Engineering College"
                  className="w-full h-10 object-contain"
                />
              </div>
              <div className="mt-2 px-1">
                <div className="font-semibold text-sm leading-tight">Incubation Centre</div>
                <div className="text-indigo-300 text-xs leading-tight mt-0.5">Food Management</div>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 mx-auto bg-white rounded-lg overflow-hidden flex items-center">
              <img
                src={sairamLogo}
                alt="Sairam"
                className="h-8 max-w-none"
              />
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-700 text-white font-medium'
                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                }`
              }
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="text-base shrink-0 w-5 text-center">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}

        </nav>

        {/* User area */}
        <div className="border-t border-indigo-800 p-4">
          {sidebarOpen ? (
            <div>
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-indigo-300 text-xs mb-3">Sairam Incubation Staff</div>
              <button
                onClick={handleLogout}
                className="text-xs text-indigo-300 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>↩</span> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="text-indigo-300 hover:text-white transition-colors text-center w-full"
              title="Logout"
            >↩</button>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-full w-5 h-10 bg-indigo-700 hover:bg-indigo-600 text-white text-xs flex items-center justify-center rounded-r transition-colors z-10"
          style={{ marginLeft: sidebarOpen ? 240 : 64, position: 'fixed' }}
        >
          {sidebarOpen ? '‹' : '›'}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">{currentTitle}</h1>
            <p className="text-xs text-slate-400">Sri Sairam Engineering College · Incubation Centre</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{today}</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">A</div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
