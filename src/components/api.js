import Swal from "sweetalert2";

class API {
  constructor() {}
  token =
    "eyJhbGciOiJIUzI1NiJ9.eyJtb2JpbGVObyI6Im1wUTBSMTJHTzAzNmY4ckVCbmZqVTg4OWwyczNnZGlGQUVzcCtNRWUrNzQ9IiwidGltZXN0YW1wIjoiMjAyMi0wMS0xNFQxMzowMDowNSswNzowMCJ9.gUvmq2MI9DAa5-AgWAX8DE7tL2elCD7VW8g-2gtYz9g";
  async Authen() {
    // const res = await fetch(
    //   "https://hitthemole-apistg.wisdomcloud.net/customer/ssbeserv/authenToken",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       token: this.token,
    //     }),
    //   }
    // );
    // if (res.status === 200) {
    //   const getRes = await res.json();
    //   localStorage.setItem("transactionID", getRes.transactionID);
    //   localStorage.setItem("token", getRes.data.token);
    //   return
    // }
  }

  async RewardInfo() {
    // const getToken = localStorage.getItem("token")
    // const getID = localStorage.getItem("transactionID")
    // LoadingAlert()
    // const res = await fetch(
    //   "https://hitthemole-apistg.wisdomcloud.net/game/rewardInfo",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${getToken}`,
    //       transactionid: getID,
    //     },
    //     body: JSON.stringify({
    //       game: "hitTheMole",
    //     }),
    //   }
    // );
    // if(res.status === 200){
    //     const getRes = await res.json()
    //     localStorage.setItem("award",JSON.stringify({name:"",type:""}))
    //     CloseAlert()
    //     return getRes
    // }
  }

  async Play() {
    // const getToken = localStorage.getItem("token")
    // const getID = localStorage.getItem("transactionID")
    // LoadingAlert()
    // const res = await fetch(
    //     "https://hitthemole-apistg.wisdomcloud.net/game/play",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${getToken}`,
    //         transactionid: getID,
    //       },
    //       body: JSON.stringify({
    //         o: 0,
    //         token: `Bearer ${getToken}`
    //       }),
    //     }
    //   );
    //   if(res.status === 200){
    //     const getRes = await res.json();
    //     CloseAlert()
    //     return getRes
    //   }
  }
}
export default API;

const LoadingAlert = () => {
  Swal.fire({
    title: "Please Wait",
    allowEscapeKey: false,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

const CloseAlert = () => {
  Swal.close();
};
