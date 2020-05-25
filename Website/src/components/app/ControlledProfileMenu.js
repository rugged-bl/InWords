import React, { memo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { denyAccess } from 'src/actions/authActions';
import { removeState } from 'src/localStorage';
import Icon from 'src/components/core/Icon';
import IconButton from 'src/components/core/IconButton';
import ResponsiveMenu from 'src/components/core/ResponsiveMenu';
import MenuItem from 'src/components/core/MenuItem';
import usePopup from 'src/components/core/usePopup';
import PopupContainer from 'src/components/core/PopupContainer';
import Popup from 'src/components/core/Popup';
import ButtonBase from 'src/components/core/ButtonBase';

const handleOAuth2Logout = async () => {
  if (window.gapi) {
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (auth2 != null) {
      try {
        await auth2.signOut();
        auth2.disconnect();
      } catch (error) {
        // die
      }
    }
  }
};

function ControlledProfileMenu() {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await handleOAuth2Logout();
    } catch (error) {
      // die
    } finally {
      dispatch(denyAccess());
      removeState();
      history.push('/sign-in');
    }
  };

  const { show, handleOpen, handleClose, anchorEl } = usePopup();

  return (
    <PopupContainer>
      <IconButton
        aria-label="меню профиля"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleOpen}
        edge="end"
        color="inherit"
      >
        <Icon>account_circle</Icon>
      </IconButton>
      <Popup show={show} side="right" onClose={handleClose}>
        <ResponsiveMenu id="profile-menu" anchorEl={anchorEl} responsive={show}>
          <li>
            <MenuItem component={Link} to="/profile" onClick={handleClose}>
              Профиль
            </MenuItem>
          </li>
          <li>
            <MenuItem
              component={ButtonBase}
              onClick={() => {
                handleLogout();
                handleClose();
              }}
            >
              Выйти
            </MenuItem>
          </li>
        </ResponsiveMenu>
      </Popup>
    </PopupContainer>
  );
}

export default memo(ControlledProfileMenu);
