import React from 'react'

const Spinner: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <div className="loader"></div>

            <style>{`
        .loader {
          border: 6px solid #f3f3f3;
          border-top: 6px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
        </div>
    )
}

export default Spinner
