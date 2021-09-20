import React from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import Chartjs from 'chart.js';

function Chart(props) {
  const el = useRef(null);
  const chart = useRef(null);

  useEffect(() => {
    chart.current = new Chartjs((el.current).getContext('2d'), props.config);

    return () => {
      chart.current.destroy();
    }
  });

  return (
    <canvas
      id="chart"
      className={classNames(props.className)}
      ref={el}
    />
  )
}

Chart.propTypes = {
  config: PropTypes.object.isRequired
};

export default Chart;