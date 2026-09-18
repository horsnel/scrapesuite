"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getToken } from "@/lib/auth-client";

interface ApiKeyItem {
  id: string;
  name: string;
  keyMasked: string;
  keyVisible: string;
  lastUsed: string | null;
  createdAt: string;
}

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKeyDialog, setNewKeyDialog] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await fetch("/api/keys", {
        headers,
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCreate = async () => {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ name: newKeyName || "New Key" }),
      });
      if (res.ok) {
        const data = await res.json();
        setCreatedKey(data.fullKey);
        setNewKeyName("");
        fetchKeys();
      }
    } catch {
      // silently handle
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (keyId: string) => {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`/api/keys?id=${keyId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      if (res.ok) {
        fetchKeys();
      }
    } catch {
      // silently handle
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">API Keys</h1>
          <p className="text-slate-400 text-sm">
            Manage your API keys for authenticating scrape requests.
          </p>
        </div>
        <Dialog
          open={newKeyDialog}
          onOpenChange={(open) => {
            setNewKeyDialog(open);
            if (!open) setCreatedKey(null);
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111827] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">
                Create New API Key
              </DialogTitle>
            </DialogHeader>
            {createdKey ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-green-400 text-sm font-medium mb-2">
                    API Key Created!
                  </p>
                  <p className="text-slate-400 text-xs mb-3">
                    Make sure to copy your API key now. You won&apos;t be able
                    to see it again.
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-[#0b0f1a] rounded px-3 py-2 text-sm text-amber-400 font-mono overflow-x-auto whitespace-nowrap">
                      {createdKey}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        copyToClipboard(createdKey, "created")
                      }
                      className="text-slate-400 hover:text-white shrink-0"
                    >
                      {copiedId === "created" ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => setNewKeyDialog(false)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  placeholder="Key name (e.g., Production)"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="bg-[#0b0f1a] border-white/10 text-white placeholder:text-slate-500"
                />
                <Button
                  onClick={handleCreate}
                  disabled={creating}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                >
                  {creating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Create Key"
                  )}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {keys.map((apiKey) => (
          <Card key={apiKey.id} className="bg-[#111827] border-white/5">
            <CardContent className="p-4">
              {/* Top row: icon + name + delete button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Key className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-medium text-sm truncate">
                      {apiKey.name}
                    </div>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(apiKey.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {/* Key value row: always masked, copy copies the partial visible key */}
              <div className="flex items-center gap-2 mt-3 ml-12">
                <div className="flex-1 bg-[#0b0f1a] rounded-md px-3 py-1.5 min-w-0">
                  <code className="text-xs text-slate-400 font-mono block truncate">
                    {apiKey.keyMasked}
                  </code>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(apiKey.keyVisible, apiKey.id)
                  }
                  className="text-slate-500 hover:text-white shrink-0 p-1"
                  title="Copy key"
                >
                  {copiedId === apiKey.id ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {/* Metadata row */}
              <div className="flex items-center gap-3 mt-2 ml-12">
                <span className="text-xs text-slate-500">
                  Created{" "}
                  {new Date(apiKey.createdAt).toLocaleDateString()}
                </span>
                {apiKey.lastUsed && (
                  <span className="text-xs text-slate-500">
                    Last used{" "}
                    {new Date(apiKey.lastUsed).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {keys.length === 0 && (
          <Card className="bg-[#111827] border-white/5">
            <CardContent className="p-8 text-center">
              <Key className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                No API keys yet.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Create your first API key to start scraping.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
