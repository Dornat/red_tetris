import React from 'react';
import Field from "./Field";
import {useState, useEffect} from 'react';
import {createField} from "../utils/createField";

const EnemyField = (props) => {
    return (
        <div className="enemy-field">
            <Field field={props.field}/>
        </div>
    );
};

export default EnemyField;