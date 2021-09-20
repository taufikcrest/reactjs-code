import React, { PureComponent } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// custom components.
import { Separator, WidgetPlaceholder, Widget, WidgetBox, Widgets, WidgetCategory } from './components';
import { Window } from 'components/common/controls';

// plugin references
const { $ } = window; //jQuery
const Draggabilly = window.Draggabilly; //Draggabilly

class Personalize extends PureComponent {
  static defaultProps = {
    layout: {}
  };

  constructor(props) {
    super(props);

    // globals for storing the draggies.
    this.pDraggies = [];
    this.cDraggies = [];

    // globals for handling the manipulatino index for different packery items.
    this.p = null;
    this.c = null;

    this.state = {
      layout: this.props.layout,
      openWidgets: false,
      widgetConfirm: '',
      categoryConfirm: '',
      openGSettings: false,
      widgetSetting: false
    };

    [
      '_applyPlugin',
      '_updatePositions',
      '_addWidgetCategory',
      '_addWidget',
      '_deleteWidget',
      '_deleteWidgetCategory',
      '_assignWidget',
      '_handleToggle',
      '_updateLayout'
    ].map(fn => (this[fn] = this[fn].bind(this)));
  }

  componentDidMount() {
    this._applyPlugin();
  }

  componentDidUpdate() {
    setTimeout(this._applyPlugin, 0);
  }

  _renderHeader() {
    const { onClose } = this.props;

    return (
      <div className={classNames({ [`Window__header`]: true }, "col-12 border-bottom shadow-sm")}>
        <div className="row no-gutters">
          <div className="col-2">
            <i className="icon fal fa-times border-right" onClick={onClose}></i>
          </div>
          <div className="col text-center">Personalization Mode</div>
          <div className="col-2">
            <span className="icon fal fa-question-circle border-left float-right" onClick={() => { }}></span>
            <span className="icon fal fa-cog border-left float-right" onClick={() => this.setState({ openGSettings: true })}></span>
          </div>
        </div>
      </div>
    )
  }

  _applyPlugin() {
    // childrens
    $('.widgets-block.grid').each((index, child_element) => {
      // variable for storing the packery reference.
      let $child = null;

      // get child positions
      let positions = JSON.parse($(child_element).attr('data-arrangements')) || [];
      let shouldInitLayout = $(child_element).find('.widget-block.grid-item').length === positions.length;

      // if packery initialized then use existing instance
      if (typeof $(child_element).data('packery') !== 'undefined') {
        // reload the packery items.
        $child = $(child_element)
          .packery('reloadItems')
          .packery();

        // unbind the old draggies.
        _.get(this.cDraggies, index, []).forEach((draggie) => $child.packery('unbindDraggabillyEvents', draggie));
        this.cDraggies[index] = [];
      } else {
        // initialize packery
        $child = $(child_element).packery({
          itemSelector: '.widget-block.grid-item',
          columnWidth: '.child.grid-sizer',
          percentPosition: true,
          shiftPercentResize: true,
          initLayout: !shouldInitLayout // disable initial layout
        });
      }

      // init layout with saved positions
      if (shouldInitLayout) {
        $child.packery('initShiftLayout', positions, 'data-item-cid');
      }

      // make draggable
      let tmp = [];
      $child.find('.widget-block.grid-item').each((i, item) => {
        let draggie = new Draggabilly(item);
        tmp.push(draggie);
        $child.packery('bindDraggabillyEvents', draggie);
      });
      this.cDraggies[index] = tmp;

      // save drag positions on event
      $child
        .off('dragItemPositioned')
        .on('dragItemPositioned', (e, draggedItem) => {
          // update parent packery for skip the overlapping children
          $('.widgets-category.grid').packery();
        });
    });

    // parent
    $('.widgets-category.grid').each((index, element) => {
      // variable for storing the packery reference.
      let $parent = null;

      // getting the element positions
      let initPositions = JSON.parse($(element).attr('data-arrangements')) || [];
      let shouldInitLayout = $(element).find('.widget-category.grid-item').length === initPositions.length;

      // remove old instance of packery
      if (typeof $(element).data('packery') !== 'undefined') {
        // reload the packery items
        $parent = $(element)
          .packery('reloadItems')
          .packery();

        // unbind the old draggies.
        (this.pDraggies || []).forEach((draggie) => $parent.packery('unbindDraggabillyEvents', draggie));
        this.pDraggies = [];
      } else {
        // initialize packery
        $parent = $(element).packery({
          itemSelector: '.widget-category.grid-item',
          columnWidth: '.parent.grid-sizer',
          percentPosition: true,
          shiftPercentResize: true,
          initLayout: !shouldInitLayout // disable initial layout
        });
      }

      // init layout with saved positions
      if (shouldInitLayout) {
        $parent.packery('initShiftLayout', initPositions, 'data-item-pid');
      }

      // make draggable
      $parent.find('.widget-category.grid-item').each((i, item) => {
        var pDraggie = new Draggabilly(item, { handle: '.widget-category--handle' });
        this.pDraggies.push(pDraggie);
        $parent.packery('bindDraggabillyEvents', pDraggie);
      });

      // save drag positions on event
      $parent
        .off('dragItemPositioned')
        .on('dragItemPositioned', (e, draggedItem) => {
          // save new position data to the state json
          this._updatePositions();
        });
    });

    // rearrange the children
    if ($(window).width() <= 768) {
      $('.widgets-block').packery();
    }

    // rearrange the parent
    if ($(window).width() <= 1200) {
      $('.widgets-category').packery();
    }
  }

