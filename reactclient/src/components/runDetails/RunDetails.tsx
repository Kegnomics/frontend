import * as React from 'react';
import * as style from './RunDetails.scss';
import { HistoryRunDAO, VariantDAO, PublicationDAO } from '../../DataAccess';
import ReactEcharts from 'echarts-for-react';

export interface RunDetailsProps {
    run: HistoryRunDAO;
}

export class RunDetails extends React.Component<RunDetailsProps, {}> {
    render() {
        return <div className={style.details}>
            <div className={style.variantContainer}>
                <div><h4>filtered variants</h4>
                    {this.props.run && this.props.run.variants && this.props.run.variants.map((variant: VariantDAO) => {
                        return <div className={style.variantWrapper}>
                            <div className={style.outcome}>
                                {variant.outcome ?
                                    <div className={variant.outcome === 'pathogenic' ? style.highlight : ''}>{variant.outcome}</div> :
                                    <div>unknown</div>}
                                {variant.phenotype ? <div>({variant.phenotype})</div> : <div>-</div>}
                            </div>
                            <div className={style.identification}>
                                <span>{variant.locus}</span>
                                <a target='_blank' href={ variant.rsid && variant.rsid !== '.' ?
                                    'https://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs=' +
                                    variant.rsid.slice(2) : ''}> {variant.rsid}</a>
                            </div>
                            <div className={style.prediction}>
                                <span>sift: {variant.sift}</span>
                                <span> polyphen: {variant.polyphen}</span>
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
            </div>
            <div className={style.articleContainer}><h4>PubMed articles:</h4>
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
        return {
            title: {
                text: 'top 5 most affected genes:'
            },
            tooltip: {},
            xAxis: {
                data: ["BCL2", "BRCA2", "NPTN", "BDNF", "DHFR"]
            },
            yAxis: {},
            series: [{
                name: 'genes',
                type: 'bar',
                data: [5, 20, 36, 10, 10]
            }]
        };
    }
}