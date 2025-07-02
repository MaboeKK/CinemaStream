import "./datatable.scss";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useState, useEffect } from 'react';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <span className={params.row.is_verified ? 'status active' : 'status passive'}>
        {params.row.is_verified ? 'Verified' : 'Not Verified'}
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
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </span>
      </div>
    ),
  },
];

const paginationModel = { page: 0, pageSize: 5 };

const Datatable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data.map((user) => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

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
          checkboxSelection
          sx={{ border: 0 }}
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