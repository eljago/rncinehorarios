
import React from 'react';

const {
  Component,
  PropTypes,
} = React;

function createAppNavigationContainer(ComponentClass) {
  const key = '_yourAppNavigationContainerNavigateCall';

  class Container extends Component {
    static contextTypes = {
      [key]: PropTypes.func,
    };

    static childContextTypes = {
      [key]: PropTypes.func.isRequired,
    };

    static propTypes = {
      navigate: PropTypes.func,
    };

    getChildContext(): Object {
      return {
        [key]: this.context[key] || this.props.navigate,
      };
    }

    render(): React.Element {
      const navigate = this.context[key] || this.props.navigate;
      return <ComponentClass {...this.props} navigate={navigate} />;
    }
  }

  return Container;
}

export default createAppNavigationContainer;
