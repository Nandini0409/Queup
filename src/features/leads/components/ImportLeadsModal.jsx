import { useState } from "react";
import { X, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { mapImportedLead } from "../../../utils/excelImportHelpers";
import { importLeads } from "../services/leads";
import toast from "react-hot-toast"

function ImportLeadsModal({
  userId,
  onClose,
  onImportSuccess,
}) {
  const [file, setFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
  }

  async function handleImport() {
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    try {
      setIsImporting(true);

      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer);

      const sheet =
        workbook.Sheets[
        workbook.SheetNames[0]
        ];

      if (!sheet) {
        throw new Error("No worksheet found.");
      }

      const rows = XLSX.utils.sheet_to_json(sheet);

      if (rows.length === 0) {
        toast.error("The selected file is empty.");
        return;
      }

      const mappedRows = rows.map(mapImportedLead);

      // Remove completely empty rows
      const validRows = mappedRows.filter(
        (lead) =>
          lead.name &&
          lead.profile_link
      );

      if (validRows.length === 0) {
        toast.error(
          "No valid leads were found."
        );
        return;
      }

      await importLeads(userId, validRows);

      onImportSuccess();

      toast.success(
        `${validRows.length} lead${validRows.length > 1 ? "s" : ""
        } imported successfully.`
      );

      onClose();
    } catch (error) {
      console.error(error);

      toast.error(error.message, {
  duration: 12000, // 12 seconds
});
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div
        className="
          fixed
          left-1/2
          top-1/2
          z-50
          w-[95vw]
          max-w-xl
          -translate-x-1/2
          -translate-y-1/2

          rounded-3xl
          border
          border-[var(--color-border)]

          bg-white
          shadow-2xl
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between

            border-b
            border-[var(--color-border)]

            px-6
            py-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-xl

                bg-[rgba(24,27,58,0.06)]
                text-[var(--color-primary)]
              "
            >
              <Upload size={18} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Import Leads
              </h2>

              <p className="text-sm text-[var(--color-text-secondary)]">
                Import leads from Excel or CSV.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <label
            className="
              flex
              cursor-pointer
              flex-col
              items-center
              justify-center

              rounded-2xl
              border-2
              border-dashed
              border-[var(--color-border)]

              px-6
              py-12

              hover:bg-slate-50
            "
          >
            <Upload
              size={32}
              className="text-[var(--color-primary)]"
            />

            <p className="mt-4 font-medium">
              Click to choose a file
            </p>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Supports .xlsx and .xls 
            </p>

            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              disabled={isImporting}
              onChange={handleFileChange}
            />
          </label>

          {file && (
            <div
              className="
                rounded-xl
                border
                border-green-200

                bg-green-50

                px-4
                py-3
              "
            >
              <p className="text-sm font-medium text-green-700">
                Selected File
              </p>

              <p className="mt-1 text-sm truncate">
                {file.name}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="
            flex
            justify-end
            gap-3

            border-t
            border-[var(--color-border)]

            px-6
            py-5
          "
        >
          <button
            disabled={isImporting}
            onClick={onClose}
            className="
    rounded-xl
    border
    border-[var(--color-border)]
    px-5
    py-2.5
    disabled:opacity-50
  "
          >
            Cancel
          </button>

          <button
            disabled={!file || isImporting}
            onClick={handleImport}
            className="
    rounded-xl
    bg-[var(--color-primary)]
    px-5
    py-2.5
    text-white
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
          >
            {isImporting
              ? "Importing..."
              : "Import"}
          </button>
        </div>
      </div>
    </>
  );
}

export default ImportLeadsModal;