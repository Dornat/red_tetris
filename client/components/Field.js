import React, {useState} from 'react';
import {connect} from "react-redux";
import Cell from './Cell';

const Field = ({field}) => {

    console.log(field);
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
