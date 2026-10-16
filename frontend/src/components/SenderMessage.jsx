import React from "react";


const SenderMessage = ({message, image}) => {


  return (

    <div className="sent">
     {message &&  <span>{message}</span>}
                 
     {image && (
        <img src={image} />
      )}
     
    </div>


  );
};

export default SenderMessage;