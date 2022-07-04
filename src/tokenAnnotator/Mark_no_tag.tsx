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
}

const TAG_COLORS = {
  ORG: "#00ffa2",
  PERSON: "#84d2ff",
  DAT: "#66fc03",
  LOC: "#fc03c2",
  PRO: "#eb8634",
  MAT: "#eb3434"
};

const MarkNoTag: React.SFC<MarkProps> = props => (
  <mark
    style={{backgroundColor: TAG_COLORS[props.tag] || '#84d2ff', padding: ".2em .3em", margin: "0 .25em", lineHeight: "1", display: "inline-block", borderRadius: ".25em"}}
    data-start={props.start}
    data-end={props.end}
    onClick={() => props.onClick({start: props.start, end: props.end})}
  >
    {parse(props.content)}
  </mark>
)

export default MarkNoTag