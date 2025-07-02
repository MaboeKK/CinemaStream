import "./datatable.scss";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Datatable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (user_id) => {
    try {
      await axios.delete(`/api/users/${user_id}`);
      setUsers(users.filter((user) => user.user_id !== user_id));
    } catch (error) {
      console.error(error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'user_id', headerName: 'ID', width: 70 },
    { field: 'first_name', headerName: 'First name', width: 130 },
    { field: 'last_name', headerName: 'Last name', width: 130 },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'is_verified',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <span className={params.value ? 'status active' : 'status passive'}>
          {params.value ? 'Verified' : 'Not Verified'}
        </span>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <div className="action">
          <span
            className="badge-btn delete"
            onClick={() => handleDelete(params.row.user_id)}
          >
            Delete
          </span>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data.map((user) => ({
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          is_verified: user.is_verified,
        })));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
          getRowSpacing={() => ({
            top: 8,
            bottom: 8,
          })}
        />
      </Paper>
    </div>
  );
};

export default Datatable;