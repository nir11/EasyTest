import React, { useState } from 'react'
import MyForm from '../../components/Form/Form'

const Home = () => {

    return (
        <div className='container-fluid'>
            <div className='container card'>
                <h1>בחירת מוסך</h1>
                <MyForm />
            </div>
        </div>
    )
}

export default Home