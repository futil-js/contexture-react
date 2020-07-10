import _ from 'lodash/fp'
import F from 'futil'
import { extendObservable } from 'mobx'

// Logic

export let whenUndefined = F.when(_.isUndefined)
export let whenDefined = F.unless(_.isUndefined)

// Array

export let slashEncoder = {
  encode: F.when(_.isArray, _.join('/')),
  decode: F.when(_.isString, _.split('/')),
}

let trimEnd = _.trimEnd.convert({ fixed: false })
let trimStart = _.trimStart.convert({ fixed: false })

export let joinPaths = _.curry((p1, p2) =>
  F.compactJoin('/', [trimEnd(p1, '/'), trimStart(p2, '/')])
)

let parentRegex = /\/\w+$/

export let parentPath = p => trimEnd(p, '/').replace(parentRegex, '')

export let siblingPath = (p1, p2) => joinPaths(parentPath(p1), p2)

// Tree

export let treePath = (value, key, parents, parentsKeys) =>
  _.flow(_.dropRight(1), _.reverse, _.map(_.toString))([key, ...parentsKeys])

let traverse = F.unless(F.isTraversable, undefined)

let dotTreePath = _.flow(treePath, F.dotEncoder.encode)

export let flattenTreeLeaves = (next = traverse) => (buildPath = dotTreePath) =>
  F.reduceTree(next)(
    (result, node, ...x) =>
      next(node, ...x) ? result : _.set([buildPath(node, ...x)], node, result),
    {}
  )

export let unflattenTree = (splitPath = F.dotEncoder.decode) => x =>
  _.zipObjectDeep(_.map(splitPath, _.keys(x)), _.values(x))

// Aspect

export let Command = F.aspects.command(x => y => extendObservable(y, x))

let onCommandStatus = predicate => fn =>
  F.aspect({
    async after(result, state, args) {
      if (predicate(state)) {
        await fn(result, state, args)
      }
    },
  })

export let onCommandSuccess = onCommandStatus(_.get('succeeded'))
