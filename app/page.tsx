'use client';

import { useState } from 'react';

// ── COULEURS LINGUEO ──────────────────────────────────────────────────────────
// Bleu Lingueo #1E3A5F, Turquoise #00C9B1, Blanc, Gris clair

const COLORS = {
  jordan: '#1E3A5F',
  walid: '#00C9B1',
  ken: '#F59E0B',
  philippe: '#8B5CF6',
  bg: '#F4F6F9',
  card: '#FFFFFF',
  border: '#E2E8F0',
  text: '#1A202C',
  muted: '#718096',
  red: '#EF4444',
  green: '#10B981',
  amber: '#F59E0B',
};

const API_KEY = process.env.NEXT_PUBLIC_INTERNAL_API_KEY || '';

type Agent = 'jordan' | 'walid' | 'ken' | 'philippe';

type DashboardData = {
  generatedAt: string;
  jordan: {
    weeklyScore: string;
    scoreTrend: string;
    criticalAlerts: number;
    summary: string;
    priorities: string[];
    weeklyStakes?: string;
    poB2B?: string;
    poB2C?: string;
    poTotal?: string;
    salesAnalysis?: { name: string; oppsCreated: number; oppsLost: number; amount: string; alert: boolean; note: string }[];
  };
  walid: {
    followupsSuggested: number;
    urgentFollowups: string[];
    meetings: { company: string; date: string; time: string; type: string; stake: string; disc: string; status: string }[];
  };
  ken: {
    openRevenue: string;
    newOppsThisWeek: number;
    newOppsAmount: string;
    wonThisWeek: number;
    wonAmount: string;
    lostThisWeek: number;
    lostAmount: string;
    topLostReason: string;
    alerts: string[];
    oppsDetail?: { name: string; commercial: string; amount: string; type: string; status: string; reason?: string }[];
  };
  philippe: {
    rdvsAnalyzed: number;
    avgScore: string;
    alerts: string[];
    coaching?: { commercial: string; score: string; strength: string; axis: string; disc: string }[];
  };
  rapport: string;
};

// ── COMPOSANTS UI ─────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: COLORS.jordan, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>L</span>
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.jordan, letterSpacing: '-0.02em' }}>Lingueo</div>
        <div style={{ fontSize: 11, color: COLORS.muted, marginTop: -2 }}>OS Commercial · Agents IA</div>
      </div>
    </div>
  );
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  const map: Record<string, { bg: string; text: string }> = {
    red: { bg: '#FEE2E2', text: '#DC2626' },
    green: { bg: '#D1FAE5', text: '#059669' },
    amber: { bg: '#FEF3C7', text: '#D97706' },
    blue: { bg: '#DBEAFE', text: '#1D4ED8' },
    purple: { bg: '#EDE9FE', text: '#7C3AED' },
    teal: { bg: '#CCFBF1', text: '#0D9488' },
    gray: { bg: '#F3F4F6', text: '#6B7280' },
  };
  const c = map[color] || map.gray;
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: c.bg, color: c.text, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

function KpiCard({ label, value, sub, color, icon }: { label: string; value: string | number; sub?: string; color?: string; icon?: string }) {
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 140 }}>
      {icon && <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>}
      <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 500, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || COLORS.text, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function SectionCard({ title, color, children, badge }: { title: string; color: string; children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFBFC' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 4, height: 18, borderRadius: 2, background: color }} />
          <span style={{ fontWeight: 600, fontSize: 14, color: COLORS.text }}>{title}</span>
        </div>
        {badge}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'hausse') return <span style={{ color: COLORS.green, fontWeight: 700 }}>↑</span>;
  if (trend === 'baisse') return <span style={{ color: COLORS.red, fontWeight: 700 }}>↓</span>;
  return <span style={{ color: COLORS.amber, fontWeight: 700 }}>→</span>;
}

function AgentTab({ id, label, color, active, onClick }: { id: string; label: string; color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        borderRadius: 8,
        border: active ? `2px solid ${color}` : `2px solid transparent`,
        background: active ? color : 'transparent',
        color: active ? '#fff' : COLORS.muted,
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {label}
    </button>
  );
}

// ── PANELS ────────────────────────────────────────────────────────────────────

