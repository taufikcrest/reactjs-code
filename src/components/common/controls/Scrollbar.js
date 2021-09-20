import React, { PureComponent } from 'react';
import classNames from "classnames";
import { Scrollbars } from 'react-custom-scrollbars';
import { SpringSystem, MathUtil } from 'rebound';

export class Scrollbar extends PureComponent {

  constructor(props, ...rest) {
    super(props, ...rest);
    this.handleSpringUpdate = this.handleSpringUpdate.bind(this);
  }

  componentDidMount() {
    this.springSystem = new SpringSystem();
    this.spring = this.springSystem.createSpring();
    this.spring.addListener({ onSpringUpdate: this.handleSpringUpdate });
  }

  componentWillUnmount() {
    this.springSystem.deregisterSpring(this.spring);
    this.springSystem.removeAllListeners();
    this.springSystem = undefined;
    this.spring.destroy();
    this.spring = undefined;
  }

  getScrollTop() {
    return this.refs.scrollbars.getScrollTop();
  }

  getScrollHeight() {
    return this.refs.scrollbars.getScrollHeight();
  }

  getHeight() {
    return this.refs.scrollbars.getHeight();
  }

  scrollTop(top) {
    const { scrollbars } = this.refs;
    const scrollTop = scrollbars.getScrollTop();
    const scrollHeight = scrollbars.getScrollHeight();
    const val = MathUtil.mapValueInRange(top, 0, scrollHeight, scrollHeight * 0.2, scrollHeight * 0.8);
    this.spring.setCurrentValue(scrollTop).setAtRest();
    this.spring.setEndValue(val);
  }

  handleSpringUpdate(spring) {
    const { scrollbars } = this.refs;
    const val = spring.getCurrentValue();
    scrollbars.scrollTop(val);
  }

  _thumbVertical({ style }) {
    return (
      <div
        className="Scrollbar__thumb"
        style={{
          ...style,
          width: "0.25rem",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "0.125rem"
        }}
      />
    )
  }

  render() {
    const { className, children, autoHeight, autoHeightMax = 250, ...props } = this.props;

    return (
      <Scrollbars
        className={classNames("Scrollbar", className, { "Scrollbar--autoHeight": autoHeight })}
        // renderTrackHorizontal={props => <div {...props} className="track-horizontal" />}
        // renderTrackVertical={props => <div {...props} className="track-vertical" />}
        // renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" />}
        // renderView={props => <div {...props} className="view" />}
        renderThumbVertical={this._thumbVertical}
        autoHeight={autoHeight}
        autoHeightMax={autoHeightMax}
        {...props}
        ref="scrollbars"
      >
        {children}
      </Scrollbars>
    );
  }
}

export default Scrollbar;