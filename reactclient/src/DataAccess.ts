export interface VariantDAO {
    id: number;
    rsid: string;
    locus: string;
    outcome: string;
    phenotype: string;
    frequency: number;
    polyphen: number;
    sift: number;
}

export interface HistoryRunDAO {
    runId: number;
    keywords: string;
    submissionTime: string;
    variants: VariantDAO[];
}

export interface GenericServerData {
    results: any[];
}

export default class DataAccess {
    
    private apiRoot: string;
    constructor(apiRoot: string) {
        this.apiRoot = apiRoot;
    }

    public getHistoricRuns(): Promise<HistoryRunDAO[]> {
        let url: string = this.apiRoot + 'jobs?user_id=123';
        return fetch(url).then((response) => {
            return response.json();
        }).then((rawJson: GenericServerData) => {
            return rawJson.results.map((data: any) => {
                return {
                    runId: data.id,
                    keywords: 'smtn',
                    submissionTime: data.timestamp,
                    variants: data.variants
                };
            });
        });
    }

    public getArticles(keywords: string): Promise<any> {
        let commaSeparatedKeywords: string = this.formKeywordArray(keywords).join(',');
        let url: string = this.apiRoot + 'pubmed?keywords=' + commaSeparatedKeywords + '&maxres=2';
        return fetch(url).then((response) => {
            return response.json();
        }).then((theJson)=> {

        });
    }

    public pollForJobDone(runId: number): Promise<any> {
        let url: string = this.apiRoot + 'jobs?user_id=123&job_id='+ runId;
        return fetch(url).then((response) => {
            return response.json();
        }).then((theJson) => {
            return theJson.job;
        });
    }

    public uploadStuff(file: File, keywords: string, runName: string): Promise<any> {
        let formData: FormData = new FormData();
        formData.append('user_id', '123');
        formData.append('runName', runName);
        formData.append('vcf', file);
        formData.append('keywords', JSON.stringify(this.formKeywordArray(keywords)));
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        return fetch(this.apiRoot + 'upload',{
            method: 'POST',
            body: formData
        }).then((response) => {
            return response.json();
        });
    }

    private formKeywordArray(keywords: string): string[] {
        let array: string[] = keywords.split(' ');
        return array;
    }
}