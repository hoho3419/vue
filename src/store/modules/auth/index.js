import Axios from "axios";
let timer;

const authModule = {
  // namespaced: true, 이미 getters를 전역으로 했기 때문에 사용하려면 다 바꿔줘야 한ㄷ.
  state(){
    return {
      userId: null,
      token: null,
      // tokenExpiration: null,
      didAutoLogout: false,
    }
  },
  mutations:{
    setUser(state,payload){
      state.token = payload.token;
      state.userId = payload.userId;
      state.didAutoLogout = false
    },
    setAutoLogout(state){
      state.didAutoLogout = true;
    },
  },
  actions:{
    async login(context,payload){
      /** 
      const response = await Axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC29RxZY7KYNxuxJP2TLOh04X1rc917Hj0`,{
        email: payload.email,
        password: payload.password,  
        returnSecureToken: true,
      });
      const responseData = await response.data;
      if(!response.status){
        const error = new Error(responseData.message || "통신이 잘못 되었습니다.");
        throw error;
      }
      console.log(responseData);
      context.commit('setUser',{
        token: responseData.idToken,
        userId: responseData.localId ,
        tokenExpiration: responseData.expiresIn
      })
*/
      return context.dispatch('auth',{
        ...payload,
        mode: 'login'
      })

    },
    async signup(context,payload){
      /** 
      const response = await Axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC29RxZY7KYNxuxJP2TLOh04X1rc917Hj0`,{
        email: payload.email,
        password: payload.password,  
        returnSecureToken: true,
      });
      console.log(response);
      const responseData = await response.data;
      if(!response.status){
        const error = new Error(responseData.message || "통신이 잘못 되었습니다.");
        throw error;
      }
      console.log(responseData);
      context.commit('setUser',{
        token: responseData.idToken,
        userId: responseData.localId ,
        tokenExpiration: responseData.expiresIn
      })
      */
      return context.dispatch('auth',{
        ...payload,
        mode: 'signup'
      })

    },
    logout(context){
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('tokenExpiration');
      clearTimeout(timer);

      context.commit('setUser',{
        token: null,
        userId: null,
      })
    },
    autoLogout(context){
      context.dispatch('logout');
      context.commit('setAutoLogout');
    },
    async auth(context,payload){
      const mode = payload.mode;
      let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC29RxZY7KYNxuxJP2TLOh04X1rc917Hj0';
      if(mode === 'signup'){
        url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC29RxZY7KYNxuxJP2TLOh04X1rc917Hj0`;
      }

      const response = await Axios.post(url,{
        email: payload.email,
        password: payload.password,  
        returnSecureToken: true,
      });
      const responseData = await response.data;
      if(!response.status){
        const error = new Error(responseData.message || "통신이 잘못 되었습니다.");
        throw error;
      }
      const expiresIn = +responseData.expiresIn * 1000;
      const expirationDate = new Date().getTime() + expiresIn;

      localStorage.setItem('token',responseData.idToken);
      localStorage.setItem('userId',responseData.localId);
      localStorage.setItem('tokenExpiration',expirationDate);

      timer = setTimeout(() =>{
        context.commit('autoLogout');
      },expiresIn)

      // console.log(responseData);
      context.commit('setUser',{
        token: responseData.idToken,
        userId: responseData.localId ,
        // tokenExpiration: expirationDate
      })

    },
    tryLogin(context){
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      const expiresIn = +tokenExpiration - new Date().getTime();

      if(expiresIn < 0){
        return;
      }

      timer = setTimeout(() =>{
        context.dispatch('autoLogout');
      },expiresIn);

      if(token && userId){
        context.commit('setUser',{
          token: token,
          userId: userId,
        })
      }
    }
  },
  getters:{
    getUserId(state){
      return state.userId;
    },
    getToken(state){
      return state.token;
    },
    isAthentication(state){
      return !!state.token; // 토큰은 문자열이기 때문에 !! 연산자를 통해서 불리언 값으로 만들어서 리턴한다.
    },
    getDidAutoLogout(state){
      return state.didAutoLogout;
    }
  },
}

export default authModule;