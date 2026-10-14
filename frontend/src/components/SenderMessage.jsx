import React from "react";


const SenderMessage = ({message}) => {


  return (

    <div className="sent">
     {message &&  <span>{message}</span>
                 
     }
     
    </div>


  );
};

export default SenderMessage;