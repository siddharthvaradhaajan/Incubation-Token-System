'use client';

import { useState } from 'react';
import { students, dailyFoodLists, foodTokens as initialTokens, type FoodToken, todayStr } from '@/data/mockData';
import QRCodeSVG from '@/components/QRCodeSVG';

type ScanState =
  | 'idle'
  | 'scanning'
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
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');

  const todayList = dailyFoodLists.find(l => l.date === todayStr);

  const processId = (id: string) => {
    const trimmed = id.trim();
    if (!trimmed) return;
    setScannedId(trimmed);

    // Brief scanning animation state for realism
    setState('scanning');
    setTimeout(() => {
      const student = students.find(s => s.id.toLowerCase() === trimmed.toLowerCase());
      if (!student) {
        setState('not-found');
        return;
      }

      const eligible = todayList?.entries.some(e => e.studentId === student.id) ?? false;
      if (!eligible) {
        setState('found-not-eligible');
        return;
      }

      const existing = tokens.find(t => t.studentId === student.id && t.date === todayStr);
      if (existing) {
        setGeneratedToken(existing);
        setState('duplicate');
        return;
      }

      setState('found-eligible');
    }, 400);
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
      const printed = Math.random() > 0.15;
      if (printed) {
        setState('token-generated');
      } else {
        setState('printer-failure');
      }
    }, 1000);
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

      {/* SCANNING ACTIVE / IDLE STATE */}
      {(state === 'idle' || state === 'scanning') && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          {/* Header Switcher */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'scan'
                  ? 'border-indigo-600 text-indigo-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Optical QR Scanner
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'manual'
                  ? 'border-indigo-600 text-indigo-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Manual ID Entry
            </button>
          </div>

          {/* QR Viewfinder Area */}
          {activeTab === 'scan' ? (
            <div className="p-8 text-center bg-slate-900 text-white relative">
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wider border border-indigo-400/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  SCANNER ACTIVE · 60 FPS
                </div>
                <h3 className="text-base font-bold text-white tracking-wide mt-2">ALIGNED QR CODE SCANNER</h3>
                <p className="text-xs text-slate-400 mt-0.5">Position student ID QR card within the target frame</p>
              </div>

              {/* Viewfinder Frame with Target Corner Brackets & QR Code */}
              <div className="relative inline-block w-64 h-64 p-4 mx-auto">
                {/* 4 Corner Targeting Reticles */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-lg pointer-events-none"></div>

                {/* Subtle Grid Reticle Background */}
                <div className="w-full h-full rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center p-5 shadow-2xl relative overflow-hidden">
                  {/* Real-time Unique QR Code Display */}
                  <div className="p-3 bg-white rounded-lg shadow-lg">
                    <QRCodeSVG value="SRI-SAIRAM-INCUBATION-STUDENT-ID" size={150} color="#0f172a" />
                  </div>

                  {/* Animated Horizontal Laser Scan Beam */}
                  <div className="absolute inset-x-2 animate-laser pointer-events-none z-10">
                    <div className="h-0.5 w-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]"></div>
                    <div className="h-4 w-full bg-linear-to-b from-cyan-400/20 to-transparent"></div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-6">
              <p className="text-sm font-medium text-slate-700 mb-2">Enter College Student Roll No / ID:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualId}
                  onChange={e => setManualId(e.target.value)}
                  placeholder="e.g. 23CS101, 23CS102..."
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase tracking-wide"
                  onKeyDown={e => e.key === 'Enter' && processId(manualId)}
                />
                <button
                  onClick={() => processId(manualId)}
                  className="bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-800 transition-colors cursor-pointer"
                >
                  Verify ID
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-2">Quick select from eligible students:</p>
                <div className="flex flex-wrap gap-2">
                  {students.slice(0, 6).map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setManualId(s.id);
                        processId(s.id);
                      }}
                      className="px-2.5 py-1 text-xs border border-indigo-200 text-indigo-700 rounded-md hover:bg-indigo-50 font-medium tracking-wide transition-colors cursor-pointer"
                    >
                      {s.id} ({s.name.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOUND — ELIGIBLE */}
      {state === 'found-eligible' && student && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="bg-emerald-50 border-b border-emerald-100 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-2xl font-bold mb-2">
              ✓
            </div>
            <h3 className="text-lg font-bold text-emerald-900">Student Verified & Eligible</h3>
            <p className="text-xs text-emerald-700 mt-0.5">Approved in today's incubation food roster</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                  {student.name[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base">{student.name}</div>
                  <div className="text-xs text-indigo-700 font-semibold tracking-wide">{student.id}</div>
                  <div className="text-xs text-slate-500">{student.department} · Year {student.year}</div>
                </div>
              </div>

              {/* Unique Student QR Badge */}
              <div className="text-center shrink-0 p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                <QRCodeSVG value={`STUDENT-${student.id}`} size={56} color="#1e1b4b" />
                <div className="text-[9px] text-slate-400 mt-0.5 tracking-wider">VERIFIED QR</div>
              </div>
            </div>

            {eligibilityEntry?.project && (
              <div className="text-xs text-slate-600 bg-indigo-50/60 border border-indigo-100 rounded-lg p-3 flex items-center justify-between">
                <span>Associated Incubation Project:</span>
                <span className="font-semibold text-indigo-900">{eligibilityEntry.project}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={reset}
                className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={generateToken}
                className="flex-1 bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-800 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Issue Food Token
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERATING TOKEN ANIMATION */}
      {state === 'generating' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-12 text-center">
          <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-700 rounded-full animate-spin mb-4"></div>
          <div className="font-semibold text-slate-800 text-base">Generating Unique Food Token…</div>
          <p className="text-xs text-slate-400 mt-1">Registering serial number and sending to thermal printer</p>
        </div>
      )}

      {/* TOKEN READY WITH UNIQUE QR CODE & THERMAL SLIP */}
      {state === 'token-generated' && generatedToken && student && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="bg-emerald-50 border-b border-emerald-100 p-4 text-center">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-xl font-bold mb-1">
                ✓
              </div>
              <h3 className="font-bold text-emerald-900">Food Token Ready</h3>
              <p className="text-xs text-emerald-700">Token successfully registered and ready for collection</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 mb-0.5">Token Number</div>
                  <div className="text-2xl font-bold text-indigo-900 tracking-wide tabular-nums">{generatedToken.tokenNumber}</div>
                </div>
                {/* Unique Token QR */}
                <div className="p-2 bg-white rounded-lg border border-indigo-200 shadow-xs text-center">
                  <QRCodeSVG value={generatedToken.tokenNumber} size={64} color="#312e81" />
                  <div className="text-[9px] text-indigo-600 font-semibold mt-0.5 tracking-wider">SCAN AT MESS</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400">Student Name:</span>
                  <div className="font-semibold text-slate-800">{student.name}</div>
                </div>
                <div>
                  <span className="text-slate-400">Student ID:</span>
                  <div className="font-semibold text-slate-800 tracking-wide">{student.id}</div>
                </div>
                <div>
                  <span className="text-slate-400">Meal Date & Time:</span>
                  <div className="font-semibold text-slate-800">{generatedToken.date} · {generatedToken.time}</div>
                </div>
                <div>
                  <span className="text-slate-400">Project:</span>
                  <div className="font-semibold text-slate-800">{generatedToken.project || 'General'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Thermal Receipt Preview with QR Code */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Thermal Receipt Print Preview
            </div>
            <div className="max-w-xs mx-auto bg-white border border-slate-300 rounded-lg p-5 text-xs leading-tight shadow-sm text-slate-900">
              <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
                <div className="font-bold text-[13px]">SRI SAIRAM ENGINEERING COLLEGE</div>
                <div className="text-[11px] text-slate-600">INCUBATION CENTRE</div>
                <div className="font-bold text-[13px] mt-1 text-indigo-900">FOOD TOKEN SLIP</div>
              </div>

              {/* Receipt Center QR Code */}
              <div className="flex flex-col items-center justify-center my-3">
                <div className="p-2 border border-slate-400 bg-white">
                  <QRCodeSVG value={generatedToken.tokenNumber} size={90} color="#000000" />
                </div>
                <div className="text-[10px] mt-1 font-bold tracking-widest">{generatedToken.tokenNumber}</div>
              </div>

              <div className="space-y-1.5 border-t border-b border-dashed border-slate-300 py-2.5 my-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">STUDENT:</span>
                  <span className="font-bold">{student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ID NO:</span>
                  <span className="font-bold">{student.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PROJECT:</span>
                  <span>{generatedToken.project || 'Incubation'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SESSION:</span>
                  <span>LUNCH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ISSUED:</span>
                  <span>{generatedToken.time}</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-500 pt-1">
                <div>Present this slip at mess counter</div>
                <div>Valid for 1 meal only · Non-transferable</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => alert(`Printing slip for ${generatedToken.tokenNumber}...`)}
              className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Print Slip Again
            </button>
            <button
              onClick={reset}
              className="flex-1 bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-800 transition-colors shadow-xs cursor-pointer"
            >
              Scan Next Student
            </button>
          </div>
        </div>
      )}

      {/* PRINTER FAILURE */}
      {state === 'printer-failure' && generatedToken && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-100 p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center text-xl font-bold mb-1">
              ⚠
            </div>
            <h3 className="font-bold text-amber-800">Printing Failed</h3>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <p className="text-slate-600">
              The food token was <span className="font-semibold text-emerald-700">created successfully</span>, but the thermal printer did not respond.
            </p>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 mb-1">Token Number</div>
                <div className="font-bold text-indigo-700 text-lg tracking-wide tabular-nums">{generatedToken.tokenNumber}</div>
              </div>
              <QRCodeSVG value={generatedToken.tokenNumber} size={48} color="#1e1b4b" />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => setState('token-generated')}
                className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium cursor-pointer"
              >
                Retry Print
              </button>
              <button
                onClick={reset}
                className="w-full border border-slate-300 text-slate-600 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOT ELIGIBLE */}
      {state === 'found-not-eligible' && student && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="bg-rose-50 border-b border-rose-100 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center text-2xl font-bold mb-2">
              ✕
            </div>
            <h3 className="text-lg font-bold text-rose-800">Student Not Eligible</h3>
          </div>
          <div className="p-6 space-y-3 text-center">
            <div className="font-bold text-slate-800">{student.name}</div>
            <div className="text-sm text-slate-400 font-medium tracking-wide">{student.id} · {student.department}</div>
            <p className="text-sm text-slate-500">
              This student is not included in today's food eligibility list. No food token was issued.
            </p>
            <button
              onClick={reset}
              className="mt-4 bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-800 transition-colors cursor-pointer"
            >
              Scan Another Student
            </button>
          </div>
        </div>
      )}

      {/* NOT FOUND */}
      {state === 'not-found' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 mx-auto flex items-center justify-center text-2xl font-bold mb-2">
              ?
            </div>
            <h3 className="text-lg font-bold text-slate-700">Student Not Found</h3>
          </div>
          <div className="p-6 space-y-3 text-center">
            <p className="text-sm text-slate-500">
              The scanned student ID <span className="font-semibold tracking-wide text-slate-700">{scannedId}</span> does not exist in the Student Master registry.
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <button
                onClick={reset}
                className="border border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DUPLICATE */}
      {state === 'duplicate' && student && generatedToken && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-100 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center text-2xl font-bold mb-2">
              ⚠
            </div>
            <h3 className="text-lg font-bold text-amber-800">Token Already Issued</h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="text-center">
              <div className="font-bold text-slate-800">{student.name}</div>
              <div className="text-sm text-slate-400 font-medium tracking-wide">{student.id}</div>
            </div>
            <p className="text-sm text-slate-500 text-center">
              A food token has already been generated for this student for today's meal session.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-600 font-semibold mb-0.5">Existing Token</div>
                <div className="font-bold text-amber-800 text-base tracking-wide tabular-nums">{generatedToken.tokenNumber}</div>
                <div className="text-xs text-slate-500 mt-0.5">Issued: {generatedToken.time}</div>
              </div>
              <QRCodeSVG value={generatedToken.tokenNumber} size={48} color="#92400e" />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => alert(`Reprinting slip for ${generatedToken.tokenNumber}...`)}
                className="flex-1 border border-slate-300 text-slate-600 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Print Slip Again
              </button>
              <button
                onClick={reset}
                className="flex-1 bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
