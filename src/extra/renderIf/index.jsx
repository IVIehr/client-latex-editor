/* eslint-disable react/prop-types */

const RenderIf = ({ children, isTrue }) => {
  return isTrue ? children : null;
};

export default RenderIf;
