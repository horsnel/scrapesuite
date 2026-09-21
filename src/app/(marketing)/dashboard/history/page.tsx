"use client";

import { useEffect, useState, useCallback } from "react";
import { History, Eye, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchWithTimeout } from "@/lib/auth-client";
import { ContentSkeleton } from "@/components/dashboard-skeletons";

interface ScrapeRecord {
  id: string;
  url: string;
  status: string;
  result: string;
  creditsUsed: number;
  responseMs: number;
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<ScrapeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<string | null>(
    null
  );
  const [selectedUrl, setSelectedUrl] = useState<string>("");

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetchWithTimeout("/api/dashboard/history", {
        credentials: "include",
      });
      if (res && res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading) {
    return <ContentSkeleton rows={5} />;
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Scrape History
        </h1>
        <p className="text-slate-400 text-sm">
          View your past scrape requests and their results.
        </p>
      </div>

      <Card className="bg-[#111827] border-white/5">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            All Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                No scrape history yet.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Make API calls to see results here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5">
                    <TableHead className="text-slate-400">URL</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Credits</TableHead>
                    <TableHead className="text-slate-400">
                      Response Time
                    </TableHead>
                    <TableHead className="text-slate-400">Date</TableHead>
                    <TableHead className="text-slate-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow
                      key={record.id}
                      className="border-white/5"
                    >
                      <TableCell className="text-white font-mono text-xs max-w-[200px] truncate">
                        {record.url}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            record.status === "success"
                              ? "border-green-500/30 text-green-400"
                              : "border-red-500/30 text-red-400"
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {record.creditsUsed}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {record.responseMs}ms
                      </TableCell>
                      <TableCell className="text-slate-400 text-xs">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setSelectedResult(record.result);
                            setSelectedUrl(record.url);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Dialog */}
      <Dialog
        open={!!selectedResult}
        onOpenChange={() => setSelectedResult(null)}
      >
        <DialogContent className="bg-[#111827] border-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-sm font-mono">
              {selectedUrl}
            </DialogTitle>
          </DialogHeader>
          <pre className="bg-[#0b0f1a] rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">
            {selectedResult
              ? JSON.stringify(
                  JSON.parse(selectedResult),
                  null,
                  2
                )
              : ""}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}
