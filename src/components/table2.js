import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import { Box, Button, ListItemIcon, MenuItem, Typography } from '@mui/material';
import TAG_COLORS from '../utils/tag_colors';
import React, { useRef, useState, useEffect } from 'react';

import { useAppContext } from '../context/context'
import parse from 'html-react-parser';

const TableComponent2 = (propMerge, propSplit, propRemove) => {

  const {
    value_sidebar,
    allEntities,
    anomTokens,
    anomValues,
    last_index,
    tag,
    menuStyle,
    setMenuStyle,
    popUpMenu,
    setPopUpMenu,
    mode,
    setMode,
    rows,
    setRows,
    raw_text,
    renderValue,
    setRenderValue,
    sourceHtml,
    setSourceHtml,
  } = useAppContext()

  let anomRules = {
    "PES": "PES",
    "DAT": "DAT",
    "ORG": "ORG",
    "LOC": "LOC",
    "PRO": "PRO",
    "MAT": "MAT"
  }
  
  let entitieCounter = {
    "PES":0,
    "DAT":0,
    "ORG":0,
    "LOC":0,
    "PRO":0,
    "MAT":0
  }
  
  
  useEffect(() => {
    if (renderValue.allEntities !== null) {
      createRows()
    }
    if (renderValue.anomTokens) {

    }
    if (renderValue.anomValues) {

    }
  }, [renderValue])

  function createRows() {
    let res = []

    let old_value = anomValues.current.value

    for (let entitie of allEntities.current) {
      let entities = entitie.tokens
      let type = entitie.tag
      let name = ""
      let counter = 0
      
      entitieCounter[type] ++

      var str = entitieCounter[type].toString()
      var pad = "000"
      var ans = pad.substring(0, pad.length - str.length) + str
      
      let anom = anomRules[type] + ans
      
      for (let e of entities) {
        name += e.text
        // If not last
        if (counter != entities.length-1) {
          name += "<br></br>"
        }
        counter++

        // Add anom value to anomValues
        for (let value of old_value) {
          if (e.ids.includes(value.start)) {
            value.anom = anom
          }
        }
      }
      
      name = parse(name)
      
      res.push({ name, type, anom })
      entitie.anom = anom
    }

    setRows(res)
  }

  const columns = [
    {header: "Entitidade", accessorKey: "name", minSize: 250,
    //custom conditional format and styling
    Cell: ({ cell }) => (
        <span style={{fontSize:"large"}}>{cell.getValue()}</span>
      )},
    {header: "Tipo", accessorKey: "type", maxSize:40,
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
          <span style={{fontSize:"large"}}>{cell.getValue()}</span>
        </Box>
      )},
    {header: "Anom", accessorKey: "anom", maxSize:40,
    //custom conditional format and styling
    Cell: ({ cell }) => (
        <span style={{fontSize:"large", fontStyle:"italic"}}>{cell.getValue()}</span>
      )},
  ]

  return(
    <div className='Table'>
      <MaterialReactTable
        columns={columns}
        data={rows}
        enableRowSelection
        enableColumnOrdering
        enablePagination={false}
        //enableColumnResizing
        initialState={{
          density: 'compact',
        }}
        renderTopToolbarCustomActions={({ table }) => {
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
                disabled={table.getSelectedRowModel().flatRows.length < 2}
                onClick={handleMerge}
                variant="contained"
              >
                Juntar
              </Button>
              <Button
                color="info"
                disabled={table.getSelectedRowModel().flatRows.length < 1}
                onClick={handleSplit}
                variant="contained"
              >
                Separar
              </Button>
              <Button
                color="error"
                disabled={table.getSelectedRowModel().flatRows.length < 1}
                onClick={handleRemove}
                variant="contained"
              >
                Remover
              </Button>
            </div>
          );
        }}
      />
    </div>
  )
}

export default TableComponent2