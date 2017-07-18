// Action names stored here
// in the format: <duck-name>.<action-name>

let duckName

duckName = 'cards.'

export const ADD_CARD = duckName + 'ADD_CARD'
export const START_CREATE_CARD = duckName + 'START_CREATE_CARD'
export const CANCEL_CREATE_CARD = duckName + 'CANCEL_CREATE_CARD'
export const TOP_UP_CARD = duckName + 'TOP_UP_CARD'
export const FETCH_CARD = duckName + 'FETCH_CARD'
export const FETCH_CARDS = duckName + 'FETCH_CARDS'
export const MAKE_TRANSACTION = duckName + 'MAKE_TRANSACTION'

duckName = 'merchant.'

export const REQUEST_AUTH = duckName + 'REQUEST_AUTH'
export const FETCH_TRANSACTIONS = duckName + 'FETCH_TRANSACTIONS'
export const EDIT_AMOUNT = duckName + 'EDIT_AMOUNT'
export const REFUND = duckName + 'REFUND'
