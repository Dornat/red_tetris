import React, {useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';

const Paginator = (props) => {

    useEffect(() => {
        console.log('HERE I AM');
    }, []);

    return (
        <div className="paginator">
            <div className="paginator__row">
                <div className="pagination__page-btn">
                    <button type="button" className="nes-btn">
                        <FontAwesomeIcon icon={faAngleLeft}/>
                    </button>
                </div>
                <div className="pagination__page-btn">
                    <button type="button" className="nes-btn is-primary">1</button>
                </div>
                <div className="pagination__page-btn">
                    <button type="button" className="nes-btn">2</button>
                </div>
                <div className="pagination__page-btn">
                    <button type="button" className="nes-btn">3</button>
                </div>
                <div className="pagination__page-btn">
                    <button type="button" className="nes-btn">...</button>
                </div>
                <div className="pagination__page-btn">
                    <button type="button" className="nes-btn">7</button>
                </div>
                <div className="pagination__page__btn">
                    <button type="button" className="nes-btn">
                        <FontAwesomeIcon icon={faAngleRight}/>
                    </button>
                </div>
            </div>
        </div>
    );

};

export default Paginator;