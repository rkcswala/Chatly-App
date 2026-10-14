
import React from 'react'

const ReceiverMessage = ({message}) => {
  return (
    <div className="received">
     {message &&  <span>{message}</span>}
     
    </div>
  )
}

export default ReceiverMessage