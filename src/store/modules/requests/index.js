import Axios from "axios";

const requestsModule = {
  namespaced: true,
  state(){
    return {
      requests: [],
    }
  },
  mutations:{
    addRequest(state,payload){
      state.requests.push(payload);
    },
    setRequest(state,payload){
      state.requests = payload;
    }
  },
  actions:{
    async addContact(context,payload){
      const newRequest = {
        userEmail: payload.email,
        message: payload.message,
      };
      const response = await Axios.post(`https://vue-http-demo-76c51-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,newRequest);
      if(!response.status){
        const error = new Error(response.message || '데이터를 가져오지 못했습니다.');
        throw error;
      }
      const responseData = response.data;
      // console.log("Post 로 요청하고 받은 데이터" + response.data);

      newRequest.id = responseData.name;
      newRequest.coachId = payload.coachId;

      context.commit('addRequest',newRequest);
    },
    async fetchRequests(context){
      const coachId = context.rootGetters.getUserId;
      const Token = context.rootGetters.getToken;
      const response = await Axios.get(`https://vue-http-demo-76c51-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=${Token}`);
      const responseData = await response.data;
      if(!response.status){
        const error = new Error(response.message || '데이터를 가져오지 못했습니다.');
        throw error;
      }

      const requests = [];
      for(const res in responseData){
        const request = {
          id: res,
          coachId: coachId,
          message: responseData[res].message,
          userEmail: responseData[res].userEmail,
        }
        requests.push(request);
      }

      context.commit('setRequest',requests);
    }
  },
  getters:{
    getRequest(state,getters,rootState,rootGetters){
      const userId = rootGetters.getUserId;

      return state.requests.filter(el => el.coachId === userId);
    },
    getHasRequest(state,getters,rootState,rootGetters){
      const userId = rootGetters.getUserId;
      const findRequests = state.requests.filter(el => el.coachId === userId);
      return findRequests && findRequests.length > 0;
    }
  },
};

export default requestsModule;