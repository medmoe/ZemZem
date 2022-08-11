import React, {CSSProperties} from 'react'

export interface PropTypes {
    content: string;
    cssProperties: CSSProperties;
}


export const Button = ({content, cssProperties}: PropTypes) => {
    return (
        <button style={cssProperties}>{content}</button>
    )
}