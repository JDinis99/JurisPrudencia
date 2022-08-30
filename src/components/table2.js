import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import { Box, Button, ListItemIcon, MenuItem, Typography } from '@mui/material';
import TAG_COLORS from '../utils/tag_colors';

const TableComponent2 = (rows, propMerge, propSplit, propRemove) => {
  console.log("rendering table")
  const columns = [
    {header: "Entitie", accessorKey: "name", minSize: 250},
    {header: "Type", accessorKey: "type", maxSize:40,
      //custom conditional format and styling
      Cell: ({ cell }) => (
        <Box
          sx={() => ({
            backgroundColor: TAG_COLORS[cell.getValue()],
            borderRadius: '0.25rem',
            color: 'black',
            maxWidth: '9ch',
            p: '0.25rem',
          })}
        >
          {cell.getValue()}
        </Box>
      )},
    {header: "Anom", accessorKey: "anom", maxSize:40,},
  ]

  return(
    <MaterialReactTable
      columns={columns}
      data={rows}
      enableRowNumbers
      enableRowSelection
      enableColumnOrdering
      //enableColumnResizing
      initialState={{
        density: 'compact',
      }}
      renderToolbarTopCustomActions={({ table }) => {
        const handleMerge = () => {
          let selected =[]
          table.getSelectedRowModel().flatRows.map((row) => {
            console.log('merging ' + row.getValue('name'));
            selected.push(row.id)
          });
          propMerge(selected)

          table.resetRowSelection()
        };

        const handleSplit = () => {
          let selected =[]
          table.getSelectedRowModel().flatRows.map((row) => {
            console.log('spliting ' + row.getValue('name'));
            selected.push(row.id)
          });
          propSplit(selected)

          table.resetRowSelection()

        };

        const handleRemove = () => {
          let selected =[]
          table.getSelectedRowModel().flatRows.map((row) => {
            console.log('removing ' + row.getValue('name'));
            selected.push(row.id)
          });
          propRemove(selected)

          table.resetRowSelection()

        };

        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              color="success"
              disabled={table.getSelectedRowModel().flatRows.length === 0}
              onClick={handleMerge}
              variant="contained"
            >
              Merge
            </Button>
            <Button
              color="info"
              disabled={table.getSelectedRowModel().flatRows.length === 0}
              onClick={handleSplit}
              variant="contained"
            >
              Split
            </Button>
            <Button
              color="error"
              disabled={table.getSelectedRowModel().flatRows.length === 0}
              onClick={handleRemove}
              variant="contained"
            >
              Remove
            </Button>
          </div>
        );
      }}
    />
  )
}

export default TableComponent2