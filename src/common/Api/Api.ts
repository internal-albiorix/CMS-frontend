import axios from "axios";
import {
  responsePostDataModel,
  responseSelectDataModel,
} from "../../models/responseModel";
import { getSecureLocalStorage } from "../../helpers/SecureLocalStorage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const api_url = process.env.REACT_APP_API_URL;

const apiConfig = (options: any) => {
  const { token = getSecureLocalStorage("token"), timestamp = null } =
    options || {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      timestamp: timestamp,
    },
  };
};

const getApi = async (endPointObj: string, options?: any) => {
  const { data }: { data: responseSelectDataModel } = await axios.get(
    api_url + endPointObj,
    apiConfig(options)
  );
  return data;
};

const getByIdApi = async (apiEndPoint: string, id: number|string, options?: any) => {
  const { data }: { data: responseSelectDataModel } = await axios.get(
    api_url + apiEndPoint + "/" + id,
    apiConfig(options)
  );
  return data;
};
const insertApi = async (apiEndPoint: string, postData: any, options?: any) =>
  await axios
    .post(`${api_url}${apiEndPoint}`, postData, apiConfig(options))
    .then((res) => {
      return res?.data;
    })
    .catch((err) => {
      if (err?.response.status === 401) {
        toast.error(err?.response?.data?.message);
        const { data }: { data: responsePostDataModel } = err;
        return data;
      } else {
        return err?.response;
      }
    });

const updateApi = async (apiEndPoint: string, postData: any, options?: any) => {
  try {
    const { data }: { data: responsePostDataModel } = await axios.put(
      api_url + apiEndPoint,
      postData,
      apiConfig(options)
    );
    return data;
  } catch (err: any) {
    if (err?.response.status === 401) {
      toast.error(err?.response?.data?.message);
      const { data }: { data: responsePostDataModel } = err;
      return data;
    } else {
      return err?.response;
    }
  }
};

const deleteApi = async (apiEndPoint: string, id: number, options?: any) => {
  try {
    const { data }: { data: responsePostDataModel } = await axios.delete(
      api_url + apiEndPoint + "/" + id,
      apiConfig(options)
    );
    return data;
  } catch (err: any) {
    if (err?.response.status === 401) {
      toast.error(err?.response?.data?.message);
      const { data }: { data: responsePostDataModel } = err;
      return data;
    } else {
      return err?.response;
    }
  }
};

const downloadApi = async (
  apiEndPoint: string,
  fileName: string,
  options?: any
) => {
  const { data } = await axios.get(api_url + apiEndPoint + "/" + fileName, {
    responseType: "blob",
    ...apiConfig(options),
  });
  return data;
};

const getReportCandidateData = async (apiEndPoint: string, TimeFrame: number, Technologies: string[], CandidateStatus: string[], fromDate: Date | null, toDate: Date | null,options?: any) => {
  try {
    const response = await axios.post(`${api_url}${apiEndPoint}`, {
      TimeFrame,
      Technologies,
      CandidateStatus,
      fromDate,
      toDate,
      ...apiConfig(options)
    });
    return response.data;
  } catch (err: any) {
    if (err?.response.status === 401) {
      toast.error(err?.response?.data?.message);
      const { data }: { data: responsePostDataModel } = err;
      return data;
    } else {
      return err?.response;
    }
  }
};

const sentmail = async (apiEndPoint: string, type: string, options?: any) => {
  const { data }: { data: responseSelectDataModel } = await axios.get(
    api_url + apiEndPoint + "/" + type,
    apiConfig(options)
  );
  return data;
};

export { getApi, insertApi, updateApi, deleteApi, getByIdApi, downloadApi,getReportCandidateData,sentmail };
