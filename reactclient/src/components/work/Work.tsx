import * as React from 'react';
import * as style from './Work.scss';
import DataAccess, { HistoryRunDAO } from '../../DataAccess';
import { HistoryRun } from '../historyRun/HistoryRun';

export interface FileSubmissionData {
    runId: number;
}

export enum Transmission {
    Heterozygous,
    Homozygous
}

export interface WorkProps {

}

export interface WorkState {
    keywords: string;
    transmission: Transmission;
    uploadedFile: File;
    showResults: boolean;
    historicResults: HistoryRunDAO[];
}

export class Work extends React.Component<WorkProps, WorkState>{

    private da: DataAccess;

    constructor(props: WorkProps) {
        super(props);
        this.state = { 
            keywords: '', 
            transmission: Transmission.Heterozygous, 
            uploadedFile: null,
            showResults: false,
            historicResults: []
        };
        this.da = new DataAccess('http://35.234.120.86:5000/api/');
        this.da.getHistoricRuns().then((runs: HistoryRunDAO[]) => {
            this.setState({
                historicResults: runs
            });
        });
    }

    public render() {
        return <div className={style.container}>
            <button type='button' onClick={this.toggleResults.bind(this)} >{this.state.showResults ? 'new run' : 'results'}</button>
            <div className={this.state.showResults ? style.hidden : style.visible} >
                <p>What's the suspected illness? keywords? marks?</p>
                <input className={style.maxWidth} type='text' onChange={this.onKeywordInputChange.bind(this)} />
                <p>Transmission model</p>
                <select className={style.maxWidth} onChange={this.transmissionChange.bind(this)}>
                    <option>Heterozygous</option>
                    <option>Homozygous</option>
                </select>
                <p>VCF upload:</p>
                <input className={style.maxWidth} type='file' onChange={this.onFileUploaded.bind(this)} />
                <input type='button' value='submit query' onClick={this.onSubmit.bind(this)}/>
            </div>
            <div className={this.state.showResults ? style.visible : style.hidden}>
                <div>a list of historic runs</div>
                {this.state.historicResults.map((result: HistoryRunDAO) => {
                    return <HistoryRun key={result.runId} data={result} />   
                })}
                <div>details about a chosen run</div>
            </div>
        </div>
    }

    private onKeywordInputChange(e: any): void {
        this.setState({
            keywords: e.target.value
        });
    }

    private onFileUploaded(e: any): void {
        if(e.target.files.length < 1){
            return;
        }

        this.setState({
            uploadedFile: e.target.files[0]
        });
    }

    private transmissionChange(e: any): void {
        this.setState({ 
            transmission: e.target.value 
        });
    }

    private onSubmit(): void {
        // this.da.getArticles(this.state.keywords);
        this.da.uploadStuff(this.state.uploadedFile, this.state.keywords).then((data: FileSubmissionData)=> {
            // add a new pending run
            // go to the details tab
            this.setState({
                showResults: true
            })
        });
    }

    private toggleResults(): void {
        this.setState({
            showResults : !this.state.showResults
        });
    }
}