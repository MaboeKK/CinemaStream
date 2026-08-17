import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast } from 'react-toastify';
import adminApi from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';
import ConfirmDialog from './ConfirmDialog';
import './UsersDataTable.scss';

const ROLES = ['guest', 'admin', 'super_admin'];
const PAGE_SIZE_OPTIONS = [10, 25, 50];

// { type, target } -- type selects which confirm copy/handler to show;
// target is the row the action applies to.
const buildConfirmCopy = (pending) => {
  if (!pending) return null;
  const name = `${pending.target.first_name} ${pending.target.last_name}`;
  switch (pending.type) {
    case 'role':
      return {
        title: 'Change role',
        body: `Set ${name}'s role to "${pending.role}"?`,
        confirmLabel: 'Change role',
        danger: true,
      };
    case 'suspend':
      return { title: 'Suspend user', body: `Suspend ${name}? They won't be able to log in until reactivated.`, confirmLabel: 'Suspend', danger: true };
    case 'ban':
      return { title: 'Ban user', body: `Ban ${name}? This is more severe than a suspension.`, confirmLabel: 'Ban', danger: true };
    case 'reactivate':
      return { title: 'Reactivate user', body: `Restore ${name}'s account to active?`, confirmLabel: 'Reactivate', danger: false };
    case 'force-logout':
      return { title: 'Force logout', body: `Sign ${name} out of every active session?`, confirmLabel: 'Sign out', danger: true };
    case 'verify-email':
      return { title: 'Verify email', body: `Mark ${name}'s email as verified?`, confirmLabel: 'Verify', danger: false };
    case 'reset-password':
      return { title: 'Trigger password reset', body: `Email ${name} a password reset link?`, confirmLabel: 'Send reset', danger: false };
    default:
      return null;
  }
};

function UsersDataTable() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [pending, setPending] = useState(null); // { type, target, role? }
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    adminApi
      .getUsers({
        search: search || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      })
      .then(({ rows: r, total }) => {
        setRows(r);
        setRowCount(total);
      })
      .catch((err) => {
        console.error('Failed to load users', err);
        toast.error(err.message || 'Failed to load users');
      })
      .finally(() => setLoading(false));
  }, [search, roleFilter, statusFilter, paginationModel]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openMenu = (event, row) => {
    setMenuAnchor(event.currentTarget);
    setMenuRow(row);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuRow(null);
  };

  const requestAction = (type, target, extra) => {
    setPending({ type, target, ...extra });
    closeMenu();
  };

  const runPending = async () => {
    if (!pending) return;
    setSubmitting(true);
    try {
      const { type, target, role } = pending;
      const id = target.user_id;
      if (type === 'role') await adminApi.changeUserRole(id, role);
      else if (type === 'suspend') await adminApi.changeUserStatus(id, 'suspended');
      else if (type === 'ban') await adminApi.changeUserStatus(id, 'banned');
      else if (type === 'reactivate') await adminApi.changeUserStatus(id, 'active');
      else if (type === 'force-logout') await adminApi.forceLogoutUser(id);
      else if (type === 'verify-email') await adminApi.verifyUserEmail(id);
      else if (type === 'reset-password') await adminApi.triggerPasswordReset(id);

      toast.success('Done.');
      setPending(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = useMemo(
    () => [
      { field: 'user_id', headerName: 'ID', width: 70 },
      { field: 'first_name', headerName: 'First name', width: 120 },
      { field: 'last_name', headerName: 'Last name', width: 120 },
      { field: 'email', headerName: 'Email', width: 220 },
      { field: 'role', headerName: 'Role', width: 120 },
      {
        field: 'status',
        headerName: 'Status',
        width: 110,
        renderCell: (params) => (
          <span className={`status ${params.value === 'active' ? 'active' : 'passive'}`}>{params.value}</span>
        ),
      },
      {
        field: 'is_verified',
        headerName: 'Verified',
        width: 110,
        renderCell: (params) => (
          <span className={params.value ? 'status active' : 'status passive'}>
            {params.value ? 'Verified' : 'Not Verified'}
          </span>
        ),
      },
      {
        field: 'actions',
        headerName: '',
        width: 60,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <IconButton size="small" onClick={(e) => openMenu(e, params.row)} aria-label="Actions">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    []
  );

  const isSelf = menuRow && currentUser && menuRow.user_id === currentUser.user_id;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const confirmCopy = buildConfirmCopy(pending);

  return (
    <div className="datatable">
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Search name or email"
          value={search}
          onChange={(e) => {
            setPaginationModel((m) => ({ ...m, page: 0 }));
            setSearch(e.target.value);
          }}
          sx={{ minWidth: 240 }}
        />
        <Select
          size="small"
          displayEmpty
          value={roleFilter}
          onChange={(e) => {
            setPaginationModel((m) => ({ ...m, page: 0 }));
            setRoleFilter(e.target.value);
          }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All roles</MenuItem>
          {ROLES.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </Select>
        <Select
          size="small"
          displayEmpty
          value={statusFilter}
          onChange={(e) => {
            setPaginationModel((m) => ({ ...m, page: 0 }));
            setStatusFilter(e.target.value);
          }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="suspended">Suspended</MenuItem>
          <MenuItem value="banned">Banned</MenuItem>
        </Select>
      </Stack>

      <Paper sx={{ height: 560, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={rowCount}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          sx={{ border: 0 }}
          getRowId={(row) => row.user_id}
          onRowClick={(params) => navigate(`/admin/users/${params.row.user_id}`)}
        />
      </Paper>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem onClick={() => navigate(`/admin/users/${menuRow.user_id}`)}>View detail</MenuItem>
        {isSuperAdmin &&
          !isSelf &&
          menuRow &&
          ROLES.filter((r) => r !== menuRow.role).map((r) => (
            <MenuItem key={r} onClick={() => requestAction('role', menuRow, { role: r })}>
              Set role: {r}
            </MenuItem>
          ))}
        {isSuperAdmin && !isSelf && menuRow?.status === 'active' && (
          <MenuItem onClick={() => requestAction('suspend', menuRow)}>Suspend</MenuItem>
        )}
        {isSuperAdmin && !isSelf && menuRow?.status === 'active' && (
          <MenuItem onClick={() => requestAction('ban', menuRow)}>Ban</MenuItem>
        )}
        {isSuperAdmin && !isSelf && menuRow?.status !== 'active' && (
          <MenuItem onClick={() => requestAction('reactivate', menuRow)}>Reactivate</MenuItem>
        )}
        {isSuperAdmin && !isSelf && (
          <MenuItem onClick={() => requestAction('force-logout', menuRow)}>Force logout</MenuItem>
        )}
        {menuRow && !menuRow.is_verified && (
          <MenuItem onClick={() => requestAction('verify-email', menuRow)}>Verify email</MenuItem>
        )}
        <MenuItem onClick={() => requestAction('reset-password', menuRow)}>Trigger password reset</MenuItem>
      </Menu>

      <ConfirmDialog
        open={Boolean(pending)}
        submitting={submitting}
        onClose={() => setPending(null)}
        onConfirm={runPending}
        {...(confirmCopy || {})}
      />
    </div>
  );
}

export default UsersDataTable;
