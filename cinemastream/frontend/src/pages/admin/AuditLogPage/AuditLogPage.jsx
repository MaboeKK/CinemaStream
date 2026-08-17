import React, { useCallback, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminNavbar from '../../../components/admin/AdminNavbar';
import adminApi from '../../../api/adminApi';
import './AuditLogPage.scss';

const ACTION_LABELS = {
  role_change: 'Role changed',
  status_change: 'Status changed',
  force_logout: 'Forced logout',
  verify_email: 'Verified email',
  trigger_password_reset: 'Triggered password reset',
  content_feature: 'Featured content',
  content_block: 'Blocked content',
  content_override_removed: 'Removed content override',
};

const describeMetadata = (row) => {
  const m = row.metadata;
  if (!m) return '';
  if (row.action === 'role_change') return `${m.fromRole} → ${m.toRole}`;
  if (row.action === 'status_change') return `${m.fromStatus} → ${m.toStatus}${m.reason ? ` (${m.reason})` : ''}`;
  if (row.action.startsWith('content_')) return `${m.title} (${m.mediaType} #${m.tmdbId})`;
  return JSON.stringify(m);
};

const columns = [
  {
    field: 'created_at',
    headerName: 'When',
    width: 190,
    valueFormatter: (value) => new Date(value).toLocaleString(),
  },
  { field: 'actor_email', headerName: 'Actor', width: 220 },
  {
    field: 'action',
    headerName: 'Action',
    width: 200,
    valueFormatter: (value) => ACTION_LABELS[value] || value,
  },
  { field: 'target_email', headerName: 'Target', width: 220 },
  {
    field: 'metadata',
    headerName: 'Details',
    flex: 1,
    renderCell: (params) => describeMetadata(params.row),
  },
];

const paginationModel = { page: 0, pageSize: 25 };

function AuditLogPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    adminApi
      .getAuditLog({ page: 1, pageSize: 200 })
      .then(({ rows: r }) => setRows(r))
      .catch((err) => console.error('Failed to load audit log', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="admin-audit">
      <AdminSidebar />
      <div className="admin-auditContainer">
        <AdminNavbar />
        <Paper sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[25, 50, 100]}
            sx={{ border: 0 }}
            getRowId={(row) => row.id}
          />
        </Paper>
      </div>
    </div>
  );
}

export default AuditLogPage;
