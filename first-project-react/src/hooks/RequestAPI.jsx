import React from "react";
import axios from "axios";

const RequestAPI = async (method, url, headers, data) => {
  try {
    let config = {
      method,
      url,
      maxBodyLength: Infinity,
      headers,
      data,
    };
    let response = await axios(config)
      .then(function (response) {
        let result = response.data;
        if (result.success && result.message) {
          return {
            loading: false,
            message: "",
            data: data || [],
            success: result.success,
          };
        } else if (
          result.success &&
          result.data &&
          Object.values(result.data).length > 0
        ) {
          return {
            loading: false,
            message: "",
            data: result.data,
            success: result.success,
          };
        } else {
          return {
            loading: false,
            message: result.message || "No record found",
            data: [],
            success: result.success,
          };
        }
      })
      .catch(function (error) {
        return {
          loading: false,
          message: error.message,
          data: [],
          success: false,
        };
      });
    return response;
  } catch (error) {
    return { loading: false, message: error.message, data: [] };
  }
};

export { RequestAPI };
