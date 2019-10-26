import React, {useState} from 'react';

const Cell = ({type}) => {

    return (
        <div className={type === 0 ? 'cell' : 'cell filled'}>
        </div>
    );
};

export default Cell;
