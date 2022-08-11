import React, {useState} from 'react'
import Star from './../lib/Star'
import styles from './SatisfactionForm.module.css'
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectSatisfactionFormData, updateSatisfactionFormData} from "../homepage/homeSlice";

interface PropTypes {
    submitFeedback: (event: React.FormEvent) => void;
    statement: string;
}

export function SatisfactionForm({submitFeedback, statement}: PropTypes) {
    const [stars, setStars] = useState<number>(0);
    const satisfactionFormData = useAppSelector(selectSatisfactionFormData);
    const dispatch = useAppDispatch()
    const updateColor = (event: React.MouseEvent) => {
        const target = event.target as HTMLElement
        setStars(+target.id)
        dispatch(updateSatisfactionFormData({...satisfactionFormData, stars: +target.id + 1}))
    }
    return (
        <div>
            <form className={styles.satisfaction_form}>
                <p>Rate your experience</p>
                <div className={styles.stars}>
                    {Array(5).fill(null).map((elem, id) => {
                        if (id > stars) {
                            return <Star updateColor={updateColor}
                                         id={id}
                                         key={id}
                                         style={{filter: "invert(100%)"}}/>
                        } else {
                            return <Star updateColor={updateColor}
                                         id={id}
                                         key={id}
                                         style={{filter: "invert(79%) sepia(87%) saturate(2647%) hue-rotate(351deg) brightness(98%) contrast(106%)"}}/>
                        }
                    })}
                </div>
                <input type="checkbox" id="wasDelivered" name="wasDelivered" onChange={() => {
                    dispatch(updateSatisfactionFormData({
                        ...satisfactionFormData,
                        isDelivered: !satisfactionFormData.isDelivered
                    }))
                }}/>
                <label htmlFor="wasDelivered">{statement}</label>
                <input type="text" placeholder="Add a comment" name="comment" onChange={(event) => {
                    dispatch(updateSatisfactionFormData({...satisfactionFormData, comment: event.target.value}))
                }}/>
                <input type="submit" value="Send to ZemZem" onClick={submitFeedback} data-key={stars}/>
            </form>
        </div>
    )
}