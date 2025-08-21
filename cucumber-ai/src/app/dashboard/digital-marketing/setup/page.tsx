"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, PlugZap, ShieldCheck, Webhook, Users, Globe2, Store, Settings2, Bot, Key, Eye, EyeOff, RefreshCcw, Plus, Pencil, Trash2, MessageCircleMore, Tag, Globe, Star, AlertCircle, Sparkles, Info, Check, X, ToggleLeftIcon } from "lucide-react";
import { format } from "date-fns";
import clsx from "clsx";
import { SiteHeader } from "@/components/site-header";

/**
 * Setup & Integrations Page
 * - Platforms: Link/manage external platforms (Zomato, Google Business, Swiggy, FB/IG, TripAdvisor, Magicpin, EazyDiner)
 * - Team & Roles: Manage users & roles, team assignments, outlet map
 * - Templates & AI Rules: Global reply templates & AI default rules
 * - Webhooks & API Keys: Manage outgoing webhooks, internal API keys
 * - Audit Logs: View recent integration sync/audit events
 *
 * Notes:
 * - This page assumes the presence of tables defined previously:
 *   platform_integrations, review_templates, ai_rules, integration_sync_logs,
 *   organizations, locations, (optional) user_profiles.
 * - For brevity, some columns in user_profiles are inferred (id, full_name, email, role).
 * - RLS should be configured to scope by organization_id.
 */

// ---------- Supabase Client (browser) ----------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient();

// ---------- Types ----------

type UUID = string;

type Organization = {
  id: UUID;
  name: string;
  slug: string;
};

type Location = {
  id: UUID;
  organization_id: UUID;
  name: string;
};

type UserProfile = {
  id: UUID;
  full_name?: string | null;
  email?: string | null;
  role?: string | null; // inferred
};

type PlatformIntegration = {
  id: UUID;
  organization_id: UUID;
  platform: string; // 'zomato' | 'google' | 'swiggy' | 'facebook' | 'instagram' | 'tripadvisor' | 'magicpin' | 'eazydiner'
  external_account_id: string | null;
  credentials: any | null; // JSONB
  scopes: string[] | null;
  is_active: boolean;
  last_synced_at: string | null; // ISO
  config: any | null; // JSONB
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
};

type ReviewTemplate = {
  id: UUID;
  organization_id: UUID;
  name: string;
  platform: string | null;
  rating_min: number | null;
  rating_max: number | null;
  tone: string | null;
  body: string;
  variables: Record<string, string> | null;
  is_active: boolean;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
};

type AiRule = {
  id: UUID;
  organization_id: UUID;
  name: string;
  enabled: boolean;
  platforms: string[] | null;
  rating_min: number | null;
  rating_max: number | null;
  mode: "auto" | "manual" | "hybrid";
  template_id: UUID | null;
  conditions: any | null;
  last_modified_by: UUID | null;
  created_at: string;
  updated_at: string;
};

type SyncLog = {
  id: UUID;
  integration_id: UUID | null;
  organization_id: UUID | null;
  platform: string | null;
  event_type: string | null;
  payload: any | null;
  message: string | null;
  severity: "info" | "warn" | "error" | string;
  created_at: string;
};

// ---------- Helpers ----------

const PLATFORMS = [
  { key: "zomato", label: "Zomato" },
  { key: "google", label: "Google Business" },
  { key: "swiggy", label: "Swiggy" },
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "tripadvisor", label: "TripAdvisor" },
  { key: "magicpin", label: "Magicpin" },
  { key: "eazydiner", label: "EazyDiner" },
] as const;

const MODES = [
  { key: "auto", label: "Auto" },
  { key: "manual", label: "Manual" },
  { key: "hybrid", label: "Hybrid" },
] as const;

const CONDITION_TYPES = [
  { key: 'keywords', label: 'Contains Keywords', type: 'array' },
  { key: 'sentiment', label: 'Sentiment Threshold', type: 'number' },
  { key: 'word_count', label: 'Word Count', type: 'range' },
  { key: 'review_length', label: 'Review Length', type: 'select', options: ['short', 'medium', 'long'] },
  { key: 'time_of_day', label: 'Time of Day', type: 'select', options: ['morning', 'afternoon', 'evening', 'night'] },
  { key: 'day_of_week', label: 'Day of Week', type: 'multiselect', options: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }
];

