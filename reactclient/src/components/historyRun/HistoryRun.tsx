import * as React from 'react';
import * as style from './HistoryRun.scss';
import {HistoryRunDAO} from '../../DataAccess';

export interface HistoryRunProps {
    data: HistoryRunDAO;
    clickHandler: (runId: number) => void;
}

export class HistoryRun extends React.Component<HistoryRunProps, {}>{
    render() {
        return <div className={style.smtn}>
            <div className={style.historyContainer}>
                <span className={style.detailsSpan}>{this.props.data.runId}</span>
                <span className={style.nameSpan + ' ' + style.detailsSpan} onClick={() => {this.props.clickHandler(this.props.data.runId);}}>{this.props.data.runname}</span>
                <p className={style.dateSpan}>{this.props.data.submissionTime}</p>
            </div>
        </div>
    }
}