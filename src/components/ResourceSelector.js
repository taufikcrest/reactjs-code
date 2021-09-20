import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import _ from "lodash";

import { SidebarPanel, Input, Select } from "../components/common/controls";
import { GET_RESOURCES } from "../graphql/queries/appointments";


class ResourceSelector extends PureComponent {
  static defaultProps = {
    value: "",
    onChange: () => { }
  }

  constructor(props) {
    super(props);

    this.state = { isOpen: false };

    [
      "_renderInput",
      "_handleChange",
      "_renderSidebar"
    ].map((fn) => this[fn] = this[fn].bind(this));

  }

  _handleChange(value = "") {
    const { onChange } = this.props;
    typeof onChange === "function" && onChange(value);
  }

  _renderInput() {
    const { value } = this.props;
    const label = _.isEmpty(value) ? "" : (value.label || value.value || value);

    return (
      <Input
        id="ResourceSelector"
        label="Room"
        value={label}
        onClick={() => this.setState({ isOpen: true })}
        // onChange={this._handleChange}
        onChange={() => { }}
        onClear={this._handleChange}
      />
    )
  }

  _renderSidebar() {
    const { onClose, match: { params: { locationId } }, value = "" } = this.props;
    const { isOpen } = this.state;

    return (
      <SidebarPanel
        className="Room__selector"
        headerClassName="border-0"
        bodyClassName="py-2 px-5"
        actor="sidebar"
        title="Rooms"
        isOpen={isOpen}
        onClose={() => this.setState({ isOpen: false }, onClose)}
      >
        <Query
          fetchPolicy="cache-and-network"
          query={GET_RESOURCES}
          variables={{ locationId }}
        >
          {({ loading, data, error, refetch }) => {
            if (loading) return "Rooms are loading...";
            if (error) return (<p className="selector px-2 my-0 rounded" onClick={() => refetch()} >Error in getting rooms, click to retry.</p>)

            const { user: { locations: { 0: { resources = [] } } } } = data;

            return (
              <Select
                entity="Room"
                options={(resources).map(({ id, name }) => ({ value: id, label: name }))}
                value={value}
                onChange={this._handleChange}
              />
            )
          }}
        </Query>

      </SidebarPanel>
    )
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classNames(className)}>
        {this._renderInput()}
        {this._renderSidebar()}
      </div>
    );
  }
}

ResourceSelector.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withRouter(ResourceSelector);