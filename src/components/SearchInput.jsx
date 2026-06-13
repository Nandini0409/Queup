import { X, Search } from "lucide-react";

function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="relative">
      {/* Search Icon */}
      <Search
        size={18}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-[var(--color-text-secondary)]
        "
      />

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          rounded-xl
          bg-[var(--color-bg)]
          py-3
          pl-11
          pr-11
          text-sm
          outline-none
          ring-1
          ring-[var(--color-border)]
          transition
          focus:ring-2
          focus:ring-[var(--color-accent)]
        "
      />

      {/* Clear Button */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-full
            p-1
            text-[var(--color-text-secondary)]
            transition
            hover:bg-slate-200
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchInput;