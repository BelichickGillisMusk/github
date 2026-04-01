import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe,
  Server,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Edit3,
  Save,
  X,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VercelDomain {
  name: string;
  verified: boolean;
  configured: boolean;
  redirect?: string | null;
  createdAt?: number;
}

interface CloudflareZone {
  id: string;
  name: string;
  status: string;
}

type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX' | 'NS' | 'SRV';

interface DnsRecord {
  id: string;
  type: DnsRecordType;
  name: string;
  content: string;
  ttl: number;
  proxied: boolean;
  modified_on?: string;
}

interface DnsForm {
  type: DnsRecordType;
  name: string;
  content: string;
  ttl: number;
  proxied: boolean;
}

const DNS_TYPES: DnsRecordType[] = ['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'NS', 'SRV'];
const PROXIABLE_TYPES: DnsRecordType[] = ['A', 'AAAA', 'CNAME'];

const defaultDnsForm = (): DnsForm => ({
  type: 'A',
  name: '',
  content: '',
  ttl: 1,
  proxied: false,
});

// ─── Shared UI ────────────────────────────────────────────────────────────────

function ErrorBanner({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="flex items-start gap-3 bg-red-900/30 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
      <span className="flex-1">{message}</span>
      <button onClick={onClose}><X className="w-4 h-4 hover:text-white" /></button>
    </div>
  );
}

function SuccessBanner({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="flex items-start gap-3 bg-green-900/30 border border-green-500/30 text-green-300 rounded-xl px-4 py-3 text-sm">
      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
      <span className="flex-1">{message}</span>
      <button onClick={onClose}><X className="w-4 h-4 hover:text-white" /></button>
    </div>
  );
}

function inputCls(extra = '') {
  return `bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 ${extra}`;
}

function btnPrimary(extra = '') {
  return `flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${extra}`;
}

function btnSecondary(extra = '') {
  return `flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${extra}`;
}

function btnDanger(extra = '') {
  return `flex items-center gap-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-300 hover:text-red-200 px-3 py-2 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${extra}`;
}

// ─── Vercel Panel ─────────────────────────────────────────────────────────────

function VercelPanel() {
  const [projectId, setProjectId] = useState('');
  const [loadedId, setLoadedId] = useState('');
  const [domains, setDomains] = useState<VercelDomain[]>([]);
  const [loading, setLoading] = useState(false);
  const [addValue, setAddValue] = useState('');
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState<string | null>(null); // domain being acted on
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadDomains = useCallback(async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/vercel/projects/${encodeURIComponent(id.trim())}/domains`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? json?.message ?? `HTTP ${res.status}`);
      setDomains(json.domains ?? json ?? []);
      setLoadedId(id.trim());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDomain = async () => {
    if (!addValue.trim() || !loadedId) return;
    setAdding(true);
    setError('');
    try {
      const res = await fetch(`/api/vercel/projects/${encodeURIComponent(loadedId)}/domains`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: addValue.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? json?.message ?? `HTTP ${res.status}`);
      setSuccess(`Added ${addValue.trim()}`);
      setAddValue('');
      await loadDomains(loadedId);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAdding(false);
    }
  };

  const removeDomain = async (domain: string) => {
    setBusy(domain);
    setError('');
    try {
      const res = await fetch(
        `/api/vercel/projects/${encodeURIComponent(loadedId)}/domains/${encodeURIComponent(domain)}`,
        { method: 'DELETE' }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? json?.message ?? `HTTP ${res.status}`);
      setSuccess(`Removed ${domain}`);
      await loadDomains(loadedId);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  };

  const verifyDomain = async (domain: string) => {
    setBusy(`verify:${domain}`);
    setError('');
    try {
      const res = await fetch(
        `/api/vercel/projects/${encodeURIComponent(loadedId)}/domains/${encodeURIComponent(domain)}/verify`,
        { method: 'POST' }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? json?.message ?? `HTTP ${res.status}`);
      setSuccess(`Verification triggered for ${domain}`);
      await loadDomains(loadedId);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Project selector */}
      <div className="p-5 bg-zinc-900/50 rounded-2xl border border-white/5">
        <h3 className="font-semibold text-sm text-zinc-400 uppercase tracking-widest mb-3">Project</h3>
        <div className="flex gap-3">
          <input
            className={inputCls('flex-1')}
            placeholder="Vercel project ID or name"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadDomains(projectId)}
          />
          <button
            className={btnSecondary()}
            onClick={() => loadDomains(projectId)}
            disabled={loading || !projectId.trim()}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Load
          </button>
        </div>
      </div>

      {/* Banners */}
      {error && <ErrorBanner message={error} onClose={() => setError('')} />}
      {success && <SuccessBanner message={success} onClose={() => setSuccess('')} />}

      {/* Domain list */}
      {loadedId && (
        <div className="p-5 bg-zinc-900/50 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-zinc-400 uppercase tracking-widest">
              Domains — {loadedId}
            </h3>
            <span className="text-xs text-zinc-500">{domains.length} domain{domains.length !== 1 ? 's' : ''}</span>
          </div>

          {domains.length === 0 ? (
            <p className="text-zinc-500 text-sm py-4 text-center">No domains attached to this project.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {domains.map((d) => (
                <div key={d.name} className="flex items-center gap-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{d.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className={`flex items-center gap-1 text-xs ${d.verified ? 'text-green-400' : 'text-yellow-400'}`}>
                        {d.verified
                          ? <><CheckCircle2 className="w-3 h-3" />Verified</>
                          : <><XCircle className="w-3 h-3" />Unverified</>}
                      </span>
                      <span className={`flex items-center gap-1 text-xs ${d.configured ? 'text-green-400' : 'text-zinc-500'}`}>
                        {d.configured
                          ? <><ShieldCheck className="w-3 h-3" />Configured</>
                          : <><AlertTriangle className="w-3 h-3" />Not configured</>}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!d.verified && (
                      <button
                        className={btnSecondary('text-xs px-2 py-1.5')}
                        onClick={() => verifyDomain(d.name)}
                        disabled={busy === `verify:${d.name}`}
                      >
                        {busy === `verify:${d.name}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                        Verify
                      </button>
                    )}
                    <button
                      className={btnDanger('text-xs px-2 py-1.5')}
                      onClick={() => removeDomain(d.name)}
                      disabled={busy === d.name}
                    >
                      {busy === d.name ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add domain */}
          <div className="flex gap-3 pt-2 border-t border-white/5">
            <input
              className={inputCls('flex-1')}
              placeholder="e.g. app.example.com"
              value={addValue}
              onChange={(e) => setAddValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addDomain()}
            />
            <button className={btnPrimary()} onClick={addDomain} disabled={adding || !addValue.trim()}>
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Cloudflare Panel ─────────────────────────────────────────────────────────

function CloudflarePanel() {
  const [zones, setZones] = useState<CloudflareZone[]>([]);
  const [zonesLoading, setZonesLoading] = useState(false);
  const [selectedZone, setSelectedZone] = useState('');
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [addForm, setAddForm] = useState<DnsForm>(defaultDnsForm());
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<DnsForm>(defaultDnsForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load zones on mount
  useEffect(() => {
    setZonesLoading(true);
    fetch('/api/cloudflare/zones')
      .then((r) => r.json())
      .then((json) => {
        if (json.success === false) throw new Error(JSON.stringify(json.errors));
        setZones((json.result ?? json) as CloudflareZone[]);
      })
      .catch((e) => setError(`Failed to load zones: ${e.message}`))
      .finally(() => setZonesLoading(false));
  }, []);

  const loadRecords = useCallback(async (zoneId: string) => {
    if (!zoneId) return;
    setRecordsLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/cloudflare/zones/${zoneId}/dns_records`);
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(JSON.stringify(json.errors ?? json));
      setRecords((json.result ?? []) as DnsRecord[]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRecordsLoading(false);
    }
  }, []);

  const handleZoneChange = (zoneId: string) => {
    setSelectedZone(zoneId);
    setRecords([]);
    setEditId(null);
    if (zoneId) loadRecords(zoneId);
  };

  const addRecord = async () => {
    if (!selectedZone || !addForm.name || !addForm.content) return;
    setAdding(true);
    setError('');
    try {
      const res = await fetch(`/api/cloudflare/zones/${selectedZone}/dns_records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(JSON.stringify(json.errors ?? json));
      setSuccess(`Added ${addForm.type} record for ${addForm.name}`);
      setAddForm(defaultDnsForm());
      await loadRecords(selectedZone);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (record: DnsRecord) => {
    setEditId(record.id);
    setEditForm({ type: record.type, name: record.name, content: record.content, ttl: record.ttl, proxied: record.proxied });
  };

  const saveEdit = async () => {
    if (!editId || !selectedZone) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/cloudflare/zones/${selectedZone}/dns_records/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(JSON.stringify(json.errors ?? json));
      setSuccess('Record updated');
      setEditId(null);
      await loadRecords(selectedZone);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (id: string, name: string) => {
    setDeleting(id);
    setError('');
    try {
      const res = await fetch(`/api/cloudflare/zones/${selectedZone}/dns_records/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(JSON.stringify(json.errors ?? json));
      setSuccess(`Deleted record ${name}`);
      await loadRecords(selectedZone);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  };

  const DnsFormFields = ({ form, onChange }: { form: DnsForm; onChange: (f: DnsForm) => void }) => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <select
        className={inputCls()}
        value={form.type}
        onChange={(e) => onChange({ ...form, type: e.target.value as DnsRecordType, proxied: PROXIABLE_TYPES.includes(e.target.value as DnsRecordType) ? form.proxied : false })}
      >
        {DNS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <input className={inputCls()} placeholder="Name / @" value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} />
      <input className={inputCls('md:col-span-2')} placeholder="Content / value" value={form.content} onChange={(e) => onChange({ ...form, content: e.target.value })} />
      <div className="flex items-center gap-3">
        <input
          type="number"
          className={inputCls('w-20')}
          placeholder="TTL"
          value={form.ttl}
          min={1}
          onChange={(e) => onChange({ ...form, ttl: parseInt(e.target.value) || 1 })}
        />
        {PROXIABLE_TYPES.includes(form.type) && (
          <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer select-none whitespace-nowrap">
            <input
              type="checkbox"
              className="accent-orange-500"
              checked={form.proxied}
              onChange={(e) => onChange({ ...form, proxied: e.target.checked })}
            />
            Proxied
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Zone selector */}
      <div className="p-5 bg-zinc-900/50 rounded-2xl border border-white/5">
        <h3 className="font-semibold text-sm text-zinc-400 uppercase tracking-widest mb-3">Zone</h3>
        {zonesLoading ? (
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading zones…
          </div>
        ) : (
          <div className="flex gap-3">
            <select
              className={inputCls('flex-1')}
              value={selectedZone}
              onChange={(e) => handleZoneChange(e.target.value)}
            >
              <option value="">— select a zone —</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>{z.name} ({z.status})</option>
              ))}
            </select>
            {selectedZone && (
              <button className={btnSecondary()} onClick={() => loadRecords(selectedZone)} disabled={recordsLoading}>
                {recordsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Refresh
              </button>
            )}
          </div>
        )}
      </div>

      {/* Banners */}
      {error && <ErrorBanner message={error} onClose={() => setError('')} />}
      {success && <SuccessBanner message={success} onClose={() => setSuccess('')} />}

      {/* DNS records table */}
      {selectedZone && (
        <div className="p-5 bg-zinc-900/50 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-zinc-400 uppercase tracking-widest">DNS Records</h3>
            <span className="text-xs text-zinc-500">{records.length} record{records.length !== 1 ? 's' : ''}</span>
          </div>

          {recordsLoading ? (
            <div className="flex items-center justify-center py-8 text-zinc-500 gap-2 text-sm">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading records…
            </div>
          ) : records.length === 0 ? (
            <p className="text-zinc-500 text-sm py-4 text-center">No DNS records found.</p>
          ) : (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-500 text-xs border-b border-white/5">
                    <th className="pb-2 pr-4 font-medium">Type</th>
                    <th className="pb-2 pr-4 font-medium">Name</th>
                    <th className="pb-2 pr-4 font-medium">Content</th>
                    <th className="pb-2 pr-4 font-medium">TTL</th>
                    <th className="pb-2 pr-4 font-medium">Proxy</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {records.map((r) =>
                    editId === r.id ? (
                      <tr key={r.id} className="align-top">
                        <td colSpan={5} className="py-3 pr-4">
                          <DnsFormFields form={editForm} onChange={setEditForm} />
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button className={btnPrimary('px-2 py-1.5 text-xs')} onClick={saveEdit} disabled={saving}>
                              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                              Save
                            </button>
                            <button className={btnSecondary('px-2 py-1.5 text-xs')} onClick={() => setEditId(null)}>
                              <X className="w-3 h-3" /> Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={r.id} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 pr-4">
                          <span className="font-mono text-xs bg-zinc-800 px-2 py-0.5 rounded text-orange-400">{r.type}</span>
                        </td>
                        <td className="py-2.5 pr-4 font-mono text-xs text-zinc-300 max-w-[160px] truncate">{r.name}</td>
                        <td className="py-2.5 pr-4 font-mono text-xs text-zinc-400 max-w-[200px] truncate">{r.content}</td>
                        <td className="py-2.5 pr-4 text-xs text-zinc-500">{r.ttl === 1 ? 'Auto' : r.ttl}</td>
                        <td className="py-2.5 pr-4 text-xs">
                          {r.proxied
                            ? <span className="text-orange-400">On</span>
                            : <span className="text-zinc-600">Off</span>}
                        </td>
                        <td className="py-2.5">
                          <div className="flex gap-2">
                            <button className={btnSecondary('px-2 py-1.5 text-xs')} onClick={() => startEdit(r)}>
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              className={btnDanger('px-2 py-1.5 text-xs')}
                              onClick={() => deleteRecord(r.id, r.name)}
                              disabled={deleting === r.id}
                            >
                              {deleting === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Add record form */}
          <div className="pt-4 border-t border-white/5 space-y-3">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Add Record</h4>
            <DnsFormFields form={addForm} onChange={setAddForm} />
            <button
              className={btnPrimary()}
              onClick={addRecord}
              disabled={adding || !addForm.name.trim() || !addForm.content.trim()}
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

type Panel = 'vercel' | 'cloudflare';

export function DomainManager() {
  const [panel, setPanel] = useState<Panel>('vercel');

  return (
    <div className="space-y-6">
      {/* Panel tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setPanel('vercel')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            panel === 'vercel'
              ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.35)]'
              : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          <Globe className="w-4 h-4" />
          Vercel Domains
        </button>
        <button
          onClick={() => setPanel('cloudflare')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            panel === 'cloudflare'
              ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.35)]'
              : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          <Server className="w-4 h-4" />
          Cloudflare DNS
        </button>
      </div>

      {panel === 'vercel' && <VercelPanel />}
      {panel === 'cloudflare' && <CloudflarePanel />}
    </div>
  );
}
