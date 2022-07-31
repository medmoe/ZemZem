import React from 'react';
import styles from './User.module.css'

type IProps = {
    message:string;
}

export function Banner(props:IProps){
    return(
        <div className={styles.banner}>
            <h4>{props.message}</h4>
        </div>
    )
}