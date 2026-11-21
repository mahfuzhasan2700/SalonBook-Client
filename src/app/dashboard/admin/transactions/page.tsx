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
          <span className="text-xs uppercase font-bold tracking-wider text-primary-700">
            Financial Audit Trail
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
            Payment Transactions
          </h1>
          <p className="text-sm text-gray-500">
            Stripe webhook verified payment ledger. Immutable audit records of completed client appointments.
          </p>
        </div>

        {/* Volume Badge */}
        <div className="bg-white border border-rose-100 p-4 rounded-2xl shadow-sm flex items-center space-x-3 self-start sm:self-auto">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Verified Volume
            </p>
            <p className="text-xl font-serif font-bold text-gray-900">
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
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-50/70 border-b border-rose-100 text-xs font-bold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Service & Schedule</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Stripe Session Reference</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-rose-50/30 transition-colors">
                    {/* Customer */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900 text-sm">
                        {tx.customerId?.name || 'Customer'}
                      </p>
                      <p className="text-xs text-gray-500">{tx.customerId?.email}</p>
                    </td>

                    {/* Service & Schedule */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900 text-sm">
                        {tx.appointmentId?.serviceId?.serviceName || 'Salon Service'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {tx.appointmentId?.appointmentDate} ({tx.appointmentId?.timeSlot})
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-900 text-base">
                        ${tx.amount}{' '}
                        <span className="text-xs font-medium uppercase text-gray-400">
                          {tx.currency}
                        </span>
                      </span>
                    </td>

                    {/* Stripe Session ID */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-md text-gray-700 max-w-[160px] truncate">
                          {tx.stripeSessionId}
                        </code>
                        <button
                          onClick={() => copySessionId(tx.stripeSessionId)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 transition-colors"
                          title="Copy Full ID"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{tx.status}</span>
                      </span>
                    </td>

                    {/* Transaction Date */}
                    <td className="py-4 px-6 text-right text-xs text-gray-500">
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
