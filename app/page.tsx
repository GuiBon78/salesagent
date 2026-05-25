'use client';

import { useState } from 'react';

interface DashboardData {
  generatedAt: string;
  jordan?: {
    weeklyScore: string;
    criticalAlerts: number;
    summary: string;
    priorities: string[];
  };
  walid?: {
    meetingsCount: number;
    briefsReady: number;
    followupsSuggested: number;
  };
  ken?: {
    poCurrentMonth: string;
    openRevenue: string;
    weightedPipeline: string;
    closingRate: string;
  };
  veille?: {
    signals: number;
    critical: number;
  };
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dashboard/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-api-key': process.env.NEXT_PUBLIC_INTERNAL_API_KEY || '',
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erreur inconnue');
      }
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date().toLocaleString('fr-FR'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">OS Lingueo</h1>
            <p className="text-slate-400 mt-1">Dashboard Agents IA</p>
          </div>
          <div className="flex items-center gap-4">
            {lastRefresh && (
              <span className="text-slate-400 text-sm">Dernier refresh : {lastRefresh}</span>
            )}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Chargement...' : 'Refresh Dashboard'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            <strong>Erreur :</strong> {error}
          </div>
        )}

        {!data && !loading && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-xl">Cliquez sur <strong className="text-white">Refresh Dashboard</strong> pour charger les données.</p>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.jordan && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold mb-4 text-blue-400">Jordan</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Score hebdo</span>
                    <span className="font-bold text-white">{data.jordan.weeklyScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Alertes critiques</span>
                    <span className="font-bold text-red-400">{data.jordan.criticalAlerts}</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-3">{data.jordan.summary}</p>
                  {data.jordan.priorities && (
                    <ul className="mt-3 space-y-1">
                      {data.jordan.priorities.map((p, i) => (
                        <li key={i} className="text-sm text-slate-300 flex gap-2">
                          <span className="text-blue-400">{i + 1}.</span> {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {data.walid && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold mb-4 text-green-400">Walid</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">RDV semaine</span>
                    <span className="font-bold text-white">{data.walid.meetingsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Briefs prêts</span>
                    <span className="font-bold text-white">{data.walid.briefsReady}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Relances suggérées</span>
                    <span className="font-bold text-white">{data.walid.followupsSuggested}</span>
                  </div>
                </div>
              </div>
            )}

            {data.ken && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold mb-4 text-yellow-400">Ken — RevOps</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">PO mois en cours</span>
                    <span className="font-bold text-white">{data.ken.poCurrentMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Revenue ouvert</span>
                    <span className="font-bold text-white">{data.ken.openRevenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pipeline pondéré</span>
                    <span className="font-bold text-white">{data.ken.weightedPipeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taux de closing</span>
                    <span className="font-bold text-white">{data.ken.closingRate}</span>
                  </div>
                </div>
              </div>
            )}

            {data.veille && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Veille</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Signaux détectés</span>
                    <span className="font-bold text-white">{data.veille.signals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Signaux critiques</span>
                    <span className="font-bold text-red-400">{data.veille.critical}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
