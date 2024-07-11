import React, { useEffect } from 'react';
import "./Title.css";

interface TitleProps {
    titleName: string;
    children?: React.ReactNode
}

const Title: React.FC<TitleProps> = (props: React.PropsWithChildren<TitleProps>) => {
    const { titleName, children } = props

    useEffect(() => {
        document.title = titleName  //To change tab tiitle on each page change
    }, [])


    return (
        <div className='titleWrapper'>
            <h2 style={{ margin: 0 }}>
                <strong>{titleName}</strong>
            </h2>

            <div className='childrenWrapper'>
                {children}
            </div>
        </div>
    )
}

export default Title;