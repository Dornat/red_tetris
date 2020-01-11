import React, {useEffect, useState} from 'react';
import Paginator from './Paginator';
import PropTypes from 'prop-types';

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
                <tr key={index}>
                    <td style={{textAlign: 'center'}}>{item.rank}</td>
                    <td style={{textAlign: 'center'}}>{item.nickname}</td>
                    <td style={{textAlign: 'center'}}>{item.score}</td>
                </tr>
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

            <div className="nes-table-responsive">
                <table className="nes-table is-bordered is-centered" style={{width: '-webkit-fill-available'}}>
                    <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Nickname</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderData()}
                    </tbody>
                </table>
            </div>

            {renderPaginator()}
        </div>
    );
};

export default Score;

Score.propTypes = {
    socket: PropTypes.object,
};