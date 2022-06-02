import './styles/App.css';
import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import Sidebar from './components/sidebar';

import TokenAnnotator from './tokenAnnotator/TokenAnnotator.tsx';
import ActionMenu from './components/actionMenu';

import {useMousePos} from "./utils/useMousePos";


const example_json = require("./data/example.json");



// Dictionary of entities by type, that is a dictionary of entitie name whose key is a list occurences of entitie
let allEntities = [
  {
    id: "ORG",
    label: "Organizacoes",
    expanded: true,
    children: []
  },
  {
    id: "PER",
    label: "Pessoas",
    expanded: true,
    children: []
  },
  {
    id: "DAT",
    label: "Datas",
    expanded: true,
    children: []
  },
  {
    id: "LOC",
    label: "Localizacoes",
    expanded: true,
    children: []
  }
]

function createChild (entitie) {
  let new_child = {
    id: entitie[3],
    label: entitie[3],
    expanded: true,
    children: [
      {
        id: entitie[1].toString(),
        label: entitie[1].toString(),
        data: entitie
      }
    ]
  }
  return new_child
}

  
function getAllEntities() {
  
  example_json.forEach(function (value) {
    value.entities.forEach(function (entitie) {

      let found = false

      // Divide entities per type
      if (entitie[0] === "ORG") {

        allEntities[0].children.forEach(function (child) {
          // If entitie has been found before
          if (child.id === entitie[3]) {
            found = true
            // Add entitie to children of child
            child.children.push( {
              id: entitie[1].toString(),
              label: entitie[1].toString(),
            })
          }
        })
    
        // If entitie has not been found before
        if (found === false) {
          // Create new child and add entitie to that child's children
          let new_child = createChild(entitie) 
          allEntities[0].children.push(new_child)
        }
      }
      if (entitie[0] === "PER") {

        allEntities[1].children.forEach(function (child) {
          // If entitie has been found before
          if (child.id === entitie[3]) {
            found = true
            // Add entitie to children of child
            child.children.push( {
              id: entitie[1].toString(),
              label: entitie[1].toString(),
            })
          }
        })
    
        // If entitie has not been found before
        if (found === false) {
          // Create new child and add entitie to that child's children
          let new_child = createChild(entitie)
          allEntities[1].children.push(new_child)
        }
      }
      if (entitie[0] === "DAT") {

        allEntities[2].children.forEach(function (child) {
          // If entitie has been found before
          if (child.id === entitie[3]) {
            found = true
            // Add entitie to children of child
            child.children.push( {
              id: entitie[1].toString(),
              label: entitie[1].toString(),
            })
          }
        })
    
        // If entitie has not been found before
        if (found === false) {
          // Create new child and add entitie to that child's children
          let new_child = createChild(entitie)
          allEntities[2].children.push(new_child)
        }
      }
      if (entitie[0] === "LOC") {
        
        allEntities[3].children.forEach(function (child) {
          // If entitie has been found before
          if (child.id === entitie[3]) {
            found = true
            // Add entitie to children of child
            child.children.push( {
              id: entitie[1].toString(),
              label: entitie[1].toString(),
            })
          }
        })
    
        // If entitie has not been found before
        if (found === false) {
          // Create new child and add entitie to that child's children
          let new_child = createChild(entitie)
          allEntities[3].children.push(new_child)
        }
      }
    })
  })
}


