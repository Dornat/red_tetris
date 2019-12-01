import React from 'react';
import Field from "./Field";

const EnemyField = (props) => {
    return (
        <div className="enemy-field">
            <Field field={props.field}/>
        </div>
    );
};

export default EnemyField;