import React, {useEffect, useState} from 'react';
import Paginator from './Paginator';

const SCORES_AMOUNT = 3;

const Score = (props) => {

    const [paginationData, setPaginationData] = useState({
        items: null,
        page: null,
        pages: null
    });

    useEffect(() => {
        props.socket.emit('getScoreResults', {
            count: SCORES_AMOUNT,
            page: 1
        });

        props.socket.on('scoreResults', (data) => {

            setPaginationData({
                items: data.items,
                page: data.page,
                pages: data.pages
            });
        });
    }, []);

    const pageChange = () => {

    };

    const renderData = () => {
        if (paginationData.items !== null && paginationData.items.length) {
            return paginationData.items.map((item, index) => (
                <div className="score__row" key={index}>
                    <div className="score__column">
                        <span>{item.rank}</span>
                    </div>
                    <div className="score__column">
                        <span>{item.nickname}</span>
                    </div>
                    <div className="score__column">
                        <span>{item.score}</span>
                    </div>
                </div>
            ));
        }
    };

    const renderPaginator = () => {
        if (paginationData.pages && paginationData.page) {
            return (
                <Paginator currentPage={paginationData.pages} pages={paginationData.pages} pageChange={pageChange}/>
            );
        }
    };

    return (
        <div className="score__container">
            <div className="score__head">
                <div className="score__value">
                    <p>Highest score: 620</p>
                </div>
                <div className="score__position">
                    <p>Your position: 24 / 234</p>
                </div>
            </div>
            <div className="score__table-wrap">
                <div className="score__table">
                    <div className="score-table__head score__row">
                        <div className="score__column">
                            <span>Rank</span>
                        </div>
                        <div className="score__column">
                            <span>Nickname</span>
                        </div>
                        <div className="score__column">
                            <span>Score</span>
                        </div>
                    </div>
                    { renderData() }
                </div>
            </div>

            { renderPaginator() }
        </div>
    )
};

export default Score;