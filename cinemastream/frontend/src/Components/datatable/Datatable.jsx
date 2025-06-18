
import "./datatable.scss";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

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

const rows = [
  { id: 1, firstName: 'Mpondo', lastName: 'Robben', email: 'mpondo.robben@example.com', status: 'Active' },
  { id: 2, firstName: 'Khoza', lastName: 'Lala', email: 'khoza.lala@example.com', status: 'Passive' },
  { id: 3, firstName: 'Crocs', lastName: 'Shaun', email: 'crocs.shaun@example.com', status: 'Passive' },
  { id: 4, firstName: 'Mpondo', lastName: 'Solly', email: 'mpondo.solly@example.com', status: 'Active' },
  { id: 5, firstName: 'Shitolo', lastName: 'Raymond', email: 'shitolo.raymond@example.com', status: 'Passive' },
  { id: 6, firstName: null, lastName: 'Mellisa', email: 'mellisa@example.com', status: 'Active' },
  { id: 7, firstName: 'Pheka', lastName: 'Clifford', email: 'pheka.clifford@example.com', status: 'Active' },
  { id: 8, firstName: 'Mdebuka', lastName: 'France', email: 'mdebuka.france@example.com', status: 'Passive' },
  { id: 9, firstName: 'Mdebuka', lastName: 'Ronnie', email: 'mdebuka.ronnie@example.com', status: 'Active' },
];

const paginationModel = { page: 0, pageSize: 5 };

const Datatable = () => {
  return (
    <div className="datatable">
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
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






