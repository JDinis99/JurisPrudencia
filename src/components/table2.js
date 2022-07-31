import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';

const TableComponent2 = (rows) => {
  const columns = [
    {header: "Entitie", accessorKey: "name"},
    {header: "Type", accessorKey: "type"},
    {header: "Anom", accessorKey: "anom"},
  ]

  return(
    <MaterialReactTable columns={columns} data={rows}/>
  )
}

export default TableComponent2