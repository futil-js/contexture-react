import React from 'react'
import { Tag as GVTag, TagsInput as GVTagsInput } from '../../greyVest/index.js'

let RemoveIcon = (props) => (
  <span className="tags-input-tag-remove fa fa-times" {...props} />
)

export function Tag(props) {
  return <GVTag RemoveIcon={RemoveIcon} {...props} />
}

export default function TagsInput(props) {
  return <GVTagsInput Tag={Tag} {...props} />
}
