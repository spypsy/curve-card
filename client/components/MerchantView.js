import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchTransactions, editAmount, refund } from '../redux/ducks/merchant';
import '../styles/MerchantView.less'

class MerchantView extends Component {
  static propTypes = {
    cardId: PropTypes.string,
    fetchTransactions: PropTypes.func,
    editAmount: PropTypes.func,
    refund: PropTypes.func,
    transactions: PropTypes.array,
    transactionError: PropTypes.string,
  }

  render() {
    return (<div className="merchant-view">
      <h2>Merchant's transactions</h2>
      <div className="transactions">
        {this.props.transactions.map(trx =>
          <div key={trx._id} className="transaction">
            {trx.error && <span className="error">
              {trx.error}
            </span>}
            Amount: <b>{trx.amount} £</b><br />
            Authorized: <b>{trx.authorized.toString()}</b> <br />
            Completed: <b>{trx.completed.toString()}</b> <br />
            Captured Amount: <b>{trx.capturedAmount} £</b><br />
            Reversed Amount: <b>{trx.reversedAmount} £</b><br />
            <form onSubmit={(e) => this.captureAmount(e, trx)}>
              Capture:
              <input type="number" id="capture"
                ref={c => this.captureInput = c}/>
              <button type="submit" className="cta small">
                Submit
              </button>
            </form>
            <form onSubmit={(e) => this.reverseAmount(e, trx)}>
              Reverse:
              <input type="number" id="reverse"
                ref={r => this.reverseInput = r}/>
              <button type="submit" className="cta small">
                Submit
              </button>
            </form>
            <button className="cta" onClick={() => this.refund(trx)}>
              Refund
            </button>
          </div>
        )}
      </div>
    </div>)
  }

  captureAmount = (e, {_id}) => {
    e.preventDefault()
    this.props.editAmount(e.target.capture.value, _id, 'capture')
    this.captureInput.value = null
  }

  reverseAmount = (e, {_id}) => {
    e.preventDefault()
    this.props.editAmount(e.target.reverse.value, _id, 'reverse')
    this.captureInput.value = null
  }

  refund = ({_id}) => {
    this.props.refund(_id)
  }
}

const mapStateToProps = (state, ownProps) => ({
  transactions: state.merchant.transactions.filter(
    trx => trx.card === ownProps.cardId,
  ),
  transactionError: state.merchant.error,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchTransactions, editAmount, refund
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MerchantView)
