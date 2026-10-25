import { useState, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useProduct } from "../hook/use.product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  UploadCloud,
  X,
  Star,
  Trash2,
  Plus,
  AlertCircle,
  ShoppingBag,
  Sparkles,
  Loader2,
  ArrowLeft,
  Heart,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

const MAX_IMAGES = 7;
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const QUICK_TAGS = [
  "100% Cotton",
  "Oversized Fit",
  "Cuban Collar",
  "Waffle Knit",
  "Pre-washed",
];

export default function CreateProduct() {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });

  // Images state: [{ id, file, previewUrl, name, sizeFormatted }]
  const [images, setImages] = useState([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  // Status / Feedback States
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [successData, setSuccessData] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const currencySymbol = formData.priceCurrency === "USD" ? "$" : "₹";

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddQuickTag = (tag) => {
    setFormData((prev) => {
      const current = prev.description.trim();
      const updated = current ? `${current}\n• ${tag}` : `• ${tag}`;
      return { ...prev, description: updated };
    });
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  const processFiles = useCallback((newFiles) => {
    const validFiles = [];
    let errorMessage = "";

    for (const file of Array.from(newFiles)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errorMessage = `File "${file.name}" must be JPG, PNG, or WEBP.`;
        continue;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errorMessage = `File "${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit.`;
        continue;
      }
      validFiles.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        sizeFormatted:
          file.size < 1024 * 1024
            ? `${(file.size / 1024).toFixed(0)} KB`
            : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
    }

    setImages((prev) => {
      const combined = [...prev, ...validFiles];
      if (combined.length > MAX_IMAGES) {
        setErrors((err) => ({
          ...err,
          images: `Maximum ${MAX_IMAGES} photos allowed. Extra files were trimmed.`,
        }));
        return combined.slice(0, MAX_IMAGES);
      }
      return combined;
    });

    if (errorMessage) {
      setErrors((prev) => ({ ...prev, images: errorMessage }));
    } else {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (activePreviewIndex >= updated.length) {
        setActivePreviewIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  const handleSetCover = (index) => {
    if (index === 0) return;
    setImages((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, idx) => idx !== index);
      return [target, ...rest];
    });
    setActivePreviewIndex(0);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Please add more details (min 10 characters)";
    }

    const price = Number(formData.priceAmount);
    if (!formData.priceAmount || isNaN(price) || price <= 0) {
      newErrors.priceAmount = "Please enter a valid price amount";
    }

    if (images.length === 0) {
      newErrors.images = "Please upload at least 1 product photo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setTouched({
      title: true,
      description: true,
      priceAmount: true,
      images: true,
    });

    if (!validateForm()) {
      window.scrollTo({ top: 60, behavior: "smooth" });
      return;
    }

    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("priceAmount", Number(formData.priceAmount));
      payload.append("priceCurrency", formData.priceCurrency);

      images.forEach((item) => {
        payload.append("images", item.file);
      });

      const res = await handleCreateProduct(payload);
      setSuccessData(res || { title: formData.title });
    } catch (err) {
      console.error("Product creation error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        err.message ||
        "Failed to publish product. Please check your inputs.";
      setErrors((prev) => ({ ...prev, submit: msg }));
    } finally {
      setIsLoading(false);
    }
  };

  const netPayout = useMemo(() => {
    const raw = Number(formData.priceAmount);
    if (!raw || isNaN(raw) || raw <= 0) return "0.00";
    return (raw * 0.98).toFixed(2);
  }, [formData.priceAmount]);

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      priceAmount: "",
      priceCurrency: "INR",
    });
    setImages([]);
    setErrors({});
    setTouched({});
    setSuccessData(null);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-zinc-900 flex flex-col font-sans antialiased selection:bg-zinc-900 selection:text-white overflow-x-hidden">
      {/* ── Studio Top Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="group flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors pr-3 border-r border-zinc-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Back</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-widest text-sm uppercase text-zinc-950 font-serif">
                SNITCH
              </span>
              <span className="text-zinc-300">/</span>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500 font-mono">
                STUDIO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={isLoading}
              className="group text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 h-8 px-2.5 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700 group-hover:-rotate-180 transition-transform duration-500" />
              <span>Clear</span>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-luxury-shimmer group bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-medium h-8 px-3.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 transition-all duration-300 group-hover:rotate-45 group-hover:scale-125" />
                  <span>Publish Product</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main Workspace ──────────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-3.5 sm:py-4">
        {/* Breadcrumb Header */}
        <div className="mb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-950">
              New Product Listing
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Add product imagery, specifications, and pricing for your storefront.
            </p>
          </div>
          <Badge
            variant="outline"
            className="w-fit text-xs font-medium bg-amber-50 text-amber-800 border-amber-200/80 py-0.5 px-2.5 rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
            Unpublished Draft
          </Badge>
        </div>

        {/* Global Error Banner */}
        {errors.submit && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <div>
              <span className="font-semibold text-red-800">Publishing Failed: </span>
              <span>{errors.submit}</span>
            </div>
          </div>
        )}

        {/* ── Two-Column Layout ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* ── Left Column: Form Details (7 cols) ────────────────────── */}
          <div className="lg:col-span-7 space-y-4">
            {/* 1. Media & Dropzone (21st.dev style joyco dropzone) */}
            <Card className="border-zinc-200/90 shadow-xs rounded-xl overflow-hidden bg-white">
              <div className="px-4 py-2.5 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    Product Imagery
                  </h2>
                </div>
                <span
                  className={cn(
                    "text-[11px] font-mono px-2 py-0.5 rounded-full border",
                    images.length >= MAX_IMAGES
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-zinc-50 text-zinc-600 border-zinc-200",
                  )}
                >
                  {images.length} / {MAX_IMAGES}
                </span>
              </div>

              <CardContent className="p-4 space-y-3">
                {/* 21st.dev joyco Dropzone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative group cursor-pointer rounded-lg border-2 border-dashed py-4 px-3 text-center transition-all duration-300",
                    isDragging
                      ? "border-zinc-950 bg-zinc-100/90 dropzone-kinetic-active scale-[1.015]"
                      : "border-zinc-300 hover:border-zinc-900 bg-zinc-50/50 hover:bg-zinc-50",
                    images.length >= MAX_IMAGES && "pointer-events-none opacity-50",
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        processFiles(e.target.files);
                      }
                    }}
                  />

                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full border flex items-center justify-center shadow-xs transition-all duration-300",
                        isDragging
                          ? "bg-zinc-950 text-white border-zinc-950 scale-125 -translate-y-1 shadow-md"
                          : "bg-white border-zinc-200 text-zinc-700 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 group-hover:shadow-md",
                      )}
                    >
                      <UploadCloud
                        className={cn(
                          "w-4 h-4 transition-transform duration-300",
                          isDragging
                            ? "scale-110 -translate-y-0.5"
                            : "group-hover:-translate-y-0.5 group-hover:scale-110",
                        )}
                      />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-zinc-900">
                        Drop photos here or{" "}
                        <span className="text-zinc-950 underline underline-offset-2 font-bold">
                          browse files
                        </span>
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Supports JPG, PNG, WEBP (up to {MAX_IMAGES} images, max {MAX_FILE_SIZE_MB}MB each)
                      </p>
                    </div>
                  </div>
                </div>

                {errors.images && (
                  <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.images}</span>
                  </p>
                )}

                {/* Uploaded Thumbnails Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-1">
                    {images.map((item, idx) => {
                      const isCover = idx === 0;
                      const isSelected = activePreviewIndex === idx;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setActivePreviewIndex(idx)}
                          className={cn(
                            "group relative rounded-lg border overflow-hidden bg-zinc-50 transition-all cursor-pointer select-none",
                            isSelected
                              ? "border-zinc-950 ring-2 ring-zinc-950 shadow-md scale-[1.02]"
                              : isCover
                              ? "border-zinc-900/60 ring-1 ring-zinc-900/20"
                              : "border-zinc-200 hover:border-zinc-400",
                          )}
                        >
                          <div className="aspect-[3/4] w-full relative overflow-hidden">
                            <img
                              src={item.previewUrl}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                            />

                            {/* Cover Badge */}
                            {isCover && (
                              <div className="absolute top-1 left-1 z-10 pointer-events-none">
                                <span className="bg-zinc-950 text-white font-mono text-[8px] font-bold uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                                  <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300 animate-pulse" />
                                  Cover
                                </span>
                              </div>
                            )}

                            {/* Viewing Badge if selected but not cover */}
                            {isSelected && !isCover && (
                              <div className="absolute top-1 left-1 z-10 pointer-events-none">
                                <span className="bg-zinc-900/90 backdrop-blur-xs text-white font-mono text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shadow-xs">
                                  Viewing
                                </span>
                              </div>
                            )}

                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 pointer-events-none">
                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSetCover(idx);
                                  }}
                                  title="Set as hero cover"
                                  className="pointer-events-auto group/btn p-1.5 rounded-md bg-white/95 text-zinc-700 hover:text-amber-500 hover:bg-white shadow-xs transition-all active:scale-90"
                                >
                                  <Star className="w-3 h-3 transition-transform duration-200 group-hover/btn:scale-125 group-hover/btn:rotate-12" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(idx);
                                }}
                                title="Remove photo"
                                className="pointer-events-auto group/trash p-1.5 rounded-md bg-white/95 text-zinc-700 hover:text-red-600 hover:bg-white shadow-xs transition-all active:scale-90"
                              >
                                <Trash2 className="w-3 h-3 transition-transform duration-200 group-hover/trash:-rotate-12 group-hover/trash:scale-110" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2. Product Details & OriginUI Joined Price Input */}
            <Card className="border-zinc-200/90 shadow-xs rounded-xl overflow-hidden bg-white">
              <div className="px-4 py-2.5 border-b border-zinc-100">
                <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Product Details & Pricing
                </h2>
              </div>

              <CardContent className="p-4 space-y-3.5">
                {/* Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="product-title"
                      className="text-xs font-semibold text-zinc-800 uppercase tracking-wider"
                    >
                      Product Title <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {formData.title.length}/120
                    </span>
                  </div>
                  <Input
                    id="product-title"
                    value={formData.title}
                    maxLength={120}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g. Classic Oversized Cuban Collar Linen Shirt"
                    className={cn(
                      "h-10 text-sm font-medium",
                      errors.title && touched.title && "border-red-500",
                    )}
                  />
                  {errors.title && touched.title && (
                    <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Price & Currency (21st.dev OriginUI Joined Input) */}
                <div>
                  <label
                    htmlFor="product-price"
                    className="text-xs font-semibold text-zinc-800 uppercase tracking-wider block mb-1"
                  >
                    Pricing & Currency <span className="text-red-500">*</span>
                  </label>

                  {/* OriginUI Joined Add-on Pattern */}
                  <div className="relative flex rounded-lg shadow-2xs border border-zinc-200 bg-white focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950/20 transition-all">
                    <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-sm font-bold text-zinc-500">
                      {currencySymbol}
                    </span>
                    <input
                      id="product-price"
                      type="number"
                      min="1"
                      step="any"
                      value={formData.priceAmount}
                      onChange={(e) => handleInputChange("priceAmount", e.target.value)}
                      placeholder="e.g. 2499"
                      className="h-10 w-full bg-transparent ps-7 pe-2 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 outline-none"
                    />
                    <select
                      value={formData.priceCurrency}
                      onChange={(e) => handleInputChange("priceCurrency", e.target.value)}
                      className="inline-flex items-center rounded-r-lg border-l border-zinc-200 bg-zinc-50 px-2.5 text-xs font-semibold text-zinc-700 outline-none hover:bg-zinc-100 cursor-pointer transition-colors"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>

                  {errors.priceAmount && touched.priceAmount && (
                    <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.priceAmount}
                    </p>
                  )}

                  {/* Inline Payout pill */}
                  {Number(formData.priceAmount) > 0 && (
                    <div className="mt-1.5 py-1 px-2.5 bg-zinc-50 border border-zinc-200/80 rounded-md flex items-center justify-between text-[11px] text-zinc-600">
                      <span>Platform fee (2%): -{currencySymbol}{(Number(formData.priceAmount) * 0.02).toFixed(2)}</span>
                      <span className="font-semibold text-emerald-700">
                        Est. Net Payout: {currencySymbol}{netPayout}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="product-description"
                      className="text-xs font-semibold text-zinc-800 uppercase tracking-wider"
                    >
                      Description & Fabric Specs <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-zinc-400">Detailed overview</span>
                  </div>
                  <Textarea
                    id="product-description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Detail the silhouette, fabric blend, fit notes, and washing instructions..."
                    className={cn(
                      "text-sm leading-relaxed min-h-[75px]",
                      errors.description && touched.description && "border-red-500",
                    )}
                  />
                  {errors.description && touched.description && (
                    <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.description}
                    </p>
                  )}

                  {/* Compact Quick Tags */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-zinc-400 font-medium">Quick add:</span>
                    {QUICK_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddQuickTag(tag)}
                        className="group/tag inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-700 transition-all duration-200 border border-zinc-200/60 font-medium active:scale-95"
                      >
                        <Plus className="w-3 h-3 text-zinc-400 group-hover/tag:text-white group-hover/tag:rotate-90 transition-all duration-200" />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Right Column: Storefront Preview & Actions (5 cols) ────────── */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end space-y-4 lg:sticky lg:top-20">
            {/* 21st.dev shadcnstore E-Commerce Card Preview (Properly sized max 290px) */}
            <div className="w-full max-w-[280px] sm:max-w-[290px] bg-white rounded-xl border border-zinc-200/90 shadow-sm overflow-hidden transition-all duration-300">
              <div className="px-3.5 py-2.5 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Storefront Preview
                </span>
                <span className="text-[10px] font-mono text-zinc-400">Live Sync</span>
              </div>

              {/* 3:4 Fashion Aspect Media */}
              <div className="aspect-[3/4] w-full bg-zinc-100 relative overflow-hidden flex items-center justify-center">
                {images.length > 0 ? (
                  <img
                    key={images[activePreviewIndex]?.id || activePreviewIndex}
                    src={images[activePreviewIndex]?.previewUrl || images[0]?.previewUrl}
                    alt="Storefront Preview"
                    className="w-full h-full object-cover transition-all duration-300 animate-in fade-in zoom-in-95 ease-out"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-400 gap-2 p-4 text-center">
                    <ShoppingBag className="w-7 h-7 text-zinc-300" />
                    <span className="text-xs font-medium text-zinc-400">
                      Photo preview
                    </span>
                  </div>
                )}

                {/* Badge */}
                <span className="absolute top-2.5 left-2.5 bg-zinc-950/90 text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-xs">
                  NEW ARRIVAL
                </span>

                {/* Mock Wishlist */}
                <button
                  type="button"
                  onClick={() => setIsWishlisted((prev) => !prev)}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className={cn(
                    "absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow-xs transition-all duration-200 active:scale-75 cursor-pointer",
                    isWishlisted ? "text-red-500 scale-105" : "text-zinc-600 hover:text-zinc-900",
                  )}
                >
                  <Heart
                    className={cn(
                      "w-3.5 h-3.5 transition-all duration-200",
                      isWishlisted
                        ? "fill-red-500 text-red-500 animate-in zoom-in-75"
                        : "fill-transparent text-zinc-600",
                    )}
                  />
                </button>

                {/* Dots if multiple photos */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1 z-10">
                    {images.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setActivePreviewIndex(dotIdx)}
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          activePreviewIndex === dotIdx
                            ? "w-3.5 bg-white"
                            : "w-1.5 bg-white/50 hover:bg-white",
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info footer */}
              <div className="p-3.5 space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block">
                  SNITCH STUDIO
                </span>
                <p className="text-xs font-semibold text-zinc-900 truncate">
                  {formData.title.trim() || "Product Title"}
                </p>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-sm font-bold text-zinc-950 font-mono">
                    {currencySymbol} {formData.priceAmount ? Number(formData.priceAmount).toLocaleString() : "0"}
                  </span>
                  <span className="text-[10px] text-zinc-400">Tax incl.</span>
                </div>
              </div>
            </div>

            {/* Quick Publish CTA button */}
            <div className="w-full max-w-[280px] sm:max-w-[290px]">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="btn-luxury-shimmer group w-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold h-10 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 transition-all duration-300 group-hover:rotate-45 group-hover:scale-125" />
                    <span>Publish to Snitch Store</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Success Celebration Modal ────────────────────────────────────── */}
      {successData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-center border border-zinc-200 shadow-xl space-y-3 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-zinc-950">
                Product Published!
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                &ldquo;{successData?.title || formData.title}&rdquo; is now active in your seller catalog.
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1 text-xs h-9 rounded-lg"
              >
                Add Another
              </Button>
              <Button
                onClick={() => navigate("/")}
                className="flex-1 bg-zinc-950 text-white hover:bg-zinc-800 text-xs h-9 rounded-lg"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}