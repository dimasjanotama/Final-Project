import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Router} from 'react-router-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'

import App from './App'
import reducers from './reducers/index'
import 'bootstrap/dist/css/bootstrap.min.css'
import './dimdom.css'
import './lib/semantic/semantic.min.css'


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const STORE = createStore(
    reducers,
    composeEnhancers(applyMiddleware(thunk))
)

ReactDOM.render(
  <Provider store={STORE}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'))

