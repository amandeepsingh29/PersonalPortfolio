import React, { useEffect, useState } from 'react';
import { TerminalSquare, Minimize2, Maximize2, Crosshair, Activity } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useDevActiveSection, useInterpolatedDevAccent } from '../hooks/useDevActiveSection';

const commandLinks = [
  { label: 'cd about', target: 'about' },
  { label: 'open projects', target: 'projects' },
  { label: 'tail reads', target: 'reads' },
  { label: 'ping contact', target: 'contact' },
];

const statusFeed = [
  'watcher: incremental build complete',
  'api: heartbeat ok (200)',
  'lint: 0 errors, 0 warnings',
  'cache: warmed project assets',
  'deploy: edge node sync green',
  'tests: smoke suite passed',
];

export default function DevHud() {
  const { isDev } = useTheme();
  const activeSection = useDevActiveSection(isDev);
  const accent = useInterpolatedDevAccent(activeSection, isDev, 340);
  const [minimized, setMinimized] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [clock, setClock] = useState(() => new Date());
  const [latency, setLatency] = useState(16);
  const [logLine, setLogLine] = useState(statusFeed[0]);
  const [lastAction, setLastAction] = useState('idle');
  const [sequence, setSequence] = useState([]);
  const [commandInput, setCommandInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', text: 'dev-shell v0.3 initialized. type help.' },
  ]);

  useEffect(() => {
    if (!isDev) return undefined;

    const onMouseMove = (e) => setMouse({ x: e.clientX, y: e.clientY });
    const tick = setInterval(() => {
      setClock(new Date());
      setLatency(Math.max(8, Math.min(42, Math.round(14 + Math.random() * 22))));
      setLogLine(statusFeed[Math.floor(Math.random() * statusFeed.length)]);
    }, 1200);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearInterval(tick);
    };
  }, [isDev]);

  const uptimeSeconds = Math.floor(performance.now() / 1000);
  const uptimeMins = Math.floor(uptimeSeconds / 60).toString().padStart(2, '0');
  const uptimeSecs = (uptimeSeconds % 60).toString().padStart(2, '0');
  const uptime = `${uptimeMins}:${uptimeSecs}`;

  const runCommand = (target, label = target) => {
    if (target === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLastAction(`executed: ${label}`);
      return;
    }

    const node = document.getElementById(target);
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setLastAction(`executed: ${label}`);
    }
  };

  const appendHistory = (entry) => {
    setHistory((prev) => [...prev.slice(-24), entry]);
  };

  const executeCommand = (raw) => {
    const value = raw.trim();
    if (!value) return;

    appendHistory({ type: 'command', text: `$ ${value}` });

    const [cmd, arg] = value.split(/\s+/, 2);
    if (cmd === 'help') {
      appendHistory({ type: 'output', text: 'commands: help, clear, goto <about|blogs|projects|reads|contact>, top, status, open github' });
      return;
    }

    if (cmd === 'clear') {
      setHistory([{ type: 'output', text: 'console cleared.' }]);
      return;
    }

    if (cmd === 'goto') {
      const target = arg || '';
      if (['about', 'blogs', 'projects', 'reads', 'contact'].includes(target)) {
        runCommand(target, `goto ${target}`);
        appendHistory({ type: 'output', text: `navigated to ${target}.` });
      } else {
        appendHistory({ type: 'output', text: 'unknown route. try goto projects' });
      }
      return;
    }

    if (cmd === 'top') {
      runCommand('top', 'top');
      appendHistory({ type: 'output', text: 'jumped to top.' });
      return;
    }

    if (cmd === 'status') {
      appendHistory({ type: 'output', text: `${logLine} | latency=${latency}ms | uptime=${uptime}` });
      return;
    }

    if (cmd === 'open' && arg === 'github') {
      window.open('https://github.com/amandeepsingh29', '_blank', 'noopener,noreferrer');
      appendHistory({ type: 'output', text: 'opening github...' });
      return;
    }

    appendHistory({ type: 'output', text: `command not found: ${value}` });
  };

  useEffect(() => {
    if (!isDev) return undefined;

    const onKeyDown = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      setSequence((prev) => {
        const next = [...prev.slice(-7), e.key];
        const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
        if (next.join('|') === code.join('|')) {
          document.body.classList.add('dev-overclock');
          setTimeout(() => document.body.classList.remove('dev-overclock'), 2800);
          setLastAction('overclock:// enabled');
        }
        return next;
      });

      if (e.key === '1') runCommand('about', 'hotkey[1] -> about');
      if (e.key === '2') runCommand('projects', 'hotkey[2] -> projects');
      if (e.key === '3') runCommand('reads', 'hotkey[3] -> reads');
      if (e.key === '4') runCommand('contact', 'hotkey[4] -> contact');
      if (e.key === '0') runCommand('top', 'hotkey[0] -> top');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDev]);

  if (!isDev) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[80] hidden md:block">
      <div
        className="w-[320px] rounded-2xl border bg-[#04110d]/85 p-3 backdrop-blur-xl transition-[border-color,box-shadow] duration-300"
        style={{
          borderColor: `rgba(${accent.rgb},0.34)`,
          boxShadow: `0 0 30px rgba(${accent.rgb},0.16)`,
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2" style={{ color: `rgba(${accent.rgb},0.95)` }}>
            <TerminalSquare size={14} />
            <span className="text-[11px] font-bold tracking-[0.2em]">DEV CONSOLE // {activeSection.toUpperCase()}</span>
          </div>
          <button
            type="button"
            onClick={() => setMinimized((prev) => !prev)}
            className="rounded-md p-1 transition-colors"
            style={{
              color: `rgba(${accent.rgb},0.85)`,
              backgroundColor: 'transparent',
            }}
            aria-label={minimized ? 'Expand developer console' : 'Minimize developer console'}
          >
            {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
        </div>

        {!minimized && (
          <>
            <div className="mb-3 grid grid-cols-3 gap-2 text-[10px]">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2 py-1.5 text-emerald-100">
                <div className="mb-0.5 text-emerald-300/70">FPS LAT</div>
                <div className="font-bold">{latency} ms</div>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2 py-1.5 text-emerald-100">
                <div className="mb-0.5 text-emerald-300/70">UPTIME</div>
                <div className="font-bold">{uptime}</div>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2 py-1.5 text-emerald-100">
                <div className="mb-0.5 text-emerald-300/70">CLOCK</div>
                <div className="font-bold">{clock.toLocaleTimeString('en-US', { hour12: false })}</div>
              </div>
            </div>

            <div className="mb-3 rounded-lg border border-emerald-500/20 bg-black/25 px-2.5 py-2 text-[11px] text-emerald-200/90">
              <div className="mb-1 flex items-center gap-1.5 text-emerald-300/80">
                <Crosshair size={12} />
                <span>Cursor Tracking</span>
              </div>
              <div>mouse.x={mouse.x.toString().padStart(4, '0')} mouse.y={mouse.y.toString().padStart(4, '0')}</div>
            </div>

            <div className="mb-3 rounded-lg border border-emerald-500/20 bg-black/25 px-2.5 py-2 text-[11px] text-emerald-200/90">
              <div className="mb-1 text-emerald-300/80">Live Feed</div>
              <div className="truncate">{logLine}</div>
              <div className="mt-1 text-emerald-300/60">{lastAction}</div>
            </div>

            <div className="space-y-1.5">
              {commandLinks.map((cmd) => (
                <button
                  key={cmd.label}
                  type="button"
                  onClick={() => runCommand(cmd.target, cmd.label)}
                  className="flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-left text-[11px] text-emerald-200 transition-colors"
                  style={{
                    borderColor: `rgba(${accent.rgb},0.24)`,
                    backgroundColor: `rgba(${accent.rgb},0.08)`,
                  }}
                >
                  <span>$ {cmd.label}</span>
                  <Activity size={11} style={{ color: `rgba(${accent.rgb},0.85)` }} />
                </button>
              ))}
            </div>

            <div className="mt-3 rounded-lg border border-emerald-500/20 bg-black/30 p-2">
              <div className="mb-1 max-h-24 overflow-y-auto pr-1 text-[10px]">
                {history.map((entry, idx) => (
                  <p key={`${entry.text}-${idx}`} className={entry.type === 'command' ? 'text-emerald-300' : 'text-emerald-200/75'}>
                    {entry.text}
                  </p>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  executeCommand(commandInput);
                  setCommandInput('');
                }}
                className="flex items-center gap-2 border-t border-emerald-500/20 pt-2"
              >
                <span className="text-[10px] text-emerald-300">$</span>
                <input
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="type command"
                  className="w-full bg-transparent text-[10px] text-emerald-100 placeholder:text-emerald-300/45 outline-none"
                />
              </form>
            </div>

            <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-2 text-[10px] text-emerald-200/75">
              hotkeys: [1] about [2] projects [3] reads [4] contact [0] top
            </div>
          </>
        )}
      </div>
    </div>
  );
}
