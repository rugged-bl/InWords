import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import deepPurple from '@material-ui/core/colors/deepPurple';
import amber from '@material-ui/core/colors/amber';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { store } from './store/configureStore';
import App from './containers/App';

import 'bootstrap/dist/js/bootstrap.bundle.min';
import './index.scss';

const theme = createMuiTheme({
    palette: {
        primary: deepPurple,
        secondary: amber
    }
});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <App />
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
);
