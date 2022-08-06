import React,{useState} from 'react'
import Star from './../lib/Star'
import styles from './SatisfactionForm.module.css'

interface PropTypes {
    submitFeedback: (event: React.FormEvent) => void
}

export function SatisfactionForm({submitFeedback}: PropTypes) {
    const [stars, setStars] = useState<number>(0);
    const updateColor = (event: React.MouseEvent) => {
        const target = event.target as HTMLElement
        setStars(+target.id)
    }
    return (
        <div>
            <form className={styles.satisfaction_form}>
                <p>Rate your experience</p>
                <div className={styles.stars}>
                    {Array(5).fill(null).map((elem, id) => {
                        if (id > stars){
                            return <Star updateColor={updateColor}
                                         id={id}
                                         key={id}
                                         style={{filter: "invert(100%)"}}/>
                        }else{
                            return <Star updateColor={updateColor}
                                         id={id}
                                         key={id}
                                         style={{filter: "invert(79%) sepia(87%) saturate(2647%) hue-rotate(351deg) brightness(98%) contrast(106%)"}}/>
                        }
                    })}
                </div>
                <input type="text" placeholder="Add a comment"/>
                <input type="submit" value="Send to ZemZem" onClick={submitFeedback}/>
            </form>
        </div>
    )
}