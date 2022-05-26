import React, {useState} from 'react'

import Mark, {MarkProps} from './Mark.tsx'
import {selectionIsEmpty, selectionIsBackwards, splitTokensWithOffsets} from './utils.ts'
import {Span} from './span.ts'
import parse from 'html-react-parser';

interface TokenProps {
  i: number
  content: string
}

interface TokenSpan {
  start: number
  end: number
  tokens: string[]
}

const Token: React.SFC<TokenProps> = props => {
  return <span data-i={props.i}>{parse(props.content)} </span>
}

export interface TokenAnnotatorProps<T>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tokens: string[]
  value: T[]
  onNewEntitie: (value: T[], p) => any
  onEntitieChange: (index, p) => any
  getSpan?: (span: TokenSpan) => T
  renderMark?: (props: MarkProps) => JSX.Element
  // TODO: determine whether to overwrite or leave intersecting ranges.
}

const TokenAnnotator = <T extends Span>(props: TokenAnnotatorProps<T>) => {
  const renderMark = props.renderMark || (props => <Mark {...props} />)

  const getSpan = (span: TokenSpan): T => {
    if (props.getSpan) return props.getSpan(span)
    return {start: span.start, end: span.end} as T
  }

  const handleMouseUp = () => {
    if (!props.onNewEntitie) return

    const selection = window.getSelection()
    const r = selection.getRangeAt(0);
    const p = r.getBoundingClientRect();

    if (selectionIsEmpty(selection)) return

    if (
      !selection.anchorNode.parentElement.hasAttribute('data-i') ||
      !selection.focusNode.parentElement.hasAttribute('data-i')
    ) {
      window.getSelection().empty()
      return false
    }

    let start = parseInt(selection.anchorNode.parentElement.getAttribute('data-i'), 10)
    let end = parseInt(selection.focusNode.parentElement.getAttribute('data-i'), 10)

    if (selectionIsBackwards(selection)) {
      ;[start, end] = [end, start]
    }

    end += 1

    props.onNewEntitie([...props.value, getSpan({start, end, tokens: props.tokens.slice(start, end)})], p)
    window.getSelection().empty()
  }

  const handleSplitClick = ({start, end}) => {
    const selection = window.getSelection()
    const r = selection.getRangeAt(0);
    const p = r.getBoundingClientRect();
    // Find and remove the matching split.
    const splitIndex = props.value.findIndex(s => s.start === start && s.end === end)
    if (splitIndex >= 0) {
      props.onEntitieChange(splitIndex, p)
    }
  }

  const {tokens, value, onNewEntitie, onEntitieChange, getSpan: _, ...divProps} = props
  const splits = splitTokensWithOffsets(tokens, value)
  return (
    <div {...divProps} onMouseUp={handleMouseUp}>
      {splits.map((split, i) =>
        split.mark ? (
          renderMark({
            key: `${split.start}-${split.end}`,
            ...split,
            onClick: handleSplitClick,
          })
        ) : (
          <Token key={split.i} {...split} />
        )
      )}
    </div>
  )
}

export default TokenAnnotator