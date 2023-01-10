import React from 'react'
import axios from "axios"

const test = () => {


    const clicked =  () => {
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("x-api-key", "0ee23ae9-610f-4ded-a1b4-4158c7a6701c");

        var requestOptions = {
            method: 'POST',
            headers:myHeaders,
            body: '{"email":"kirans08298@gmail.com"}',
            mode:"no-cors"
        };

        fetch("https://stg.api.onmeta.in/v1/users/login",requestOptions)
        .then(response => response)
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }        



  return (
    <div>
        <h1>test</h1>
        <button onClick={clicked}>click</button>
    </div>
  )
}

export default test