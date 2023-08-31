import axios from "axios";

export const apiInstance = axios.create({
  baseURL: "http://ec2-13-127-154-248.ap-south-1.compute.amazonaws.com:8080/",
});
