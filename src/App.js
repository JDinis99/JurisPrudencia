import './styles/App.css';
import React, { useRef, useState, useEffect } from 'react';

import entitieOption from './components/entitieOption';
import Sidebar from './components/sidebar';
import TokenAnnotator from './tokenAnnotator/TokenAnnotator.tsx';
import ActionMenu from './components/actionMenu';
import PopUpMenu from './components/popUpMenu';
import OutsideClickHandler from 'react-outside-click-handler';

import Button from '@mui/material/Button';

//const example_json = require("./data/example.json");

// eslint-disable-next-line import/no-webpack-loader-syntax
var new_example_html_file = require('raw-loader!./data/new_example_2.html');
var new_example_html = new_example_html_file.default;


function App() {
  const [allEntities, setAllEntites] = useState(null)
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
  let value_sidebar = useRef(null)
  let selected = useRef([])

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

  const handleNewEntitie = (value, p, text) => {
    // TODO: Update ALL Entitites based on new value
    setMenuStyle({
      left: p.left,
      top: p.top + 10,
      showMenu: true
    })
    let old_tag = anomValues.tag
    value[value.length - 1].text = text
    addToSidebar(value[value.length - 1].text, value[value.length - 1].tag, [value[value.length - 1].start])
    setAllEntites(value_sidebar.current)
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
        removeFromSidebar(old_value[last_index.current].start)
        setAllEntites(value_sidebar.current)
      }
      else {
        old_value[last_index.current].tag = new_tag
        new_anom = {
          value: old_value,
          tag: new_tag
        }
        changeSidebar(old_value[last_index.current].text, new_tag, old_value[last_index.current].start)
        setAllEntites(value_sidebar.current)
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

  function Header() {
    return (
      <>
        <header className='PageHeader'>
          Header
        </header>

        <div className='FlexButtonContainer'>
          <div className='OptionButton'>
            <Button variant="contained">Zoom</Button>
          </div>
          <div className='OptionButton'>
            <Button variant="outlined" className='OptionButton'>Feature</Button>
          </div>
        </div>
      </>
      )
  }

  function handleSelect(id) {
    console.log("Selected: ", id)
    selected.current.push(id)
  }

  function Side() {
    let res = []
    if (allEntities != null) {
      let count = 0
      for (let entitie of allEntities) {
        res.push(entitieOption(entitie.tokens, entitie.tag, "AA", count, handleSelect, handleSplit))
        count++
      }
      return (
        <div className='SideBar'>
          <button onClick={handleMerge}>Merge</button>
          <button onClick={handleSplit}>Split</button>
          <button onClick={handleRemove}>Remove</button>

          <div className="EntitieOptionBox" id='header'>
            <div className="EntitieSection">
              Entidade
              <button onClick={handleSortEntitie}>S</button>
            </div>
            <div className="EntitieSection">
              Tipo
              <button onClick={handleSortType}>S</button>
            </div>
            <div className="EntitieSection">
              Anom
              <button>S</button>
            </div>
          </div>

          {res}
        </div>
     )
    }
  }

  function handleSortEntitie() {
    value_sidebar.current.sort(function(a,b) {
      let s = a.tokens[0].text.localeCompare(b.tokens[0].text)
      return s
    })
    setAllEntites(value_sidebar.current)
  }

  function handleSortType() {
    value_sidebar.current.sort(function(a,b) {
      let s = a.tag.localeCompare(b.tag)
      return s
    })
    setAllEntites(value_sidebar.current)
  }

  function addToSidebar(text, role, ids) {
    let found = false
    for (let entitie of value_sidebar.current) {
      for (let token of entitie.tokens) {
        // If it already exists
        if(token.text === text && role === entitie.tag) {
          found = true
          token.ids = token.ids.concat(ids)
          break
        }
      }
    }

    if (found == false) {
      value_sidebar.current.push({
        tokens: [{
          text: text,
          ids: ids
        }],
        tag: role
      })
    }
  }

  function removeFromSidebar(id, all) {
    let last = null
    let counter = 0
    let t_counter = 0

    for (let entitie of value_sidebar.current) {
      t_counter = 0
      for(let token of entitie.tokens) {
        if (token.ids.includes(id)) {
          // If there is only one id or if we want to remove all
          if (token.ids.length === 1 || all === true) {
            last = true
            break
          }

          // If not

          let indice = token.ids.indexOf(id)

          let slice_1 = token.ids.slice(0, indice)
          let slice_2 = token.ids.slice(indice+1)
          token.ids = slice_1.concat(slice_2)
          break
        }
        t_counter++
      }
      
      if (last === true) {
        break
      }
      counter++
    }

    if (last === true) {
      // If it is the only token in entitie
      if (value_sidebar.current[counter].tokens.length === 1) {
        let slice_1 = value_sidebar.current.slice(0, counter)
        let slice_2 = value_sidebar.current.slice(counter+1)
        value_sidebar.current = slice_1.concat(slice_2)
      }
      // If not
      else {
        console.log(counter, t_counter)
        console.log(value_sidebar.current[counter])
        let slice_1 = value_sidebar.current[counter].tokens.slice(0, t_counter)
        let slice_2 = value_sidebar.current[counter].tokens.slice(t_counter+1)
        value_sidebar.current[counter].tokens = slice_1.concat(slice_2)

        console.log(value_sidebar.current[counter])
      }
    }
  }
  
  function changeSidebar(text, new_tag, id, all) {
    for (let entitie of value_sidebar.current) {
      for (let token of entitie.tokens) {
        if (token.ids.includes(id)) {
          // If it is an entitie with a single id or if we whish to change tag for all ids
          if (token.ids.length === 1 || all === true) {
            // Simply Change Tag
            entitie.tag = new_tag
          }
          // If there are multiple ids and we only want to change 1
          else {
            // Remove current id from sidebar
            removeFromSidebar(id, false)
            // And re-add it with new tag
            addToSidebar(text, new_tag, [id])
          }
          break
        }
      }
    }
  }

  function handleMerge() {
    let first = null

    for (let selected_id of selected.current) {
      if (first === null) {
        first = selected_id.list_id
      }
      else {
        let token = value_sidebar.current[selected_id.list_id].tokens[selected_id.token_id]
        value_sidebar.current[first].tokens.push(token)

        // Remove extra tokens
        removeFromSidebar(token.ids[0], true)
      }
    }

    selected.current = []
    setAllEntites(value_sidebar.current)
  }

  function handleSplit() {
    for (let selected_id of selected.current) {
      // If we split an entitie with a single token then ignore
      if (value_sidebar.current[selected_id.list_id].tokens === 1) {
        continue
      }

      // If entitie has multiple tokens, seperate the selected one from the rest
      let token = value_sidebar.current[selected_id.list_id].tokens[selected_id.token_id]

      addToSidebar(token.text, token.tag, token.ids)
      removeFromSidebar(token.ids[0], true)
      }

    selected.current = []
    setAllEntites(value_sidebar.current)
  }

  function handleRemove() {
    let old_value_sidebar = value_sidebar.current
    let old_value = anomValues.value
    let old_tag = anomValues.tag
    let new_value = null
    let counter = 0

    for (let selected_id of selected.current) {
      let token = old_value_sidebar[selected_id.list_id].tokens[selected_id.token_id]
      removeFromSidebar(token.ids[0], true)

      for (let id of token.ids) {
        counter = 0
        for (let v of old_value) {
          if (v.start === id) {
            let slice_1 = old_value.slice(0, counter)
            let slice_2 = old_value.slice(counter+1)
            new_value = slice_1.concat(slice_2)
            break
          }
          counter ++
        }
        old_value = new_value
      }
    }


    selected.current = []
    setAllEntites(value_sidebar.current)
    setAnomValues({
      value: old_value,
      tag: old_tag
    })
  }

  function iterateHtml (text) {
    let res = []
    let start_index = text.indexOf("<")

    // If there are no more tags
    if (start_index === -1){
    let split = text.trim().split(" ")
      tokenCounter += split.length
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
      return ([{
        tokens: split,
        tag: "normal",
        props: {}
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
        res.push({
          tokens: split,
          tag: "normal",
          props: {}
        })
      }
    }

    // If there is no closing tag (ex: single tag <hr>)
    if (closing_tag_index === -1) {
      tokenCounter += 1
      res = res.concat({
        tokens: [tag],
        tag: "normal",
        props: {}
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
      addToSidebar(new_text, role, [tokenCounter])
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
      let final_text = text.substring(closing_tag_index + closing_tag.length, text.length)
      let tmp_res = iterateHtml(final_text)
      res = res.concat(tmp_res)
    }

    return res
  }

  function readHtml () {
    let raw_text = ""
    value = []
    value_sidebar.current = []
    
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

    setAllEntites(value_sidebar.current)
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

      <div className='FlexContainer'>
        {box()}
        {Side()}
      </div>

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
