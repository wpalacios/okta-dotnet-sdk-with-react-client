/*
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import { Container } from 'semantic-ui-react';
import config from './.samples.config';
import Home from './Home';
import Navbar from './Navbar';
import Profile from './Profile';
import Details from './Details';
import UserAdd from './UserAdd';
import Users from './Users';
import PasswordChange from './PasswordChange';

class App extends Component {
  render() {
    return (
      <Router>
        <Security
          issuer={config.oidc.issuer}
          client_id={config.oidc.clientId}
          redirect_uri={config.oidc.redirectUri}
        >
          <Navbar />
          <Container text style={{ marginTop: '7em' }}>
            <Route path="/" exact component={Home} />
            <Route path="/implicit/callback" component={ImplicitCallback} />
            <SecureRoute path="/profile" component={Profile} />
            <SecureRoute path="/Details" component={Details} />
            <SecureRoute path="/userAdd" component={UserAdd} />
            <SecureRoute path="/users" component={Users} />
            <SecureRoute path="/passwordChange" component={PasswordChange} />
          </Container>
        </Security>
      </Router>
    );
  }
}

export default App;
