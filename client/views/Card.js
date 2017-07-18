import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Loader } from 'react-loaders';

import MerchantView from '../components/MerchantView';
import { topUpCard, fetchCard } from '../redux/ducks/cards';
import { requestAuth, fetchTransactions } from '../redux/ducks/merchant';
import '../styles/Card.less';

class Card extends Component {
  static propTypes = {
    card: PropTypes.object,
    topUpCard: PropTypes.func,
    requestAuth: PropTypes.func,
    fetchCard: PropTypes.func,
    fetchTransactions: PropTypes.func,
    params: PropTypes.object,
    transactions: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  componentWillMount() {
    const { cardId } = this.props.params;
    this.props.fetchCard(cardId);
    this.props.fetchTransactions(cardId);
  }

  render() {
    const { card } = this.props;
    const { error } = card;
    if (!card || !card.ready) {
      return <Loader />;
    }
    return (
      <div>
        <div className="card-wrapper">
          <h2>
            {card.name}
          </h2>
          {card.ready !== false &&
            <div className="balance-wrapper">
              <div className="balance-item">
                Current balance:
                <span className="balance">{card.balance} £</span>
              </div>
              <div className="balance-item">
                Available balance:
                <span className="balance">
                  {card.balance - card.blockedBalance} £
                </span>
              </div>
              <div className="error-message">
                {error}
              </div>
            </div>}
          <div className="card-input">
            Top up:
            <form onSubmit={this.topUpBalance}>
              <input
                type="number"
                id="amount"
                ref={tu => (this.topUpInput = tu)}
              />
              <button type="submit" className="cta">
                Submit
              </button>
            </form>
          </div>
          <div className="card-input">
            Make Transaction:
            <form onSubmit={this.makeTransaction}>
              <input
                type="number"
                id="trx_amount"
                ref={trx => (this.trxInput = trx)}
              />
              <button type="submit" className="cta">
                Submit
              </button>
            </form>
          </div>
          <div
            className="cta refresh"
            onClick={() => this.props.fetchCard(card._id)}
          >
            Refresh Card
          </div>
        </div>
        <MerchantView cardId={card._id} />
      </div>
    );
  }

  topUpBalance = e => {
    e.preventDefault();
    this.props.topUpCard(e.target.amount.value || 0, this.props.card._id);
    this.topUpInput.value = null;
  };

  makeTransaction = e => {
    e.preventDefault();
    this.props.requestAuth(e.target.trx_amount.value || 0, this.props.card._id);
    this.trxInput.value = null;
  };
}

function mapStateToProps(state, ownProps) {
  return {
    card: state.cards.items.find(c => c._id === ownProps.params.cardId),
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      topUpCard,
      fetchCard,
      requestAuth,
      fetchTransactions,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Card);
