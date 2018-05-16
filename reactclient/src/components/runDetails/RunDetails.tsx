import * as React from 'react';
import * as style from './RunDetails.scss';
import { HistoryRunDAO, VariantDAO, PublicationDAO, GeneCountsDAO } from '../../DataAccess';
import ReactEcharts from 'echarts-for-react';

declare var API_URL: string;

export interface RunDetailsProps {
    run: HistoryRunDAO;
}

export class RunDetails extends React.Component<RunDetailsProps, {}> {
    render() {
        let lastClusterApi = API_URL + 'getLastCluster';

        return <div className={style.details}>
            <div className={style.variantContainer}>
                <div><h4 className={style.sectionLabel}>Filtered Variants</h4>
                    {this.props.run && this.props.run.variants && this.props.run.variants.map((variant: VariantDAO) => {
                        let ensemblShards: string[] = variant.locus.split(',');
                        let chr: string = ensemblShards[0].slice(3);
                        let start: number = parseInt(ensemblShards[1]);
                        let ensemblUrl: string = 'https://www.ensembl.org/Homo_sapiens/Location/View?db=core;r='+chr+':'+start+'-'+(start+1);
                        return <div className={style.variantWrapper}>
                            <div className={style.identification}>
                                <a target='_blank' href={ensemblUrl}>{variant.locus}</a>
                                <a target='_blank' href={ variant.rsid && variant.rsid !== '.' ?
                                    'https://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs=' +
                                    variant.rsid.slice(2) : ''}> {variant.rsid}</a>
                            </div>
                            <div className={style.prediction}>
                                <div><span className={style.sectionLabel}>SIFT:</span> {variant.sift == null ? 'not provided' : variant.sift }</div>
                                <div> <span className={style.sectionLabel}>Polyphen:</span> {variant.polyphen == null ? 'not provided' : variant.polyphen }</div>
                            </div>
                            <div className={style.outcome}>
                                <div>
                                <span className={style.sectionLabel}>Outcome: </span>{variant.outcome ?
                                    <span className={variant.outcome === 'pathogenic' ? style.highlight : ''}>{variant.outcome}</span> :
                                    <span>unknown</span>}
                                </div>
                                <div>
                                 <span className={style.sectionLabel}>Phenotype: </span>{variant.phenotype ? <span>({variant.phenotype})</span> : <span>-</span>}
                                </div>
                            </div>
                        </div>
                    })}
                </div>
                <div>
                    <ReactEcharts
                        option={this.getChartData()}
                        notMerge={true}
                        lazyUpdate={true}
                        theme={"theme_name"}
                    />
                </div>
                <div>
                    <h4 className={style.sectionLabel}>Clustering based on filtered/nonfiltered genes:</h4>
                    <img className={style.clusterContainer} src={lastClusterApi}/>
                </div>
            </div>
            <div className={style.articleContainer}><h4 className={style.sectionLabel}>PubMed articles:</h4>
                {this.props.run && this.props.run.publications && this.props.run.publications.map((publication: PublicationDAO) => {
                    return <div>
                        <div className={style.abstract}>{publication.abstract}</div>
                        <a target='_blank' href={publication.url}>PubMed</a>
                    </div>
                })}
            </div>
        </div>
    }

    private getChartData(): any {
        let run: HistoryRunDAO = this.props.run;
        let genes: GeneCountsDAO[] = run.genecounts;
        return {
            title: {
                text: 'Top 10 most affected genes:'
            },
            tooltip: {},
            xAxis: {
                data: genes.map((gene: GeneCountsDAO) => {
                    return gene.gene;
                })
            },
            yAxis: {},
            series: [{
                name: 'genes',
                type: 'bar',
                data: genes.map((gene: GeneCountsDAO) => {
                    return gene.count;
                })
            }]
        };
    }
}
