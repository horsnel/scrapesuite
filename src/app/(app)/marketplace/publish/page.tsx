'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Eye,
  Upload,
  Plus,
  X,
  FileJson,
  DollarSign,
  Globe,
  AlertCircle,
  CheckCircle2,
  ShoppingBag,
  Database,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CATEGORIES, CATEGORY_ICONS, type ItemType, type Category, type PricingModel } from '@/lib/marketplace-data';

const defaultSchema = JSON.stringify(
  {
    type: 'object',
    properties: {
      title: { type: 'string' },
      url: { type: 'string' },
      description: { type: 'string' },
    },
  },
  null,
  2
);

const defaultSample = JSON.stringify(
  {
    title: 'Example Title',
    url: 'https://example.com',
    description: 'Example description of the extracted data.',
  },
  null,
  2
);

export default function PublishPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [itemType, setItemType] = useState<ItemType>('template');
  const [category, setCategory] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [schema, setSchema] = useState(defaultSchema);
  const [sampleOutput, setSampleOutput] = useState(defaultSample);
  const [pricing, setPricing] = useState<PricingModel>('free');
  const [price, setPrice] = useState('');
  const [domainPatterns, setDomainPatterns] = useState<string[]>([]);
  const [domainInput, setDomainInput] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [sampleError, setSampleError] = useState<string | null>(null);

  const validateJson = (value: string): boolean => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSchemaChange = (value: string) => {
    setSchema(value);
    setSchemaError(validateJson(value) ? null : 'Invalid JSON syntax');
  };

  const handleSampleChange = (value: string) => {
    setSampleOutput(value);
    setSampleError(validateJson(value) ? null : 'Invalid JSON syntax');
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const addDomain = () => {
    const d = domainInput.trim();
    if (d && !domainPatterns.includes(d)) {
      setDomainPatterns([...domainPatterns, d]);
      setDomainInput('');
    }
  };

  const removeDomain = (d: string) => {
    setDomainPatterns(domainPatterns.filter((p) => p !== d));
  };

  const canPublish =
    name.trim() &&
    description.trim() &&
    category &&
    !schemaError &&
    !sampleError &&
    (pricing === 'free' || price.trim());

  const handlePublish = () => {
    if (!canPublish) return;
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setPublished(true);
    }, 2000);
  };

  if (published) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <CheckCircle2 className="size-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Published Successfully!</h2>
          <p className="text-muted-foreground text-sm mt-2">
            Your {itemType} has been submitted for review. It will appear in the marketplace once
            approved.
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <Button asChild>
              <Link href="/marketplace">Browse Marketplace</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/marketplace/my-items">My Items</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Back nav */}
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Back to Marketplace
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Publish to Marketplace
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Share your scraping template or dataset with the ScrapeSuite community
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="py-4">
            <CardHeader className="px-4">
              <CardTitle className="text-base">Basic Information</CardTitle>
              <CardDescription>Provide the essential details about your item</CardDescription>
            </CardHeader>
            <CardContent className="px-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-type">Item Type</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={itemType === 'template' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setItemType('template')}
                    >
                      <ShoppingBag className="size-4 mr-1" />
                      Template
                    </Button>
                    <Button
                      type="button"
                      variant={itemType === 'dataset' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setItemType('dataset')}
                    >
                      <Database className="size-4 mr-1" />
                      Dataset
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {CATEGORY_ICONS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Amazon Product Scraper"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your template/dataset does, what data it extracts, and any important notes..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addTag}>
                    <Plus className="size-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1 text-xs">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Schema & Sample */}
          <Card className="py-4">
            <CardHeader className="px-4">
              <CardTitle className="text-base flex items-center gap-2">
                <FileJson className="size-4" />
                Schema & Sample Output
              </CardTitle>
              <CardDescription>
                Define the output schema and provide a sample of what the extracted data looks like
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schema">Output Schema (JSON)</Label>
                <Textarea
                  id="schema"
                  placeholder="Define your output schema as JSON..."
                  rows={10}
                  value={schema}
                  onChange={(e) => handleSchemaChange(e.target.value)}
                  className="font-mono text-xs"
                />
                {schemaError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {schemaError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sample">Sample Output (JSON)</Label>
                <Textarea
                  id="sample"
                  placeholder="Provide a sample of the output data..."
                  rows={10}
                  value={sampleOutput}
                  onChange={(e) => handleSampleChange(e.target.value)}
                  className="font-mono text-xs"
                />
                {sampleError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {sampleError}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Domain Patterns */}
          {itemType === 'template' && (
            <Card className="py-4">
              <CardHeader className="px-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="size-4" />
                  Domain Patterns
                </CardTitle>
                <CardDescription>
                  Specify URL patterns that this template is designed to work with
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., amazon.com/dp/*"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addDomain();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addDomain}>
                    <Plus className="size-4" />
                  </Button>
                </div>
                {domainPatterns.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {domainPatterns.map((p) => (
                      <Badge key={p} variant="outline" className="gap-1 font-mono text-xs">
                        {p}
                        <button
                          onClick={() => removeDomain(p)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pricing */}
          <Card className="py-4">
            <CardHeader className="px-4">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="size-4" />
                Pricing
              </CardTitle>
              <CardDescription>Choose how users will pay for your item</CardDescription>
            </CardHeader>
            <CardContent className="px-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPricing('free')}
                  className={`rounded-lg border-2 p-4 text-left transition-colors ${
                    pricing === 'free'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-semibold text-sm">Free</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No cost to users. Best for building reputation.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setPricing('credits')}
                  className={`rounded-lg border-2 p-4 text-left transition-colors ${
                    pricing === 'credits'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-semibold text-sm">Credits</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pay per use. Users spend credits for each extraction.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setPricing('subscription')}
                  className={`rounded-lg border-2 p-4 text-left transition-colors ${
                    pricing === 'subscription'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-semibold text-sm">Subscription</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Monthly fee for unlimited access to your item.
                  </p>
                </button>
              </div>

              {pricing !== 'free' && (
                <div className="space-y-2">
                  <Label htmlFor="price">
                    {pricing === 'credits' ? 'Credits per extraction' : 'Monthly price (USD)'}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    placeholder={pricing === 'credits' ? 'e.g., 5' : 'e.g., 29'}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-1.5">
                  <Eye className="size-4" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Publish Preview</DialogTitle>
                  <DialogDescription>
                    This is how your item will appear in the marketplace
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {itemType === 'template' ? (
                        <ShoppingBag className="size-3 mr-1" />
                      ) : (
                        <Database className="size-3 mr-1" />
                      )}
                      {itemType}
                    </Badge>
                    {category && (
                      <Badge variant="secondary" className="text-xs">
                        {CATEGORY_ICONS[category as Category]} {category}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-bold">{name || 'Untitled Item'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {description || 'No description provided'}
                  </p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Separator />
                  {domainPatterns.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Domain Patterns</p>
                      <div className="flex flex-wrap gap-2">
                        {domainPatterns.map((p) => (
                          <code key={p} className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {p}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium mb-2">Pricing</p>
                    <p className="text-sm">
                      {pricing === 'free'
                        ? 'Free'
                        : pricing === 'credits'
                          ? `${price || '—'} credits per extraction`
                          : `$${price || '—'}/month`}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Schema</p>
                    <pre className="text-xs bg-muted p-3 rounded font-mono overflow-x-auto">
                      {schema}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Sample Output</p>
                    <pre className="text-xs bg-muted p-3 rounded font-mono overflow-x-auto">
                      {sampleOutput}
                    </pre>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              size="lg"
              onClick={handlePublish}
              disabled={!canPublish || publishing}
              className="gap-1.5"
            >
              <Upload className="size-4" />
              {publishing ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
