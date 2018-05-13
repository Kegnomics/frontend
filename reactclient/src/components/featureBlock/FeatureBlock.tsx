import * as React from 'react';
import * as style from './FeatureBlock.scss';

// import 'bootstrap/dist/css/bootstrap.css';

export interface FeatureBlockProps {
    text: string;
    className: string;
}

export class FeatureBlock extends React.Component<FeatureBlockProps, {}>{
    public render() {
        this.props.className

        return <div className={[style.featureBlock, this.props.className].join(' ')}><span>{this.props.text}</span></div>
    }
}