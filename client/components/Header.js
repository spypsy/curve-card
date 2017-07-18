import React from 'react';
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {routerActions} from 'react-router-redux';

import '../styles/Header.less'

const Header = ({goTo}) => <div className="header">
  <h2 onClick={() => goTo('Home')}>Curve Cards</h2>
</div>

Header.propTypes = {
  goTo: PropTypes.fund,
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => bindActionCreators({
  goTo: routerActions.push
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Header)
