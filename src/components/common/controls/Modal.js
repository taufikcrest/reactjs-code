import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ReactModal from "react-modal";
import classNames from "classnames";

export class Modal extends PureComponent {

  static defaultProps = {
    baseClassName: "Modal",
    showCloseButton: true,
    onClose: () => { },
    customCloseButton: (null)
  }

  render() {
    const {
      baseClassName,
      portalClassName,
      overlayClassName,
      className,
      iconClassName,
      showCloseButton,
      customCloseButton,
      children,
      isOpen,
      onClose,
      center,
      ...props
    } = this.props;

    return (
      <ReactModal
        portalClassName={classNames({ [`${baseClassName}__root`]: true }, portalClassName)}
        overlayClassName={classNames({ [`${baseClassName}__overlay`]: true, [`${baseClassName}__overlay--show`]: isOpen }, overlayClassName)}
        className={classNames({ [`${baseClassName}`]: true, [`${baseClassName}--centered`]: center }, className)}
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={onClose}
        {...props}
      >
        {!center && showCloseButton && (customCloseButton || <span className={classNames({ [`${baseClassName}__close`]: true }, "icon fal fa-times", iconClassName)} onClick={() => this.props.onClose()}></span>)}
        {children}
      </ReactModal>
    )
  }
}

Modal.propTypes = {
  portalClassName: PropTypes.string,
  overlayClassName: PropTypes.string,
  baseClassName: PropTypes.string,
  showCloseButton: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  customCloseButton: PropTypes.node,
};

export default Modal;