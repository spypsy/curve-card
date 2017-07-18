import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { addCard, cancelCreatingCard } from '../redux/ducks/cards'

import '../styles/CardCreator.less'

class CardCreator extends Component {
  static propTypes = {
    addCard: PropTypes.func,
    cancelCreatingCard: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      warning: null,
    }
  }

  render() {
    return (
      <div className="card-creator">
        <form className="new-card" onSubmit={this.handleCreateCard}>
          <div className="close" onClick={this.props.cancelCreatingCard}>
            ✕
          </div>
          <h2>Create a new card</h2>
          <label htmlFor="name">
            Name your card <br />
            <input id="name" type="text" className="user-input" />
            {this.state.warning &&
              <span className="warning">
                {this.state.warning}
              </span>}
          </label>
          <label htmlFor="description">
            Add a description <br />
            <input id="description" type="text" className="user-input" />
          </label>
          <label htmlFor="amount">
            Initial amount <br />
            <input
              id="amount"
              type="number"
              step="0.01"
              className="user-input"
            />
          </label>
          <button className="cta" type="submit">
            Submit
          </button>
        </form>
        <div className="overlay" />
      </div>
    )
  }

  handleCreateCard = e => {
    e.preventDefault()
    if (!e.target.name.value || !e.target.name.value.length) {
      this.setState({
        warning: 'Please add a name',
      })
      return
    }
    this.props.addCard({
      name: e.target.name.value,
      description: e.target.description.value || '',
      amount: e.target.amount.value || 0,
    })
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addCard,
      cancelCreatingCard,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(CardCreator)
