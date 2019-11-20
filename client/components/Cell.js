import React, {useState} from 'react';

const Cell = ({type}) => {

    return (
        <div className={type === 0 ? 'cell' : 'cell filled-for-type-' + type}>
        </div>
    );
};

export default React.memo(Cell);
