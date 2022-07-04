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
  const [mode, setMode] = useState("Doccano")
  const [anomTokens, setAnomTokens] = useState(null)
  const [anomValues, setAnomValues] = useState(null)
  const last_index = useRef(0)
  const tag = useRef(null)
  const [menuStyle, setMenuStyle] = useState({
    left: 0,
    top: 0,
    showMenu: false
  })

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
    //getAllEntities()
    //setAnomTokens(anomText())
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
        if (entitie[0] === "PRO") {
          let substituion = "Substitute PRO"
          anonimization = "<font color=yellow><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
          anonimized_text = anonimized_text.replace(entitie[3], anonimization)
        }
        if (entitie[0] === "MAT") {
          let substituion = "Substitute MAT"
          anonimization = "<font color=red><b><strike>" + entitie[3] + "</b></strike> " + substituion + "</font>"
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

    // Counter for words not characters
    let counter = 0
    example_json.forEach(function(value) {

      value.entities.forEach(function(entitie) {
        let type = entitie[0]
        let tmp_str = value.text.slice(0, entitie[1])

        let start = counter + tmp_str.split(" ").length
        let end = start + entitie[3].split(" ").length

        let final_entitie = {
          start: start,
          end: end,
          tag: type,
          text: entitie[3]
        }

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

    if (anomValues === null) {
      setAnomValues({
        value: final_entities,
        tag: "PER"
      })
    }

    return text
  }

  function readHtml () {
    let raw_text = ""
    
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

    // Seperate raw_text into the zones with and without formating
    let format_tokens = []
    let iteration_beginning = 0
    let start_index = 0
    let end_index = 0
    let closing_tag_index = 0
    let tag = ""
    let temp_tag = ""
    let temp_split = []
    let closing_tag = ""
    let formating = ""
    let normal = ""

    while (true) {
      start_index = raw_text.indexOf("<", iteration_beginning)

      // If there are no more tags
      if (start_index === -1){
        break
      }

      end_index = raw_text.indexOf(">", start_index)
      temp_tag = raw_text.substring(start_index + 1,end_index)
      temp_split = temp_tag.split(" ")
      tag = "<" + temp_split[0] + ">"
      closing_tag = tag .replace("<", "</")

      // Ignore <p> and </p>
      if (tag === "<p>" || tag === "</p>" || temp_split[0] === "section" || temp_split[0] === "hr" || temp_split[0] === "ol" || temp_split[0] === "li"){
        normal = raw_text.substring(iteration_beginning, end_index + 1)
        format_tokens.push({
          type: "normal",
          start_index: iteration_beginning,
          end_index: start_index,
          value: normal
        })

        iteration_beginning = end_index + 1
        continue
      }

      closing_tag_index = raw_text.indexOf(closing_tag, end_index)

      normal = raw_text.substring(iteration_beginning, start_index)
      format_tokens.push({
        type: "normal",
        start_index: iteration_beginning,
        end_index: start_index,
        value: normal
      })

      formating = raw_text.substring(start_index, closing_tag_index + closing_tag.length)
      format_tokens.push({
        type: "format",
        start_index: start_index,
        end_index: closing_tag_index + closing_tag.length,
        value: formating
      })

      iteration_beginning = closing_tag_index + closing_tag.length
    }
    
    //console.log(format_tokens)

    // Process format_tokens into final tokens
    let final_tokens = []
    let opening_tags = []
    let closing_tags = []
    let next_tag_index = 0
    let text = ""
    let text_tokens = []

    // <strong>II – <em>Acórdão do <mark role="ORG">Tribunal da Relação de Coimbra</mark></em></strong>
    
    for (let f_token of format_tokens) {
      //console.log(f_token.value)
      if (f_token.type === "normal") {
        final_tokens = final_tokens.concat(f_token.value.split(" "))
      }
      else if (f_token.type === "format") {
        opening_tags = []
        closing_tags = []
        iteration_beginning = 0

        // while é a primeira iteracao ou opening tags ta vazio / qd o index chegou ao fim?
        do {

          // Starting tag
          start_index = f_token.value.indexOf("<", iteration_beginning)
          end_index = f_token.value.indexOf(">", start_index)
          tag = f_token.value.substring(start_index+1, end_index)
          temp_split = tag.split(" ")

          
          // If we are still finding new tags
          if (!temp_split[0].includes("/")) {
            // Add them to the tags arrays
            opening_tags.push("<" + tag + ">")
            closing_tag = "</" + temp_split[0] + ">"
            closing_tags.push(closing_tag)
            closing_tag_index = f_token.value.indexOf(closing_tag, end_index)
          }
          // If we are closing older tags
          else {
            // Search for the next tag to close from array
            closing_tag = closing_tags[closing_tags.length - 1]
            closing_tag_index = f_token.value.indexOf(closing_tag, start_index)
          }

          next_tag_index = f_token.value.indexOf("<", end_index + 1)

          // console.log("start_index: ", start_index)
          // console.log("end_index: ", end_index)
          // console.log("next_tag_index: ", next_tag_index)
          // console.log("closing_tag_index: ", closing_tag_index)
          // console.log("tag: ", tag)
          // console.log("closing tag: ", closing_tag)
          // console.log(opening_tags)
          // console.log(closing_tags)

          // If there is text until next tag
          if (next_tag_index !== end_index + 1 && next_tag_index !== -1 && closing_tag_index !== -1) {
            // Add text until next tag with its proper tags
            text = f_token.value.substring(end_index + 1, next_tag_index)
            //console.log("text:" ,text)
            text_tokens = text.split(" ")
            for (let t of text_tokens) {
              if (t !== "") {
                // Add all necessary tags
                let txt = ""
                for (let ta of opening_tags) {
                  txt += ta
                }
                txt += t
                for (let ta of closing_tags) {
                  txt += ta
                }
                //console.log("PUSHED: ", txt)
                final_tokens.push(txt)
              }
            }
          }

          // If tag in question is its own the closing tag
          if (start_index === closing_tag_index) {
            opening_tags.pop()
            closing_tags.pop()
            iteration_beginning = end_index + 1
          }
          // If the next tag after starting tag is the corresponding closing tag then close tags
          else if (closing_tag_index === next_tag_index) {
            opening_tags.pop()
            closing_tags.pop()
            iteration_beginning = closing_tag_index + closing_tag.length
          }
          // If not, open next set of tags
          else {
            iteration_beginning = next_tag_index
          }
          
        } while (opening_tags.length !== 0)
        //break
      }
    }

    //console.log(final_tokens)

    //   let split_mark_1 = line.split("<mark")

    //   let first = true
    //   for(let s of split_mark_1) {
    //     if (first){
    //       first = false
    //       continue
    //     }

    //     let split_mark_2 = s.split('">')
    //     let split_mark_3 = split_mark_2[1].split('</mark>')
    //     let word = split_mark_3[0]
    //     console.log(word)
    // }

    setAnomTokens(final_tokens)
    setAnomValues({
      value: [],
      //value: [{start: 0, end:6, tag: "PER"}],
      tag: "PER"
    })
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

      if (anomValues === null || anomTokens === null) {
        return <></>
      }
      let test_tokens = [
        {
          tokens: [
            {
              tokens: ["item", "outside", "1" ,"item", "outside", "1"],
              tag: "normal"
            }
          ],
          tag: "strong"
        },
        {
          tokens: [
            {
              tokens: ["item-0", "item-0"],
              tag: "normal"
            }
          ],
          tag: ""
        },
        {
          tokens: [
            {
              tokens: [
                {
                  tokens: ["item-1", "item-1"],
                  tag: "normal"
                }
              ],
              tag: "li"
            },
            {
              tokens: [
                {
                  tokens: ["item-2", "item-2"],
                  tag: "normal"
                }
              ],
              tag: "li"
            }
          ],
          tag: "ol"
        },
        {
          tokens: ["item-outside-2"],
          tag: "normal"
        },
      ]
      return (
        <div className='Text'>
            <TokenAnnotator
              //tokens={anomTokens}
              tokens={test_tokens}
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

  }
  

  return (
    <div className="App">
      {Header()}

      {Side()}

      {box()}

        {ActionMenu(menuStyle.left, menuStyle.top, menuStyle.showMenu, handleTagChange)}

      <div className='PopUp'>
          {PopUpMenu(popUpMenu.showMenu, handleMultipleTagChange, popUpMenu.entities)}
      </div>

    </div>
  );
}

export default App;
