import './styles/App.css';
import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import Sidebar from './components/sidebar';

import TokenAnnotator from './tokenAnnotator/TokenAnnotator.tsx';
import ActionMenu from './components/actionMenu';
import PopUpMenu from './components/popUpMenu';
import OutsideClickHandler from 'react-outside-click-handler';

import {useMousePos} from "./utils/useMousePos";


const example_json = require("./data/example.json");

// eslint-disable-next-line import/no-webpack-loader-syntax
var new_example_html_file = require('raw-loader!./data/new_example_2.html');
var new_example_html = new_example_html_file.default;

//const new_example_html = require("./data/new_example_2.html");


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
  },
  {
    id: "PRO",
    label: "Processos",
    expanded: true,
    children: []
  },
  {
    id: "MAT",
    label: "Matriculas",
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
      if (entitie[0] === "PRO") {
        
        allEntities[4].children.forEach(function (child) {
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
      if (entitie[0] === "MAT") {
        
        allEntities[5].children.forEach(function (child) {
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

  // Sorting
  for (let i = 0; i < allEntities.length; i++) {
    allEntities[i].children.sort(function (a, b) {
      if (a.id < b.id)
        return -1;
      else
        return 1;
    })
  }

}


function App() {
  const editorRef = useRef(null);
  const [anomTokens, setAnomTokens] = useState(null)
  const [anomValues, setAnomValues] = useState(null)
  const last_index = useRef(0)
  const tag = useRef(null)
  const [menuStyle, setMenuStyle] = useState({
    left: 0,
    top: 0,
    showMenu: false
  })
  let tokenCounter = 0
  let value = []

  const [popUpMenu, setPopUpMenu] = useState({
    showMenu: false,
    entities: {
      "PER":0,
      "DAT":0,
      "ORG":0,
      "LOC":0,
      "PRO":0,
      "MAT":0
    }
  })

  useEffect(() => {
    readHtml()
  }, [])

  const handleNewEntitie = (value, p) => {
    // TODO: Update ALL Entitites based on new value
    setMenuStyle({
      left: p.left,
      top: p.top + 10,
      showMenu: true
    })
    let old_tag = anomValues.tag
    let new_anom = {
      value: value,
      tag: old_tag
    }
    last_index.current = value.length - 1
    setAnomValues(new_anom);
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

    let new_tag  = e.target.value
    tag.current = new_tag

    let entitie = anomValues.value[last_index.current]

    let per_number = 0
    let dat_number = 0
    let org_number = 0
    let loc_number = 0
    let pro_number = 0
    let mat_number = 0

    anomValues.value.forEach(function(ent) {
      if (ent.tag === "PER" && entitie.text === ent.text) {per_number += 1}
      else if (ent.tag === "DAT" && entitie.text === ent.text) {dat_number += 1}
      else if (ent.tag === "ORG" && entitie.text === ent.text) {org_number += 1}
      else if (ent.tag === "LOC" && entitie.text === ent.text) {loc_number += 1}
      else if (ent.tag === "PRO" && entitie.text === ent.text) {pro_number += 1}
      else if (ent.tag === "MAT" && entitie.text === ent.text) {mat_number += 1}
    })

    setPopUpMenu({
      showMenu: true,
      entities: {
        "PER": per_number,
        "DAT": dat_number,
        "ORG": org_number,
        "LOC": loc_number,
        "PRO": pro_number,
        "MAT": mat_number
      }
    })
  }

  const handleMultipleTagChange = e => {

    setPopUpMenu({
      showMenu: false,
      entities: {
        "PER":0,
        "DAT":0,
        "ORG":0,
        "LOC":0,
        "PRO":0,
        "MAT":0
      }
    })

    let new_anom = null
    let new_tag  = tag.current
    let old_value = anomValues.value
    let old_text = old_value[last_index.current].text
    let old_tag = old_value[last_index.current].tag
    let new_value = []

    if (e.target.value === "Single") {
      
      if (new_tag == "Remove") {
        let old_tag = anomValues.tag
        let slice_1 = old_value.slice(0, last_index.current)
        let slice_2 = old_value.slice(last_index.current + 1)
        new_value = slice_1.concat(slice_2)
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
      setAnomValues(new_anom);
    }

    else if (e.target.value === "All-Equal") {
      old_value.forEach(function(entitie){
        if (new_tag == "Remove") {
          if (entitie.text === old_text && entitie.tag === old_tag) {
            // Ignore and dont add to new array
          }
          else {
            new_value.push(entitie)
          }
        }
        else {
          if (entitie.text === old_text && entitie.tag === old_tag) {
            // change tag
            entitie.tag = new_tag
          }
        }
      })

      if (new_tag == "Remove") {
        new_anom = {
          value: new_value,
          tag: old_tag
        }
        setAnomValues(new_anom);
      }

    }

    else if (e.target.value === "All-All") {
      old_value.forEach(function(entitie){
        if (new_tag == "Remove") {
          if (entitie.text === old_text) {
            // Ignore and dont add to new array
          }
          else {
            new_value.push(entitie)
          }
        }
        else {
          if (entitie.text === old_text) {
            // change tag
            entitie.tag = new_tag
          }
        }
      })

      if (new_tag == "Remove") {
        new_anom = {
          value: new_value,
          tag: old_tag
        }
        setAnomValues(new_anom);
      }
    }

  }



  function Side() {
    return (
      <div className='SideBar'>
        <Sidebar allMenuItems={allEntities}/>
      </div>
    )
  }

  function Header() {
    return (
      <>
        <header className='PageHeader'>
          Header
        </header>
        <button>
          Mode change
        </button>
      </>
      )
  }


  function iterateHtml (text) {
    let res = []
    let start_index = text.indexOf("<")

    // If there are no more tags
    if (start_index === -1){
    let split = text.trim().split(" ")
      tokenCounter += split.length
      // console.log("adding lenght: ", split.length)
      // console.log("new counter: ", tokenCounter)
      return ([{
        tokens: split,
        tag: "normal",
        props: {}
      }])
    }

    let end_index = text.indexOf(">", start_index)

    // If there are no more tags
    if (end_index === -1){
      let split = text.trim().split(" ")
      tokenCounter += split.length
      // console.log("adding lenght: ", split.length)
      // console.log("new counter: ", tokenCounter)
      return ([{
        tokens: split,
        tag: "normal",
        close_tag: {}
      }])
    }

    // If there are tags

    let temp_tag = text.substring(start_index + 1,end_index)
    let temp_split = temp_tag.split(" ")
    let tag = "<" + temp_split[0] + ">"
    let closing_tag = tag.replace("<", "</")
    let closing_tag_index = text.indexOf(closing_tag, end_index)
    tag = "<" + temp_tag + ">"

    // If there is text before the tag
    if (start_index !== 0) {
      let initial_text = text.substring(0, start_index)
      let split = initial_text.trim().split(" ")
      if (split[0] !== "") {
        tokenCounter += split.length
        // console.log("adding lenght: ", split.length)
        // console.log("new counter: ", tokenCounter)
        res.push({
          tokens: split,
          tag: "normal",
          close_tag: {}
        })
      }
    }

    // If there is no closing tag (ex: single tag <hr>)
    if (closing_tag_index === -1) {
      tokenCounter += 1
      res = res.concat({
        tokens: [tag],
        tag: "normal",
        close_tag: {}
      })
    }
    // If it is a mark tag
    else if (temp_split[0] === "mark") {
      let new_text = text.substring(end_index+1, closing_tag_index)
      let split = new_text.trim().split(" ")
      let role = temp_split[1].substring(6,9)
      value.push({
        start: tokenCounter,
        end: tokenCounter + split.length,
        tag: role,
        text: new_text
      })
      let tmp_res = iterateHtml(new_text)
      res = res.concat(tmp_res)
    }
    else {
      // Iterate over main tags
      let new_text = text.substring(end_index+1, closing_tag_index)
      let tmp_res = iterateHtml(new_text)
      let props = {}
      for (let i = 1; i < temp_split.length; i++) {
        let another_split = temp_split[i].split("=")
        props[another_split[0]] = another_split[1]
      }
      res.push({
        tokens: tmp_res,
        tag: temp_split[0],
        props: props
      })
    }

    // If there is text after the tag
    if (closing_tag_index !== text.length - closing_tag.length) {
      let final_text = text.substring(closing_tag_index + closing_tag.length+1, text.length)
      let tmp_res = iterateHtml(final_text)
      res = res.concat(tmp_res)
    }

    return res
  }

  function readHtml () {
    let raw_text = ""
    value = []
    
    // Join main relevant html into a single string
    let split = new_example_html.split("\n")
    for (let line of split) {
      // Ignore first line
      if (line.includes("<div")){
        continue;
      }
      // Ignore table
      else if (line.includes("</div>")) {
        break
      }
      
      // Normal iteration
      raw_text += " " + line.trim()
    }

    let final_tokens = iterateHtml(raw_text)

    setAnomTokens(final_tokens)
    setAnomValues({
      value: value,
      //value: [],
      //value: [{start: 0, end:6, tag: "PER"}],
      tag: "PER"
    })
  }

  function box() {
    if (anomValues === null || anomTokens === null) {
      return <></>
    }
    return (
      <div className='Text'>
          <TokenAnnotator
            tokens={anomTokens}
            value={anomValues.value}
            onNewEntitie={handleNewEntitie}
            onEntitieChange={handleEntitieChange}
            getSpan={span => ({
              ...span,
              tag: anomValues.tag,
            })}
          />
      </div>
    )

  }
  

  return (
    <div className="App">
      {Header()}

      {Side()}

      {box()}

      <OutsideClickHandler onOutsideClick={() => {setMenuStyle({left:0,top: 0, showMenu: false})}}>
        {ActionMenu(menuStyle.left, menuStyle.top, menuStyle.showMenu, handleTagChange)}
      </OutsideClickHandler>

      <div className='PopUp'>
        <OutsideClickHandler onOutsideClick={() => {setPopUpMenu({showMenu: false, entities: {"PER":0, "DAT":0, "ORG":0, "LOC":0, "PRO":0, "MAT":0}})}}>
          {PopUpMenu(popUpMenu.showMenu, handleMultipleTagChange, popUpMenu.entities)}
        </OutsideClickHandler>
      </div>

    </div>
  );
}

export default App;
