import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {routerActions} from 'react-router-redux';

import Header from '../components/Header';

class Application extends React.Component {
  static propTypes = {
    pathname: PropTypes.string,
    children: PropTypes.node,
    goTo: PropTypes.func,
  }

  getRedirectionRoute() {
    if (this.props.pathname === '/') {
      return 'home';
    }
  }

  componentWillMount() {
    const redirect = this.getRedirectionRoute();
    if (redirect) {
      this.props.goTo(redirect);
    }
  }

  render() {
    return (
      <div className="application">
        <Header />
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pathname: (state.routing.locationBeforeTransitions || {}).pathname,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    goTo: routerActions.replace,
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Application);
