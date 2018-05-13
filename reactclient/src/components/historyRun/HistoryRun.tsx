import * as React from 'react';
import * as style from './HistoryRun.scss';
import {HistoryRunDAO} from '../../DataAccess';

export interface HistoryRunProps {
    data: HistoryRunDAO;
    clickHandler: (runId: number) => void;
    isSelected: boolean;
}

export class HistoryRun extends React.Component<HistoryRunProps, {}>{
    render() {
        return <div className={style.smtn + ' ' + (this.props.isSelected ? style.isSelected : '')}>
            <div className={style.historyContainer + ' ' + (this.props.data.done === 0 ? style.historyContainerPending : style.historyContainerDone)}>
                <span className={style.detailsSpan}>{this.props.data.runId}</span>
                <span className={style.nameSpan + ' ' + style.detailsSpan} onClick={() => {!this.props.isSelected && this.props.clickHandler(this.props.data.runId);}}>{this.props.data.runname}</span>
                <p className={style.dateSpan}>{this.props.data.submissionTime}</p>
            </div>
        </div>
    }
}