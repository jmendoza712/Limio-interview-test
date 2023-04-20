import React from "react";
import PropTypes from 'prop-types';

/**
 * A square in the game of tic tac toe.   Can be clicked or the square can contain a value.
 */
const Square = ({onClick, value, bgColor}) => (
    <button className="square" onClick={onClick} style={bgColor}>
        {value}
    </button>
);

Square.propTypes = {
    /**
     *  The handler for when a square is clicked
     */
    onClick: PropTypes.func,
    bgColor: PropTypes.object,
    /**
     *  The value to put in the square
     */
    value: PropTypes.string
};

export default Square;
