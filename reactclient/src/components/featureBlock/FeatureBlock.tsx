import * as React from 'react';
import * as style from './FeatureBlock.scss';

// import 'bootstrap/dist/css/bootstrap.css';

export interface FeatureBlockProps {
    text: string;
    className: string;
    click?: () => void;
}

export class FeatureBlock extends React.Component<FeatureBlockProps, {}>{
    public render() {
        this.props.className

        return <div onClick={this.props.click} className={[style.featureBlock, this.props.className].join(' ')}><span>{this.props.text}</span></div>
    }
}