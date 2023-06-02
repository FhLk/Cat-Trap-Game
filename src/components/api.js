import Swal from "sweetalert2";

class API {
  // BASE_API = "https://catthetrap-apistg.wisdomcloud.net/api";
  BASE_API = "http://192.168.1.235:8080/api";
  getToken = localStorage.getItem("o");
  token =
    "eyJhbGciOiJIUzI1NiJ9.eyJtb2JpbGVObyI6Im1wUTBSMTJHTzAzNmY4ckVCbmZqVTg4OWwyczNnZGlGQUVzcCtNRWUrNzQ9IiwidGltZXN0YW1wIjoiMjAyMi0wMS0xNFQxMzowMDowNSswNzowMCJ9.gUvmq2MI9DAa5-AgWAX8DE7tL2elCD7VW8g-2gtYz9g";

  static LoadingAlert() {
    Swal.fire({
      title: "Please Wait",
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  static CloseAlert() {
    Swal.close();
  }

  static PopupAlert(){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }

  async Authen() {
    try {
      API.LoadingAlert();
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
        API.CloseAlert()
        const getRes = await res.json();
        localStorage.setItem("token", getRes.o);
        return true;
      } else {
        API.PopupAlert()
        throw new Error("Something went wrong during authentication.");
      }
    } catch (error) {
      API.PopupAlert()
      throw new Error("Something went wrong during authentication.");
    }
  }

  async Setup(level) {
    try {
      API.LoadingAlert();
      const res = await fetch(`${this.BASE_API}/setup`, {
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
        const dataSetup = {
          board: getRes.board,
          session: getRes.sessionID,
          time: getRes.timeOut,
          token: getRes.token,
          turn: getRes.turn,
          canPlay: getRes.canPlay,
        };
        localStorage.setItem("board", dataSetup.token);
        sessionStorage.setItem("sessionID", dataSetup.session);
        API.CloseAlert();
        return dataSetup;
      } else {
        API.PopupAlert()
        throw new Error("Something went wrong during setup.");
      }
    } catch (error) {
      API.PopupAlert()
      console.log(error);
      throw new Error("Something went wrong during setup.");
    }
  }

  async Play(req) {
    try {
      const token = localStorage.getItem("board");
      const session = sessionStorage.getItem("sessionID");
      const res = await fetch(`${this.BASE_API}/play`, {
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
        const dataPlay = {
          board: getRes.board,
          time: getRes.timeOut,
          token: getRes.token,
          turn: getRes.turn,
          canPlay: getRes.canPlay,
        };
        localStorage.setItem("board", dataPlay.token);
        API.CloseAlert();
        return dataPlay;
      } else {
        API.PopupAlert()
        throw new Error("Something went wrong during play.");
      }
    } catch (error) {
      API.PopupAlert()
      console.log(error);
      throw new Error("Something went wrong during play.");
    }
  }

  async Reset(level) {
    try {
      const session = sessionStorage.getItem("sessionID");
      API.LoadingAlert();
      const res = await fetch(`${this.BASE_API}/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken}`,
        },
        body: JSON.stringify({
          sessionID: session,
          level: level,
        }),
      });

      if (res.status === 200) {
        const getRes = await res.json();
        const dataSetup = {
          board: getRes.board,
          session: getRes.sessionID,
          time: getRes.timeOut,
          token: getRes.token,
          turn: getRes.turn,
        };
        localStorage.setItem("board", dataSetup.token);
        sessionStorage.setItem("sessionID", dataSetup.session);
        API.CloseAlert();
        return dataSetup;
      } else {
        API.PopupAlert()
        throw new Error("Something went wrong during reset.");
      }
    } catch (error) {
      API.PopupAlert()
      console.log(error);
      throw new Error("Something went wrong during reset.");
    }
  }

  async TimeOut(req) {
    try {
      const token = localStorage.getItem("board");
      const session = sessionStorage.getItem("sessionID");
      const res = await fetch(`${this.BASE_API}/time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken}`,
        },
        body: JSON.stringify({
          sessionID: session,
          time: req.time,
          turn: req.turn + 1,
          token: token,
          level: req.level,
        }),
      });

      if (res.status === 200) {
        const getRes = await res.json();
        const dataPlay = {
          board: getRes.board,
          time: getRes.timeOut,
          token: getRes.token,
          turn: getRes.turn,
          canPlay: getRes.canPlay,
        };
        localStorage.setItem("board", dataPlay.token);
        API.CloseAlert();
        return dataPlay;
      } else {
        API.PopupAlert()
        throw new Error("Something went wrong during timeout.");
      }
    } catch (error) {
      API.PopupAlert()
      console.log(error);
      throw new Error("Something went wrong during timeout.");
    }
  }
}

export default API;
