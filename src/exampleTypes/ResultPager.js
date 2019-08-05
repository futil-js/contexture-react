import _ from 'lodash/fp'
import React from 'react'
import { contexturify, defaultTheme } from '../utils/hoc'
import DefaultIcon from '../DefaultIcon'

// These are to prevent warning from `active`, `previous`, `next`
let span = ({ children }) => <span>{children}</span>
let a = ({ children, onClick }) => <a onClick={onClick}>{children}</a>

let ResultPager = _.flow(
  defaultTheme({
    Item: span,
    Link: a,
    Icon: DefaultIcon,
  }),
  contexturify
)(({ node, tree, theme, className = '' }) => {
  let pages = Math.ceil(
    (node.context.response.totalRecords || 1) / node.pageSize
  )
  let page = node.page || 1
  return (
    pages > 1 && (
      <div className={`${className} contexture-result-pager`}>
        <theme.Item disabled={!(page > 1)}>
          <theme.Link
            previous
            onClick={() => tree.mutate(node.path, { page: page - 1 })}
          >
            <theme.Icon icon="PreviousPage" />
          </theme.Link>
        </theme.Item>
        {page > 3 && (
          <theme.Item
            onClick={() =>
              tree.mutate(node.path, { page: _.max([0, page - 5]) })
            }
          >
            <theme.Icon icon="Previous5Pages" />
          </theme.Item>
        )}
        {_.reverse(
          _.times(
            n =>
              page > n + 1 && (
                <theme.Item key={`prev${n}`}>
                  <theme.Link
                    onClick={() =>
                      tree.mutate(node.path, { page: page - (n + 1) })
                    }
                  >
                    {page - (n + 1)}
                  </theme.Link>
                </theme.Item>
              ),
            2
          )
        )}
        <theme.Item active>
          <theme.Link>{page}</theme.Link>
        </theme.Item>
        {_.times(
          n =>
            page + (n + 1) <= pages && (
              <theme.Item key={`next${n}`}>
                <theme.Link
                  onClick={() =>
                    tree.mutate(node.path, { page: page + (n + 1) })
                  }
                >
                  {page + (n + 1)}
                </theme.Link>
              </theme.Item>
            ),
          2
        )}
        {page + 2 < pages && (
          <theme.Item
            onClick={() =>
              tree.mutate(node.path, { page: _.min([pages, page + 5]) })
            }
          >
            <theme.Icon icon="Next5Pages" />
          </theme.Item>
        )}
        <theme.Item disabled={!(page < pages)}>
          <theme.Link
            next
            onClick={() => tree.mutate(node.path, { page: page + 1 })}
          >
            <theme.Icon icon="NextPage" />
          </theme.Link>
        </theme.Item>
      </div>
    )
  )
})
ResultPager.displayName = 'ResultPager'

export default ResultPager
