import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Paginator from './Paginator';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

const SCORES_AMOUNT = 10;

const Score = (props) => {

    const [paginationData, setPaginationData] = useState({
        items: null,
        page: null,
        pages: null,
    });

    const [personalScore, setPersonalScore] = useState({
        highest: null,
        position: null
    });

    useEffect(() => {
        props.socket.emit('getScoreResults', {
            count: SCORES_AMOUNT,
            page: 1
        });

        props.socket.emit('getPersonalScore', {
            nickname: props.nickname,
        });

        props.socket.on('scoreResults', (data) => {
            setPaginationData({
                items: data.items,
                page: data.page,
                pages: data.pages
            });
        });

        props.socket.on('personalScore', (data) => {
            setPersonalScore({
                highest: data.highest,
                position: data.position
            });
        });

    }, []);

    const onPageClick = (page) => {

        props.socket.emit('getScoreResults', {
            count: SCORES_AMOUNT,
            page: page
        });
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
                <Paginator
                    page={paginationData.page}
                    pageCount={paginationData.pages}
                    onPageClick={onPageClick}
                />
            );
        }
    };

    const toDashboard = () => props.history.push('/');

    return (
        <div className="score__container">
            <table className="nes-table is-bordered is-centered score-table">
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

            {renderPaginator()}

            <div className="bottom__menu">
                <button className="nes-btn is-primary" onClick={toDashboard}>To Dashboard</button>
            </div>
        </div>
    );
};

Score.propTypes = {
    socket: PropTypes.object,
    history: PropTypes.object,
    nickname: PropTypes.string,
};

const mapStateToProps = (state) => {
    return {
        nickname: state.user.nickname
    };
};

export default connect(mapStateToProps, null)(withRouter(Score));