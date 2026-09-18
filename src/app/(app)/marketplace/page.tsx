'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Grid3X3,
  List,
  Star,
  Download,
  ShieldCheck,
  Award,
  ArrowUpDown,
  ShoppingBag,
  Database,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  MOCK_ITEMS,
  CATEGORIES,
  CATEGORY_ICONS,
  formatNumber,
  getPriceLabel,
  type ItemType,
  type Category,
  type MarketplaceItem,
} from '@/lib/marketplace-data';

const ITEMS_PER_PAGE = 6;

type SortOption = 'newest' | 'popular' | 'rating' | 'staff';

function sortItems(items: MarketplaceItem[], sort: SortOption): MarketplaceItem[] {
  switch (sort) {
    case 'newest':
      return [...items].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    case 'popular':
      return [...items].sort((a, b) => b.downloads - a.downloads);
    case 'rating':
      return [...items].sort((a, b) => b.rating - a.rating);
    case 'staff':
      return [...items].sort((a, b) => (b.staffPick ? 1 : 0) - (a.staffPick ? 1 : 0));
    default:
      return items;
  }
}

function ItemCard({ item, view }: { item: MarketplaceItem; view: 'grid' | 'list' }) {
  if (view === 'list') {
    return (
      <Link href={`/marketplace/${item.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer py-4">
          <CardContent className="flex items-center gap-4 px-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl">
              {CATEGORY_ICONS[item.category]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                {item.staffPick && (
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] px-1.5 py-0">
                    <Award className="size-3 mr-0.5" />
                    Staff Pick
                  </Badge>
                )}
                {item.verified && (
                  <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                )}
              </div>
              <p className="text-muted-foreground text-xs line-clamp-1 mt-0.5">
                {item.description}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-4 shrink-0 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {item.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Download className="size-3.5" />
                {formatNumber(item.downloads)}
              </span>
              <Badge variant="outline" className="text-[10px] px-1.5">
                {item.type}
              </Badge>
            </div>
            <div className="shrink-0 text-sm font-medium min-w-[80px] text-right">
              {getPriceLabel(item)}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/marketplace/${item.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full py-4">
        <CardHeader className="pb-0 px-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg">
                {CATEGORY_ICONS[item.category]}
              </div>
              <div>
                <CardTitle className="text-sm flex items-center gap-1.5">
                  {item.name}
                  {item.verified && <ShieldCheck className="size-3.5 text-emerald-600" />}
                </CardTitle>
                <CardDescription className="text-xs">
                  by {item.author.name}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] px-1.5 shrink-0">
              {item.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-4 pt-3">
          <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
            {item.description}
          </p>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {item.staffPick && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] px-1.5 py-0">
                <Award className="size-3 mr-0.5" />
                Staff Pick
              </Badge>
            )}
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {item.category}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {item.rating.toFixed(1)} ({item.reviewCount})
              </span>
              <span className="flex items-center gap-1">
                <Download className="size-3" />
                {formatNumber(item.downloads)}
              </span>
            </div>
            <span className="font-medium text-foreground">{getPriceLabel(item)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [itemType, setItemType] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<SortOption>('popular');
  const [page, setPage] = useState(1);

  const filteredItems = useMemo(() => {
    let items = MOCK_ITEMS;

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (category !== 'all') {
      items = items.filter((i) => i.category === category);
    }

    if (itemType !== 'all') {
      items = items.filter((i) => i.type === itemType);
    }

    return sortItems(items, sort);
  }, [search, category, itemType, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Browse and install scraping templates and datasets for your projects
          </p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search templates, datasets..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CATEGORY_ICONS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sort}
                onValueChange={(v) => setSort(v as SortOption)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="staff">Staff Picks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant={itemType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setItemType('all');
                  setPage(1);
                }}
              >
                All
              </Button>
              <Button
                variant={itemType === 'template' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setItemType('template');
                  setPage(1);
                }}
              >
                <ShoppingBag className="size-3.5 mr-1" />
                Templates
              </Button>
              <Button
                variant={itemType === 'dataset' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setItemType('dataset');
                  setPage(1);
                }}
              >
                <Database className="size-3.5 mr-1" />
                Datasets
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <span className="text-xs text-muted-foreground">
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center border rounded-md">
              <Button
                variant={view === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-r-none"
                onClick={() => setView('grid')}
                aria-label="Grid view"
              >
                <Grid3X3 className="size-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-l-none"
                onClick={() => setView('list')}
                aria-label="List view"
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Items */}
        {paginatedItems.length === 0 ? (
          <div className="text-center py-20">
            <Search className="size-10 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium">No items found</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedItems.map((item) => (
              <ItemCard key={item.id} item={item} view="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {paginatedItems.map((item) => (
              <ItemCard key={item.id} item={item} view="list" />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(Math.max(1, currentPage - 1));
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {pageNumbers.map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(p);
                      }}
                      isActive={p === currentPage}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(Math.min(totalPages, currentPage + 1));
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
