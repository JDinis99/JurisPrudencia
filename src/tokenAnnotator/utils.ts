import sortBy from 'lodash.sortby'

export const splitWithOffsets = (text, offsets: {start: number; end: number}[]) => {
  let lastEnd = 0
  const splits = []

  for (let offset of sortBy(offsets, o => o.start)) {
    const {start, end} = offset
    if (lastEnd < start) {
      splits.push({
        start: lastEnd,
        end: start,
        content: text.slice(lastEnd, start),
      })
    }
    splits.push({
      ...offset,
      mark: true,
      content: text.slice(start, end),
    })
    lastEnd = end
  }
  if (lastEnd < text.length) {
    splits.push({
      start: lastEnd,
      end: text.length,
      content: text.slice(lastEnd, text.length),
    })
  }

  return splits
}

export const splitTokensWithOffsets = (text, offsets: {start: number; end: number}[], value_offset) => {
  let lastEnd = 0
  const splits = []

  for (let offset of sortBy(offsets, o => o.start)) {
    let {start, end} = offset
    start = start - value_offset
    end = end - value_offset

    // Consider out of bounds offsets
    console.log("text: ", text)
    console.log("text lenght: ", text.length)
    console.log("start: ", start)
    console.log("end: ", end)
    console.log("value_offset: ", value_offset)

    // If offset is before this set of tokens
    if (start < 0 && end <=0) {
      console.log("Case 1")
      continue
    }
    // If offset starts before set of tokens, but ends within set of tokens
    else if (start < 0 && end > 0 && end <= text.length - 1) {
      console.log("Case 2")
      start = 0
    }
    // If offset is within the set of tokens
    else if (start >= 0 && start < text.length - 1 && end > 0 && end <= text.length - 1) {
      console.log("Case 3")
      // Do nothing
    }
    // If offeset starts within set of tokemns, but ends outside set of tokens
    else if (start >= 0 && start < text.length - 1 && end > text.length - 1) {
      console.log("Case 4")
      end = text.length
    }
    // If offset is after the set of tokens
    else if (start > text.length - 1 && end > text.length - 1) {
      console.log("Case 5")
      continue
    }
    // If offeset ocupies entire set of tokens
    else if (start < 0 && end > text.length - 1) {
      console.log("Case 6")
      start = 0
      end = text.length
    }
      console.log("End of cases")
      console.log("-------------------------------")

    if (lastEnd < start) {
      for (let i = lastEnd; i < start; i++) {
        splits.push({
          i,
          content: text[i],
        })
      }
    }
    splits.push({
      ...offset,
      mark: true,
      content: text.slice(start, end).join(' '),
    })
    lastEnd = end
  }

  for (let i = lastEnd; i < text.length; i++) {
    splits.push({
      i,
      content: text[i],
    })
  }

  return splits
}

export const selectionIsEmpty = (selection: Selection) => {
  let position = selection.anchorNode.compareDocumentPosition(selection.focusNode)

  return position === 0 && selection.focusOffset === selection.anchorOffset
}

export const selectionIsBackwards = (selection: Selection) => {
  if (selectionIsEmpty(selection)) return false

  let position = selection.anchorNode.compareDocumentPosition(selection.focusNode)

  let backward = false
  if (
    (!position && selection.anchorOffset > selection.focusOffset) ||
    position === Node.DOCUMENT_POSITION_PRECEDING
  )
    backward = true

  return backward
}