function App() {
  const editorRef = useRef(null);
  const [mode, setMode] = useState("Doccano")
  const [anom_test, setAnomText] = useState(null)
  const [anom, setAnom] = useState(null)
  const last_index = useRef(0)
  const [menuStyle, setMenuStyle] = useState({
    left: 0,
    top: 0,
    showMenu: false
  })

  useEffect(() => {
    getAllEntities()
    setAnomText(anomText())
  }, [])

  const handleNewEntitie = (value, p) => {
    console.log(value[value.length - 1])
    // TODO: Update ALL Entitites based on new value
    setMenuStyle({
      left: p.left,
      top: p.top + 10,
      showMenu: true
    })
    let old_tag = anom.tag
    let new_anom = {
      value: value,
      tag: old_tag
    }
    last_index.current = value.length - 1
    setAnom(new_anom);
  }

  const handleEntitieChange = (index, p) => {
    setMenuStyle({
      left: p.left,
      top: p.top + 10,
      showMenu: true
    })

    last_index.current = index
  }

  const handleTagChange = e => {
    setMenuStyle({
      left: 0,
      top: 0,
      showMenu: false
    })

    let new_anom = null
    let old_value = anom.value
    let new_tag  = e.target.value
    
    if (new_tag == "Remove") {
      let old_tag = anom.tag
      let slice_1 = old_value.slice(0, last_index.current)
      let slice_2 = old_value.slice(last_index.current + 1)
      let new_value = slice_1.concat(slice_2)
      new_anom = {
        value: new_value,
        tag: old_tag
      }
    }
    else {
      old_value[last_index.current].tag = new_tag
      new_anom = {
        value: old_value,
        tag: new_tag
      }
    }
    setAnom(new_anom);
  }

  
  const log = () => {
    if (editorRef.current) {
      //console.log(editorRef.current.getContent());
      let test = editorRef.current.selection.select(editorRef.current.dom.select('s')[0])
      console.log(test)
      test.scrollIntoView({behavior: "instant", block: "center", inline: "nearest"});
    }
  }

  function Side() {
    return (
      <div className='SideBar'>
        <Sidebar allMenuItems={allEntities}/>
      </div>
    )
  }

  function changeMode() {
    if (mode === "Editor") {
      setMode("Doccano")
    }
    if (mode === "Doccano") {
      setMode("Editor")
    }
  }
  
  function Header() {
    return (
      <>
        <header className='PageHeader'>
          Header
        </header>
        <button onClick={changeMode}>
          Mode change
        </button>
      </>
      )
  }

  const text = () => {
    let text = ""
    example_json.forEach(function(value) {
      let anonimized_text = value.text
      let anonimization = ""
      let substituion = ""
      value.entities.forEach(function(entitie) {
        if (entitie[0] === "ORG") {
          let substituion = "Substitute ORG"
          anonimization = "<font color=red><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
        if (entitie[0] === "PER") {
          let substituion = "Substitute PER"
          anonimization = "<font color=green><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
        if (entitie[0] === "DAT") {
          let substituion = "Substitute DAT"
          anonimization = "<font color=brown><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
        if (entitie[0] === "LOC") {
          let substituion = "Substitute LOC"
          anonimization = "<font color=blue><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
      })
      text += '<p>' + anonimized_text + '</p>'
    })

    return text
  }

  const anomText = () => {
    let text = ""
    let final_entities = []

    //let test = " Supremo Tribunal de Justiça  t\t\t\t\t\t\t\t\t\t\t\t\t\t5.ª Secção Criminal  Proc. n.º 129/21.1YRCBR  Extradição   *  Acordam, em Conferência, na 5.ª Secção do Supremo Tribunal de Justiça.              I - Pedido de extradição e termos subsequentes  1. O Ministério Público"
    let test = "Supremo Tribunal de Justiça"
    console.log(test.split(" "))

    let text_counter = null
    // Counter for words not characters
    let counter = 0
    example_json.forEach(function(value) {
      // console.log("Counter so far: ", counter)
      // console.log("Iteration's text: ", value.text)
      // console.log("Iteration's lenght: ", value.text.split(" ").length)

      value.entities.forEach(function(entitie) {
        let type = entitie[0]
        let tmp_str = value.text.slice(0, entitie[1])

        let split = value.text.split(entitie[3])

        let start = counter + split[0].split(" ").length
        let end = start + entitie[3].split(" ").length

        let final_entitie = {
          start: start,
          end: end,
          tag: type
        }

        //console.log(final_entitie)
        final_entities.push(final_entitie)
      })
      if (value.text === "") {
        text += "\n"
      }
      else {
        counter += value.text.split(" ").length + 1
        text += " " + value.text + " \n"

      }

  })
    
    console.log(final_entities[0])
    //console.log(text)

    if (anom === null) {
      setAnom({
        //value: [],
        value: final_entities,
        tag: "PER"
      })
    }

    return text
  }
  
  function box() {

    if (mode === "Editor") {
      return (
        <>
          <Editor tinymceScriptSrc="http://localhost:3000/tinymce/js/tinymce/tinymce.min.js"
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={text()}
            init={{
              toolbar_sticky: true,
              menubar: 'tools',
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
                'autoresize',
                'importcss',
                'example',
                'code'
              ],
              toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help | code | example',
            }}
          />
          <button onClick={log}>Log editor content</button>
        </>
      )
    }

    if (mode === "Doccano") {

      if (anom === null || anom_test === null) {
        return <></>
      }
      return (
        <div className='Text'>
            <TokenAnnotator
              tokens={anom_test.split(" ")}
              value={anom.value}
              onNewEntitie={handleNewEntitie}
              onEntitieChange={handleEntitieChange}
              getSpan={span => ({
                ...span,
                tag: anom.tag,
              })}
            />
        </div>
      )
    }

  }
  

  return (
    <div className="App">
      let text = anomText()
      {Header()}

      {Side()}

      {box()}

      {ActionMenu(menuStyle.left, menuStyle.top, menuStyle.showMenu, handleTagChange)}

    </div>
  );
}

export default App;
