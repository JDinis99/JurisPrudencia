import React from 'react'
import parse from 'html-react-parser';

export interface MarkProps {
  key: string
  content: string
  start: number
  end: number
  tag: string
  color?: string
  onClick: (any) => any
  preview: boolean
  anom: string
}

const TAG_COLORS = {
  ORG: "#00ffa2",
  PERSON: "#84d2ff",
  DAT: "#66fc03",
  LOC: "#fc03c2",
  PRO: "#eb8634",
  MAT: "#eb3434"
};

const Mark: React.SFC<MarkProps> = props => (
  <mark
    style={{backgroundColor: TAG_COLORS[props.tag] || '#84d2ff', padding: ".2em .3em", margin: "0 .25em", lineHeight: "1", display: "inline-block", borderRadius: ".25em"}}
    data-start={props.start}
    data-end={props.end}
    onClick={() => props.onClick({start: props.start, end: props.end})}
  >
    {props.preview ? props.anom : parse(props.content)}
    {props.tag && (
      <span style={{boxSizing: "border-box", content: "attr(data-entity)", fontSize: ".55em", lineHeight: "1", padding: ".35em .35em", borderRadius: ".35em", textTransform: "uppercase", display: "inline-block", verticalAlign: "middle", margin: "0 0 .15rem .5rem", background: "#fff", fontWeight: "700"}}>{props.tag}</span>
    )}
  </mark>
)

export default Mark