function PanelJordan({ data }: { data: DashboardData }) {
  const j = data.jordan;
  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <KpiCard label="Score semaine" value={j.weeklyScore} sub={j.scoreTrend} color={COLORS.jordan} icon="📊" />
        <KpiCard label="Alertes critiques" value={j.criticalAlerts} color={j.criticalAlerts > 0 ? COLORS.red : COLORS.green} icon="🔴" />
        <KpiCard label="PO B2B" value={j.poB2B || 'N/A'} sub="New Business" color={COLORS.jordan} icon="🏢" />
        <KpiCard label="PO B2C" value={j.poB2C || 'N/A'} sub="Consumer" color={COLORS.walid} icon="👤" />
        <KpiCard label="PO Total" value={j.poTotal || 'N/A'} sub="Mois en cours" color={COLORS.green} icon="💶" />
      </div>

      {/* Enjeux de la semaine */}
      <SectionCard title="Enjeux de la semaine" color={COLORS.jordan}>
        <p style={{ color: COLORS.text, lineHeight: 1.7, margin: 0, fontSize: 14 }}>
          {j.weeklyStakes || j.summary}
        </p>
      </SectionCard>

      {/* Priorités */}
      <SectionCard title="3 actions prioritaires Guillaume" color={COLORS.jordan}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {j.priorities.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: COLORS.jordan, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.5 }}>{p}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Analyse par sales */}
      <SectionCard title="Analyse commerciaux — opportunités semaine" color={COLORS.jordan} badge={<Badge color="blue">Salesforce</Badge>}>
        {j.salesAnalysis && j.salesAnalysis.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {j.salesAnalysis.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: s.alert ? '#FEF2F2' : '#F8FAFC', borderRadius: 10, border: `1px solid ${s.alert ? '#FECACA' : COLORS.border}` }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.alert ? '#FEE2E2' : '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: s.alert ? COLORS.red : COLORS.jordan, flexShrink: 0 }}>
                  {s.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.text }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{s.note}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Badge color="green">{s.oppsCreated} créées</Badge>
                  {s.oppsLost > 0 && <Badge color="red">{s.oppsLost} perdues</Badge>}
                  <Badge color={s.alert ? 'red' : 'blue'}>{s.amount}</Badge>
                  {s.alert && <span style={{ fontSize: 16 }}>⚠️</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: COLORS.muted, fontSize: 14, margin: 0 }}>Données Salesforce non disponibles — déposez un export dans Drive</p>
        )}
      </SectionCard>

      {/* Opportunités */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <SectionCard title={`Opps créées cette semaine`} color={COLORS.green} badge={<Badge color="green">{data.ken.newOppsThisWeek} · {data.ken.newOppsAmount}</Badge>}>
          {data.ken.oppsDetail?.filter(o => o.status === 'created').map((o, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{o.name}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{o.commercial} · {o.type}</div>
              </div>
              <Badge color="green">{o.amount}</Badge>
            </div>
          )) || <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>Aucune donnée disponible</p>}
        </SectionCard>
        <SectionCard title={`Opps perdues cette semaine`} color={COLORS.red} badge={<Badge color="red">{data.ken.lostThisWeek} · {data.ken.lostAmount}</Badge>}>
          {data.ken.oppsDetail?.filter(o => o.status === 'lost').map((o, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{o.name}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{o.commercial} · {o.reason}</div>
              </div>
              <Badge color="red">{o.amount}</Badge>
            </div>
          )) || <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>Aucune donnée disponible</p>}
        </SectionCard>
      </div>
    </div>
  );
}

