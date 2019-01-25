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
import { Header, Icon, Message, Table, Button } from 'semantic-ui-react';

import config from './.samples.config';

export default withAuth(class Details extends Component {
  constructor(props) {
    super(props);
    this.state = { userDetails: null, failed: null };
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this); 
  }

  componentDidMount() {
    this.getDetails();
  }

  async getDetails() {
    if (!this.state.userDetails) {
      try {
        const user = await this.props.auth.getUser();
        const accessToken = await this.props.auth.getAccessToken();
        const baseUrl = config.resourceServer.usersUrl;
        const endpoint = `${baseUrl}/${user.sub}/details`;

        /* global fetch */
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status !== 200) {
          this.setState({ failed: true });
          return;
        }

        const userDetails = await response.json();
        this.setState({ userDetails, failed: false });

      } catch (err) {
        this.setState({ failed: true });
        /* eslint-disable no-console */
        console.error(err);
      }
    }
  }

  async handlePasswordChange() {
    let path = '/PasswordChange';
    this.props.history.push(path);
  }

  async handleEdit() {
    return;
  }

  render() {
    const possibleErrors = [
      'Your resource server example is using the same Okta authorization server (issuer) that you have configured this React application to use.',
    ];
    return (
      <div>
        <Header as="h1"><Icon name="mail outline" /> My Profile from Backend</Header>
        <Button.Group>
          <Button onClick={() => {this.handleEdit()}}>Edit Profile</Button>
          <Button onClick={()=> {this.handlePasswordChange()}}>Change Password</Button>
        </Button.Group>
        {
          this.state.failed === true &&
          <Message error header="Failed to fetch profile.  Please verify the following:" list={possibleErrors} />
        }
        {this.state.userDetails && !this.state.failed &&
          <Table fixed>
            <Table.Header>
              <Table.HeaderCell>Property</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
            </Table.Header>

            <Table.Body>
              {this.state.userDetails.map(item => 
                	<Table.Row key={item.id}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.value}</Table.Cell>
                  </Table.Row> 
                )}
            </Table.Body>
          </Table>
        }
      </div>
    );
  }
});