  _updatePositions() {
    let config = JSON.parse(_.get(this.state, 'layout.config', '{}'));

    // childrens's positions
    let child_positions = [];

    $('.widgets-block.grid').each(function (i, item) {
      child_positions.push({
        positions: $(item).packery('getShiftPositions', 'data-item-cid')
      });
    });

    // parent's positions
    let positions = $('.widgets-category.grid').packery('getShiftPositions', 'data-item-pid');

    // update categories's child positions
    let categories = _.get(config, 'categories', []).map((category, i) => ({ ...category, ...child_positions[i] }));

    // updating the main layout
    const _config = { ...config, ...{ categories, positions } };

    if (!_.isEqual(config, _config)) {
      this.setState({ layout: { ...this.state.layout, ...{ config: JSON.stringify(_config) } } });
    }
  }

  _addWidgetCategory(portion = 0) {
    const { categories = [], positions = [] } = JSON.parse(_.get(this.state, 'layout.config', '{}'));

    // adding category.
    categories.push({
      name: 'Blank Category',
      widgets: [
        {
          placeholder: true
        },
        {
          placeholder: true
        },
        {
          placeholder: true
        },
        {
          placeholder: true
        }
      ],
      positions: [
        { attr: '0', x: 0 },
        { attr: '1', x: 0.25 },
        { attr: '2', x: 0.5 },
        { attr: '3', x: 0.75 }
      ]
    });

    // adding position.
    let index = categories.length - 1;
    positions.splice(index, 1, { attr: `${index}`, x: `${portion}` });

    const config = JSON.stringify({ categories, positions });

    const layout = { ...this.state.layout, ...{ config } };

    this.setState({ layout }, () => {
      this._applyPlugin();
      this._updatePositions();
    });

  }

  _addWidget(i) {
    const config = JSON.parse(_.get(this.state, 'layout.config', '{}'));
    let { categories = [] } = config;
    let { widgets = [], positions = [] } = _.get(categories, i, {});

    widgets.push({ placeholder: true });

    const index = widgets.length - 1;

    positions.splice(index, 1, { attr: `${index}`, x: 0 });
    categories.splice(i, 1, { ...categories[i], ...{ widgets, positions } });

    let layout = { ...this.state.layout, ...{ config: JSON.stringify({ ...config, ...{ categories } }) } };

    this.setState({ layout }, () => {
      this._applyPlugin();
      this._updatePositions();
    });
  }

  _deleteWidget() {
    const config = JSON.parse(_.get(this.state, 'layout.config', '{}'));

    let { categories = [] } = config;
    let { widgets = [], ...rem } = _.get(categories, this.p, {});

    // remove the widget
    widgets.splice(this.c, 1);

    // update the categories
    categories.splice(this.p, 1, { ...rem, widgets });

    // prepare final layout
    const layout = { ...this.state.layout, ...{ config: JSON.stringify({ ...config, ...{ categories } }) } };

    // close the dialog first.
    this._handleToggle('widgetConfirm');

    // update the layout.
    this.setState({ layout }, () => {
      this._applyPlugin();
      this._updatePositions();
    });
  }

