import React, { useState, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Search, Download, CheckCircle2, ArrowUpDown, Filter, Shield } from 'lucide-react';

export default function LiveLedger({ transactions = [], isCompact = false, onNavigateToLedger }) {
  const gridRef = useRef(null);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // AG Grid Column Definitions
  const columnDefs = useMemo(() => [
    {
      field: 'id',
      headerName: 'PayPal Tx ID',
      width: 170,
      cellRenderer: (params) => (
        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded">
          {params.value}
        </span>
      ),
      filter: 'agTextColumnFilter',
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 130,
      cellClass: 'text-xs font-semibold text-slate-500',
      sort: 'desc',
    },
    {
      field: 'description',
      headerName: 'Description & Rationale',
      flex: 2,
      minWidth: 260,
      cellClass: 'font-bold text-[#0A1628]',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'bucket',
      headerName: 'Target Bucket',
      width: 200,
      cellRenderer: (params) => (
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
          {params.value}
        </span>
      ),
      filter: true,
    },
    {
      field: 'type',
      headerName: 'API Rail',
      width: 180,
      cellRenderer: (params) => {
        const isPayout = params.value?.includes('Payout');
        return (
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${isPayout ? 'bg-indigo-50 text-indigo-700' : 'bg-teal-50 text-teal-700'}`}>
            {params.value}
          </span>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      cellRenderer: (params) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          {params.value}
        </span>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      cellClass: 'text-right font-black text-[#0A1628]',
      valueFormatter: (params) => `£${Number(params.value).toFixed(2)}`,
      comparator: (valueA, valueB) => valueA - valueB,
    },
  ], []);

  // Default Column Config
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
  }), []);

  // Filtered Rows for UI filter selection
  const filteredRows = useMemo(() => {
    if (statusFilter === 'ALL') return transactions;
    return transactions.filter(t => t.status.toUpperCase() === statusFilter);
  }, [transactions, statusFilter]);

  // CSV Export via AG Grid API
  const handleExportCsv = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `able-ai-financial-ledger-${new Date().toISOString().split('T')[0]}.csv`,
      });
    }
  };

  if (isCompact) {
    return (
      <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-[#0A1628]">Live Financial Ledger</h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                AG Grid Powered
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Real-time audit trail of every autonomous PayPal sweep and disbursement
            </p>
          </div>
          {onNavigateToLedger && (
            <button
              onClick={onNavigateToLedger}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#0A1628] transition-colors"
            >
              Full AG Grid Ledger
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-200/70">
                <th className="py-3.5 px-6">Transaction ID</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Rail</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {transactions.slice(0, 4).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-xs font-bold text-slate-500">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-[#0A1628]">{tx.description}</td>
                  <td className="py-3.5 px-6 text-xs font-semibold text-slate-500">
                    {tx.type}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200/60">
                      <CheckCircle2 className="w-3 h-3" /> {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right font-black text-[#0A1628]">
                    £{tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black text-[#0A1628]">Live Financial Ledger</h2>
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600/10 to-teal-500/10 text-blue-900 border border-blue-600/20">
              AG Grid Enterprise Architecture
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Cryptographic audit log of every Gemini AI sweep, PayPal Order capture, and Payout disbursement.
          </p>
        </div>

        {/* Toolbar: Quick Filter, Status Filter, CSV Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search all columns in AG Grid..."
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 w-60 shadow-2xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="DISBURSED">Disbursed</option>
            <option value="CLEARED">Cleared</option>
          </select>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 text-xs font-bold bg-[#0A1628] hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* AG Grid Component */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 overflow-hidden">
        <div className="ag-theme-quartz w-full" style={{ height: '480px' }}>
          <AgGridReact
            ref={gridRef}
            rowData={filteredRows}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            quickFilterText={quickFilterText}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
            animateRows={true}
            rowHeight={48}
            headerHeight={44}
          />
        </div>
      </div>
    </div>
  );
}
