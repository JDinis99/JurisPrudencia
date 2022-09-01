import React from 'react'
import parse from 'html-react-parser';
import TAG_COLORS from '../utils/tag_colors';

export interface MarkProps {
  key: string
  content: string
  start: number
  end: number
  tag: string
  color?: string
  onClick: (any) => any
  mode: string
  anom: string
}

const Mark: React.SFC<MarkProps> = props => (
  props.mode == "Preview" ?
  <mark>
    {props.anom + " "}
  </mark>
  :
  <mark
    style={{backgroundColor: TAG_COLORS[props.tag] || '#84d2ff', padding: ".2em .3em", margin: "0 .25em", lineHeight: "1", display: "inline-block", borderRadius: ".25em"}}
    data-start={props.start}
    data-end={props.end}
    onClick={() => props.onClick({start: props.start, end: props.end})}
  >
    {parse(props.content)}
    {props.tag && (
      <span style={{boxSizing: "border-box", content: "attr(data-entity)", fontSize: ".55em", lineHeight: "1", padding: ".35em .35em", borderRadius: ".35em", textTransform: "uppercase", display: "inline-block", verticalAlign: "middle", margin: "0 0 .15rem .5rem", background: "#fff", fontWeight: "700"}}>{props.tag}</span>
    )}
  </mark>
)

export default Mark