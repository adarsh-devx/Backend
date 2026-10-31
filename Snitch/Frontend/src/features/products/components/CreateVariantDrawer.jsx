import { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Loader2,
  AlertCircle,
  Check,
  Plus,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Exact size options from mockup
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

// Exact circular colors from mockup
const COLOR_OPTIONS = [
  { name: "Black", hex: "#000000", isDark: true },
  { name: "White", hex: "#ffffff", isDark: false },
  { name: "Grey", hex: "#6b7280", isDark: true },
  { name: "Red", hex: "#dc2626", isDark: true },
  { name: "Blue", hex: "#2563eb", isDark: true },
  { name: "Green", hex: "#16a34a", isDark: true },
];

// Exact fit options from mockup
const FIT_OPTIONS = ["Regular", "Oversized", "Slim", "Relaxed"];

export default function CreateVariantDrawer({
  isOpen,
  onClose,
  product,
  onVariantCreated,
}) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [customColor, setCustomColor] = useState("");
  const [showCustomColorInput, setShowCustomColorInput] = useState(false);
  const [selectedFit, setSelectedFit] = useState("Oversized");

  // Fabric and custom attributes
  const [fabric, setFabric] = useState("380 GSM FLEECE");
  const [showCustomAttrForm, setShowCustomAttrForm] = useState(false);
  const [customAttrs, setCustomAttrs] = useState([]);
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");

  // Pricing & Stock
  const [priceAmount, setPriceAmount] = useState("3499");
  const [currency, setCurrency] = useState("INR");
  const [stock, setStock] = useState("0");

  // Image uploads state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  // Initialize price with master product price if present
  useEffect(() => {
    if (product?.price?.amount) {
      setPriceAmount(String(product.price.amount));
    }
    if (product?.price?.currency) {
      setCurrency(product.price.currency);
    }
  }, [product]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle file select
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleAddCustomAttr = () => {
    if (!newKey.trim() || !newVal.trim()) return;
    setCustomAttrs((prev) => [
      ...prev,
      { key: newKey.trim(), value: newVal.trim() },
    ]);
    setNewKey("");
    setNewVal("");
  };

  const handleRemoveCustomAttr = (idx) => {
    setCustomAttrs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const attributes = {
        size: selectedSize,
        color: customColor.trim() || selectedColor,
        fit: selectedFit,
      };

      if (fabric) {
        attributes.fabric = fabric;
      }

      customAttrs.forEach(({ key, value }) => {
        attributes[key] = value;
      });

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      formData.append("attributes", JSON.stringify(attributes));
      formData.append(
        "priceAmount",
        priceAmount || String(product?.price?.amount || 0),
      );
      formData.append("priceCurrency", currency || "INR");
      formData.append("stock", String(Math.max(0, parseInt(stock, 10) || 0)));

      if (onVariantCreated) {
        await onVariantCreated(formData);
      }

      // Reset state & close
      setSelectedFiles([]);
      setPreviewUrls([]);
      setCustomAttrs([]);
      setCustomColor("");
      onClose();
    } catch (err) {
      console.error("Variant creation error:", err);
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to craft variant",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-inter select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Container: exact ~380px width matching red outline & height constrained to 100vh */}
      <div className="relative w-full max-w-[350px] bg-[#f4f3ed] text-zinc-900 h-screen max-h-screen shadow-2xl flex flex-col z-10 border-l border-zinc-300 overflow-hidden animate-in slide-in-from-right duration-300">
        {/* ── HEADER (Solid Black) ─────────────────────────── */}
        <header className="px-5 py-3.5 bg-black text-white flex items-start justify-between shrink-0">
          <div className="space-y-0.5">
            <h2 className="font-space text-base font-bold uppercase tracking-wider text-white leading-tight">
              CREATE VARIANT
            </h2>
            <p className="text-[11px] font-inter text-zinc-400 leading-tight">
              Add a new variant with custom images, attributes, price and
              initial stock.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-xs shrink-0 ml-3"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* ── SCROLLABLE FORM BODY (Proportionally Compact) ─── */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 min-h-0 overflow-y-auto px-5 py-3 space-y-2.5"
        >
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-mono flex items-center gap-2 rounded-md">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ── SECTION: VARIANT IMAGES ─────────────────────── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-space font-bold uppercase tracking-wider text-zinc-900">
                VARIANT IMAGES
              </label>
              <span className="text-[11px] font-mono text-zinc-500 font-medium">
                {selectedFiles.length > 0 ? `${selectedFiles.length}/8` : "4/8"}
              </span>
            </div>

            {/* Dashed Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-zinc-300 hover:border-zinc-900 rounded-md bg-[#faf9f5] hover:bg-white py-8 px-3 text-center cursor-pointer transition-colors space-y-0.5 group flex flex-col items-center justify-center"
            >
              <Upload className="w-5 h-5 text-zinc-700 stroke-[1.5] group-hover:scale-105 transition-transform" />
              <div className="text-[11px] text-zinc-800">
                <span className="font-semibold text-zinc-950">
                  Drag & drop images here
                </span>{" "}
                <span className="text-zinc-600">or click to upload</span>
              </div>
              <p className="text-[10px] text-zinc-400">
                Supports JPG, PNG, WebP (Max 5MB each)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Thumbnail Previews Row (Only rendered when images are uploaded) */}
            {previewUrls.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 pt-0.5">
                {previewUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-13 h-13 rounded-md bg-zinc-200 border border-zinc-300 overflow-hidden shrink-0 shadow-2xs"
                  >
                    <img
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-black hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── SECTION: ATTRIBUTES ─────────────────────────── */}
          <div className="space-y-2 pt-0.5">
            <h3 className="text-[11px] font-space font-bold uppercase tracking-wider text-zinc-900">
              ATTRIBUTES
            </h3>

            {/* Size */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1">
                Size{" "}
                <span className="text-zinc-400 font-mono text-[10px]">→</span>
              </label>

              <div className="grid grid-cols-6 gap-1.5">
                {SIZE_OPTIONS.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={cn(
                        "h-8 rounded-md border text-xs font-bold transition-all flex items-center justify-center cursor-pointer",
                        isSelected
                          ? "bg-black text-white border-black shadow-xs"
                          : "bg-[#faf9f5] hover:bg-white text-zinc-800 border-zinc-300 hover:border-zinc-800",
                      )}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color (Single Horizontal Row with checkmark & (+) button) */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1">
                Color <span className="text-zinc-400 text-[8px]">→</span>
              </label>

              <div className="flex items-center gap-2.5">
                {COLOR_OPTIONS.map((swatch) => {
                  const isSelected =
                    selectedColor === swatch.name && !customColor;
                  return (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => {
                        setSelectedColor(swatch.name);
                        setCustomColor("");
                      }}
                      title={swatch.name}
                      className={cn(
                        "relative w-7 h-7 rounded-full transition-all flex items-center justify-center cursor-pointer hover:scale-105",
                        isSelected
                          ? "ring-2 ring-black ring-offset-2 ring-offset-[#f4f3ed]"
                          : "border border-zinc-300 hover:border-zinc-600",
                      )}
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={cn(
                            "w-3.5 h-3.5 stroke-[2.5]",
                            swatch.isDark ? "text-white" : "text-black",
                          )}
                        />
                      )}
                    </button>
                  );
                })}

                {/* (+) button for custom color */}
                <button
                  type="button"
                  onClick={() => setShowCustomColorInput((prev) => !prev)}
                  title="Add custom color"
                  className={cn(
                    "w-7 h-7 rounded-full border border-dashed flex items-center justify-center cursor-pointer transition-all hover:scale-105",
                    showCustomColorInput || customColor
                      ? "border-black bg-black text-white"
                      : "border-zinc-400 bg-white/60 hover:bg-white text-zinc-600 hover:border-black",
                  )}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Inline Custom Color Input if toggled */}
              {(showCustomColorInput || customColor) && (
                <div className="flex items-center gap-1.5 mt-1 animate-in fade-in">
                  <input
                    type="text"
                    placeholder="Custom color (e.g. Acid Wash)"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      if (e.target.value.trim()) {
                        setSelectedColor(e.target.value.trim());
                      }
                    }}
                    className="flex-1 bg-white rounded-md border border-zinc-300 px-2.5 py-1 text-xs text-zinc-900 outline-none focus:border-black"
                    autoFocus
                  />
                  {customColor && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomColor("");
                        setSelectedColor(COLOR_OPTIONS[0].name);
                      }}
                      className="p-1 text-zinc-400 hover:text-zinc-900"
                      title="Clear"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Fit */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1">
                Fit{" "}
                <span className="text-zinc-400 font-mono text-[10px]">→</span>
              </label>

              <div className="grid grid-cols-4 gap-1.5">
                {FIT_OPTIONS.map((fit) => {
                  const isSelected = selectedFit === fit;
                  return (
                    <button
                      key={fit}
                      type="button"
                      onClick={() => setSelectedFit(fit)}
                      className={cn(
                        "py-1.5 px-2 rounded-md border text-xs font-medium text-center transition-all cursor-pointer",
                        isSelected
                          ? "bg-black text-white border-black font-semibold shadow-xs"
                          : "bg-[#faf9f5] hover:bg-white text-zinc-800 border-zinc-300 hover:border-zinc-800",
                      )}
                    >
                      {fit}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fabric */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-700 block">
                Fabric
              </label>

              <div className="flex items-center justify-between bg-[#faf9f5] border border-zinc-300 rounded-md px-3 py-1.5 text-xs font-bold text-zinc-900">
                <div className="flex items-center gap-1.5">
                  <span>{fabric || "380 GSM FLEECE"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                {fabric && (
                  <button
                    type="button"
                    onClick={() => setFabric("")}
                    className="text-zinc-400 hover:text-zinc-900 cursor-pointer"
                    title="Remove fabric"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* + Add Custom Attribute Button */}
            <div>
              <button
                type="button"
                onClick={() => setShowCustomAttrForm((prev) => !prev)}
                className="w-full py-1.5 rounded-md border border-zinc-400/80 bg-transparent hover:bg-white text-zinc-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3 text-zinc-700" />
                <span>Add Custom Attribute</span>
              </button>

              {/* Expandable Key-Value Form */}
              {showCustomAttrForm && (
                <div className="flex gap-1.5 mt-1.5 animate-in fade-in">
                  <input
                    type="text"
                    placeholder="Key (e.g. Wash)"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="flex-1 bg-white rounded-md border border-zinc-300 px-2.5 py-1 text-xs text-zinc-900 outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Acid)"
                    value={newVal}
                    onChange={(e) => setNewVal(e.target.value)}
                    className="flex-1 bg-white rounded-md border border-zinc-300 px-2.5 py-1 text-xs text-zinc-900 outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAttr}
                    className="px-3 bg-black text-white text-xs font-semibold rounded-md hover:bg-zinc-800 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              )}

              {/* Render custom attributes chips */}
              {customAttrs.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {customAttrs.map((attr, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-zinc-300 rounded-md text-[11px] font-medium text-zinc-800 shadow-2xs"
                    >
                      <strong>{attr.key}:</strong> {attr.value}
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomAttr(idx)}
                        className="text-zinc-400 hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── SECTION: PRICING ────────────────────────────── */}
          <div className="space-y-1.5 pt-0.5">
            <h4 className="text-[11px] font-space font-bold uppercase tracking-wider text-zinc-900">
              PRICING
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Price (Amount) */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-zinc-700">
                  Price (Amount)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={priceAmount}
                  onChange={(e) => setPriceAmount(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-900 outline-none focus:border-black"
                  placeholder="3499"
                />
              </div>

              {/* Currency */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-zinc-700">
                  Currency
                </label>
                <div className="relative">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full appearance-none bg-white border border-zinc-300 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-900 outline-none focus:border-black cursor-pointer pr-7"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION: INITIAL STOCK ──────────────────────── */}
          <div className="space-y-1">
            <h4 className="text-[11px] font-space font-bold uppercase tracking-wider text-zinc-900">
              INITIAL STOCK
            </h4>
            <input
              type="number"
              min="0"
              step="1"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-900 outline-none focus:border-black"
              placeholder="0"
            />
          </div>
        </form>

        {/* ── FOOTER ACTIONS ───────────────────────────────── */}
        <footer className="px-5 py-3 border-t border-zinc-300/80 bg-[#f4f3ed] shrink-0 flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-24 py-2.5 rounded-md border border-zinc-400 bg-transparent hover:bg-white text-xs font-bold text-zinc-800 transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-md bg-black hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <span>PUBLISH VARIANT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}
