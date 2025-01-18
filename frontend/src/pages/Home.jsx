import React, { useState } from 'react';
import Form from '../components/Form';

const Home = () => {
    const [resultImage, setResultImage] = useState(null);

    return (
        <div>
            <h1>Virtual Garment Try-On</h1>
            <Form onResult={setResultImage} />
            {resultImage && (
                <div>
                    <h2>Result</h2>
                    <img src={resultImage} alt="Try On Result" />
                </div>
            )}
        </div>
    );
};

export default Home;
