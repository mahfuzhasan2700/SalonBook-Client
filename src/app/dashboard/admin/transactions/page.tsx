'use client';

import React, { useState, useEffect } from 'react';
import { Transaction } from '../../../../types';
import { apiFetch } from '../../../../lib/api';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import EmptyState from '../../../../components/common/EmptyState';
import { toast } from 'sonner';
import { CreditCard, CheckCircle2, ShieldCheck, DollarSign, Calendar, Copy } from 'lucide-react';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const res = await apiFetch('/payments/transactions');
        if (res.success && res.transactions) {
          setTransactions(res.transactions);
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to retrieve transactions.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const copySessionId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Stripe Session ID copied to clipboard!');
  };

  const totalAmount = transactions.reduce((acc, t) => acc + (t.status === 'paid' ? t.amount : 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#80405A] dark:text-[#E2A5BA]">
            Financial Audit Trail
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mt-1">
            Payment Transactions
          </h1>
          <p className="text-sm text-[#675961] dark:text-[#C8B8C0]">
            Stripe webhook verified payment ledger. Immutable audit records of completed client appointments.
          </p>
        </div>

        {/* Volume Badge */}
        <div className="bg-white dark:bg-[#241E23] border border-[#EAE3DB] dark:border-[#382E36] p-4 rounded-2xl shadow-sm flex items-center space-x-3 self-start sm:self-auto">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#675961] dark:text-[#C8B8C0]">
              Verified Volume
            </p>
            <p className="text-xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED]">
              ${totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Auditing payment transactions..." />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No Transactions Logged"
          description="No successful Stripe checkout payments have been processed yet."
        />
      ) : (
        <div className="bg-white dark:bg-[#241E23] rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF7F3] dark:bg-[#1d171b] border-b border-[#EAE3DB] dark:border-[#382E36] text-xs font-bold uppercase tracking-wider text-[#675961] dark:text-[#C8B8C0]">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Service & Schedule</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Stripe Session Reference</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3DB] dark:divide-[#382E36] text-[#291F26] dark:text-[#F8F1ED]">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-[#FAF7F3]/60 dark:hover:bg-[#1d171b]/60 transition-colors">
                    {/* Customer */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-[#291F26] dark:text-[#F8F1ED] text-sm">
                        {tx.customerId?.name || 'Customer'}
                      </p>
                      <p className="text-xs text-[#675961] dark:text-[#C8B8C0]">{tx.customerId?.email}</p>
                    </td>

                    {/* Service & Schedule */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-[#291F26] dark:text-[#F8F1ED] text-sm">
                        {tx.appointmentId?.serviceId?.serviceName || tx.appointmentId?.serviceName || 'Salon Service'}
                      </p>
                      <p className="text-xs text-[#675961] dark:text-[#C8B8C0]">
                        {tx.appointmentId?.appointmentDate} ({tx.appointmentId?.timeSlot})
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6">
                      <span className="font-bold text-[#291F26] dark:text-[#F8F1ED] text-base">
                        ${tx.amount}{' '}
                        <span className="text-xs font-medium uppercase text-[#675961] dark:text-[#C8B8C0]">
                          {tx.currency}
                        </span>
                      </span>
                    </td>

                    {/* Stripe Session ID */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <code className="text-xs font-mono bg-[#FAF7F3] dark:bg-[#171316] border border-[#EAE3DB] dark:border-[#382E36] px-2 py-1 rounded-md text-[#291F26] dark:text-[#F8F1ED] max-w-[160px] truncate">
                          {tx.stripeSessionId}
                        </code>
                        <button
                          onClick={() => copySessionId(tx.stripeSessionId)}
                          className="p-1 hover:bg-stone-100 dark:hover:bg-[#171316] rounded text-[#675961] dark:text-[#C8B8C0] hover:text-[#291F26] dark:hover:text-[#F8F1ED] transition-colors"
                          title="Copy Full ID"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{tx.status}</span>
                      </span>
                    </td>

                    {/* Transaction Date */}
                    <td className="py-4 px-6 text-right text-xs text-[#675961] dark:text-[#C8B8C0]">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
