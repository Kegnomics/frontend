import * as React from 'react';
import * as style from './Work.scss';
import DataAccess, { HistoryRunDAO } from '../../DataAccess';
import { HistoryRun } from '../historyRun/HistoryRun';
import { RunDetails } from '../runDetails/RunDetails';

declare var API_URL: string;
declare var FRONTEND_URL: string;

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
    fileUploadDialog: JSX.Element;
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
            fileUploadDialog: <div>Click to Upload File</div>,
            showResults: false,
            historicResults: [],
            selectedRun: null,
            runName: '',
            isWorking: false,
            pendingRun: false
        };
        console.log(API_URL);
        this.da = new DataAccess(API_URL);
        this.da.getHistoricRuns().then((runs: HistoryRunDAO[]) => {
            this.setState({
                historicResults: runs.reverse()
            });
        });
    }

    public render() {
        let spinnerUrl = FRONTEND_URL + '/loading_spinner.gif';
        return <div className={style.container}>
            <div>
                <div className={this.state.showResults ? style.button : style.button + ' ' + style.selected } onClick={this.showNewRun.bind(this)}>Run</div>
                <div className={!this.state.showResults ? style.button : style.button + ' ' + style.selected } onClick={this.showResults.bind(this)}>History</div>
            </div>
            <div className={style.workContainer + ' ' + (this.state.showResults ? style.hidden : style.visible)} >
                <p className={style.inputLabel}>What's the suspected illness? Keywords? Marks?</p>
                <input className={style.keywordInput} type='text' onChange={this.onKeywordInputChange.bind(this)} />
                <p className={style.inputLabel}>Transmission Model</p>
                <select className={style.keywordInput} onChange={this.transmissionChange.bind(this)}>
                    <option>Heterozygous</option>
                    <option>Homozygous</option>
                </select>
                <p className={style.inputLabel}>VCF Upload:</p>
                <div className={style.fileUpload}>
                    <div className={style.fileUploadOverlay}>{this.state.fileUploadDialog}</div>            
                    <input className={style.fileUploadControl} type='file' onChange={this.onFileUploaded.bind(this)} />
                </div>
                <p className={style.inputLabel}>Name Your Run:</p>
                <input className={style.keywordInput} type='text' onChange={this.runNameChanged.bind(this)} />
                <div>
                    <div className={style.submitButton} onClick={this.onSubmit.bind(this)}>Submit</div>
                    <img className={ style.spinner + ' ' + (this.state.isWorking ? style.visibleInline : style.hidden)} src={spinnerUrl} />
                </div>
            </div>
            <div className={this.state.showResults ? style.visible : style.hidden}>
                {this.state.selectedRun ?
                    <div>
                        <div onClick={() => { this.setState({ selectedRun: null});}} className={style.submitButton}> Back</div>
                        <HistoryRun key={this.state.selectedRun.runId+'u'} isSelected={this.state.selectedRun && this.state.selectedRun.runId === this.state.selectedRun.runId} clickHandler={this.selectRun.bind(this)} data={this.state.selectedRun} />
                        <RunDetails key={this.state.selectedRun.runId+'d'} run={this.state.selectedRun} /> 
                    </div> 
                    : <div>
                        <h4 className={style.inputLabel}>Previous runs:</h4>
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

        let targetFile = e.target.files[0];
        let fileUploadPrompt = <div> Selected File:  <b>{targetFile.name}</b>. Click to select another file. </div>

        console.log(targetFile);
        this.setState({
            uploadedFile: targetFile,
            fileUploadDialog: fileUploadPrompt
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
