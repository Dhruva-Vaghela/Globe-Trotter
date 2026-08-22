import React from 'react';
import { User, Shield, Trash2, Calendar, Map } from 'lucide-react';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string | null;
  createdAt: string | Date;
  _count?: {
    trips: number;
    posts: number;
  };
}

interface UserTableProps {
  users: UserRecord[];
  currentUserId?: string;
  onRoleChange: (userId: string, newRole: 'USER' | 'ADMIN') => void;
  onDeleteUser: (userId: string, userName: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentUserId,
  onRoleChange,
  onDeleteUser,
}) => {
  const formatDate = (dateVal: string | Date) => {
    return new Date(dateVal).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #e2e8f0',
        padding: '1.4rem',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.5rem',
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
        User Management ({users.length})
      </h3>

      {users.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
          <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: '0.9rem' }}>No users match the search filters.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--fg-muted)' }}>User</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--fg-muted)' }}>Email</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--fg-muted)' }}>Role</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--fg-muted)' }}>Trips</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--fg-muted)' }}>Joined Date</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--fg-muted)', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((usr) => {
                const isSelf = usr.id === currentUserId;
                const isAdmin = usr.role === 'ADMIN';

                return (
                  <tr key={usr.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: isAdmin ? '#e0e7ff' : '#f1f5f9',
                            color: isAdmin ? '#4f46e5' : 'var(--fg-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                          }}
                        >
                          {isAdmin ? <Shield size={16} /> : <User size={16} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{usr.name}</div>
                          {isSelf && <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>(You)</span>}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: 'var(--fg-muted)' }}>{usr.email}</td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <select
                        value={usr.role}
                        disabled={isSelf}
                        onChange={(e) => onRoleChange(usr.id, e.target.value as 'USER' | 'ADMIN')}
                        style={{
                          padding: '0.3rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          border: 'none',
                          background: isAdmin ? '#e0e7ff' : '#f1f5f9',
                          color: isAdmin ? '#4f46e5' : '#475569',
                          cursor: isSelf ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Map size={14} color="var(--fg-muted)" />
                        {usr._count?.trips || 0}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: 'var(--fg-muted)', fontSize: '0.825rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} />
                        {formatDate(usr.createdAt)}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => onDeleteUser(usr.id, usr.name)}
                        disabled={isSelf}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: isSelf ? '#cbd5e1' : '#ef4444',
                          cursor: isSelf ? 'not-allowed' : 'pointer',
                          padding: '0.3rem',
                        }}
                        title={isSelf ? 'Cannot delete your own account' : 'Delete user'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
