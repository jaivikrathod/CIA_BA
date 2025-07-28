import React from 'react';
import './LoadingComponent.css';

const LoadingComponent = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        </div>
    );
};

export default LoadingComponent;
