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

import { withAuth } from '@okta/okta-react';
import React, { Component } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { checkAuthentication } from './helpers';

export default withAuth(class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null, userinfo: null };
    this.checkAuthentication = checkAuthentication.bind(this);
    this.login = this.login.bind(this);
  }

  async componentDidMount() {
    this.checkAuthentication();
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  async login() {
    this.props.auth.login('/');
  }

  render() {

    return (
      <div>
        {this.state.authenticated !== null &&
        <div>
          <Header as="h1">Implicit Flow w/ Okta Hosted Login Page</Header>
          {this.state.authenticated &&
            <div>
              <p>Welcome back, {this.state.userinfo.name}!</p>
              <p>
                You have successfully authenticated against your Okta org, and have been redirected back to this application.  You now have an ID token and access token in local storage.
                Visit the <a href="/profile">My Profile</a> page to take a look inside the ID token.
              </p>
            </div>
          }
          {!this.state.authenticated &&
            <div>
              <p>If you&lsquo;re viewing this page then you have successfully started this React application.</p>
              <p>
                <span>This example shows you how to use the </span>
                <a href="https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react">Okta React Library</a>
                <span> to add the </span>
                <a href="https://developer.okta.com/authentication-guide/implementing-authentication/implicit">Implicit Flow</a>
                <span> to your application.</span>
              </p>
              <p>
                When you click the login button below, you will be redirected to the login page on your Okta org.
                After you authenticate, you will be returned to this application with an ID token and access token.  These tokens will be stored in local storage and can be retrieved at a later time.
              </p>
              <Button id="login-button" primary onClick={this.login}>Login</Button>
            </div>
          }
        </div>
        }
      </div>
    );
  }
});
