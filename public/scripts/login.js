/* eslint-disable no-undef */

import axios from "axios";

export async function login(creds) {
  console.log(creds);
  try {
    const res = await axios.post("http://localhost:8000/api/users/login", {
      email: creds.email,
      password: creds.password
    });
    if (res.status === 200) {
      location.assign("/");
      // window.setTimeout(() => {}, 1500);
    }
  } catch (err) {
    console.error(err.response.data);
    alert(err.response.data.message);
    throw err;
  }
}