const TONES = [
  { key: 'neutral', label: 'Neutral', description: 'Professional and balanced' },
  { key: 'thankful', label: 'Thankful', description: 'Appreciative and grateful' },
  { key: 'apologetic', label: 'Apologetic', description: 'Understanding and remorseful' },
  { key: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { key: 'friendly', label: 'Friendly', description: 'Warm and approachable' }
];


function fmtDate(d?: string | null) {
  if (!d) return "—";
  try { return format(new Date(d), "PPpp"); } catch { return d as string; }
}

function pretty(json: any) {
  try { return JSON.stringify(json ?? {}, null, 2); } catch { return String(json ?? ""); }
}

// ---------- Main Component ----------

export default function SetupIntegrationsPage() {
  const [loading, setLoading] = useState(true);

  // You would typically derive organization from session/URL context.
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  const [integrations, setIntegrations] = useState<PlatformIntegration[]>([]);
  const [templates, setTemplates] = useState<ReviewTemplate[]>([]);
  const [aiRules, setAiRules] = useState<AiRule[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);

  const [error, setError] = useState<string | null>(null);

  // Secrets visibility for credentials
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // ---------- Initial Load ----------
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) Get current user + org (replace with your app's logic)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // For demo: pick the first organization owned by user or where settings allow access
        const { data: orgs, error: orgErr } = await supabase
          .from("organizations")
          .select("id,name,slug")
          .eq("owner_id", user.id)
          .limit(1);
        if (orgErr) throw orgErr;
        if (!orgs || orgs.length === 0) throw new Error("No organization found for current user");
        const org = orgs[0] as Organization;
        setOrganization(org);

        // 2) Load locations
        const { data: locs, error: locErr } = await supabase
          .from("locations")
          .select("id,organization_id,name")
          .eq("organization_id", org.id)
          .order("name");
        if (locErr) throw locErr;
        setLocations((locs ?? []) as Location[]);

        // 3) Load platform integrations
        const { data: ints, error: intErr } = await supabase
          .from("platform_integrations")
          .select("*")
          .eq("organization_id", org.id)
          .order("platform");
        if (intErr) throw intErr;
        setIntegrations((ints ?? []) as PlatformIntegration[]);

        // 4) Load users (optional user_profiles table)
        const { data: profs } = await supabase
          .from("user_profiles")
          .select("id, full_name, email, role")
          .limit(200);
        setUsers((profs ?? []) as UserProfile[]);

        // 5) Load templates
        const { data: tmpls, error: tmplErr } = await supabase
          .from("review_templates")
          .select("*")
          .eq("organization_id", org.id)
          .order("updated_at", { ascending: false });
        if (tmplErr) throw tmplErr;
        setTemplates((tmpls ?? []) as ReviewTemplate[]);

        // 6) Load AI rules
        const { data: rules, error: rulesErr } = await supabase
          .from("ai_rules")
          .select("*")
          .eq("organization_id", org.id)
          .order("updated_at", { ascending: false });
        if (rulesErr) throw rulesErr;
        setAiRules((rules ?? []) as AiRule[]);

        // 7) Load audit/sync logs (recent)
        const { data: logs } = await supabase
          .from("integration_sync_logs")
          .select("*")
          .eq("organization_id", org.id)
          .order("created_at", { ascending: false })
          .limit(100);
        setSyncLogs((logs ?? []) as SyncLog[]);
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "Failed to load Setup & Integrations");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading Setup & Integrations…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Couldn’t load Setup & Integrations</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
        <SiteHeader title="Setup & Integrations"/>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Setup & Integrations</h1>
          <p className="text-sm text-muted-foreground">Account linking, roles, templates & AI rules, webhooks and audit logs.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">Org</Badge>
          <span className="font-medium">{organization?.name}</span>
        </div>
      </div>

      <Tabs defaultValue="platforms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="platforms"><PlugZap className="mr-2 h-4 w-4"/>Platforms</TabsTrigger>
          <TabsTrigger value="templates"><Bot className="mr-2 h-4 w-4"/>Templates & AI Rules</TabsTrigger>
          <TabsTrigger value="team"><Users className="mr-2 h-4 w-4"/>Team & Roles</TabsTrigger>
          <TabsTrigger value="webhooks"><Webhook className="mr-2 h-4 w-4"/>Webhooks & Keys</TabsTrigger>
          <TabsTrigger value="audit"><ShieldCheck className="mr-2 h-4 w-4"/>Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-6">
          <PlatformsSection
            organizationId={organization!.id}
            integrations={integrations}
            onRefresh={async () => {
              const { data } = await supabase
                .from("platform_integrations").select("*")
                .eq("organization_id", organization!.id).order("platform");
              setIntegrations((data ?? []) as PlatformIntegration[]);
            }}
            showSecrets={showSecrets}
            setShowSecrets={setShowSecrets}
          />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <TeamRolesSection
            organization={organization!}
            users={users}
            locations={locations}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <TemplatesRulesSection
            organizationId={organization!.id}
            templates={templates}
            setTemplates={setTemplates}
            aiRules={aiRules}
            setAiRules={setAiRules}
          />
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <WebhooksKeysSection organizationId={organization!.id} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <AuditLogsSection logs={syncLogs} />
        </TabsContent>
      </Tabs>
    </div>
    </div>
            </div>
          </div>
        </div>
   </div>   
  );
}

// ---------- Platforms Section ----------

