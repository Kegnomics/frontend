import * as React from 'react';
import * as style from './Work.scss';
import DataAccess, { HistoryRunDAO } from '../../DataAccess';
import { HistoryRun } from '../historyRun/HistoryRun';
import { RunDetails } from '../runDetails/RunDetails';

export interface FileSubmissionData {
    job_id: number;
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
    selectedRun: HistoryRunDAO;
    runName: string;
    isWorking: boolean;
    pendingRun: boolean;
}

export class Work extends React.Component<WorkProps, WorkState>{

    private da: DataAccess;
    private interval: number;

    constructor(props: WorkProps) {
        super(props);
        this.state = { 
            keywords: '', 
            transmission: Transmission.Heterozygous, 
            uploadedFile: null,
            showResults: false,
            historicResults: [],
            selectedRun: null,
            runName: '',
            isWorking: false,
            pendingRun: false
        };
        this.da = new DataAccess('http://10.10.1.31:5000/api/');
        this.da.getHistoricRuns().then((runs: HistoryRunDAO[]) => {
            this.setState({
                historicResults: runs.reverse()
            });
        });
    }

    public render() {

        return <div className={style.container}>
            <div>
                <div className={this.state.showResults ? style.button : style.button + ' ' + style.selected } onClick={this.showNewRun.bind(this)}>run</div>
                <div className={!this.state.showResults ? style.button : style.button + ' ' + style.selected } onClick={this.showResults.bind(this)}>history</div>
            </div>
            <div className={style.workContainer + ' ' + (this.state.showResults ? style.hidden : style.visible)} >
                <p>what's the suspected illness? keywords? marks?</p>
                <input className={style.keywordInput} type='text' onChange={this.onKeywordInputChange.bind(this)} />
                <p>transmission model</p>
                <select className={style.keywordInput} onChange={this.transmissionChange.bind(this)}>
                    <option>Heterozygous</option>
                    <option>Homozygous</option>
                </select>
                <p>VCF upload:</p>
                <div className={style.fileUpload}>
                    <div className={style.fileUploadOverlay}>click to upload file</div>
                    <input className={style.fileUploadControl} type='file' onChange={this.onFileUploaded.bind(this)} />
                </div>
                <p>name your run:</p>
                <input className={style.keywordInput} type='text' onChange={this.runNameChanged.bind(this)} />
                <div>
                    <div className={style.submitButton} onClick={this.onSubmit.bind(this)}>submit</div>
                    <img className={ style.spinner + ' ' + (this.state.isWorking ? style.visibleInline : style.hidden)} src='http://localhost:8080/loading_spinner.gif'/>
                </div>
            </div>
            <div className={this.state.showResults ? style.visible : style.hidden}>
            <h4>previous runs:</h4>
                {this.state.selectedRun ?
                    <div>
                        <div onClick={() => { this.setState({ selectedRun: null});}}>back</div>
                        <HistoryRun key={this.state.selectedRun.runId+'u'} isSelected={this.state.selectedRun && this.state.selectedRun.runId === this.state.selectedRun.runId} clickHandler={this.selectRun.bind(this)} data={this.state.selectedRun} />
                        <RunDetails key={this.state.selectedRun.runId+'d'} run={this.state.selectedRun} /> 
                    </div> 
                    : <div>
                        <div className={style.progress + ' ' + (this.state.pendingRun ? style.visible : style.hidden)}>you have runs in progress</div>
                        {this.state.historicResults.map((result: HistoryRunDAO) => {
                            return <HistoryRun key={result.runId+'l'} isSelected={this.state.selectedRun && this.state.selectedRun.runId === result.runId} clickHandler={this.selectRun.bind(this)} data={result} />   
                        })}
                    </div>
                    }
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

    private runNameChanged(e: any): void {
        this.setState({
            runName: e.target.value
        });
    }

    private onSubmit(): void {
        this.setState({
            isWorking: true,
            pendingRun: true
        });
        this.da.uploadStuff(this.state.uploadedFile, this.state.keywords, this.state.runName).then((data: FileSubmissionData)=> {
            this.interval = window.setInterval(() => {this.pollForJobDone(data.job_id)}, 10000);
            this.setState({
                isWorking: false,
                showResults: true
            });
        });
    }

    private showResults(): void {
        this.setState({
            showResults: true
        });
    }

    private showNewRun(): void {
        this.setState({
            showResults: false
        });
    }

    private selectRun(runId: number): void {
        this.setState({
            selectedRun: this.state.historicResults.filter((run: HistoryRunDAO) => { return run.runId == runId})[0]
        });
    }

    private pollForJobDone(runId: number): void {
        this.da.pollForJobDone(runId).then((theJson) => {
            if(theJson.done === 1) {
                window.clearInterval(this.interval);
                this.da.getHistoricRuns().then((runs: HistoryRunDAO[]) => {
                    this.setState({
                        historicResults: runs.reverse(),
                        pendingRun: false
                    });
                });
            }
        });
    }
}