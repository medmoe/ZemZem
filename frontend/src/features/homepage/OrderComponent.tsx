import React from 'react'

interface PropTypes {
    distance: string,
}

export function OrderComponent ({distance}: PropTypes){
    return (
        <p>{distance} Km away.</p>
    )
}