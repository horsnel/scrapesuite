'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Download,
  ShieldCheck,
  Award,
  Clock,
  Tag,
  Globe,
  FileJson,
  CreditCard,
  Zap,
  Repeat,
  ShoppingBag,
  Database,
  ChevronDown,
  ExternalLink,
  User,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MOCK_ITEMS,
  CATEGORY_ICONS,
  formatNumber,
  getPriceLabel,
  type MarketplaceItem,
  type Review,
} from '@/lib/marketplace-data';

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const s = size === 'md' ? 'size-4' : 'size-3';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${s} ${
            i <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : i - 0.5 <= rating
                ? 'fill-amber-200 text-amber-400'
                : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="py-4">
      <div className="flex items-start gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">{review.avatar}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm">{review.author}</span>
            <span className="text-xs text-muted-foreground">{review.date}</span>
          </div>
          <StarRating rating={review.rating} />
          <p className="text-sm text-muted-foreground mt-1.5">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}

function RelatedItems({ currentId, category }: { currentId: string; category: string }) {
  const related = MOCK_ITEMS.filter(
    (i) => i.id !== currentId && i.category === category
  ).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="space-y-3">
      {related.map((item) => (
        <Link key={item.id} href={`/marketplace/${item.id}`}>
          <Card className="hover:shadow-sm transition-shadow cursor-pointer py-3">
            <CardContent className="flex items-center gap-3 px-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-base">
                {CATEGORY_ICONS[item.category]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  {item.rating.toFixed(1)} · {formatNumber(item.downloads)} downloads
                </p>
              </div>
              <span className="text-xs font-medium shrink-0">{getPriceLabel(item)}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [installing, setInstalling] = useState(false);

  const item = MOCK_ITEMS.find((i) => i.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Item not found</h2>
          <p className="text-muted-foreground text-sm mt-1">
            The marketplace item you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild className="mt-4">
            <Link href="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  const reviews = item.reviews ?? [];

  const handleInstall = () => {
    setInstalling(true);
    setTimeout(() => setInstalling(false), 2000);
  };

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

        {/* Hero section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left - Main info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="outline" className="text-xs">
                  {item.type === 'template' ? (
                    <ShoppingBag className="size-3 mr-1" />
                  ) : (
                    <Database className="size-3 mr-1" />
                  )}
                  {item.type}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {CATEGORY_ICONS[item.category]} {item.category}
                </Badge>
                {item.staffPick && (
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                    <Award className="size-3 mr-1" />
                    Staff Pick
                  </Badge>
                )}
                {item.verified && (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                    <ShieldCheck className="size-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{item.name}</h1>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Avatar className="size-6">
                    <AvatarFallback className="text-[10px]">{item.author.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{item.author.name}</span>
                  {item.author.verified && (
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                  )}
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <StarRating rating={item.rating} size="sm" />
                  <span className="text-sm font-medium ml-1">{item.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({item.reviewCount} reviews)</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Download className="size-3.5" />
                  {formatNumber(item.downloads)} downloads
                </span>
              </div>
            </div>

            <Card className="py-4">
              <CardHeader className="pb-0 px-4">
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.longDescription || item.description}
                </p>
              </CardContent>
            </Card>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="size-4 text-muted-foreground" />
              {item.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Domain patterns */}
            {item.domainPatterns && item.domainPatterns.length > 0 && (
              <Card className="py-4">
                <CardHeader className="pb-0 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="size-4" />
                    Domain Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4">
                  <div className="flex flex-wrap gap-2">
                    {item.domainPatterns.map((pattern) => (
                      <code
                        key={pattern}
                        className="text-xs bg-muted px-2 py-1 rounded font-mono"
                      >
                        {pattern}
                      </code>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right sidebar - Pricing & actions */}
          <div className="space-y-4">
            <Card className="py-4">
              <CardContent className="px-4 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Pricing</p>
                  <p className="text-2xl font-bold mt-1">
                    {item.pricing === 'free' ? (
                      'Free'
                    ) : item.pricing === 'credits' ? (
                      <span className="flex items-center gap-1">
                        <CreditCard className="size-5" />
                        {item.price} credits
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Repeat className="size-5" />
                        ${item.price}/mo
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.pricing === 'free'
                      ? 'No cost to use this item'
                      : item.pricing === 'credits'
                        ? 'Pay per extraction run'
                        : 'Monthly subscription for unlimited access'}
                  </p>
                </div>
                <Separator />
                <Button className="w-full" size="lg" onClick={handleInstall} disabled={installing}>
                  <Zap className="size-4 mr-1" />
                  {installing
                    ? 'Installing...'
                    : item.pricing === 'free'
                      ? 'Install Free'
                      : item.pricing === 'credits'
                        ? `Buy for ${item.price} Credits`
                        : 'Subscribe Now'}
                </Button>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    v{item.version} · Updated {item.updatedAt}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Version history */}
            {item.versions && item.versions.length > 0 && (
              <Card className="py-4">
                <CardHeader className="pb-0 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="size-4" />
                    Version History
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4">
                  <ScrollArea className="max-h-48">
                    <div className="space-y-3">
                      {item.versions.map((v) => (
                        <div key={v.version} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="size-2 rounded-full bg-primary mt-1.5" />
                            {v !== item.versions![item.versions!.length - 1] && (
                              <div className="w-px flex-1 bg-border mt-1" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pb-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">v{v.version}</span>
                              <span className="text-xs text-muted-foreground">{v.date}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {v.changelog}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Related items */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Related Items</h3>
              <RelatedItems currentId={item.id} category={item.category} />
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <Tabs defaultValue="schema" className="mt-2">
          <TabsList>
            <TabsTrigger value="schema" className="flex items-center gap-1.5">
              <FileJson className="size-3.5" />
              Schema / Output
            </TabsTrigger>
            <TabsTrigger value="sample" className="flex items-center gap-1.5">
              <FileJson className="size-3.5" />
              Sample Output
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-1.5">
              <User className="size-3.5" />
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schema">
            <Card className="py-4">
              <CardHeader className="px-4">
                <CardTitle className="text-base">Output Schema</CardTitle>
                <CardDescription>
                  The JSON schema that defines the structure of extracted data
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4">
                <ScrollArea className="max-h-96">
                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto font-mono leading-relaxed">
                    {JSON.stringify(item.schema, null, 2)}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sample">
            <Card className="py-4">
              <CardHeader className="px-4">
                <CardTitle className="text-base">Sample Output</CardTitle>
                <CardDescription>
                  Example data extracted using this {item.type}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4">
                <ScrollArea className="max-h-96">
                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto font-mono leading-relaxed">
                    {JSON.stringify(item.sampleOutput, null, 2)}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="py-4">
              <CardHeader className="px-4">
                <CardTitle className="text-base">Reviews</CardTitle>
                <CardDescription>
                  {reviews.length > 0
                    ? `What users are saying about this ${item.type}`
                    : `No reviews yet for this ${item.type}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4">
                {reviews.length > 0 ? (
                  <div className="divide-y">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No reviews yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