function PlatformsSection({
  organizationId,
  integrations,
  onRefresh,
  showSecrets,
  setShowSecrets,
}: {
  organizationId: UUID;
  integrations: PlatformIntegration[];
  onRefresh: () => Promise<void>;
  showSecrets: Record<string, boolean>;
  setShowSecrets: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const [saving, setSaving] = useState(false);
  const byPlatform = useMemo(() => {
    const map: Record<string, PlatformIntegration | undefined> = {};
    for (const p of integrations) map[p.platform] = p;
    return map;
  }, [integrations]);

  const [form, setForm] = useState<Record<string, { external_account_id: string; credentials: string; scopes: string; is_active: boolean }>>(() => {
    const initial: Record<string, any> = {};
    PLATFORMS.forEach(({ key }) => {
      const curr = (byPlatform[key] ?? null) as PlatformIntegration | null;
      initial[key] = {
        external_account_id: curr?.external_account_id ?? "",
        credentials: curr?.credentials ? JSON.stringify(curr.credentials, null, 2) : "{}",
        scopes: (curr?.scopes ?? []).join(","),
        is_active: curr?.is_active ?? false,
      };
    });
    return initial;
  });

  const handleSave = async (key: string) => {
    setSaving(true);
    try {
      const payload = form[key];
      const credentials = JSON.parse(payload.credentials || "{}");
      const scopes = payload.scopes
        ? payload.scopes.split(",").map((s) => s.trim()).filter(Boolean)
        : null;

      const existing = byPlatform[key];
      if (existing) {
        const { error } = await supabase
          .from("platform_integrations")
          .update({
            external_account_id: payload.external_account_id || null,
            credentials,
            scopes,
            is_active: payload.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("platform_integrations")
          .insert({
            organization_id: organizationId,
            platform: key,
            external_account_id: payload.external_account_id || null,
            credentials,
            scopes,
            is_active: payload.is_active,
          });
        if (error) throw error;
      }
      await onRefresh();
    } catch (e: any) {
      alert(e?.message ?? "Failed to save integration");
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async (key: string) => {
    // This would normally trigger a server action / edge function.
    alert(`Requested sync for ${key}. Hook this to your Edge Function.`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {PLATFORMS.map(({ key, label }) => {
        const curr = byPlatform[key];
        const visible = !!showSecrets[key];
        return (
          <Card key={key} className="flex flex-col">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <img
                    src={`/assets/${key}-logo.png`}
                    alt={label}
                    className="h-10 w-10"
                    style={{ objectFit: "contain" }}
                />
                {label}
            </CardTitle>
              <CardDescription>
                {curr ? (
                  <span className="flex items-center gap-2 text-xs">
                    <Badge variant={curr.is_active ? "default" : "secondary"}>
                      {curr.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {curr.last_synced_at ? `Last sync: ${fmtDate(curr.last_synced_at)}` : "Not synced yet"}
                  </span>
                ) : (
                  <span className="text-xs">Not linked</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label>External Account ID</Label>
                <Input
                  placeholder="e.g., placeId/pageId/vendorId"
                  value={form[key].external_account_id}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: { ...f[key], external_account_id: e.target.value } }))}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label>Credentials (JSON)</Label>
                  <Button variant="ghost" size="icon" onClick={() => setShowSecrets((s) => ({ ...s, [key]: !s[key] }))}>
                    {visible ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                  </Button>
                </div>
                <Textarea
                  className={clsx("font-mono text-xs min-h-[120px]", !visible && "blur-sm select-none")}
                  value={form[key].credentials}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: { ...f[key], credentials: e.target.value } }))}
                />
              </div>

              <div className="space-y-1">
                <Label>Scopes (comma-separated)</Label>
                <Input
                  placeholder="business.manage, reviews.read"
                  value={form[key].scopes}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: { ...f[key], scopes: e.target.value } }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor={`active-${key}`}>Active</Label>
                <Switch
                  id={`active-${key}`}
                  checked={form[key].is_active}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, [key]: { ...f[key], is_active: !!v } }))}
                />
              </div>
            </CardContent>
            <CardFooter className="mt-auto flex items-center justify-between gap-2">
              <Button variant="secondary" onClick={() => handleSync(key)} disabled={!byPlatform[key]}>
                <RefreshCcw className="mr-2 h-4 w-4"/> Sync Now
              </Button>
              <Button onClick={() => handleSave(key)} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Pencil className="mr-2 h-4 w-4"/>}
                Save
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

// ---------- Team & Roles Section ----------

function TeamRolesSection({ organization, users, locations }: { organization: Organization; users: UserProfile[]; locations: Location[] }) {
  const [filter, setFilter] = useState<string>("");
  const filtered = useMemo(() => users.filter(u => (
    (u.full_name ?? "").toLowerCase().includes(filter.toLowerCase()) ||
    (u.email ?? "").toLowerCase().includes(filter.toLowerCase())
  )), [users, filter]);

  // Example role assignment stored in user_profiles.role for demo.
  const updateRole = async (userId: UUID, role: string) => {
    const { error } = await supabase.from("user_profiles").update({ role }).eq("id", userId);
    if (error) return alert(error.message);
  };

  // Example outlet assignment via a pivot table (create if exists): organization_user_locations
  const assignOutlet = async (userId: UUID, locationId: UUID) => {
    const { error } = await supabase.from("organization_user_locations").upsert({
      organization_id: organization.id,
      user_id: userId,
      location_id: locationId,
    }, { onConflict: "organization_id,user_id,location_id" });
    if (error) return alert(error.message);
    alert("Assigned to outlet");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-4 w-4"/> Team Members</CardTitle>
          <CardDescription>Manage roles and assign outlets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Input placeholder="Search by name or email" value={filter} onChange={(e) => setFilter(e.target.value)} />
            <Badge variant="outline">{filtered.length} users</Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assign Outlet</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.full_name ?? "—"}</TableCell>
                  <TableCell>{u.email ?? "—"}</TableCell>
                  <TableCell>
                    <Select onValueChange={(v) => updateRole(u.id, v)}>
                      <SelectTrigger className="w-[160px]"><SelectValue placeholder={u.role ?? "member"}/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="area_manager">Area Manager</SelectItem>
                        <SelectItem value="outlet_manager">Outlet Manager</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2"><Store className="h-4 w-4"/> Map Outlet</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="max-h-64 overflow-auto">
                        <DropdownMenuLabel>Assign to outlet</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {locations.map((l) => (
                          <DropdownMenuItem key={l.id} onClick={() => assignOutlet(u.id, l.id)}>
                            {l.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4"/></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* <Alert>
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          For fine-grained access, create a pivot table <code>organization_user_locations</code> with RLS by org.
        </AlertDescription>
      </Alert> */}
    </div>
  );
}

// ---------- Templates & AI Rules Section ----------

function TemplatesRulesSection({ organizationId, templates, setTemplates, aiRules, setAiRules }: {
  organizationId: UUID;
  templates: ReviewTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<ReviewTemplate[]>>;
  aiRules: AiRule[];
  setAiRules: React.Dispatch<React.SetStateAction<AiRule[]>>;
}) {
  // Template state
  const [openTemplate, setOpenTemplate] = useState(false);
  const [tmplForm, setTmplForm] = useState<{ 
    id?: UUID; 
    name: string; 
    platform: string; 
    rating_min: string; 
    rating_max: string; 
    tone: string; 
    body: string; 
    is_active: boolean;
  }>(() => ({ 
    name: "", 
    platform: "", 
    rating_min: "", 
    rating_max: "", 
    tone: "neutral", 
    body: "", 
    is_active: true 
  }));

  // AI Rule state
  const [openRule, setOpenRule] = useState(false);
  const [ruleForm, setRuleForm] = useState<{ 
    id?: UUID; 
    name: string; 
    enabled: boolean; 
    platforms: string[]; 
    rating_min: string; 
    rating_max: string; 
    mode: "auto"|"manual"|"hybrid"; 
    template_id: string; 
    conditions: Record<string, any>;
  }>(() => ({ 
    name: "", 
    enabled: true, 
    platforms: [], 
    rating_min: "", 
    rating_max: "", 
    mode: "auto", 
    template_id: "", 
    conditions: {} 
  }));

  // AI Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [showGenerationDialog, setShowGenerationDialog] = useState(false);

  // Form validation states
  const [templateErrors, setTemplateErrors] = useState<Record<string, string>>({});
  const [ruleErrors, setRuleErrors] = useState<Record<string, string>>({});

  // Helper functions
  const resetTemplateForm = () => {
    setTmplForm({ name: "", platform: "", rating_min: "", rating_max: "", tone: "neutral", body: "", is_active: true });
    setTemplateErrors({});
  };

  const resetRuleForm = () => {
    setRuleForm({ name: "", enabled: true, platforms: [], rating_min: "", rating_max: "", mode: "auto", template_id: "", conditions: {} });
    setRuleErrors({});
  };

  const validateTemplate = () => {
    const errors: Record<string, string> = {};
    if (!tmplForm.name.trim()) errors.name = "Template name is required";
    if (!tmplForm.body.trim()) errors.body = "Template body is required";
    if (tmplForm.rating_min && tmplForm.rating_max) {
      const min = parseInt(tmplForm.rating_min);
      const max = parseInt(tmplForm.rating_max);
      if (min > max) errors.rating_range = "Minimum rating cannot be greater than maximum";
    }
    setTemplateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRule = () => {
    const errors: Record<string, string> = {};
    if (!ruleForm.name.trim()) errors.name = "Rule name is required";
    if (ruleForm.rating_min && ruleForm.rating_max) {
      const min = parseInt(ruleForm.rating_min);
      const max = parseInt(ruleForm.rating_max);
      if (min > max) errors.rating_range = "Minimum rating cannot be greater than maximum";
    }
    setRuleErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // AI Reply Generation
  const generateAIReply = async () => {
    if (!generationPrompt.trim()) {
      alert("Please enter a prompt to generate the reply");
      return;
    }

    setIsGenerating(true);
    try {
      // Replace this with your actual AI API endpoint
      const response = await fetch('/api/ai/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: generationPrompt,
          tone: tmplForm.tone,
          organization_id: organizationId,
          platform: tmplForm.platform,
          rating_range: {
            min: tmplForm.rating_min ? parseInt(tmplForm.rating_min) : null,
            max: tmplForm.rating_max ? parseInt(tmplForm.rating_max) : null
          }
        })
      });

      if (!response.ok) throw new Error('Failed to generate reply');

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      let generatedText = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        generatedText += chunk;
        setTmplForm(prev => ({ ...prev, body: generatedText }));
      }

      setShowGenerationDialog(false);
      setGenerationPrompt("");
    } catch (error) {
      console.error('AI generation failed:', error);
      alert('Failed to generate reply. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Template CRUD operations
  const saveTemplate = async () => {
    if (!validateTemplate()) return;

    const payload = {
      organization_id: organizationId,
      name: tmplForm.name.trim(),
      platform: tmplForm.platform || null,
      rating_min: tmplForm.rating_min ? Number(tmplForm.rating_min) : null,
      rating_max: tmplForm.rating_max ? Number(tmplForm.rating_max) : null,
      tone: tmplForm.tone || null,
      body: tmplForm.body,
      is_active: tmplForm.is_active,
      variables: {},
    };

    try {
      if (tmplForm.id) {
        const { error } = await supabase.from("review_templates").update(payload).eq("id", tmplForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("review_templates").insert(payload);
        if (error) throw error;
      }

      const { data } = await supabase.from("review_templates").select("*").eq("organization_id", organizationId).order("updated_at", { ascending: false });
      setTemplates((data ?? []) as ReviewTemplate[]);
      setOpenTemplate(false);
      resetTemplateForm();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const deleteTemplate = async (id: UUID) => {
    if (!confirm("Delete this template?")) return;
    try {
      const { error } = await supabase.from("review_templates").delete().eq("id", id);
      if (error) throw error;
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  // AI Rule CRUD operations
  const saveRule = async () => {
    if (!validateRule()) return;

    const payload = {
      organization_id: organizationId,
      name: ruleForm.name.trim(),
      enabled: ruleForm.enabled,
      platforms: ruleForm.platforms.length ? ruleForm.platforms : null,
      rating_min: ruleForm.rating_min ? Number(ruleForm.rating_min) : null,
      rating_max: ruleForm.rating_max ? Number(ruleForm.rating_max) : null,
      mode: ruleForm.mode,
      template_id: ruleForm.template_id || null,
      conditions: ruleForm.conditions,
    } as Partial<AiRule> & { organization_id: UUID };

    try {
      if (ruleForm.id) {
        const { error } = await supabase.from("ai_rules").update(payload).eq("id", ruleForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("ai_rules").insert(payload);
        if (error) throw error;
      }

      const { data } = await supabase.from("ai_rules").select("*").eq("organization_id", organizationId).order("updated_at", { ascending: false });
      setAiRules((data ?? []) as AiRule[]);
      setOpenRule(false);
      resetRuleForm();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const deleteRule = async (id: UUID) => {
    if (!confirm("Delete this rule?")) return;
    try {
      const { error } = await supabase.from("ai_rules").delete().eq("id", id);
      if (error) throw error;
      setAiRules((prev) => prev.filter((r) => r.id !== id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Condition helpers
  const addCondition = (type: string) => {
    setRuleForm(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [type]: getDefaultConditionValue(type)
      }
    }));
  };

  const removeCondition = (type: string) => {
    setRuleForm(prev => ({
      ...prev,
      conditions: Object.fromEntries(
        Object.entries(prev.conditions).filter(([key]) => key !== type)
      )
    }));
  };

  const updateCondition = (type: string, value: any) => {
    setRuleForm(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [type]: value
      }
    }));
  };

  const getDefaultConditionValue = (type: string) => {
    const conditionType = CONDITION_TYPES.find(ct => ct.key === type);
    switch (conditionType?.type) {
      case 'array': return [];
      case 'number': return 0;
      case 'range': return { min: 0, max: 100 };
      case 'select': return conditionType.options?.[0] || '';
      case 'multiselect': return [];
      default: return '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Templates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageCircleMore className="h-4 w-4" />
              Reply Templates
            </CardTitle>
            <CardDescription>Create reusable templates for different platforms.</CardDescription>
          </div>
          <Dialog open={openTemplate} onOpenChange={(open) => {
            setOpenTemplate(open);
            if (!open) resetTemplateForm();
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{tmplForm.id ? "Edit Template" : "Create New Template"}</DialogTitle>
                <DialogDescription>
                  {/* Create templates with dynamic placeholders like {"{customer_name}"}, {"{business_name}"}, and {"{review_rating}"}. */}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-3">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="template-name" className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Template Name
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="template-name"
                        value={tmplForm.name}
                        onChange={(e) => setTmplForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="e.g., Positive Review Response"
                        className={templateErrors.name ? "border-red-500" : ""}
                      />
                      {templateErrors.name && (
                        <p className="text-sm text-red-500 mt-1">{templateErrors.name}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="template-platform" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Platform
                      </Label>
                      <Select value={tmplForm.platform} onValueChange={(v) => setTmplForm((f) => ({ ...f, platform: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Platforms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Platforms">All Platforms</SelectItem>
                          {PLATFORMS.map(p => (
                            <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                     <div className="flex flex-col gap-2">
                    <Label htmlFor="template-platform" className="flex items-center gap-2">
                        <ToggleLeftIcon className="h-4 w-4" />
                        Template Active
                      </Label>
                    <Switch
                      id="template-active"
                      checked={tmplForm.is_active}
                      onCheckedChange={(v) => setTmplForm((f) => ({ ...f, is_active: v }))}
                    />
                  </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="rating-min" className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Min Rating
                      </Label>
                      <Select value={tmplForm.rating_min} onValueChange={(v) => setTmplForm((f) => ({ ...f, rating_min: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Any">Any</SelectItem>
                          {[1, 2, 3, 4, 5].map(rating => (
                            <SelectItem key={rating} value={String(rating)}>{rating} ⭐</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="rating-max">Max Rating</Label>
                      <Select value={tmplForm.rating_max} onValueChange={(v) => setTmplForm((f) => ({ ...f, rating_max: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Any">Any</SelectItem>
                          {[1, 2, 3, 4, 5].map(rating => (
                            <SelectItem key={rating} value={String(rating)}>{rating} ⭐</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>Tone</Label>
                      <Select value={tmplForm.tone} onValueChange={(v) => setTmplForm((f) => ({ ...f, tone: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TONES.map(tone => (
                            <SelectItem key={tone.key} value={tone.key}>
                              <div className="flex flex-col">
                                <span>{tone.label}</span>
                                <span className="text-xs text-muted-foreground">{tone.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {templateErrors.rating_range && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{templateErrors.rating_range}</AlertDescription>
                    </Alert>
                  )}

                  {/* <div className="flex items-center gap-2">
                    <Label htmlFor="template-active" className="text-base">Template Active</Label>
                    <Switch
                      id="template-active"
                      checked={tmplForm.is_active}
                      onCheckedChange={(v) => setTmplForm((f) => ({ ...f, is_active: v }))}
                    />
                  </div> */}
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="template-body" className="text-base">
                      Template Content <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowGenerationDialog(true)}
                        disabled={isGenerating}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI Generate
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    id="template-body"
                    value={tmplForm.body}
                    onChange={(e) => setTmplForm((f) => ({ ...f, body: e.target.value }))}
                    placeholder="Write your template here... Use {customer_name}, {business_name}, {review_rating} for dynamic content."
                    className={`min-h-[200px] ${templateErrors.body ? "border-red-500" : ""}`}
                  />

                  {templateErrors.body && (
                    <p className="text-sm text-red-500">{templateErrors.body}</p>
                  )}

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Available Placeholders
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><code>{"{customer_name}"}</code> - Customer's name</div>
                      <div><code>{"{business_name}"}</code> - Your business name</div>
                      <div><code>{"{review_rating}"}</code> - Review rating (1-5)</div>
                      <div><code>{"{review_text}"}</code> - Original review text</div>
                      <div><code>{"{platform}"}</code> - Review platform</div>
                      <div><code>{"{date}"}</code> - Current date</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Template Preview</h4>
                    <div className="bg-background p-3 rounded border">
                      {tmplForm.body || <span className="text-muted-foreground italic">No content to preview</span>}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">With Sample Data</h4>
                    <div className="bg-background p-3 rounded border">
                      {tmplForm.body
                        .replace(/\{customer_name\}/g, "John Smith")
                        .replace(/\{business_name\}/g, "Cucumbers and Spices")
                        .replace(/\{review_rating\}/g, "5")
                        .replace(/\{review_text\}/g, "Great service and friendly staff!")
                        .replace(/\{platform\}/g, "Google Reviews")
                        .replace(/\{date\}/g, new Date().toLocaleDateString())
                        || <span className="text-muted-foreground italic">No content to preview</span>}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpenTemplate(false)}>
                  Cancel
                </Button>
                <Button onClick={saveTemplate} disabled={isGenerating}>
                  {tmplForm.id ? "Update Template" : "Create Template"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircleMore className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates yet</h3>
              <p className="text-muted-foreground mb-4">Create your first reply template to get started.</p>
              <Button onClick={() => setOpenTemplate(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Rating Range</TableHead>
                  <TableHead>Tone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {PLATFORMS.find(p => p.key === t.platform)?.label || "All Platforms"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {t.rating_min ?? 1}–{t.rating_max ?? 5}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {t.tone ?? "neutral"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {t.is_active ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setTmplForm({
                            id: t.id,
                            name: t.name,
                            platform: t.platform ?? "",
                            rating_min: String(t.rating_min ?? ""),
                            rating_max: String(t.rating_max ?? ""),
                            tone: t.tone ?? "neutral",
                            body: t.body,
                            is_active: t.is_active
                          });
                          setOpenTemplate(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteTemplate(t.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* AI Rules */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              AI Response Rules
            </CardTitle>
            <CardDescription>Configure automated response behavior based on conditions.</CardDescription>
          </div>
          <Dialog open={openRule} onOpenChange={(open) => {
            setOpenRule(open);
            if (!open) resetRuleForm();
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{ruleForm.id ? "Edit AI Rule" : "Create New AI Rule"}</DialogTitle>
                <DialogDescription>
                  Configure when and how AI should respond to reviews automatically.
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="targeting">Targeting</TabsTrigger>
                  <TabsTrigger value="conditions">Conditions</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rule-name" className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Rule Name
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="rule-name"
                        value={ruleForm.name}
                        onChange={(e) => setRuleForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="e.g., Auto-reply to 5-star reviews"
                        className={ruleErrors.name ? "border-red-500" : ""}
                      />
                      {ruleErrors.name && (
                        <p className="text-sm text-red-500 mt-1">{ruleErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="rule-mode" className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        Response Mode
                      </Label>
                      <Select value={ruleForm.mode} onValueChange={(v: any) => setRuleForm((f) => ({ ...f, mode: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MODES.map(m => (
                            <SelectItem key={m.key} value={m.key}>
                              <div className="flex flex-col">
                                <span>{m.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {m.key === 'auto' && 'Automatically respond to matching reviews'}
                                  {m.key === 'manual' && 'Flag for manual review and response'}
                                  {m.key === 'hybrid' && 'Generate draft, require approval'}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="rule-template" className="flex items-center gap-2">
                      <MessageCircleMore className="h-4 w-4" />
                      Default Template
                    </Label>
                    <Select value={ruleForm.template_id} onValueChange={(v) => setRuleForm((f) => ({ ...f, template_id: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="No template (AI will generate)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No Template">No template (AI will generate)</SelectItem>
                        {templates.filter(t => t.is_active).map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            <div className="flex flex-col">
                              <span>{t.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {t.platform ? PLATFORMS.find(p => p.key === t.platform)?.label : 'All platforms'} • 
                                {t.rating_min ?? 1}-{t.rating_max ?? 5} ⭐
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="rule-enabled" className="text-base">Rule Enabled</Label>
                    <Switch
                      id="rule-enabled"
                      checked={ruleForm.enabled}
                      onCheckedChange={(v) => setRuleForm((f) => ({ ...f, enabled: v }))}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="targeting" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Rating Range
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={ruleForm.rating_min} onValueChange={(v) => setRuleForm((f) => ({ ...f, rating_min: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Min" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Any">Any</SelectItem>
                            {[1, 2, 3, 4, 5].map(rating => (
                              <SelectItem key={rating} value={String(rating)}>{rating} ⭐</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={ruleForm.rating_max} onValueChange={(v) => setRuleForm((f) => ({ ...f, rating_max: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Max" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Any">Any</SelectItem>
                            {[1, 2, 3, 4, 5].map(rating => (
                              <SelectItem key={rating} value={String(rating)}>{rating} ⭐</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {ruleErrors.rating_range && (
                        <p className="text-sm text-red-500 mt-1">{ruleErrors.rating_range}</p>
                      )}
                    </div>

                    <div>
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Target Platforms
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {PLATFORMS.map((p) => {
                          const active = ruleForm.platforms.includes(p.key);
                          return (
                            <Badge
                              key={p.key}
                              variant={active ? "default" : "outline"}
                              className="cursor-pointer select-none hover:opacity-80"
                              onClick={() => setRuleForm((f) => ({
                                ...f,
                                platforms: active
                                  ? f.platforms.filter(x => x !== p.key)
                                  : [...f.platforms, p.key]
                              }))}
                            >
                              {active && <Check className="w-3 h-3 mr-1" />}
                              {p.label}
                            </Badge>
                          );
                        })}
                      </div>
                      {ruleForm.platforms.length === 0 && (
                        <p className="text-sm text-muted-foreground mt-1">No platforms selected = all platforms</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="conditions" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Advanced Conditions</Label>
                    <Select onValueChange={(value) => addCondition(value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Add condition..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITION_TYPES.filter(ct => !Object.keys(ruleForm.conditions).includes(ct.key)).map(ct => (
                          <SelectItem key={ct.key} value={ct.key}>{ct.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(ruleForm.conditions).map(([conditionType, value]) => {
                      const conditionConfig = CONDITION_TYPES.find(ct => ct.key === conditionType);
                      if (!conditionConfig) return null;

                      return (
                        <div key={conditionType} className="p-4 border rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between mb-3">
                            <Label className="font-medium">{conditionConfig.label}</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCondition(conditionType)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {conditionConfig.type === 'array' && (
                            <div className="space-y-2">
                              <Input
                                placeholder={`Enter ${conditionConfig.label.toLowerCase()} (comma-separated)`}
                                value={Array.isArray(value) ? value.join(', ') : ''}
                                onChange={(e) => updateCondition(conditionType, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                              />
                              <p className="text-xs text-muted-foreground">
                                {conditionType === 'keywords' && 'Reviews containing any of these keywords will match this rule'}
                              </p>
                            </div>
                          )}

                          {conditionConfig.type === 'number' && (
                            <div className="space-y-2">
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="0.0 - 1.0"
                                value={value}
                                onChange={(e) => updateCondition(conditionType, parseFloat(e.target.value) || 0)}
                              />
                              <p className="text-xs text-muted-foreground">
                                {conditionType === 'sentiment' && 'Sentiment score threshold (0 = very negative, 1 = very positive)'}
                              </p>
                            </div>
                          )}

                          {conditionConfig.type === 'range' && (
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                placeholder="Min"
                                value={value?.min || ''}
                                onChange={(e) => updateCondition(conditionType, { ...value, min: parseInt(e.target.value) || 0 })}
                              />
                              <Input
                                type="number"
                                placeholder="Max"
                                value={value?.max || ''}
                                onChange={(e) => updateCondition(conditionType, { ...value, max: parseInt(e.target.value) || 100 })}
                              />
                            </div>
                          )}

                          {conditionConfig.type === 'select' && conditionConfig.options && (
                            <Select value={value} onValueChange={(v) => updateCondition(conditionType, v)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {conditionConfig.options.map(option => (
                                  <SelectItem key={option} value={option} className="capitalize">
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {conditionConfig.type === 'multiselect' && conditionConfig.options && (
                            <div className="flex flex-wrap gap-2">
                              {conditionConfig.options.map(option => {
                                const selected = Array.isArray(value) && value.includes(option);
                                return (
                                  <Badge
                                    key={option}
                                    variant={selected ? "default" : "outline"}
                                    className="cursor-pointer capitalize"
                                    onClick={() => {
                                      const current = Array.isArray(value) ? value : [];
                                      updateCondition(conditionType, selected
                                        ? current.filter(v => v !== option)
                                        : [...current, option]
                                      );
                                    }}
                                  >
                                    {selected && <Check className="w-3 h-3 mr-1" />}
                                    {option}
                                  </Badge>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {Object.keys(ruleForm.conditions).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Settings2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No conditions set. This rule will apply to all matching reviews.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Rule Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {ruleForm.name || "Unnamed rule"}</div>
                      <div><strong>Mode:</strong> {MODES.find(m => m.key === ruleForm.mode)?.label}</div>
                      <div><strong>Platforms:</strong> {ruleForm.platforms.length > 0 ? ruleForm.platforms.map(p => PLATFORMS.find(pl => pl.key === p)?.label).join(', ') : 'All platforms'}</div>
                      <div><strong>Rating Range:</strong> {ruleForm.rating_min || 1}-{ruleForm.rating_max || 5} ⭐</div>
                      <div><strong>Template:</strong> {ruleForm.template_id ? templates.find(t => t.id === ruleForm.template_id)?.name : 'AI Generated'}</div>
                      <div><strong>Status:</strong> {ruleForm.enabled ? 'Enabled' : 'Disabled'}</div>
                    </div>
                  </div>

                  {Object.keys(ruleForm.conditions).length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Active Conditions</h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(ruleForm.conditions).map(([type, value]) => {
                          const config = CONDITION_TYPES.find(ct => ct.key === type);
                          return (
                            <div key={type}>
                              <strong>{config?.label}:</strong> {
                                Array.isArray(value) ? value.join(', ') : 
                                typeof value === 'object' ? `${value.min}-${value.max}` :
                                String(value)
                              }
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpenRule(false)}>
                  Cancel
                </Button>
                <Button onClick={saveRule}>
                  {ruleForm.id ? "Update Rule" : "Create Rule"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {aiRules.length === 0 ? (
            <div className="text-center py-8">
              <Settings2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No AI rules configured</h3>
              <p className="text-muted-foreground mb-4">Create rules to automate your review responses.</p>
              <Button onClick={() => setOpenRule(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Rule
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Rating Range</TableHead>
                  <TableHead>Platforms</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aiRules.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {r.mode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {r.rating_min ?? 1}–{r.rating_max ?? 5}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      {r.platforms && r.platforms.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {r.platforms.slice(0, 2).map(p => (
                            <Badge key={p} variant="secondary" className="text-xs">
                              {PLATFORMS.find(pl => pl.key === p)?.label}
                            </Badge>
                          ))}
                          {r.platforms.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{r.platforms.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline">All</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.template_id ? (
                        <Badge variant="secondary">
                          {templates.find(t => t.id === r.template_id)?.name || 'Unknown'}
                        </Badge>
                      ) : (
                        <Badge variant="outline">AI Generated</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.enabled ? (
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      ) : (
                        <Badge variant="outline">Disabled</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setRuleForm({
                            id: r.id,
                            name: r.name,
                            enabled: r.enabled,
                            platforms: r.platforms ?? [],
                            rating_min: String(r.rating_min ?? ""),
                            rating_max: String(r.rating_max ?? ""),
                            mode: r.mode,
                            template_id: r.template_id ?? "",
                            conditions: r.conditions || {}
                          });
                          setOpenRule(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteRule(r.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* AI Generation Dialog */}
      <Dialog open={showGenerationDialog} onOpenChange={setShowGenerationDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Reply with AI
            </DialogTitle>
            <DialogDescription>
              Describe what kind of reply you want, and AI will generate it for you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="generation-prompt">Generation Prompt</Label>
              <Textarea
                id="generation-prompt"
                value={generationPrompt}
                onChange={(e) => setGenerationPrompt(e.target.value)}
                placeholder="e.g., Write a professional thank you response for a 5-star review mentioning our excellent customer service..."
                className="min-h-[100px]"
              />
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium mb-2">Context Information</h4>
              <div className="text-sm space-y-1">
                <div><strong>Tone:</strong> {TONES.find(t => t.key === tmplForm.tone)?.label}</div>
                <div><strong>Platform:</strong> {tmplForm.platform ? PLATFORMS.find(p => p.key === tmplForm.platform)?.label : 'All platforms'}</div>
                {(tmplForm.rating_min || tmplForm.rating_max) && (
                  <div><strong>Rating Range:</strong> {tmplForm.rating_min || 1}-{tmplForm.rating_max || 5} ⭐</div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowGenerationDialog(false)} disabled={isGenerating}>
              Cancel
            </Button>
            <Button onClick={generateAIReply} disabled={isGenerating || !generationPrompt.trim()}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Reply
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------- Webhooks & API Keys Section ----------

function WebhooksKeysSection({ organizationId }: { organizationId: UUID }) {
  const [apiKey, setApiKey] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [events, setEvents] = useState<string[]>(["integration.synced", "review.created", "refund.updated"]);

  // Demo storage in platform_integrations.config as a central place (alternatively create a dedicated table)
  const saveApiKey = async () => {
    const { error } = await supabase.from("organizations").update({ settings: { api_key: apiKey } }).eq("id", organizationId);
    if (error) return alert(error.message);
    alert("Saved API key to organization.settings");
  };

  const saveWebhook = async () => {
    const { data, error } = await supabase
      .from("platform_integrations")
      .upsert({
        organization_id: organizationId,
        platform: "internal_webhook",
        credentials: null,
        config: { url: webhookUrl, events },
        is_active: true,
      }, { onConflict: "organization_id,platform,external_account_id" })
      .select("id").single();
    if (error) return alert(error.message);
    alert("Saved webhook config");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Key className="h-4 w-4"/> API Keys</CardTitle>
          <CardDescription>Generate and store keys used by your backend/agents.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label>Internal API Key</Label>
            <Input placeholder="sk_live_***" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={saveApiKey}>Save Key</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Webhook className="h-4 w-4"/> Outgoing Webhooks</CardTitle>
          <CardDescription>Receive events (synced, review created, refund updates).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label>Webhook URL</Label>
            <Input placeholder="https://example.com/webhooks" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Events</Label>
            <div className="flex flex-wrap gap-2">
              {events.map((evt) => (
                <Badge key={evt} className="cursor-pointer select-none" onClick={() => setEvents((es) => es.filter((e) => e !== evt))}>{evt}</Badge>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2"/> Add Event</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {[
                    "integration.synced",
                    "review.created",
                    "review.replied",
                    "ticket.created",
                    "refund.updated",
                  ].filter(e => !events.includes(e)).map((e) => (
                    <DropdownMenuItem key={e} onClick={() => setEvents((es) => [...es, e])}>{e}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={saveWebhook}>Save Webhook</Button>
        </CardFooter>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Rotate credentials regularly. Use RLS policies to isolate org data.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Store third-party tokens encrypted (KMS) before persisting to <code>platform_integrations.credentials</code>.</li>
            <li>Prefer short-lived tokens with refresh flows where supported (Google, FB/IG).</li>
            <li>Limit service key access in server-side contexts only.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- Audit Logs Section ----------

function AuditLogsSection({ logs }: { logs: SyncLog[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit & Sync Logs</CardTitle>
        <CardDescription>Recent integration events and ingestion errors.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="whitespace-nowrap">{fmtDate(l.created_at)}</TableCell>
                <TableCell className="capitalize">{l.platform ?? "—"}</TableCell>
                <TableCell>{l.event_type ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={l.severity === "error" ? "destructive" : l.severity === "warn" ? "secondary" : "default"}>{l.severity}</Badge>
                </TableCell>
                <TableCell className="max-w-[560px] truncate" title={l.message ?? ""}>{l.message ?? ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-end text-xs text-muted-foreground">Showing last {logs.length} events</CardFooter>
    </Card>
  );
}
