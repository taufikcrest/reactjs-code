import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export class Searchfield extends PureComponent {
  static defaultProps = {
    baseClassName: "Searchfield",
    onChange: () => { },
    onTypingdone: () => { }
  }

  constructor(props) {
    super(props);

    this.timer = null;
    const { value = "" } = this.props;

    this.state = {
      value
    };

    [
      "_handleChange"
    ].map(fn => (this[fn] = this[fn].bind(this)));
  }

  _handleChange() {
    const { value } = this.state;
    const { onChange, onTypingdone } = this.props;

    typeof onChange === "function" && onChange(value);

    clearTimeout(this.timer);
    typeof onTypingdone === "function" && (this.timer = setTimeout(() => onTypingdone(value), 500));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value });
    }
  }

  render() {
    const { value } = this.state;
    const {
      baseClassName,
      className,
      placeholder = "Say or type anything here...",
      onClear,
      noBorder
    } = this.props;

    return (
      <div className={classNames({ [baseClassName]: true, [`${baseClassName}--active`]: value && !noBorder }, "clearfix", className)} >
        {!value && <i className={classNames({ [`${baseClassName}__icon ${baseClassName}__search`]: true }, "icon fal fa-search ")} />}
        {value && <span className={classNames({ [`${baseClassName}__icon ${baseClassName}__clear`]: true }, "icon fas fa-times-circle")} onClick={onClear} />}

        <input
          className={classNames({ [`${baseClassName}__input`]: true }, "caption caption--lighten rounded")}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => this.setState({ value: e.target.value }, this._handleChange)}
        />

        <i className={classNames({ [`${baseClassName}__icon ${baseClassName}__mic`]: true, }, "icon fal fa-microphone ")} />
      </div>
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }
}

Searchfield.propTypes = {
  baseClassName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onTypingdone: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
};

export default Searchfield;
