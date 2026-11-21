'use client';

import React, { useState, useEffect } from 'react';
import { User } from '../../../../types';
import { apiFetch } from '../../../../lib/api';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import EmptyState from '../../../../components/common/EmptyState';
import { toast } from 'sonner';
import { Users, ShieldAlert, ShieldCheck, Search, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch('/admin/users');
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to retrieve registered users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (user: User) => {
    const action = user.isBlocked ? 'unblock' : 'block';
    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}? ${
        !user.isBlocked ? 'They will lose access to booking and appointments.' : ''
      }`
    );
    if (!confirmed) return;

    setActionLoadingId(user._id);

    try {
      const res = await apiFetch(`/admin/users/${user._id}/block`, {
        method: 'PATCH',
      });

      if (res.success) {
        toast.success(res.message || `User successfully ${action}ed.`);
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action} user.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-primary-700">
            User Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
            Manage Registered Customers
          </h1>
          <p className="text-sm text-gray-500">
            Audit customer accounts, contact details, and suspend or reinstate booking permissions.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-primary-600 text-xs text-gray-800 outline-none bg-white"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Retrieving registered clientele..." />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          title="No Customers Found"
          description="There are currently no registered customers matching your search query."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-50/70 border-b border-rose-100 text-xs font-bold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6">Account Status</th>
                  <th className="py-4 px-6 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredUsers.map((u) => {
                  const isBlocked = u.isBlocked;
                  return (
                    <tr key={u._id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3.5">
                          <img
                            src={u.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt={u.name}
                            className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-rose-100"
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-rose-50 px-2 py-0.5 rounded-full">
                              {u.role}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-gray-600 space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span>{u.email}</span>
                        </div>
                        {u.phone && (
                          <div className="flex items-center space-x-1.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6 text-xs text-gray-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isBlocked
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isBlocked ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                          <span>{isBlocked ? 'Suspended' : 'Active'}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleToggleBlock(u)}
                          disabled={actionLoadingId === u._id}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            isBlocked
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                              : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                          }`}
                        >
                          {actionLoadingId === u._id
                            ? 'Processing...'
                            : isBlocked
                            ? 'Reactivate Account'
                            : 'Suspend User'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
