import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export class TopNavbar extends Component {
    handleClickLogout = () => {
        this.props.logout();
    };

    render() {
        const { accessToken, fetching } = this.props;

        const loginLink =
            <NavLink className="nav-link" activeClassName="selected" to="/login">
                Авторизация
            </NavLink>;

        const registerLink =
            <NavLink className="nav-link" activeClassName="selected" to="/register">
                Регистрация
            </NavLink>;

        const wordlistLink =
            <NavLink className="nav-link" activeClassName="selected" to="/wordlist">
                Словарь
            </NavLink>;

        const logoutButton =
            <button type="button" className="btn btn-outline-light" onClick={this.handleClickLogout}>
                Выйти
            </button>;

        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-3">
                {accessToken ? <div /> : <Redirect to="/login" />}
                <a className="navbar-brand" href=".">
                    InWords
                </a>
                {fetching ?
                    <div className="spinner-border spinner-border-sm text-secondary visible" role="status" /> :
                    <div className="spinner-border spinner-border-sm text-secondary invisible" role="status" />}
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mr-auto">
                        {!accessToken ? loginLink : <div />}
                        {!accessToken ? registerLink : <div />}
                        {accessToken ? wordlistLink : <div />}
                    </ul>
                    {accessToken ? logoutButton : <div />}
                </div>
            </nav>
        );
    }
}

TopNavbar.propTypes = {
    accessToken: PropTypes.string,
    fetching: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired
}
