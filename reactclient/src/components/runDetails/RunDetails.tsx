import * as React from 'react';
import * as style from './RunDetails.scss';
import { HistoryRunDAO, VariantDAO } from '../../DataAccess';

export interface RunDetailsProps {
    run: HistoryRunDAO;
}

export class RunDetails extends React.Component<RunDetailsProps, {}> {
    render() {
        return <div className={style.details}>
            <div>variant list</div>
            { this.props.run && this.props.run.variants.map((variant: VariantDAO) => {
                return <div>{variant.id}|{variant.locus}|{variant.phenotype}</div>
            })}
            <div>publication list</div>
            <div>charts</div>
        </div>
    }
}