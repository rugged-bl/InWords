import React from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { fade } from '@material-ui/core/styles';
import styled from '@emotion/styled';
import List from 'src/components/List';
import ListItemButtonBase from 'src/components/ListItemButtonBase';

const NavList = styled(List)`
  width: 100%;
`;

const NavLink = styled(ListItemButtonBase)`
  padding: 10px 24px;
  width: 100%;
  font-weight: 400;
  font-size: ${props => props.theme.typography.body2.fontSize};
  color: ${props => props.theme.palette.text.primary};
  transition: ${props =>
    props.theme.transitions.create(['background-color'], {
      duration: props.theme.transitions.duration.shortest
    })};

  &.active {
    font-weight: 500;
    color: ${props => props.theme.palette.primary.main};
    background-color: ${props => fade(props.theme.palette.primary.main, 0.15)};
  }

  &:hover {
    font-weight: 500;
    color: ${props => props.theme.palette.primary.main};
  }
`;

function SideNavList({ routes, handleClose }) {
  return (
    <NavList>
      {routes.map(({ to, text }) => (
        <li key={to}>
          <NavLink
            as={RouterNavLink}
            to={to}
            activeClassName="active"
            onClick={handleClose}
          >
            {text}
          </NavLink>
        </li>
      ))}
    </NavList>
  );
}

SideNavList.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  )
};

export default SideNavList;
