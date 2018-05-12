import * as React from 'react';
import * as style from './HistoryRun.scss';
import {HistoryRunDAO} from '../../DataAccess';

export interface HistoryRunProps {
    data: HistoryRunDAO;
    clickHandler: (runId: number) => void;
}

export class HistoryRun extends React.Component<HistoryRunProps, {}>{
    render() {
        return <div className={style.smtn} onClick={() => {this.props.clickHandler(this.props.data.runId);}}>
            {this.props.data.runId}|{this.props.data.keywords}|{this.props.data.submissionTime}
        </div>
    }
}