import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { Scrollbar } from "../../../components/common/controls";

export class SidebarPanel extends PureComponent {
  static defaultProps = {
    baseClassName: "SidebarPanel",
    headerClassName: "",
    bodyClassName: "px-5 py-3 h-100",
    actor: "auto",
    header: null,
    right: true
  }

  constructor(props) {
    super(props);
    this.body = null;
  }

  render() {
    const { baseClassName, headerClassName, bodyClassName, actor, className, title = "", isOpen = false, onClose, right, header, children } = this.props;

    return (
      <div className={classNames({ [`${baseClassName}__root`]: true, [`${baseClassName}--open`]: isOpen, [`${baseClassName}--${actor}`]: actor }, className)}>
        <div className={classNames({ [`${baseClassName}__overlay`]: true })} onClick={onClose} />

        <div className={classNames({ [baseClassName]: true, [`${baseClassName}--right`]: right }, "row no-gutters")}>
          {header || (
            <div className={classNames({ [`${baseClassName}__header`]: true }, "col-12 border-bottom text-center", headerClassName)}>
              <div className="row no-gutters">
                <div className="col-2">
                  <span className={classNames({ [`${baseClassName}__header__close`]: true }, "icon fal fa-times")} onClick={onClose} />
                </div>
                <div className="col-8 text-center">
                  <span className="title title--lg m-0">{title}</span>
                </div>
              </div>
            </div>
          )}
          <div className={classNames({ [`${baseClassName}__body`]: true }, "col-12")}>
            <Scrollbar autoHide>
              <div className={classNames(bodyClassName)}>
                {children}
              </div>
            </Scrollbar>
          </div>
        </div>
      </div >
    );
  }
}

SidebarPanel.propTypes = {
  baseClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  actor: PropTypes.string,
  right: PropTypes.bool,
};

export default SidebarPanel;