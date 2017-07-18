import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CardCreator from '../components/CardCreator';
import { fetchCards, startCreatingCard } from '../redux/ducks/cards';

import '../styles/Application.less';

class Home extends Component {
  static propTypes = {
    cards: PropTypes.array,
    fetchCards: PropTypes.func,
    startCreatingCard: PropTypes.func,
    creationInProgress: PropTypes.bool,
  };

  componentWillMount() {
    this.props.fetchCards();
  }

  render() {
    const { cards, creationInProgress } = this.props;
    return (
      <div className="home">
        <div className="cards-wrapper">
          {!cards.length &&
            <span>
              You haven't created any cards yet
            </span>}
          <ul className="cards-list">
            {cards.map(card =>
              <li className="card-item" key={card._id}>
                <Link to={`card/${card._id}`}>
                  {card.name}
                </Link>{' '}
                - {card.balance}£ <br />
                <span className="description">{card.description}</span>
              </li>
            )}
          </ul>
        </div>
        <div className="cta create" onClick={this.props.startCreatingCard}>
          Create new card
        </div>
        {creationInProgress && <CardCreator />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cards: state.cards.items,
  creationInProgress: state.cards.creationInProgress,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      startCreatingCard,
      fetchCards,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);
