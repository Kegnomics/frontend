import * as React from 'react';
import * as style from './RunDetails.scss';
import { HistoryRunDAO, VariantDAO, PublicationDAO } from '../../DataAccess';

export interface RunDetailsProps {
    run: HistoryRunDAO;
}

export class RunDetails extends React.Component<RunDetailsProps, {}> {
    render() {
        return <div className={style.details}>
            <div className={style.variantContainer}><h4>variant list</h4>
            { this.props.run && this.props.run.variants && this.props.run.variants.map((variant: VariantDAO) => {
                return <div className={style.variantContainer}>
                    <div className={style.identification}>
                        <div>identification:</div>
                        <span>{variant.locus}</span>
                        <span> {variant.rsid}</span>
                    </div>
                    <div  className={style.prediction}>
                        <div>prediction:</div>
                        <span>sift: {variant.sift}</span>
                        <span> polyphen: {variant.polyphen}</span>
                    </div>

                    </div>
            })}
            </div>
            <div className={style.articleContainer}><h4>PubMed articles:</h4>
                { this.props.run && this.props.run.publications && this.props.run.publications.map((publication: PublicationDAO) => {
                    return <div>
                        <div className={style.abstract}>{publication.abstract}</div>
                        <a target='_blank' href={publication.url}>PubMed</a>
                    </div>
                })}
            </div>
        </div>
    }
}