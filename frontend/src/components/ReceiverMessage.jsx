
import React from 'react'

const ReceiverMessage = ({message, image}) => {
  return (
    <div className="received">
      {message &&  <span>{message}</span>}
                 
     {image && (
       <img src={image} />
      )}
    </div>
  )
}

export default ReceiverMessage