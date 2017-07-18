import Duck from 'reduck';

import {
  REQUEST_AUTH,
  FETCH_TRANSACTIONS,
  EDIT_AMOUNT,
  REFUND,
} from '../actions';

const initialState = {
  transactions: [],
};

const duck = new Duck('merchant', initialState);

export const requestAuth = duck.defineAction(REQUEST_AUTH, {
  creator(amount, cardId) {
    return {
      payload: {
        cardId,
      },
      meta: {
        promise: {
          method: 'POST',
          data: { cardId, amount },
          url: 'pay/request-auth',
        },
      },
    };
  },
  resolve(state, { payload }) {
    return {
      ...state,
      transactions: state.transactions.concat(payload.data.transaction),
    };
  },
  reject(state, { payload }) {
    return {
      ...state,
      error: payload.response.data,
    };
  },
});

export const refund = duck.defineAction(REFUND, {
  creator(trxId) {
    return {
      payload: {
        trxId,
      },
      meta: {
        promise: {
          method: 'POST',
          data: { transactionId: trxId },
          url: 'pay/refund',
        },
      },
    };
  },
  resolve(state, { meta }) {
    return {
      ...state,
      transactions: state.transactions.map(trx => {
        if (trx._id === meta.payload.trxId) {
          return {
            ...trx,
            refunded: true,
            error: null,
          };
        }
        return trx;
      }),
    };
  },
  reject(state, { payload, meta }) {
    return {
      ...state,
      transactions: state.transactions.map(trx => {
        if (trx._id === meta.payload.trxId) {
          return {
            ...trx,
            error: payload.response.data.message || payload.response.data,
          };
        }
        return trx;
      }),
    };
  },
});

// to be used for both capturing and reversing an amount
export const editAmount = duck.defineAction(EDIT_AMOUNT, {
  creator(amount, trxId, action) {
    return {
      payload: { trxId },
      meta: {
        promise: {
          method: 'POST',
          url: `pay/${action}`,
          data: { amount, transactionId: trxId },
        },
      },
    };
  },
  resolve(state, { payload, meta }) {
    return {
      ...state,
      transactions: state.transactions.map(trx => {
        if (trx._id === meta.payload.trxId) {
          return {
            ...payload.data.newTransaction,
          };
        }
        return trx;
      }),
    };
  },
  reject(state, { payload, meta }) {
    return {
      ...state,
      transactions: state.transactions.map(trx => {
        if (trx._id === meta.payload.trxId) {
          return {
            ...trx,
            error: payload.response.data.message || payload.response.data,
          };
        }
        return trx;
      }),
    };
  },
});

export const fetchTransactions = duck.defineAction(FETCH_TRANSACTIONS, {
  creator(cardId) {
    return {
      payload: {},
      meta: {
        promise: {
          method: 'GET',
          url: `merchant/transactions/${cardId}`,
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
      transactions: payload.data.transactions,
    };
  },
  reject(state) {
    return {
      ...state,
      ready: true,
    };
  },
});

export default duck.reducer;