function PanelWalid({ data }: { data: DashboardData }) {
  const w = data.walid;
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <KpiCard label="RDVs semaine" value={w.meetings.length} icon="📅" color={COLORS.walid} />
        <KpiCard label="Relances suggérées" value={w.followupsSuggested} icon="📧" color={COLORS.amber} />
        <KpiCard label="Urgentes" value={w.urgentFollowups.length} icon="🔴" color={w.urgentFollowups.length > 0 ? COLORS.red : COLORS.green} />
      </div>

      {w.urgentFollowups.length > 0 && (
        <SectionCard title="Relances urgentes" color={COLORS.red} badge={<Badge color="red">Action requise</Badge>}>
          {w.urgentFollowups.map((f, i) => (
            <div key={i} style={{ padding: '10px 14px', background: '#FEF2F2', borderRadius: 8, marginBottom: 8, fontSize: 13, color: COLORS.text, border: '1px solid #FECACA' }}>
              {f}
            </div>
          ))}
        </SectionCard>
      )}

      <SectionCard title="RDVs de la semaine" color={COLORS.walid}>
        {w.meetings.length === 0 ? (
          <p style={{ color: COLORS.muted, fontSize: 14, margin: 0 }}>Aucun RDV détecté dans l'agenda</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {w.meetings.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: '#F8FAFC', borderRadius: 10, border: `1px solid ${COLORS.border}`, alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'center', minWidth: 50 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.jordan }}>{m.time}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{m.date}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.text }}>{m.company}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 3 }}>{m.stake}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <Badge color={m.type === 'closing' ? 'green' : m.type === 'nego' ? 'amber' : 'blue'}>{m.type}</Badge>
                  {m.disc && <Badge color="purple">{m.disc}</Badge>}
                  {m.status && <Badge color="gray">{m.status}</Badge>}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function PanelKen({ data }: { data: DashboardData }) {
  const k = data.ken;
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <KpiCard label="Revenue ouvert" value={k.openRevenue} icon="💶" color={COLORS.jordan} />
        <KpiCard label="Opps créées" value={k.newOppsThisWeek} sub={k.newOppsAmount} icon="✅" color={COLORS.green} />
        <KpiCard label="Opps gagnées" value={k.wonThisWeek} sub={k.wonAmount} icon="🏆" color={COLORS.walid} />
        <KpiCard label="Opps perdues" value={k.lostThisWeek} sub={k.lostAmount} icon="❌" color={COLORS.red} />
      </div>

      {k.alerts.length > 0 && (
        <SectionCard title="Alertes pipeline" color={COLORS.amber} badge={<Badge color="amber">{k.alerts.length} alertes</Badge>}>
          {k.alerts.map((a, i) => (
            <div key={i} style={{ padding: '10px 14px', background: '#FFFBEB', borderRadius: 8, marginBottom: 8, fontSize: 13, color: COLORS.text, border: '1px solid #FDE68A' }}>
              ⚠️ {a}
            </div>
          ))}
        </SectionCard>
      )}

      {k.topLostReason && (
        <SectionCard title="Principale raison de perte" color={COLORS.red}>
          <p style={{ fontSize: 14, color: COLORS.text, margin: 0 }}>🎯 {k.topLostReason}</p>
        </SectionCard>
      )}

      <SectionCard title="Détail des opportunités" color={COLORS.ken}>
        {k.oppsDetail && k.oppsDetail.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Compte', 'Commercial', 'Montant', 'Type', 'Statut', 'Raison'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: COLORS.muted, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {k.oppsDetail.map((o, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{o.name}</td>
                  <td style={{ padding: '10px 12px', color: COLORS.muted }}>{o.commercial}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{o.amount}</td>
                  <td style={{ padding: '10px 12px' }}><Badge color="blue">{o.type}</Badge></td>
                  <td style={{ padding: '10px 12px' }}><Badge color={o.status === 'created' ? 'green' : o.status === 'won' ? 'teal' : 'red'}>{o.status}</Badge></td>
                  <td style={{ padding: '10px 12px', color: COLORS.muted, fontSize: 12 }}>{o.reason || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: COLORS.muted, fontSize: 14, margin: 0 }}>Déposez un export Salesforce dans Drive → data pour l'IA pour activer Ken</p>
        )}
      </SectionCard>
    </div>
  );
}

