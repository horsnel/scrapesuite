'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Download,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Eye,
  Pencil,
  Plus,
  MoreHorizontal,
  ArrowUpDown,
  Package,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  ChevronDown,
  ShoppingBag,
  Database,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MY_ITEMS,
  CATEGORY_ICONS,
  formatNumber,
  getPriceLabel,
  type ItemStatus,
  type MarketplaceItem,
} from '@/lib/marketplace-data';

function StatusBadge({ status }: { status: ItemStatus }) {
  switch (status) {
    case 'published':
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
          <CheckCircle2 className="size-3 mr-1" />
          Published
        </Badge>
      );
    case 'draft':
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
          <Clock className="size-3 mr-1" />
          Draft
        </Badge>
      );
    case 'deprecated':
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
          <AlertCircle className="size-3 mr-1" />
          Deprecated
        </Badge>
      );
    default:
      return null;
  }
}

export default function MyItemsPage() {
  const [filter, setFilter] = useState<string>('all');

  const filteredItems =
    filter === 'all' ? MY_ITEMS : MY_ITEMS.filter((i) => i.status === filter);

  const totalRevenue = MY_ITEMS.reduce((sum, i) => sum + i.revenue, 0);
  const totalDownloads = MY_ITEMS.reduce((sum, i) => sum + i.downloads, 0);
  const publishedCount = MY_ITEMS.filter((i) => i.status === 'published').length;
  const avgRating =
    MY_ITEMS.filter((i) => i.rating > 0).length > 0
      ? MY_ITEMS.filter((i) => i.rating > 0).reduce((sum, i) => sum + i.rating, 0) /
        MY_ITEMS.filter((i) => i.rating > 0).length
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Back nav */}
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Back to Marketplace
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Items</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your published templates and datasets
            </p>
          </div>
          <Button asChild>
            <Link href="/marketplace/publish" className="gap-1.5">
              <Plus className="size-4" />
              Publish New
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="py-4">
            <CardContent className="px-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="size-4" />
                <span className="text-xs font-medium">Total Revenue</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent className="px-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Download className="size-4" />
                <span className="text-xs font-medium">Total Downloads</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{formatNumber(totalDownloads)}</p>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent className="px-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Package className="size-4" />
                <span className="text-xs font-medium">Published</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{publishedCount}</p>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent className="px-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Star className="size-4" />
                <span className="text-xs font-medium">Avg Rating</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold">
                {avgRating > 0 ? avgRating.toFixed(1) : '—'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-4">
          {['all', 'published', 'draft', 'deprecated'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <Badge variant="secondary" className="ml-1.5 text-[10px] px-1">
                {f === 'all'
                  ? MY_ITEMS.length
                  : MY_ITEMS.filter((i) => i.status === f).length}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Table */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <Package className="size-10 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium">No items found</h3>
            <p className="text-muted-foreground text-sm mt-1">
              {filter !== 'all'
                ? `You don't have any ${filter} items`
                : "You haven't published any items yet"}
            </p>
            <Button asChild className="mt-4">
              <Link href="/marketplace/publish">
                <Plus className="size-4 mr-1" />
                Publish Your First Item
              </Link>
            </Button>
          </div>
        ) : (
          <Card className="py-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Downloads</TableHead>
                  <TableHead className="hidden md:table-cell">Rating</TableHead>
                  <TableHead className="hidden md:table-cell">Revenue</TableHead>
                  <TableHead className="hidden lg:table-cell">Version</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm">
                          {CATEGORY_ICONS[item.category]}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            {item.verified && (
                              <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Badge variant="outline" className="text-[10px] px-1 py-0">
                              {item.type}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] px-1 py-0">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="flex items-center gap-1 text-sm">
                        <Download className="size-3.5 text-muted-foreground" />
                        {formatNumber(item.downloads)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.rating > 0 ? (
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          {item.rating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm font-medium">
                        {item.revenue > 0 ? `$${item.revenue.toLocaleString()}` : '—'}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                        v{item.version}
                      </code>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/marketplace/${item.id}`} className="cursor-pointer">
                              <Eye className="size-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Pencil className="size-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <ArrowUpDown className="size-4 mr-2" />
                            New Version
                          </DropdownMenuItem>
                          {item.status === 'published' && (
                            <DropdownMenuItem className="cursor-pointer text-amber-600">
                              <Clock className="size-4 mr-2" />
                              Deprecate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-destructive">
                            <Trash2 className="size-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Reviews section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Recent Reviews</h2>
          <div className="space-y-3">
            {MY_ITEMS.flatMap((item) =>
              (item.reviews ?? []).map((review) => ({ ...review, itemName: item.name }))
            ).length === 0 ? (
              <Card className="py-4">
                <CardContent className="px-4 text-center py-8">
                  <Star className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No reviews received yet</p>
                </CardContent>
              </Card>
            ) : (
              MY_ITEMS.flatMap((item) =>
                (item.reviews ?? []).slice(0, 2).map((review) => ({
                  ...review,
                  itemName: item.name,
                }))
              ).map((review, idx) => (
                <Card key={`${review.id}-${idx}`} className="py-3">
                  <CardContent className="px-4 flex items-start gap-3">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="text-xs">{review.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{review.author}</span>
                          <span className="text-xs text-muted-foreground">on</span>
                          <span className="text-xs font-medium text-primary truncate">
                            {review.itemName}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`size-3 ${
                              i <= Math.floor(review.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
