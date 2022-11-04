import './styles/App.css';
import React, { useRef, useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server'

import TokenAnnotator from './tokenAnnotator/TokenAnnotator.tsx';
import ActionMenu from './components/actionMenu';
import PopUpMenu from './components/popUpMenu';
import TableComponent2 from './components/table2';
import AnomHeader from './components/anomHeader';
import parse from 'html-react-parser';

import { useAppContext } from './context/context';

// eslint-disable-next-line import/no-webpack-loader-syntax
var new_example_html_file = require('raw-loader!./data/new_example_2.html');
var new_example_html = new_example_html_file.default;


const Anom = () => {
  let tokenCounter = 0

  const value = useRef([])
  const previous_value = useRef(false)

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
    raw_text,
    setRenderValue,
    sourceHtml,
    setSourceHtml,
    trueSourceHtml,
    anom_id,
    anomStyle,
    last_value,
    last_index_backup,
    page,
    file,
    setFile
  } = useAppContext()
 

  useEffect(() => {
    readHtml()
    page.current = "anom"
  }, [sourceHtml])

  const handleNewEntitie = (value, left, top, text) => {

    // TODO: Update ALL Entitites based on new value
    setMenuStyle({
      left: left,
      top: top - 100,
      showMenu: true
    })

    value.text = text
    value.id = anom_id.current
    delete value.tokens

    last_value.current = value
    last_index.current = -1
  }

  const handleEntitieChange = (index, left, top) => {
    setMenuStyle({
      left: left,
      top: top - 100,
      showMenu: true
    })

    last_index.current = index
  }

  const countEntities = (entitie) => {
    let per_number = 0
    let dat_number = 0
    let org_number = 0
    let loc_number = 0
    let pro_number = 0
    let mat_number = 0
    let cep_number = 0
    let tel_number = 0
    let email_number = 0

    anomValues.current.value.forEach(function(ent) {
      if (ent.tag === "PES" && entitie.text === ent.text) {per_number += 1}
      else if (ent.tag === "DAT" && entitie.text === ent.text) {dat_number += 1}
      else if (ent.tag === "ORG" && entitie.text === ent.text) {org_number += 1}
      else if (ent.tag === "LOC" && entitie.text === ent.text) {loc_number += 1}
      else if (ent.tag === "PRO" && entitie.text === ent.text) {pro_number += 1}
      else if (ent.tag === "MAT" && entitie.text === ent.text) {mat_number += 1}
      else if (ent.tag === "CEP" && entitie.text === ent.text) {cep_number += 1}
      else if (ent.tag === "TEL" && entitie.text === ent.text) {tel_number += 1}
      else if (ent.tag === "E_MAIL" && entitie.text === ent.text) {email_number += 1}
    })

    return {
      per_number,
      dat_number,
      org_number,
      loc_number,
      pro_number,
      mat_number,
      cep_number,
      tel_number,
      email_number
    }

  }

  const handleTagChange = e => {
    setMenuStyle({
      left: 0,
      top: 0,
      showMenu: false
    })
    let new_tag  = e.target.value

    window.getSelection().empty()


    if (last_index.current === -1) {
      let old_tag = anomValues.current.tag
      let old_value = anomValues.current.value
      let value = last_value.current

      if (new_tag === "Cancel") {
        return
      }

      if (last_index_backup.current !== null) {
        let backup_indexes = last_index_backup.current
        last_index_backup.current = null
        let index = last_index.current

        let i_modifier = 0
        for (let i of backup_indexes) {
          tag.current = "Remove"
          last_index.current = i - i_modifier
          handleMultipleTagChange("Single")
          i_modifier += 1
        }

        old_tag = anomValues.current.tag
        old_value = anomValues.current.value
        value = last_value.current
        last_index.current = index
      }

      if (new_tag === "Remove") {
        return
      }

      value.tag = new_tag
      
      addToSidebar(value.text, value.tag, [anom_id.current], null)
      anom_id.current += 1
      allEntities.current = value_sidebar.current
  
      let new_value = [...old_value, value]
      let new_anom = {
        value: new_value,
        tag: old_tag
      }
      anomValues.current = new_anom

      last_index.current = old_value.length
  
      setRenderValue({
        anomTokens: false,
        anomValues: true,
        allEntities: true
      })

      return
    }
    
    tag.current = new_tag

    let entitie = anomValues.current.value[last_index.current]

    let counts = countEntities(entitie)

    if (new_tag === "Cancel") {
      return
    }

    setPopUpMenu({
      showMenu: true,
      entities: {
        "PES": counts.per_number,
        "DAT": counts.dat_number,
        "ORG": counts.org_number,
        "LOC": counts.loc_number,
        "PRO": counts.pro_number,
        "MAT": counts.mat_number
      }
    })
  }

  const handleMultipleTagChange = (value) => {

    setPopUpMenu({
      showMenu: false,
      entities: {
        "PES":0,
        "DAT":0,
        "ORG":0,
        "LOC":0,
        "PRO":0,
        "MAT":0
      }
    })

    if (value === "Cancel") {
      return
    } 

    
    let new_anom = null
    let new_tag  = tag.current
    let old_value = anomValues.current.value
    let old_text = old_value[last_index.current].text
    let old_tag = old_value[last_index.current].tag
    let new_value = []

    if (value === "Single") {

      if (new_tag === "Remove") {
        let old_tag = anomValues.current.tag
        let slice_1 = old_value.slice(0, last_index.current)
        let slice_2 = old_value.slice(last_index.current + 1)
        new_value = slice_1.concat(slice_2)
        new_anom = {
          value: new_value,
          tag: old_tag
        }
        removeFromSidebar(old_value[last_index.current].id)
      }
      else {
        old_value[last_index.current].tag = new_tag
        new_anom = {
          value: old_value,
          tag: new_tag
        }
        changeSidebar(old_value[last_index.current].text, new_tag, old_value[last_index.current].id, false)
      }
      allEntities.current = value_sidebar.current
      anomValues.current = new_anom
      setRenderValue({
        anomTokens: false,
        anomValues: true,
        allEntities: true
      })
    }

    else if (value === "All-Equal") {
      old_value.forEach(function(entitie){
        if (new_tag == "Remove") {
          if (entitie.text === old_text && entitie.tag === old_tag) {
            // Ignore and dont add to new array
            removeFromSidebar(entitie.id)
          }
          else {
            new_value.push(entitie)
          }
        }
        else {
          if (entitie.text === old_text && entitie.tag === old_tag) {
            // change tag
            entitie.tag = new_tag
            changeSidebar(entitie.text, new_tag, entitie.id, true)
          }
        }
      })

      allEntities.current = value_sidebar.current
      if (new_tag == "Remove") {
        new_anom = {
          value: new_value,
          tag: old_tag
        }
        anomValues.current = new_anom
      }
      setRenderValue({
        anomTokens: false,
        anomValues: true,
        allEntities: true
      })

    }

    else if (value === "All-All") {
      old_value.forEach(function(entitie){
        if (new_tag == "Remove") {
          if (entitie.text === old_text) {
            // Ignore and dont add to new array
            removeFromSidebar(entitie.id)
          }
          else {
            new_value.push(entitie)
          }
        }
        else {
          if (entitie.text === old_text) {
            // change tag
            entitie.tag = new_tag
            changeSidebar(entitie.text, new_tag, entitie.id, true)
          }
        }
      })
      allEntities.current = value_sidebar.current
      if (new_tag == "Remove") {
        new_anom = {
          value: new_value,
          tag: old_tag
        }
        anomValues.current = new_anom
      }
      setRenderValue({
        anomTokens: false,
        anomValues: true,
        allEntities: true
      })
    }

  }

  function addToSidebar(text, role, ids, entitie_id) {
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

    if (found === false) {
      if (entitie_id === null) {
        value_sidebar.current.push({
          tokens: [{
            text: text,
            ids: ids
          }],
          tag: role
        })
      }
      else {
        value_sidebar.current.splice(entitie_id, 0,  {
          tokens: [{
            text: text,
            ids: ids
          }],
          tag: role
        })
      }

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
        let slice_1 = value_sidebar.current[counter].tokens.slice(0, t_counter)
        let slice_2 = value_sidebar.current[counter].tokens.slice(t_counter+1)
        value_sidebar.current[counter].tokens = slice_1.concat(slice_2)
      }
    }
  }
  
  function changeSidebar(text, new_tag, id, all) {
    let entitie_id = 0
    for (let entitie of value_sidebar.current) {
      for (let token of entitie.tokens) {
        if (token.ids.includes(id)) {
          // Remove current id from sidebar
          removeFromSidebar(id, false)
          // And re-add it with new tag
          addToSidebar(text, new_tag, [id], entitie_id)
        }
      }
      entitie_id += 1
    }
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
      let role = temp_split[1].substring(5,9)
      if (role === "E-MA") {
        role = "E-MAIL"
      }

      if (previous_value.current === false) {
        value.current.push({
          start: tokenCounter,
          end: tokenCounter + split.length,
          tag: role,
          text: new_text,
          id: anom_id.current
        })
        addToSidebar(new_text, role, [anom_id.current], null)
        anom_id.current += 1
      }
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
    // Create default for testing
    //value.current = []
    let final_values = []
    
    if (sourceHtml !== null) {
      new_example_html = sourceHtml
    }
    else {
      const storedFileName = localStorage.getItem("ANOM_FILE_NAME");
      const storedSourceHML = localStorage.getItem("ANOM_SOURCE_HTML");
      

      if (storedSourceHML !== null) {
        setFile({name:storedFileName, complete:false})
        setSourceHtml(storedSourceHML)
        
        const storedAnomValues = localStorage.getItem("ANOM_VALUES").split("---");
        const storedAnomTokens= localStorage.getItem("ANOM_TOKENS").split("---");
        const storedAllEntities = localStorage.getItem("ANOM_ALL_ENTITIES").split("---");
        
        for (let v of storedAnomValues) {
          final_values.push(JSON.parse(v))
        }
  
        let final_stored_tokens = []
        for (let t of storedAnomTokens) {
          final_stored_tokens.push(JSON.parse(t))
        }
  
        let final_entities_tokens = []
        for (let e of storedAllEntities) {
          final_entities_tokens.push(JSON.parse(e))
        }
  
        allEntities.current = final_entities_tokens
        value_sidebar.current = final_entities_tokens
        anomValues.current = {
          value: storedAnomValues,
          tag: "PES"
        }
        anomTokens.current = final_stored_tokens
        value.current = final_values
        setRenderValue({
          anomTokens: true,
          anomValues: true,
          allEntities: true
        })

        previous_value.current = true
        //return
      }
      else {
        setSourceHtml(new_example_html)
      }
    }

    let raw_text_temp = ""
    //value_sidebar.current = []
    
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
      raw_text_temp += " " + line.trim()
    }

    if (trueSourceHtml.current === false) {
      raw_text.current = raw_text_temp
      trueSourceHtml.current = true
    }
    let final_tokens = iterateHtml(raw_text_temp)

    allEntities.current = value_sidebar.current
    anomTokens.current = final_tokens

    anomValues.current = {
      value: value.current,
      tag: "PES"
    }
    setRenderValue({
      anomTokens: true,
      anomValues: true,
      allEntities: true
    })
  }

  function box() {
    if (anomValues.current === null || anomTokens.current === null) {
      return <></>
    }
    if (mode === "Original") {
      return (
        <div className='Text'>
          {parse(raw_text.current)}
        </div>
      )
    }
    else {
      return (
        <div className='Text'>
          <TokenAnnotator
            tokens={anomTokens.current}
            value={anomValues.current.value}
            onNewEntitie={handleNewEntitie}
            onEntitieChange={handleEntitieChange}
            onTagChange={handleMultipleTagChange}
            getSpan={span => ({
              ...span,
              tag: anomValues.current.tag,
            })}
            mode={mode}
            anom_style = {anomStyle}
            last_index = {last_index_backup}
            tag = {tag}
            />
        </div>
      )
    }

  }

  function getText() {
    return ReactDOMServer.renderToString(box())
  }

  return (
    <div>
      <div className='FlexContainer'>

        <div className='Anom'>
          {AnomHeader(getText)}
          {box()}
          {ActionMenu(menuStyle.left, menuStyle.top, menuStyle.showMenu, handleTagChange)}
          <div className='PopUp'>
            {PopUpMenu(popUpMenu.showMenu, handleMultipleTagChange, popUpMenu.entities)}
          </div>
        </div>

        {TableComponent2(addToSidebar, removeFromSidebar, handleMultipleTagChange)}

      </div>

    </div>
  );
}

export default Anom;
