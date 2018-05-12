import * as React from 'react';
import * as style from './FeatureBlock.scss';

export interface FeatureBlockProps {
    text: string;
}

export class FeatureBlock extends React.Component<FeatureBlockProps, {}>{
    public render() {
        return <div className={style.featureBlock}>{this.props.text}</div>
    }
}