import {
    
    getApi
    
  } from "../common/Api/Api";

const getAllTimeFrame = async (apiEndPoint: string) => {
    let res = await getApi(apiEndPoint);
    return res;
  };

  export{getAllTimeFrame};