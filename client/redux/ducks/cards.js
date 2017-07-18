import Duck from 'reduck';

import {
  ADD_CARD,
  TOP_UP_CARD,
  FETCH_CARD,
  FETCH_CARDS,
  START_CREATE_CARD,
  CANCEL_CREATE_CARD,
} from '../actions';

const initialState = {
  items: [],
  ready: true,
  creationInProgress: false,
  error: null,
};

const cardsDuck = new Duck('cards', initialState);

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
    };
  },
  reducer(state) {
    return {
      ...state,
      ready: false,
      creationInProgress: false,
    };
  },
  // card was succesfully created
  resolve(state, { payload }) {
    const { newCard } = payload.data;
    return {
      ...state,
      ready: true,
      items: state.items.concat([newCard]),
    };
  },
  // error on creating card
  // TODO: maybe display feedback
  reject(state) {
    return {
      ...state,
      ready: false,
    };
  },
});

export const topUpCard = cardsDuck.defineAction(TOP_UP_CARD, {
  creator(amount, cardId) {
    return {
      payload: { cardId },
      meta: {
        promise: {
          method: 'POST',
          url: 'cards/top-up',
          data: { amount, cardId },
        },
      },
    };
  },
  reducer(state, payload) {
    return {
      ...state,
      items: state.items.map(card => {
        if (card._id === payload.cardId) {
          return {
            ...card,
            ready: false,
          };
        }
        return card;
      }),
    };
  },
  resolve(state, { payload, meta }) {
    return {
      ...state,
      items: state.items.map(card => {
        if (card._id === meta.payload.cardId) {
          return {
            ...card,
            error: null,
            ready: true,
            balance: payload.data.newBalance,
          };
        }
        return card;
      }),
    };
  },
  reject(state, { payload, meta }) {
    return {
      ...state,
      items: state.items.map(card => {
        if (card._id === meta.payload.cardId) {
          return {
            ...card,
            error: payload.response.data,
            ready: true,
          };
        }
        return card;
      }),
    };
  },
});

export const fetchCards = cardsDuck.defineAction(FETCH_CARDS, {
  creator() {
    return {
      payload: {},
      meta: {
        promise: {
          method: 'GET',
          url: 'cards',
        },
      },
    };
  },
  reducer(state) {
    return {
      ...state,
      ready: false,
    };
  },
  resolve(state, { payload }) {
    return {
      ...state,
      ready: true,
      items: payload.data.cards,
    };
  },
  reject(state) {
    return {
      ...state,
      ready: true,
    };
  },
});

export const fetchCard = cardsDuck.defineAction(FETCH_CARD, {
  creator(cardId) {
    return {
      payload: { cardId },
      meta: {
        promise: {
          method: 'GET',
          url: `cards/${cardId}`,
        },
      },
    };
  },
  reducer(state, { payload }) {
    return {
      ...state,
      items: state.items.map(card => {
        if (card._id === payload.cardId) {
          return {
            ...card,
            ready: false,
          };
        }
        return card;
      }),
    };
  },
  resolve(state, { payload, meta }) {
    return {
      ...state,
      items: state.items.map(card => {
        if (card._id === meta.payload.cardId) {
          return {
            ...payload.data.card,
            error: null,
            ready: true,
          };
        }
        return card;
      }),
    };
  },
  reject(state, { meta }) {
    return {
      ...state,
      items: state.items.map(card => {
        if (card._id === meta.payload.cardId) {
          return {
            ...card,
            error: 'Unable to update card info',
            ready: true,
          };
        }
        return card;
      }),
    };
  },
});

export const startCreatingCard = cardsDuck.defineAction(START_CREATE_CARD, {
  creator() {
    return {
      payload: {},
    };
  },
  reducer(state) {
    return { ...state, creationInProgress: true };
  },
});

export const cancelCreatingCard = cardsDuck.defineAction(CANCEL_CREATE_CARD, {
  creator() {
    return {
      payload: {},
    };
  },
  reducer(state) {
    return { ...state, creationInProgress: false };
  },
});

export default cardsDuck.reducer;
