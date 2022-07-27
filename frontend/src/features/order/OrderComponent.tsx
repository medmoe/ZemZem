import React, {MouseEventHandler} from 'react'

interface PropTypes {
    distance: string,
    showOrderDetails: (event: React.MouseEvent<HTMLElement>) => void,
}

export function OrderComponent ({distance, showOrderDetails}: PropTypes){
    return (
        <p onClick={showOrderDetails}>{distance} Km away.</p>
    )
}