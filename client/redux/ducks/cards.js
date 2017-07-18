import Duck from 'reduck'

import { ADD_CARD, START_CREATE_CARD, CANCEL_CREATE_CARD } from '../actions'

const initialState = {
  items: [],
  ready: true,
  creationInProgress: false,
}

const cardsDuck = new Duck('cards', initialState)

export const addCard = cardsDuck.defineAction(ADD_CARD, {
  creator(cardData) {
    return {
      payload: {
        ...cardData,
      },
      meta: {
        promise: {
          method: 'POST',
          url: '/cards',
          data: { ...cardData },
        },
      },
    }
  },
  reducer(state) {
    return {
      ...state,
      ready: false,
      creationInProgress: false,
    }
  },
  // card was succesfully created
  resolve(state, { payload }) {
    const { newCard } = payload.data
    return {
      ...state,
      ready: true,
      items: state.items.concat([newCard]),
    }
  },
  // error on creating card
  // TODO: maybe display feedback
  reject(state) {
    return {
      ...state,
      ready: false,
    }
  },
})

export const startCreatingCard = cardsDuck.defineAction(START_CREATE_CARD, {
  creator() {
    return {
      payload: {},
    }
  },
  reducer(state) {
    return { ...state, creationInProgress: true }
  },
})

export const cancelCreatingCard = cardsDuck.defineAction(CANCEL_CREATE_CARD, {
  creator() {
    return {
      payload: {},
    }
  },
  reducer(state) {
    return { ...state, creationInProgress: false }
  },
})

export default cardsDuck.reducer
