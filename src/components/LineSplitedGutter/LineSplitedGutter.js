require('./LineSplitedGutter.css');

const React = require('react');
const cn = require('classnames');

const Box = require('../Box');
const Gutter = require('../Gutter');

function LineSplitedGutter({ top, bottom, solid, dot, p }) {
  return (
    <>
      <Gutter h={top} />
      <Box p={p}>
        <i
          className={cn('devide', {
            solid: solid,
            dot: dot,
          })}
        />
      </Box>
      <Gutter h={bottom} />
    </>
  );
}

module.exports = LineSplitedGutter;
