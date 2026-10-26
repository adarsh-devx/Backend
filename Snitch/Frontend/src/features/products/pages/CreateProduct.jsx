import { useState, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useProduct } from "../hook/use.product";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  UploadCloud,
  Star,
  Trash2,
  Plus,
  AlertCircle,
  ShoppingBag,
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
  "100% Raw Cotton",
  "Oversized Silhouette",
  "Cuban Collar",
  "Heavyweight Waffle Knit",
  "Water-Repellent DWR",
  "Pre-washed Techwear",
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
      window.scrollTo({ top: 40, behavior: "smooth" });
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
    <div className="min-h-screen bg-[#e7e7e0] text-zinc-950 flex flex-col font-inter select-none antialiased overflow-x-hidden">
      {/* ── Atelier Top Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#e7e7e0]/95 backdrop-blur-xs border-b border-zinc-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/seller/dashboard"
              className="group flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase text-zinc-700 hover:text-zinc-950 transition-colors pr-3 border-r border-zinc-300"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
              <span className="hidden sm:inline">DASHBOARD</span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="font-michroma text-base sm:text-lg font-bold tracking-[0.25em] uppercase text-zinc-950"
              >
                SNITCH
              </Link>
              <span className="text-zinc-400 font-mono text-xs">/</span>
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-zinc-600">
                STUDIO WORKBENCH
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-700 hover:text-zinc-950 hover:bg-[#eae9e2] bg-[#f4f4f0] border border-zinc-300 h-8 px-3 rounded-none flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700 group-hover:-rotate-180 transition-transform duration-500" />
              <span>CLEAR</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-mono font-bold tracking-wider uppercase h-8 px-4 rounded-none flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>PUBLISHING...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>PUBLISH PRODUCT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Workspace ──────────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-3.5 sm:py-4">
        {/* Breadcrumb Header */}
        <div className="mb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-zinc-300/80 pb-2.5">
          <div>
            <h1 className="font-michroma text-lg sm:text-xl font-bold uppercase tracking-tight text-zinc-950">
              CREATE APPAREL LISTING
            </h1>
            <p className="text-xs font-mono text-zinc-600 mt-0.5">
              Specify high-resolution assets, pricing tiers, and garment
              architecture.
            </p>
          </div>
          <span className="w-fit text-[10px] font-mono font-bold uppercase tracking-widest bg-[#f4f4f0] text-zinc-800 border border-zinc-300 py-0.5 px-2.5 rounded-none shadow-2xs">
            STATUS // UNPUBLISHED DRAFT
          </span>
        </div>

        {/* Global Error Banner */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 flex items-start gap-2 text-xs font-mono animate-in fade-in rounded-none">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div>
              <span className="font-bold text-red-900 uppercase">
                PUBLISHING ERROR:{" "}
              </span>
              <span>{errors.submit}</span>
            </div>
          </div>
        )}

        {/* ── Two-Column Layout ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* ── Left Column: Form Details (7 cols) ────────────────────── */}
          <div className="lg:col-span-7 space-y-4">
            {/* 1. Media & Dropzone */}
            <div className="border border-zinc-300 shadow-2xs rounded-none overflow-hidden bg-[#f4f4f0]">
              <div className="px-4 py-2.5 border-b border-zinc-300/80 flex items-center justify-between bg-[#deddd6]/65">
                <h2 className="font-mono text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  CURATED ASSETS // IMAGERY
                </h2>
                <span
                  className={cn(
                    "text-[10px] font-mono font-bold px-2 py-0.5 border rounded-none",
                    images.length >= MAX_IMAGES
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-[#eae9e2] text-zinc-700 border-zinc-300",
                  )}
                >
                  {images.length} / {MAX_IMAGES} SLOTS
                </span>
              </div>

              <div className="p-4 space-y-3">
                {/* Soft Brutalist Dropzone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative group cursor-pointer rounded-none border-2 border-dashed py-4 px-3 text-center transition-all duration-200",
                    isDragging
                      ? "border-zinc-950 bg-[#e4e3dc]"
                      : "border-zinc-300 hover:border-zinc-950 bg-[#eae9e2]/60 hover:bg-[#eae9e2]",
                    images.length >= MAX_IMAGES &&
                      "pointer-events-none opacity-50",
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
                    <div className="p-2 bg-[#f4f4f0] border border-zinc-300 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                      <UploadCloud className="w-5 h-5 text-zinc-700 group-hover:text-zinc-950" />
                    </div>
                    <div>
                      <span className="font-space text-xs font-bold uppercase tracking-wider text-zinc-950 block">
                        UPLOAD APPAREL SHOTS
                      </span>
                      <span className="font-mono text-[11px] text-zinc-600 mt-0.5 block">
                        Drag and drop or browse files (Max 10MB each)
                      </span>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 bg-[#eae9e2] border border-zinc-300 px-2 py-0.5">
                      JPG • PNG • WEBP
                    </span>
                  </div>
                </div>

                {errors.images && (
                  <p className="text-xs text-red-600 font-mono font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.images}
                  </p>
                )}

                {/* Thumbnail Strip */}
                {images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-2 border-t border-zinc-300/70">
                    {images.map((img, idx) => {
                      const isCover = idx === 0;
                      const isActive = idx === activePreviewIndex;

                      return (
                        <div
                          key={img.id}
                          onClick={() => setActivePreviewIndex(idx)}
                          className={cn(
                            "group relative aspect-[3/4] rounded-none border overflow-hidden cursor-pointer transition-all p-0.5 bg-[#eae9e2]",
                            isActive
                              ? "border-zinc-950 ring-1 ring-zinc-950 shadow-xs"
                              : "border-zinc-300 opacity-80 hover:opacity-100",
                          )}
                        >
                          <img
                            src={img.previewUrl}
                            alt={img.name}
                            className="w-full h-full object-cover"
                          />

                          {isCover && (
                            <span className="absolute top-1 left-1 bg-zinc-950 text-white font-mono text-[8px] font-bold px-1 py-0.2 tracking-widest uppercase rounded-none">
                              PRIMARY
                            </span>
                          )}

                          {/* Hover Action Strip */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 z-10">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetCover(idx);
                                }}
                                title="Set as primary hero"
                                className="p-1 bg-[#f4f4f0] text-zinc-900 hover:bg-zinc-950 hover:text-white transition-colors rounded-none cursor-pointer"
                              >
                                <Star className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(idx);
                              }}
                              title="Delete asset"
                              className="p-1 bg-[#f4f4f0] text-zinc-900 hover:bg-red-600 hover:text-white transition-colors rounded-none cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Product Details & Pricing */}
            <div className="border border-zinc-300 shadow-2xs rounded-none overflow-hidden bg-[#f4f4f0]">
              <div className="px-4 py-2.5 border-b border-zinc-300/80 bg-[#deddd6]/65">
                <h2 className="font-mono text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  EDITORIAL SPECS & CURRENCY PRICING
                </h2>
              </div>

              <div className="p-4 space-y-3.5">
                {/* Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="product-title"
                      className="font-mono text-xs font-bold text-zinc-900 uppercase tracking-wider"
                    >
                      APPAREL TITLE <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">
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
                      "h-9 text-xs font-mono font-medium rounded-none border-zinc-300 focus-visible:ring-zinc-950 bg-[#eae9e2]/55 focus-visible:bg-[#fcfcf9] placeholder:text-zinc-400",
                      errors.title && touched.title && "border-red-500",
                    )}
                  />
                  {errors.title && touched.title && (
                    <p className="text-xs text-red-600 font-mono mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Price & Currency */}
                <div>
                  <label
                    htmlFor="product-price"
                    className="font-mono text-xs font-bold text-zinc-900 uppercase tracking-wider block mb-1"
                  >
                    PRICE ACQUISITION <span className="text-red-500">*</span>
                  </label>

                  <div className="relative flex rounded-none border border-zinc-300 bg-[#eae9e2]/55 focus-within:bg-[#fcfcf9] focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 transition-all h-9">
                    <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-xs font-space font-bold text-zinc-700">
                      {currencySymbol}
                    </span>
                    <input
                      id="product-price"
                      type="number"
                      min="1"
                      step="any"
                      value={formData.priceAmount}
                      onChange={(e) =>
                        handleInputChange("priceAmount", e.target.value)
                      }
                      placeholder="e.g. 2499"
                      className="h-full w-full bg-transparent ps-7 pe-2 text-xs font-mono font-bold text-zinc-950 placeholder:text-zinc-400 outline-none"
                    />
                    <select
                      value={formData.priceCurrency}
                      onChange={(e) =>
                        handleInputChange("priceCurrency", e.target.value)
                      }
                      className="inline-flex items-center rounded-none border-l border-zinc-300 bg-[#deddd6] hover:bg-[#d5d4cd] px-2.5 text-xs font-mono font-bold text-zinc-800 outline-none cursor-pointer transition-colors"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>

                  {errors.priceAmount && touched.priceAmount && (
                    <p className="text-xs text-red-600 font-mono mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.priceAmount}
                    </p>
                  )}

                  {/* Net Payout Summary */}
                  {Number(formData.priceAmount) > 0 && (
                    <div className="mt-1.5 py-1 px-2.5 bg-[#eae9e2] border border-zinc-300/80 rounded-none flex items-center justify-between text-[11px] font-mono text-zinc-700">
                      <span>
                        Atelier fee (2%): -{currencySymbol}
                        {(Number(formData.priceAmount) * 0.02).toFixed(2)}
                      </span>
                      <span className="font-bold text-zinc-950">
                        Net Payout: {currencySymbol}
                        {netPayout}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="product-description"
                      className="font-mono text-xs font-bold text-zinc-900 uppercase tracking-wider"
                    >
                      GARMENT SPECIFICATION{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      ARCHIVE DETAILS
                    </span>
                  </div>
                  <Textarea
                    id="product-description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Detail the silhouette cut, fabric blend, fit notes, and technical care instructions..."
                    className={cn(
                      "text-xs font-inter leading-relaxed min-h-[68px] rounded-none border-zinc-300 focus-visible:ring-zinc-950 bg-[#eae9e2]/55 focus-visible:bg-[#fcfcf9] placeholder:text-zinc-400",
                      errors.description &&
                        touched.description &&
                        "border-red-500",
                    )}
                  />
                  {errors.description && touched.description && (
                    <p className="text-xs text-red-600 font-mono mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.description}
                    </p>
                  )}

                  {/* Quick Tags */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      QUICK SPEC:
                    </span>
                    {QUICK_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddQuickTag(tag)}
                        className="group/tag inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-none bg-[#eae9e2] hover:bg-zinc-950 hover:text-white text-zinc-800 transition-colors border border-zinc-300 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5 text-zinc-400 group-hover/tag:text-white" />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Storefront Preview (5 cols) ────────── */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end space-y-3.5 lg:sticky lg:top-16">
            {/* Storefront Card Preview (Balanced Warm-Tone Sizing) */}
            <div className="w-full max-w-[280px] sm:max-w-[290px] bg-[#f4f4f0] rounded-none border border-zinc-300 shadow-2xs overflow-hidden transition-all duration-300">
              <div className="px-3.5 py-2 bg-[#deddd6]/65 border-b border-zinc-300/80 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                <span>RUNWAY PREVIEW</span>
                <span className="text-zinc-500">LIVE SYNC</span>
              </div>

              {/* 3:4 Media Stage */}
              <div className="aspect-[3/4] w-full bg-[#eae9e2] relative overflow-hidden flex items-center justify-center">
                {images.length > 0 ? (
                  <img
                    key={images[activePreviewIndex]?.id || activePreviewIndex}
                    src={
                      images[activePreviewIndex]?.previewUrl ||
                      images[0]?.previewUrl
                    }
                    alt="Storefront Preview"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-400 gap-2 p-4 text-center">
                    <ShoppingBag className="w-7 h-7 stroke-[1.2] text-zinc-400" />
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                      NO ASSET LOADED
                    </span>
                  </div>
                )}

                {/* Badge */}
                <span className="absolute top-2.5 left-2.5 bg-zinc-950 text-white text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-none">
                  NEW ARRIVAL
                </span>

                {/* Mock Wishlist */}
                <button
                  type="button"
                  onClick={() => setIsWishlisted((prev) => !prev)}
                  title={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                  className={cn(
                    "absolute top-2.5 right-2.5 w-7 h-7 rounded-none bg-[#f4f4f0]/95 border border-zinc-300 hover:border-zinc-950 flex items-center justify-center shadow-xs transition-all cursor-pointer",
                    isWishlisted
                      ? "text-red-500"
                      : "text-zinc-600 hover:text-zinc-950",
                  )}
                >
                  <Heart
                    className={cn(
                      "w-3.5 h-3.5",
                      isWishlisted
                        ? "fill-red-500 text-red-500"
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
                          "h-1 rounded-none transition-all cursor-pointer",
                          activePreviewIndex === dotIdx
                            ? "w-4 bg-zinc-950"
                            : "w-2 bg-zinc-950/40 hover:bg-zinc-950",
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 space-y-1 bg-[#f4f4f0] border-t border-zinc-300/70">
                <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-500 uppercase block">
                  SNITCH ATELIER
                </span>
                <p className="font-space text-xs font-semibold text-zinc-950 uppercase truncate">
                  {formData.title.trim() || "Untitled Product"}
                </p>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="font-space text-sm font-bold text-zinc-950">
                    {currencySymbol}{" "}
                    {formData.priceAmount
                      ? Number(formData.priceAmount).toLocaleString()
                      : "0"}
                  </span>
                  <span className="font-mono text-[9px] text-zinc-500 uppercase">
                    TAX INCL.
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Publish CTA button */}
            <div className="w-full max-w-[280px] sm:max-w-[290px]">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-space font-bold uppercase tracking-widest h-10 rounded-none flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>PUBLISHING...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>PUBLISH TO RUNWAY</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Success Modal ────────────────────────────────────── */}
      {successData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="bg-[#f4f4f0] rounded-none max-w-sm w-full p-5 text-center border border-zinc-950 shadow-2xl space-y-3 animate-in zoom-in-95">
            <div className="w-11 h-11 bg-[#deddd6] border border-zinc-400 text-zinc-950 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-zinc-900" />
            </div>

            <div className="space-y-0.5">
              <h3 className="font-michroma text-sm font-bold uppercase tracking-tight text-zinc-950">
                PRODUCT PUBLISHED
              </h3>
              <p className="text-xs font-mono text-zinc-600">
                &ldquo;{successData?.title || formData.title}&rdquo; is now
                active on the runway catalog.
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 text-xs font-mono font-bold uppercase tracking-wider h-8.5 rounded-none border border-zinc-300 bg-[#eae9e2] hover:bg-[#deddd6] text-zinc-900 transition-colors cursor-pointer"
              >
                CREATE ANOTHER
              </button>
              <button
                type="button"
                onClick={() => navigate("/seller/dashboard")}
                className="flex-1 bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-mono font-bold uppercase tracking-wider h-8.5 rounded-none transition-colors cursor-pointer"
              >
                VIEW DASHBOARD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
