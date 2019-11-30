import React from 'react';
import Cell from './Cell';

const Field = ({field}) => {
    return (
        <div className="field">
            {field.map(
                row => row.map(
                    (cell, x) => <Cell key={x} type={cell[0]}/>
                )
            )}
        </div>
    );
};

export default Field;
