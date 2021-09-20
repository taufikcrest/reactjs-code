import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import { connect } from 'react-redux';
import { notify } from 'reapop';
import get from 'lodash/get';

import Personalize from 'components/Personalize';

// GraphQL
import { GET_DASHBOARD_DATA } from 'graphql/queries/dashboard';
import { UPDATE_OR_CREATE_LAYOUT } from 'graphql/mutations/dashboard';
import { updateSearch } from 'actions/dashboard';

class Dashboard extends Component {
  static defaultProps = {
    sites: []
  };

  constructor(props) {
    super(props);

    this.state = {
      oPersonalize: false,
    };
  }

  componentDidMount() {
    // demo for generating notifications.
    const { notify } = this.props;

    notify({
      status: 'default',
      title: 'Gift Certificate',
      message: 'Roxie Tyler used a gift certificate <b>MOCC 4177 6619 P</b>',
      dismissible: true,
      dismissAfter: 0,
      closeButton: true,
    });
  }

  render() {
    const { search, updateSearch } = this.props;
    const { oPersonalize } = this.state;

    return (
      <Query fetchPolicy="cache-and-network" query={GET_DASHBOARD_DATA} >
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;

          let { user: { locations = [], activeLayout: layout, layouts = [] } } = data;

          return (
            <div className="container dashboard">

              <Navbar
                locations={locations}
                search={search}
                onChange={(search) => updateSearch(search)}
                onClear={() => updateSearch("")}
              />

              <PButton onClick={() => this.setState({ oPersonalize: true })} />

              <Mutation mutation={UPDATE_OR_CREATE_LAYOUT} refetchQueries={[{ query: GET_DASHBOARD_DATA }]} >
                {(updateLayout) => (
                  <Personalize
                    layout={layout}
                    layouts={layouts}
                    isOpen={oPersonalize}
                    onClose={() => this.setState({ oPersonalize: false })}
                    updateLayout={(layout) => updateLayout({ variables: { layout } }).then(() => this.setState({ oPersonalize: false }))}
                  />
                )}
              </Mutation>
            </div>
          )
        }}
      </Query>
    );
  }
}

const mapStateToProps = (state) => ({
  search: get(state, "dashboard.filters.search", "")
})

const mapDispatchToProps = (dispatch) => ({
  notify: (obj) => dispatch(notify(obj)),
  updateSearch: (search) => dispatch(updateSearch(search))
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);