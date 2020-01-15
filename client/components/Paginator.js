import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const PORTION_SIZE = 5;

const Paginator = (props) => {

    const [items, setItems] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [portionNumber, setPortionNumber] = useState(Math.ceil(props.page / PORTION_SIZE));

    let leftBorderPage = (portionNumber - 1) * PORTION_SIZE + 1;
    let rightBorderPage = portionNumber * PORTION_SIZE;

    useEffect(() => {
        let items = [];

        for (let i = 1; i <= props.pageCount; i++) {
            items.push(i);
        }
        setItems(items);

    }, []);


    useEffect(() => {
        setLoaded(true);
    }, [items]);

    const handlePageClick = (e) => {
        let page = e.target.dataset.page;
        let currentPage = parseInt(props.page);

        if (page === 'previous') {
            if (currentPage - 1 === 0) {
                return;
            }
            page = currentPage - 1;
            if (page < leftBorderPage) {
                setPortionNumber(portionNumber - 1);
            }
        }

        if (page === 'next') {
            if (currentPage === props.pageCount) {
                return;
            }
            page = currentPage + 1;
            if (page > rightBorderPage) {
                setPortionNumber(portionNumber + 1);
            }
        }
        props.onPageClick(page);
    };

    const handlePortionChange = (e) => {
        let direction = e.target.dataset.direction;
        let maxPortion = Math.ceil(items.length / PORTION_SIZE);

        if (direction === 'previous') {
            if (portionNumber - 1 !== 0) {
                setPortionNumber(portionNumber - 1);
                props.onPageClick((portionNumber - 1) * PORTION_SIZE - PORTION_SIZE + 1);
            }
        }

        if (direction === 'next') {
            if (portionNumber !== maxPortion) {
                setPortionNumber(portionNumber + 1);
                props.onPageClick(portionNumber * PORTION_SIZE + 1);
            }
        }
    };

    return (
        <div className="paginator">
            <div className="nes-btn" data-page="previous" onClick={handlePageClick}>
                <FontAwesomeIcon icon={faAngleLeft}/>
            </div>
            { portionNumber - 1 !== 0 && <div className="nes-btn" data-direction="previous" onClick={handlePortionChange}>{'...'}</div> }
            {isLoaded && items.filter(page => page >= leftBorderPage && page <= rightBorderPage)
                .map((page, index) => {
                    return (
                        <div className={page == props.page ? 'nes-btn is-primary' : 'nes-btn'}
                             key={index}
                             data-page={page}
                             onClick={handlePageClick}>
                            {page}
                        </div>
                    );
                })
            }
            { portionNumber !== Math.ceil(items.length / PORTION_SIZE) && <div className="nes-btn" data-direction="next" onClick={handlePortionChange}>{'...'}</div>}
            <div className="nes-btn" data-page="next" onClick={handlePageClick}>
                <FontAwesomeIcon icon={faAngleRight}/>
            </div>
        </div>
    );
};

Paginator.propTypes = {
    page: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onPageClick: PropTypes.func,
    pageCount: PropTypes.number
};

export default Paginator;