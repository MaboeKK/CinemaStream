import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import adminApi from '../../api/adminApi';
import './UsersDataTable.scss';

const columns = [
  { field: 'user_id', headerName: 'ID', width: 70 },
  { field: 'first_name', headerName: 'First name', width: 130 },
  { field: 'last_name', headerName: 'Last name', width: 130 },
  { field: 'email', headerName: 'Email', width: 220 },
  {
    field: 'is_verified',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => (
      <span className={params.value ? 'status active' : 'status passive'}>
        {params.value ? 'Verified' : 'Not Verified'}
      </span>
    ),
  },
  { field: 'role', headerName: 'Role', width: 120 },
];

const paginationModel = { page: 0, pageSize: 5 };

const UsersDataTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="datatable">
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
          getRowId={(row) => row.user_id}
        />
      </Paper>
    </div>
  );
};

export default UsersDataTable;
