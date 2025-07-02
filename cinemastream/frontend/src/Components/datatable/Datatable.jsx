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
      <span className={params.value === 'Active' ? 'status active' : 'status passive'}>
        {params.value}
      </span>
    ),
  },
  {
    field: 'action',
    headerName: 'Action',
    width: 200,
    sortable: false,
    renderCell: (params) => (
      <div className="action">
        <span
          className="badge-btn view"
          onClick={() => alert(`Viewing user ID ${params.row.id}`)}
        >
          View
        </span>
        <span
          className="badge-btn delete"
          onClick={() => alert(`Deleting user ID ${params.row.id}`)}
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
          id: user.user_id, // Use user_id as the unique id
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          status: user.is_verified ? 'Active' : 'Inactive', // Assuming you want to show status based on is_verified
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
