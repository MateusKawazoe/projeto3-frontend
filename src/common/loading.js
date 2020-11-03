import React from 'react'
import $ from 'jquery'

export default function Loading() {
    return (
        <div className="loading-container">
            <div className="loading-background"/>
            <img src={"https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/6d391369321565.5b7d0d570e829.gif"} className="loading"/>
        </div>
    )
}