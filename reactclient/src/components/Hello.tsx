import * as React from "react";
import * as style from './Hello.scss';
import { FeatureBlock } from './featureBlock/FeatureBlock';
import { Work } from './work/Work';

export interface HelloProps { isLoggedIn: boolean }

export class Hello extends React.Component<HelloProps, {}> {

    render() {
        return <div className={style.stuff}>
        <div className={style.landing}>
            <h1 className={style.title}>Variant prioritization</h1>
        </div>
        {this.props.isLoggedIn ? 
        <Work /> : 
        <div>
            <div className={style.featureContainer}>
                <FeatureBlock className={style.featureBlockCol1} text="quickly annotate" />
                <FeatureBlock className={style.featureBlockCol2} text="automatically prioritize" />
                <FeatureBlock className={style.featureBlockCol3} text="custom vizualizations" />
                <FeatureBlock className={style.featureBlockCol4} text="scientific papers" />
            </div>
            <div className={style.stepContainer}>
            <h3>4 easy steps:</h3>
                <li>register</li>
                <li>fill in details</li>
                <li>upload VCF</li>
                <li>manage results</li>
            </div>
        </div>
        }
        </div>;
    }
}