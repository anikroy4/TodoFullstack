import React from 'react'

const EyeSlashIcon = ({ onClick }) => {
  return (
    <>
        <button type="button" onClick={onClick} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .91-2.903 3.1-5.187 5.86-6.321M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.75 4.75l14.5 14.5" />
            </svg>
        </button>
    </>
  )
}

export default EyeSlashIcon