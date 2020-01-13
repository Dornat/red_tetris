import React from 'react';
import Music from '../Music';

const ApplicationActions = (ChildComponent) => {
    const Component = () => {
        return (
            <div>
                <div className="application__actions">
                    <Music/>
                </div>
                <ChildComponent/>
            </div>
        );
    };
    return Component;
};

export default ApplicationActions;