import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import classNames from "classnames";

import { Scrollbar } from "../../../components/common/controls";

export class Dialog extends PureComponent {

  static defaultProps = {
    baseClassName: "Dialog",
    onClose: () => { }
  }

  render() {
    const {
      baseClassName,
      portalClassName,
      overlayClassName,
      className,
      header,
      children,
      title,
      isOpen,
      onClose,
      ...props
    } = this.props;

    return (
      <Modal
        portalClassName={classNames({ [`${baseClassName}__root`]: true }, portalClassName)}
        overlayClassName={classNames({ [`${baseClassName}__overlay`]: true, [`${baseClassName}__overlay--show`]: isOpen }, overlayClassName)}
        className={classNames({ [`${baseClassName}`]: true, [`${baseClassName}--show`]: isOpen }, "row no-gutters", className)}
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={onClose}
        {...props}
      >
        {header || (
          <div className={classNames({ [`${baseClassName}__header`]: true }, "col-12")}>
            <div className="row no-gutters border-bottom shadow-sm">
              <div className="col-2">
                <span className="icon fal fa-times border-right" onClick={onClose}></span>
              </div>
              <div className="col text-center">{title}</div>
              <div className="col-2"></div>
            </div>
          </div>
        )}
        <div className={classNames({ [`${baseClassName}__body`]: true }, "col-12")}>
          <Scrollbar autoHide>
            {children}
          </Scrollbar>
        </div>
      </Modal>
    )
  }
}

Dialog.propTypes = {
  portalClassName: PropTypes.string,
  overlayClassName: PropTypes.string,
  baseClassName: PropTypes.string,
  showCloseButton: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  customCloseButton: PropTypes.node,
};

export default Dialog;