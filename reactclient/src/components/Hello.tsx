import * as React from "react";
import * as style from './Hello.scss';

export interface HelloProps { compiler: string; framework: string; }

export class Hello extends React.Component<HelloProps, {}> {
    render() {
        return <div className={style.stuff} >This is where all the magic 
        single page goodies are going to be. Using {this.props.framework}!</div>;
    }
}