import * as React from "react";
import * as style from './Hello.scss';
import { FeatureBlock } from './featureBlock/FeatureBlock';
import { Work } from './work/Work';

export interface HelloProps { isLoggedIn: boolean }

export class Hello extends React.Component<HelloProps, {}> {

    render() {
        return <div className={style.stuff}>
        <div className={style.landing}>
            <h1 className={style.title}>DNASeq Variant prioritization</h1>
        </div>
        {this.props.isLoggedIn ? 
        <Work /> : 
        <div>
            <div className={style.featureContainer}>
                <FeatureBlock click={() => {this.doStuff("div1");}} className={style.featureBlockCol1} text="What we offer"/>
                <FeatureBlock click={() => {this.doStuff("div2");}} className={style.featureBlockCol2} text="How it works" />
                <FeatureBlock click={() => {this.doStuff("div3");}} className={style.featureBlockCol3} text="About us" />
                <FeatureBlock click={() => {this.doStuff("div4");}} className={style.featureBlockCol4} text="Technical stuff" />
            </div>
            <div ref='container' className={style.parentContainer}>
                <div id="div1" className={style.stepContainer}>
                <h3>Goals</h3>
                    <p>In order to make the next step in disease treatment and prevention, our product will solve doctors' problem of choosing a mutation likely to be causing disease out of the hundreds or thousand of mutations each of us has by giving them a tool that does most of the filtering automatically.
We will know if our product works when we see analysis of genetic predispositions and targeted treatments for patients in each specialized small doctor's office.</li>
                    <li>Custom filtering based on doctors' assumption</li>
                    <li>More than 90% variants filtered out</li>
                    <li>Avoid manual filtering and human induced errors</li>
                    <li>Pathogenicity charts</li>
                    <li>Easy-to-use interface</li>
                </div>
                <div id="div2" className={style.stepContainerHidden}>
                <h3>3 easy steps:</h3>
                    <li>Register</li>
                    <li>Fill in details</li>
                    <li>Upload VCF</li>
                    <li>Manage results</li>
                </div>
                <div id="div3" className={style.stepContainerHidden}>
                    <img src="/logo.png"/>
                    <p> We are KegNOmics, a team of 5 aspiring drunk mutants that want to make genetic analysis easily accesible for doctors everywhere.</li>
                </div>
                <div id="div4" className={style.stepContainerHidden}>
                <h3>Technologies used for this awesome service</h3>
                    <li>React and Node for the frontend server</li>
                    <li>Backend written with Flask in Python</li>
                    <li>Using airflow, celery and redis for asynchronous submission of jobs</li>
                    <li>Machine learning for clustering of the genetic mutations</li>
                </div>
            </div>
        </div>
        }
        </div>;
    }
    private doStuff(divNo: any): void {
        let container: HTMLDivElement = this.refs['container'] as HTMLDivElement;
        let divEl: NodeListOf<HTMLElement> = container.querySelectorAll('div');
        for(let i: number =0; i< divEl.length; i++) {
            if(divEl[i].id==divNo){
                divEl[i].style.visibility="visible";
            }
            else{
                divEl[i].style.visibility="hidden";
            }
            
        }

    }
}