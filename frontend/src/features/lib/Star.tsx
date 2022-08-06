import React from 'react'
import styles from './Star.module.css';
import star from './../../assets/star.png'
interface PropTypes {
    updateColor: (event: React.MouseEvent) => void
    id: number
    style: React.CSSProperties
}
const Star = ({updateColor, id, style}: PropTypes) => {
    return (
        <div className={styles.star_container}>
            <img src={star} alt="star" onClick={updateColor} id={id+""} style={style}/>
        </div>
    )
}

export default Star;