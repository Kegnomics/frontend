import * as React from 'react';
import * as style from './Work.scss';
import DataAccess from '../../DataAccess';

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
}

export class Work extends React.Component<WorkProps, WorkState>{

    private da: DataAccess;

    constructor(props: WorkProps) {
        super(props);
        this.state = { 
            keywords: '', 
            transmission: Transmission.Heterozygous, 
            uploadedFile: null
        };
        this.da = new DataAccess('localhost');
    }

    public render() {
        return <div className={style.container}>
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
        this.da.uploadFile(this.state.uploadedFile);
    }
}