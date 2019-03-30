import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { accessActions } from '../../actions/accessActions';
import ProfileMenu from '../../components/MainAppBar/ProfileMenu';

function MainAppBarContainer({ denyAccess }) {
    const handleLogout = () => {
        denyAccess();
    };

    return <ProfileMenu handleLogout={handleLogout} />;
}

MainAppBarContainer.propTypes = {
    denyAccess: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return {
        denyAccess: () => dispatch(accessActions.denyAccess())
    };
};

export default connect(
    null,
    mapDispatchToProps
)(MainAppBarContainer);
