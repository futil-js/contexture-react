import React from 'react'

let List = ({ Component = React.Fragment, children, ...props }) => (
  <ul 
    style={{
      listStyleType: 'none',
      margin: 0,
      padding: 0
    }}
  >
  {React.Children.map(children, e =>
    e && (
      <li>
        <Component key={e} {...props}>
          {e}
        </Component>
      </li>
    )
  )}
  </ul>
)
export default List
