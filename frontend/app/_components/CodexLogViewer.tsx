"use client";

import { useEffect, useState } from "react";
import type { CodexLogEntry } from "@/app/actions/codexLogger";

interface LogStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDuration: number;
  recentSessions: string[];
}

export function CodexLogViewer({ sessionId }: { sessionId?: string }) {
  const [logs, setLogs] = useState<CodexLogEntry[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const url = sessionId 
          ? `/api/logs?sessionId=${sessionId}`
          : "/api/logs";
        
        const [logsResponse, statsResponse] = await Promise.all([
          fetch(url),
          fetch("/api/logs?stats=true")
        ]);

        if (!logsResponse.ok || !statsResponse.ok) {
          throw new Error("Failed to fetch logs");
        }

        const logsData = await logsResponse.json();
        const statsData = await statsResponse.json();

        setLogs(logsData);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="rounded-[20px] border border-white/15 bg-white/5 p-4 text-xs text-white/70">
        <div className="animate-pulse">Loading logs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[20px] border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200">
        Error loading logs: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      {stats && (
        <div className="rounded-[20px] border border-white/15 bg-white/5 p-4 text-xs text-white/70">
          <h3 className="font-semibold text-white/80 mb-3">Codex Execution Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-white/60">Total Executions</div>
              <div className="text-lg font-semibold text-white">{stats.totalExecutions}</div>
            </div>
            <div>
              <div className="text-white/60">Success Rate</div>
              <div className="text-lg font-semibold text-green-400">
                {stats.totalExecutions > 0 
                  ? Math.round((stats.successfulExecutions / stats.totalExecutions) * 100)
                  : 0}%
              </div>
            </div>
            <div>
              <div className="text-white/60">Failed</div>
              <div className="text-lg font-semibold text-red-400">{stats.failedExecutions}</div>
            </div>
            <div>
              <div className="text-white/60">Avg Duration</div>
              <div className="text-lg font-semibold text-white">{stats.averageDuration}ms</div>
            </div>
          </div>
        </div>
      )}

      {/* Logs */}
      <div className="rounded-[20px] border border-white/15 bg-white/5 p-4 text-xs text-white/70">
        <h3 className="font-semibold text-white/80 mb-3">
          {sessionId ? `Session Logs: ${sessionId}` : "All Logs"}
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-white/50">No logs found</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="border border-white/10 rounded-[12px] p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      log.success ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <span className="font-medium text-white/80">
                      {log.sessionId}
                    </span>
                  </div>
                  <div className="text-white/50">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="text-white/60 mb-1">
                  <strong>Message:</strong> {log.message}
                </div>
                <div className="text-white/60 mb-1">
                  <strong>Command:</strong> {log.command}
                </div>
                <div className="text-white/60 mb-1">
                  <strong>Duration:</strong> {log.duration}ms
                </div>
                <div className="text-white/60 mb-1">
                  <strong>Exit Code:</strong> {log.exitCode}
                </div>
                {log.stdout && (
                  <div className="mt-2">
                    <div className="text-white/60 mb-1"><strong>Output:</strong></div>
                    <pre className="bg-black/40 p-2 rounded text-[10px] text-white/70 whitespace-pre-wrap">
                      {log.stdout}
                    </pre>
                  </div>
                )}
                {log.stderr && (
                  <div className="mt-2">
                    <div className="text-red-400 mb-1"><strong>Errors:</strong></div>
                    <pre className="bg-red-500/10 p-2 rounded text-[10px] text-red-200 whitespace-pre-wrap">
                      {log.stderr}
                    </pre>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
