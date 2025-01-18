import React, { useState } from 'react';
import axios from 'axios';

const Form = ({ onResult }) => {
    const [personImage, setPersonImage] = useState(null);
    const [garmentImageUrl, setGarmentImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('personImage', personImage);
        formData.append('garmentImageUrl', garmentImageUrl);

        try {
            const response = await axios.post('http://localhost:5000/api/try-on', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setLoading(false);
            onResult(response.data.tryOnImageUrl); // Pass the result to the parent component
        } catch (error) {
            setLoading(false);
            console.error('Error:', error.message);
            alert('Failed to process try-on. Please check your inputs.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Upload Your Image:
                <input type="file" accept="image/*" onChange={(e) => setPersonImage(e.target.files[0])} required />
            </label>
            <label>
                Garment Image URL:
                <input
                    type="url"
                    value={garmentImageUrl}
                    onChange={(e) => setGarmentImageUrl(e.target.value)}
                    placeholder="https://example.com/garment.jpg"
                    required
                />
            </label>
            <button type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Try On'}
            </button>
        </form>
    );
};

export default Form;