function PanelPhilippe({ data }: { data: DashboardData }) {
  const p = data.philippe;
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <KpiCard label="RDVs analysés" value={p.rdvsAnalyzed} icon="🎙️" color={COLORS.philippe} />
        <KpiCard label="Score moyen équipe" value={p.avgScore} icon="⭐" color={COLORS.philippe} />
        <KpiCard label="Alertes coaching" value={p.alerts.length} icon="🎯" color={p.alerts.length > 0 ? COLORS.red : COLORS.green} />
      </div>

      {p.alerts.length > 0 && (
        <SectionCard title="Signaux coaching prioritaires" color={COLORS.philippe} badge={<Badge color="purple">Philippe</Badge>}>
          {p.alerts.map((a, i) => (
            <div key={i} style={{ padding: '10px 14px', background: '#F5F3FF', borderRadius: 8, marginBottom: 8, fontSize: 13, color: COLORS.text, border: '1px solid #DDD6FE' }}>
              🎯 {a}
            </div>
          ))}
        </SectionCard>
      )}

      {p.coaching && p.coaching.length > 0 && (
        <SectionCard title="Feedback DISC par commercial" color={COLORS.philippe}>
          {p.coaching.map((c, i) => (
            <div key={i} style={{ padding: '14px 16px', background: '#F8FAFC', borderRadius: 10, marginBottom: 12, border: `1px solid ${COLORS.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{c.commercial}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Badge color="purple">{c.disc}</Badge>
                  <Badge color="blue">{c.score}</Badge>
                </div>
              </div>
              <div style={{ fontSize: 13, color: COLORS.green, marginBottom: 4 }}>✅ {c.strength}</div>
              <div style={{ fontSize: 13, color: COLORS.amber }}>🎯 {c.axis}</div>
            </div>
          ))}
        </SectionCard>
      )}

      {(!p.coaching || p.coaching.length === 0) && (
        <SectionCard title="Activer Philippe" color={COLORS.philippe}>
          <p style={{ color: COLORS.muted, fontSize: 14, margin: 0 }}>
            Déposez des transcriptions de RDVs Meet dans Drive → data pour l'IA → Meet Recordings pour activer le coaching DISC automatique.
          </p>
        </SectionCard>
      )}
    </div>
  );
}

function RapportPanel({ data }: { data: DashboardData }) {
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 28 }}>
      <pre style={{ fontFamily: 'inherit', fontSize: 14, color: COLORS.text, whiteSpace: 'pre-wrap', lineHeight: 1.8, margin: 0 }}>
        {data.rapport}
      </pre>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────

const AGENTS: { id: Agent | 'rapport'; label: string; color: string; icon: string }[] = [
  { id: 'jordan', label: 'Jordan', color: COLORS.jordan, icon: '🤖' },
  { id: 'walid', label: 'Walid', color: COLORS.walid, icon: '📧' },
  { id: 'ken', label: 'Ken — RevOps', color: COLORS.ken, icon: '📊' },
  { id: 'philippe', label: 'Philippe', color: COLORS.philippe, icon: '🎯' },
  { id: 'rapport', label: 'Rapport complet', color: '#64748B', icon: '📋' },
];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agent, setAgent] = useState<Agent | 'rapport'>('jordan');

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dashboard/refresh', {
        method: 'POST',
        headers: { 'x-internal-api-key': API_KEY, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`Erreur ${res.status} — vérifiez que n8n est actif`);
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  const activeColor = AGENTS.find(a => a.id === agent)?.color || COLORS.jordan;

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <header style={{ background: COLORS.card, borderBottom: `1px solid ${COLORS.border}`, padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {data && (
            <div style={{ fontSize: 12, color: COLORS.muted }}>
              Mis à jour le {new Date(data.generatedAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
          <button
            onClick={refresh}
            disabled={loading}
            style={{
              padding: '9px 20px',
              borderRadius: 8,
              border: 'none',
              background: loading ? '#CBD5E1' : COLORS.jordan,
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {loading ? '⏳ Analyse en cours...' : '⚡ Refresh Dashboard'}
          </button>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div style={{ margin: '16px 32px', padding: '12px 16px', borderRadius: 8, background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!data && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)', gap: 16 }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: COLORS.jordan, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>🤖</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.jordan }}>Jordan est prêt</div>
          <div style={{ fontSize: 14, color: COLORS.muted, textAlign: 'center', maxWidth: 400 }}>
            Cliquez sur Refresh pour lancer l'analyse complète : Gmail · Drive · Agenda · Salesforce
          </div>
          <button onClick={refresh} style={{ marginTop: 8, padding: '12px 28px', borderRadius: 10, border: 'none', background: COLORS.jordan, color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
            Lancer la repasse Jordan
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)', gap: 16 }}>
          <div style={{ fontSize: 40 }}>⚙️</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.jordan }}>Jordan orchestre les agents...</div>
          <div style={{ fontSize: 13, color: COLORS.muted }}>Gmail · Agenda · Drive · GPT-4o en cours d'analyse</div>
        </div>
      )}

      {/* Dashboard */}
      {data && !loading && (
        <div style={{ padding: '24px 32px' }}>
          {/* Score banner */}
          <div style={{ background: COLORS.jordan, borderRadius: 14, padding: '20px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Score de la semaine</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                {data.jordan.weeklyScore} <TrendIcon trend={data.jordan.scoreTrend} />
              </div>
            </div>
            <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{data.jordan.summary}</div>
            </div>
            {data.jordan.criticalAlerts > 0 && (
              <div style={{ background: COLORS.red, borderRadius: 8, padding: '8px 16px', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                🔴 {data.jordan.criticalAlerts} alerte{data.jordan.criticalAlerts > 1 ? 's' : ''} critique{data.jordan.criticalAlerts > 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Agent tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {AGENTS.map(a => (
              <AgentTab key={a.id} id={a.id} label={`${a.icon} ${a.label}`} color={a.color} active={agent === a.id} onClick={() => setAgent(a.id)} />
            ))}
          </div>

          {/* Panel content */}
          {agent === 'jordan' && <PanelJordan data={data} />}
          {agent === 'walid' && <PanelWalid data={data} />}
          {agent === 'ken' && <PanelKen data={data} />}
          {agent === 'philippe' && <PanelPhilippe data={data} />}
          {agent === 'rapport' && <RapportPanel data={data} />}
        </div>
      )}
    </div>
  );
}