  _deleteWidgetCategory() {
    const config = JSON.parse(_.get(this.state, 'layout.config', '{}'));
    let { categories = [] } = config;

    categories.splice(this.p, 1);

    const layout = { ...this.state.layout, ...{ config: JSON.stringify({ ...config, ...{ categories } }) } };

    // close the dialog first.
    this._handleToggle('categoryConfirm');

    // update the layout.
    this.setState({ layout }, () => {
      this._applyPlugin();
      this._updatePositions();
    });
  }

  _handleToggle(key, callback) {
    // unset the global indexes.
    this.p = null;
    this.c = null;

    const value = this.state[key];

    // close the dialog
    this.setState({ [key]: !value }, callback);
  }

  _assignWidget(widget) {
    const config = JSON.parse(_.get(this.state, 'layout.config', '{}'));

    let { categories = [] } = config;
    let { widgets = [], ...rem } = _.get(categories, this.p, {});

    widgets.splice(this.c, 1, widget);
    categories.splice(this.p, 1, { widgets, ...rem });

    const layout = { ...this.state.layout, ...{ config: JSON.stringify({ ...config, ...{ categories } }) } };

    // applying the changes to the window.
    this.setState({ layout }, () => {
      this._applyPlugin();
      this._updatePositions();
    });
  }

  _updateLayout() {
    const { updateLayout } = this.props;
    let config = JSON.parse(_.get(this.state, 'layout.config', '{}'));
    let { categories = [], positions = [] } = config;

    // fetching only widgets from the categories.
    categories = categories.map(function ({ widgets = [], positions = [], ...rem }) {
      widgets = widgets.filter(widget => !widget.placeholder);

      // return updated object to the categories.
      return { widgets, positions, ...rem };
    });

    // removing empty categories(not having any widgets).
    categories = categories.filter(({ widgets }) => widgets.length > 0);

    // updated layout object.
    let layout = { ...this.state.layout, ...{ config: JSON.stringify({ ...config, ...{ categories, positions } }) } };

    // update layout to the parent component.
    this._handleToggle('openGSettings', () => typeof updateLayout === 'function' && updateLayout(layout));

    // save to localStorage.
    // localStorage.setItem('layout', JSON.stringify(layout));
  }

  render() {
    const { onClose, isOpen } = this.props;
    const { categories = [], positions = [] } = JSON.parse(this.state.layout) || {};

    return (
      <Window
        className="dashboard__personalize"
        header={this._renderHeader()}
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="row widgets-category grid" data-arrangements={JSON.stringify(positions)} >
          <div className="col-12 col-xl-6 parent grid-sizer" />
          {categories.map(({ name, widgets = [], positions = [] }, i) => (
            <WidgetCategory
              key={i}
              name={name}
              data-item-pid={i}
              onDelete={() => {
                this.p = i;
                this.setState({ categoryConfirm: `Are you sure you want to delete the ${name} ?` });
              }}
            >
              <Widgets data-arrangements={JSON.stringify(positions || [])}>
                {widgets.map((widget, w) => {
                  const { placeholder = false, options = {}, name } = widget;
                  const { width = 1, height = 1 } = options;

                  return (
                    <WidgetBox
                      key={w}
                      dimension={{ width, height }}
                      data-item-cid={w}
                    >
                      {placeholder ? (
                        <WidgetPlaceholder
                          onClick={() => {
                            this.p = i;
                            this.c = w;
                            this.setState({ openWidgets: true });
                          }}
                        />
                      ) : (
                        <Widget
                          {...widget}
                          onDelete={() => {
                            this.p = i;
                            this.c = w;
                            this.setState({
                              widgetConfirm: `Are you sure you want to delete the ${name} ?`
                            });
                          }}
                          onSetting={() => {
                            this.p = i;
                            this.c = w;
                            this.setState({ widgetSetting: widget });
                          }}
                        />
                      )}
                    </WidgetBox>
                  );
                })}
              </Widgets>
              <div className="row">
                <Separator onClick={() => this._addWidget(i)} />
              </div>
            </WidgetCategory>
          ))}
        </div>
      </Window>
    );
  }

  componentWillUnmount() {
    // remove child packery plugin.
    $('.widgets-block').packery('destroy');

    // remove parent packery plugin.
    $('.widgets-category').packery('destroy');
  }
}

export default Personalize;

// Note: This component uses draggabilly, just for showing the usage of jQuery plugin inside React, We can develop same using some pre-built open source react-components if available.