import * as React from 'react';
import * as style from './RunDetails.scss';
import { VariantDAO } from '../../DataAccess';

export interface RunDetailsProps {
    variants: VariantDAO[];
}

export class RunDetails extends React.Component<RunDetailsProps, {}> {
    render() {
        return <div className={style.details}>
            <div>variant list</div>
            { this.props.variants.map((variant: VariantDAO) => {
                return <div>{variant.id}|{variant.locus}|{variant.phenotype}</div>
            })}
            <div>publication list</div>
            <div>charts</div>
        </div>
    }
}