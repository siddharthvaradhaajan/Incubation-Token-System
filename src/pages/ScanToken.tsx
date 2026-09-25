import { useState } from 'react';
import { students, dailyFoodLists, foodTokens as initialTokens, type FoodToken, todayStr } from '../data/mockData';

type ScanState =
  | 'idle'
  | 'found-eligible'
  | 'found-not-eligible'
  | 'not-found'
  | 'generating'
  | 'token-generated'
  | 'duplicate'
  | 'printer-failure';

let tokenCounter = initialTokens.length + 1;

export default function ScanToken() {
  const [state, setState] = useState<ScanState>('idle');
  const [manualId, setManualId] = useState('');
  const [scannedId, setScannedId] = useState('');
  const [generatedToken, setGeneratedToken] = useState<FoodToken | null>(null);
  const [tokens, setTokens] = useState<FoodToken[]>(initialTokens);

  const todayList = dailyFoodLists.find(l => l.date === todayStr);

  const processId = (id: string) => {
    const trimmed = id.trim();
    if (!trimmed) return;
    setScannedId(trimmed);

    const student = students.find(s => s.id.toLowerCase() === trimmed.toLowerCase());
    if (!student) { setState('not-found'); return; }

    const eligible = todayList?.entries.some(e => e.studentId === student.id) ?? false;
    if (!eligible) { setState('found-not-eligible'); return; }

    const existing = tokens.find(t => t.studentId === student.id && t.date === todayStr);
    if (existing) {
      setGeneratedToken(existing);
      setState('duplicate');
      return;
    }

    setState('found-eligible');
  };

  const generateToken = () => {
    const student = students.find(s => s.id === scannedId);
    if (!student) return;
    setState('generating');
    setTimeout(() => {
      const pad = String(tokenCounter++).padStart(3, '0');
      const dateTag = todayStr.replace(/-/g, '').slice(2);
      const newToken: FoodToken = {
        id: String(Date.now()),
        tokenNumber: `INC-${dateTag}-${pad}`,
        studentId: student.id,
        project: todayList?.entries.find(e => e.studentId === student.id)?.project ?? '',
        date: todayStr,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: 'Generated',
        generatedBy: 'Scanner Staff',
      };
      setTokens(prev => [...prev, newToken]);
      setGeneratedToken(newToken);
      // Simulate print success 80% of time, failure 20%
      const printed = Math.random() > 0.2;
      if (printed) {
        setState('token-generated');
      } else {
        setState('printer-failure');
      }
    }, 1200);
  };

  const reset = () => {
    setState('idle');
    setManualId('');
    setScannedId('');
    setGeneratedToken(null);
  };

  const student = students.find(s => s.id === scannedId);
  const eligibilityEntry = todayList?.entries.find(e => e.studentId === scannedId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Scan Student ID</h2>
        <p className="text-sm text-slate-500">Scan the college ID to verify eligibility and generate a food token.</p>
      </div>

      {/* IDLE STATE */}
      {state === 'idle' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-indigo-50 border-b border-indigo-100 p-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-indigo-300 mb-4">
              <span className="text-4xl">⊙</span>
            </div>
            <h3 className="text-lg font-bold text-indigo-800">SCAN COLLEGE ID</h3>
            <p className="text-sm text-indigo-500 mt-1">Waiting for student ID…</p>
          </div>
          <div className="p-6">
            <p className="text-sm font-medium text-slate-600 mb-3 text-center">Or enter Student ID manually:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualId}
                onChange={e => setManualId(e.target.value)}
                placeholder="Enter Student ID (e.g. 23CS101)"
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyDown={e => e.key === 'Enter' && processId(manualId)}
              />
              <button
                onClick={() => processId(manualId)}
                className="bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-800 transition-colors"
              >
                Search
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              {['23CS101', '23CS102', '23CS103'].map(id => (
                <button key={id} onClick={() => { setManualId(id); processId(id); }} className="border border-indigo-200 text-indigo-600 px-2 py-1.5 rounded hover:bg-indigo-50 font-mono transition-colors">
                  {id}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">Quick scan — click an ID to test the flow</p>
          </div>
        </div>
      )}

      {/* FOUND — ELIGIBLE */}
      {state === 'found-eligible' && student && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-emerald-50 border-b border-emerald-100 p-6 text-center">
            <div className="text-4xl mb-2">✓</div>
            <h3 className="text-lg font-bold text-emerald-800">Student Verified</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg shrink-0">{student.name[0]}</div>
              <div>
                <div className="font-bold text-slate-800 text-lg">{student.name}</div>
                <div className="font-mono text-sm text-slate-400">{student.id}</div>
                <div className="text-sm text-slate-500">{student.department} · Year {student.year}</div>
              </div>
            </div>
            {eligibilityEntry?.project && (
              <div className="text-sm text-slate-600"><span className="font-medium">Project:</span> {eligibilityEntry.project}</div>
            )}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <span className="text-emerald-600 font-bold text-lg">✓</span>
              <div>
                <div className="text-sm font-bold text-emerald-800">ELIGIBLE</div>
                <div className="text-xs text-emerald-600">Food Date: {todayStr}</div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={reset} className="flex-1 border border-slate-300 text-slate-600 py-2.5 rounded-lg text-sm hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={generateToken} className="flex-1 bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-800 transition-colors">Generate Food Token</button>
            </div>
          </div>
        </div>
      )}

      {/* GENERATING */}
      {state === 'generating' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 text-center">
          <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-700 rounded-full animate-spin mb-4"></div>
          <div className="font-medium text-slate-700">Generating food token…</div>
        </div>
      )}

      {/* TOKEN READY */}
      {state === 'token-generated' && generatedToken && student && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-emerald-50 border-b border-emerald-100 p-4 text-center">
              <div className="text-3xl mb-1">✓</div>
              <h3 className="font-bold text-emerald-800">TOKEN READY</h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Token Number</div>
                <div className="text-2xl font-bold font-mono text-indigo-700">{generatedToken.tokenNumber}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { l: 'Student', v: student.name },
                  { l: 'Student ID', v: student.id },
                  { l: 'Date', v: generatedToken.date },
                  { l: 'Time', v: generatedToken.time },
                  { l: 'Project', v: generatedToken.project || '—' },
                ].map(r => (
                  <div key={r.l}>
                    <div className="text-xs text-slate-400">{r.l}</div>
                    <div className="font-medium text-slate-700">{r.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Thermal receipt preview */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Token Preview</div>
            <div className="max-w-xs mx-auto bg-white border border-slate-200 rounded font-mono text-xs leading-relaxed p-4 shadow-inner" style={{ fontFamily: 'Courier New, monospace' }}>
              <div className="text-center border-b border-dashed border-slate-300 pb-2 mb-2">
                <div className="font-bold">SRI SAIRAM ENGINEERING COLLEGE</div>
                <div>INCUBATION CENTRE</div>
                <div className="font-bold">FOOD TOKEN</div>
              </div>
              <div className="space-y-1 mb-2">
                <div><span className="text-slate-400">TOKEN:</span> {generatedToken.tokenNumber}</div>
                <div><span className="text-slate-400">Student:</span> {student.name}</div>
                <div><span className="text-slate-400">ID:</span> {student.id}</div>
                <div><span className="text-slate-400">Project:</span> {generatedToken.project || '—'}</div>
                <div><span className="text-slate-400">Date:</span> {generatedToken.date}</div>
                <div><span className="text-slate-400">Meal:</span> Lunch</div>
              </div>
              <div className="text-center border-t border-dashed border-slate-300 pt-2 text-slate-400">
                <div>Please present this</div>
                <div>token at the mess</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 border border-slate-300 text-slate-600 py-2.5 rounded-lg text-sm hover:bg-slate-50 transition-colors">Print Again</button>
            <button onClick={reset} className="flex-1 bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-800 transition-colors">Done</button>
          </div>
        </div>
      )}

      {/* PRINTER FAILURE */}
      {state === 'printer-failure' && generatedToken && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-100 p-4 text-center">
            <div className="text-3xl mb-1">⚠</div>
            <h3 className="font-bold text-amber-800">Printing Failed</h3>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <p className="text-slate-600">The food token was <span className="font-semibold text-emerald-700">created successfully</span>, but the thermal printer did not respond.</p>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="text-xs text-slate-400 mb-1">Token Number</div>
              <div className="font-bold font-mono text-indigo-700 text-lg">{generatedToken.tokenNumber}</div>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button className="w-full border border-amber-400 text-amber-700 py-2 rounded-lg hover:bg-amber-50 transition-colors font-medium">Retry Print</button>
              <button className="w-full border border-slate-300 text-slate-600 py-2 rounded-lg hover:bg-slate-50 transition-colors">Print Again Later</button>
              <button onClick={reset} className="w-full bg-indigo-700 text-white py-2 rounded-lg hover:bg-indigo-800 transition-colors font-medium">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* NOT ELIGIBLE */}
      {state === 'found-not-eligible' && student && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-red-50 border-b border-red-100 p-6 text-center">
            <div className="text-4xl mb-2">✕</div>
            <h3 className="text-lg font-bold text-red-800">Student Not Eligible</h3>
          </div>
          <div className="p-6 space-y-3 text-center">
            <div className="font-bold text-slate-800">{student.name}</div>
            <div className="font-mono text-sm text-slate-400">{student.id}</div>
            <p className="text-sm text-slate-500">This student is not included in today's food eligibility list. No food token was issued.</p>
            <button onClick={reset} className="mt-4 bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-800 transition-colors">Scan Another Student</button>
          </div>
        </div>
      )}

      {/* NOT FOUND */}
      {state === 'not-found' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-6 text-center">
            <div className="text-4xl mb-2">?</div>
            <h3 className="text-lg font-bold text-slate-700">Student Not Found</h3>
          </div>
          <div className="p-6 space-y-3 text-center">
            <p className="text-sm text-slate-500">The scanned student ID <span className="font-mono font-semibold">{scannedId}</span> does not exist in the Student Master.</p>
            <div className="flex gap-3 justify-center mt-4">
              <button onClick={reset} className="border border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors">Try Again</button>
              <button className="bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-800 transition-colors">Add Student</button>
            </div>
          </div>
        </div>
      )}

      {/* DUPLICATE */}
      {state === 'duplicate' && student && generatedToken && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-100 p-6 text-center">
            <div className="text-4xl mb-2">⚠</div>
            <h3 className="text-lg font-bold text-amber-800">Token Already Issued</h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="text-center">
              <div className="font-bold text-slate-800">{student.name}</div>
              <div className="font-mono text-sm text-slate-400">{student.id}</div>
            </div>
            <p className="text-sm text-slate-500 text-center">A food token has already been issued for this student today.</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
              <div className="text-xs text-amber-600 font-semibold mb-1">Existing Token</div>
              <div className="font-bold font-mono text-amber-800">{generatedToken.tokenNumber}</div>
              <div className="text-xs text-slate-500 mt-0.5">Issued: {generatedToken.time}</div>
            </div>
            <div className="flex gap-3 pt-2">
              <button className="flex-1 border border-slate-300 text-slate-600 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors">Print Again</button>
              <button onClick={reset} className="flex-1 bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-800 transition-colors">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
