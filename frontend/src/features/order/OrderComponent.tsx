import React, {MouseEventHandler} from 'react'

interface PropTypes {
    distance: string,
    id: number,
    showOrderDetails: (event: React.MouseEvent<HTMLElement>) => void,
}

export function OrderComponent ({distance, showOrderDetails, id}: PropTypes){
    return (
        <p onClick={showOrderDetails} id={id+""}>{distance} Km away.</p>
    )
}