import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Sparkles, CheckCircle2, RefreshCw, ArrowRight, Table } from 'lucide-react';
import { importSpreadsheet } from '../services/api.js';

export default function SpreadsheetImportModal({
  isOpen,
  onClose,
  onImportComplete
}) {
  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewRows, setPreviewRows] = useState([]);

  if (!isOpen) return null;

  const sampleCsv = `Date,Category,Description,Type,Amount (£)
2026-11-01,Income,Autumn Student Maintenance Grant,Credit,3200.00
2026-11-03,Fixed Housing,Prepaid Accommodation Tranche,Debit,850.00
2026-11-04,Utilities,Fiber Internet & Water Bill,Debit,45.00
2026-11-05,Savings Goal,Emergency Cushion Target,Goal,1200.00
2026-11-05,Savings Goal,Graduation Wardrobe Target,Goal,600.00
2026-11-05,Savings Goal,Deposit Savings Target,Goal,2500.00`;

  const parseCsvToPreview = (raw) => {
    const lines = raw.trim().split('\n').filter(Boolean);
    if (lines.length <= 1) return [];
    return lines.slice(1, 6).map((line, idx) => {
      const parts = line.split(',');
      return {
        id: idx,
        date: parts[0]?.trim() || '',
        category: parts[1]?.trim() || '',
        description: parts[2]?.trim() || '',
        type: parts[3]?.trim() || '',
        amount: parts[4]?.trim() || ''
      };
    });
  };

  const handleLoadSample = () => {
    setCsvText(sampleCsv);
    setFileName('student_budget_2026_q4.csv');
    setPreviewRows(parseCsvToPreview(sampleCsv));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result || '';
      setCsvText(content);
      setPreviewRows(parseCsvToPreview(content));
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!csvText.trim()) return;
    setIsProcessing(true);

    try {
      const result = await importSpreadsheet(csvText);
      onImportComplete(result);
      onClose();
    } catch (err) {
      console.error('Import failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1628]/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0A1628] text-white p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg">Import Budget Spreadsheet</h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Gemini Ingestion Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Already have an Excel or Google Sheets budget? Migrate in seconds without starting over.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Explanatory Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 text-xs text-emerald-950 space-y-1.5">
            <p className="font-extrabold flex items-center gap-1.5 text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Zero-Friction Budget Migration
            </p>
            <p className="text-slate-600 leading-relaxed">
              Able AI analyzes your existing categories, lump-sum maintenance tranches, and savings targets. It automatically derives your daily safe-spend limit and populates your AG Grid ledger so your historical context is preserved.
            </p>
          </div>

          {/* Upload Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                Upload CSV or Excel Export
              </label>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200 transition-colors cursor-pointer"
              >
                + Load Sample Student Budget CSV
              </button>
            </div>

            <label className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-slate-50/50 hover:bg-teal-50/20">
              <Upload className="w-8 h-8 text-slate-400" />
              <div className="text-center">
                <span className="text-xs font-bold text-slate-700">
                  {fileName ? `Loaded: ${fileName}` : 'Click to select CSV / Excel spreadsheet file'}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Supports .csv and text formats</p>
              </div>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Data Preview */}
          {previewRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Table className="w-3.5 h-3.5 text-teal-600" />
                <span>Detected Rows Preview ({previewRows.length} sample rows):</span>
              </div>
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-[10px] font-extrabold uppercase text-slate-500">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {previewRows.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-500">{r.date}</td>
                        <td className="py-2 px-3 font-semibold text-slate-700">{r.category}</td>
                        <td className="py-2 px-3 text-[#0A1628]">{r.description}</td>
                        <td className="py-2 px-3 text-slate-500">{r.type}</td>
                        <td className="py-2 px-3 text-right font-bold text-[#0A1628]">£{r.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500 font-medium">
            Powered by Google Gemini 1.5/2.0 Ingestion
          </p>

          <button
            onClick={handleImport}
            disabled={!csvText.trim() || isProcessing}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-teal-200" />
                <span>Ingesting with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>Calibrate Able AI with Spreadsheet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
