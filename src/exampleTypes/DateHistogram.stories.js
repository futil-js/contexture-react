import Component from './DateHistogram.js'

export default {
  component: Component,
  args: {
    node: {
      key: 'releases',
      path: ['releases'],
      type: 'dateHistogram',
      key_field: 'released',
      value_field: 'imdbVotes',
      interval: '3650d',
      context: {
        entries: [
          {
            key: 0,
            doc_count: 1,
            count: 1,
            min: 625633,
            max: 625633,
            avg: 625633,
            sum: 625633,
          },
          {
            key: 315360000000,
            doc_count: 3,
            count: 3,
            min: 74450,
            max: 557731,
            avg: 355868.3333333333,
            sum: 1067605,
          },
          {
            key: 630720000000,
            doc_count: 2,
            count: 2,
            min: 82360,
            max: 376362,
            avg: 229361,
            sum: 458722,
          },
          {
            key: 946080000000,
            doc_count: 4,
            count: 4,
            min: 28087,
            max: 395463,
            avg: 275019.25,
            sum: 1100077,
          },
          {
            key: 1261440000000,
            doc_count: 1,
            count: 1,
            min: 264551,
            max: 264551,
            avg: 264551,
            sum: 264551,
          },
        ],
        maxDate: null,
        minDate: null,
      },
    },
  },
}

export const DateHistogram = {}
