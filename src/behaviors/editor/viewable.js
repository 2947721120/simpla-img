const POPOUT_GUTTER = 8;
const MIN_SIZE = {
  width: 180,
  height: 130
};

export default {
  observers: [
    '_fitWithinConstraints(width, height)',
    '_popIfOutsideViewport(top, left, width, height, visible)'
  ],

  /**
   * Ensure bounds fit within size constraints
   * @param  {Number} width  Value of width
   * @param  {Number} height Value of height
   * @return {undefined}
   */
  // TODO: Animate constraint change, to make
  // image appear to scale/pop out of old position
  _fitWithinConstraints(width, height) {
    let { width: minWidth, height: minHeight } = MIN_SIZE,
        scale = (direction, value) => {
          let isWidth = direction === 'width',
              changedValue = isWidth ? width : height,
              scaledBound = isWidth ? 'height' : 'width',
              scaledValue = isWidth ? height : width;

          this[direction] = value;
          this[scaledBound] = scaledValue * (value / changedValue);
        };

    if (width < minWidth) {
      scale('width', minWidth);
    }

    if (height < minHeight) {
      scale('height', minHeight);
    }

    if (width > window.innerWidth) {
      scale('width', window.innerWidth);
    }

    if (height > window.innerHeight) {
      scale('height', window.innerHeight);
    }
  },

  /**
   * Translate bounds back into viewport if any are outside it
   * @param  {Object} bounds   Value of the bounds property
   * @param  {Boolean} visible Value of the visible property
   * @return {undefined}
   */
  _popIfOutsideViewport(top, left, width, height, visible) {
    let { innerWidth: viewportWidth, innerHeight: viewportHeight } = window,
        translateX = 0,
        translateY = 0;

    if (left < 0) {
      translateX = Math.abs(left) + POPOUT_GUTTER;
    } else if (left > viewportWidth - width) {
      translateX = -(left - (viewportWidth - width) + POPOUT_GUTTER);
    }

    if (top < 0) {
      translateY = Math.abs(top) + POPOUT_GUTTER;
    } else if (top > viewportHeight - height) {
      translateY = -(top - (viewportHeight - height) + POPOUT_GUTTER);
    }

    // Transform transitioned with CSS
    this.style.transform = visible ? `translate(${translateX}px, ${translateY}px)` : '';
  }
}