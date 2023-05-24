import { data } from "autoprefixer";
import Swal from "sweetalert2";
import { walk } from "vue/compiler-sfc";

class API {
  constructor() {}
  BASE_API = `http://192.168.1.232:8080/api`
  getToken = localStorage.getItem("token");
  token =
    "eyJhbGciOiJIUzI1NiJ9.eyJtb2JpbGVObyI6Im1wUTBSMTJHTzAzNmY4ckVCbmZqVTg4OWwyczNnZGlGQUVzcCtNRWUrNzQ9IiwidGltZXN0YW1wIjoiMjAyMi0wMS0xNFQxMzowMDowNSswNzowMCJ9.gUvmq2MI9DAa5-AgWAX8DE7tL2elCD7VW8g-2gtYz9g";
  async Authen() {
    try {
      // console.log();
      const res = await fetch(`${this.BASE_API}/authen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: this.token,
        }),
      });
      if (res.status === 201) {
        const getRes = await res.json();
        localStorage.setItem("token", getRes.token);
        return true;
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        return false;
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  }

  async Setup(level) {
    try {
      LoadingAlert();
      const res = await fetch(`${this.BASE_API}/setup`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken}`,
        },
        body: JSON.stringify({
          level: level,
        }),
      });
      if (res.status === 200) {
        const getRes = await res.json();
        let dataSetup = {};
        dataSetup.board = getRes.board
        dataSetup.session = getRes.sessionID
        dataSetup.time = getRes.timeOut;
        dataSetup.token = getRes.token;
        dataSetup.turn = getRes.turn;
        dataSetup.canPlay = getRes.canPlay;
        localStorage.setItem("board", dataSetup.token);
        sessionStorage.setItem("sessionID",dataSetup.session)
        CloseAlert();
        return dataSetup;
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  }

  async Play(req) {
    try {
      const token = localStorage.getItem("board");
      const session = sessionStorage.getItem("sessionID");
      const res = await fetch(`${this.BASE_API}/play`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken}`,
        },
        body: JSON.stringify({
          sessionID: session,
          turn: req.turn + 1,
          x: req.x,
          y: req.y,
          block: req.block,
          token: token,
          level: req.level,
        }),
      });
      if (res.status === 200) {
        const getRes = await res.json();
        let dataPlay = {};
        dataPlay.board = getRes.board;
        dataPlay.time = getRes.timeOut;
        dataPlay.token = getRes.token;
        dataPlay.turn = getRes.turn;
        dataPlay.canPlay = getRes.canPlay;
        localStorage.setItem("board", dataPlay.token);
        CloseAlert();
        return dataPlay;
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  }

  async Reset(level) {
    try {
      localStorage.clear()
      sessionStorage.clear()
      LoadingAlert();
      const res = await fetch(`${this.BASE_API}/reset`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken}`,
        },
        body: JSON.stringify({
          level: level,
        }),
      });
      if (res.status === 200) {
        const getRes = await res.json();
        let dataSetup = {};
        dataSetup.board = getRes.board;
        dataSetup.time = getRes.timeOut;
        dataSetup.token = getRes.token;
        dataSetup.turn = getRes.turn;
        localStorage.setItem("board", dataSetup.token);
        CloseAlert();
        return dataSetup;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  }

  async TimeOut(req) {
    try {
      const token = localStorage.getItem("board");
      const res = await fetch(`${this.BASE_API}/time`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken}`,
        },
        body: JSON.stringify({
          time: req.time,
          turn: req.turn + 1,
          token: token,
          level: req.level,
        }),
      });
      if (res.status === 200) {
        const getRes = await res.json();
        let dataPlay = {};
        dataPlay.board = getRes.board;
        dataPlay.time = getRes.timeOut;
        dataPlay.token = getRes.token;
        dataPlay.turn = getRes.turn;
        dataPlay.canPlay = getRes.canPlay;
        localStorage.setItem("board", dataPlay.token);
        CloseAlert();
        return dataPlay;
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        return;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
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
