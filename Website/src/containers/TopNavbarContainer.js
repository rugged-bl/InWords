import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { UserActions } from '../actions/UserActions';
import { TopNavbar } from '../components/TopNavbar';

class TopNavbarContainer extends Component {
    render() {
        const { authToken, logoutAction } = this.props;
        return (
            <Form.Group>
                <TopNavbar token={authToken.token} logout={logoutAction} />
            </Form.Group>
        );
    }
}

const mapStateToProps = store => {
    return {
        authToken: store.authToken
    };
}

const mapDispatchToProps = dispatch => {
    return {
        logoutAction: () => dispatch(UserActions.logout())
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopNavbarContainer);