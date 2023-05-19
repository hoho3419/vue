import Axios from 'axios';

const coachesModule = {
  namespaced: true,
  state(){
    return {
      lastFetch: null,
      coaches:[
        {
          id: 'c1',
          firstName: 'Maximilian',
          lastName: 'Schwarzmüller',
          areas: ['frontend', 'backend', 'career'],
          description:
            "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
          hourlyRate: 30
        },
        {
          id: 'c2',
          firstName: 'Julie',
          lastName: 'Jones',
          areas: ['frontend', 'career'],
          description:
            'I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
          hourlyRate: 30
        }
      ]
    }
  },
  mutations:{
    registerCoach(state,payload){
      state.coaches.push(payload);
    },
    setCoach(state,payload){
      state.coaches = payload;
    },
    setFetchTimestamp(state){
      state.lastFetch = new Date().getTime();
    }
  },
  actions:{
    async registerCoach(context,payload){
      const userId = context.rootGetters.getUserId; // 'c3', //new Date().toISOString(),
      const Token = context.rootGetters.getToken;

      const coachData = {
          firstName: payload.first,
          lastName: payload.last,
          areas: payload.areas,
          description: payload.desc,
          hourlyRate: payload.rate,
      };


      const response = await Axios.put(`https://vue-http-demo-76c51-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=${Token}`,coachData);

      if(!response.status){
        console.log(response.data);
      }

      context.commit('registerCoach',{
        ...coachData,
        id: userId,
      });
    },
    async loadCoaches(context,payload){
      if(!payload.forceRefresh && !context.getters.shouldUpdate){
        return;
      }

      const response = await Axios.get(`https://vue-http-demo-76c51-default-rtdb.firebaseio.com/coaches.json`);
      if(!response.status){
        const error = new Error(response.statusText || '파일을 가져오지 못했습니다.');
        throw error;
      }
      const responseData = response.data;
      const coaches = [];
      

      for(const key in responseData){
        const coach = {
          id: key,
          firstName: responseData[key].firstName,
          lastName: responseData[key].lastName,
          areas: responseData[key].areas,
          description: responseData[key].description,
          hourlyRate: responseData[key].hourlyRate,
        }
        coaches.push(coach);
      }

      context.commit('setCoach',coaches);
      context.commit('setFetchTimestamp');
    }
  },
  getters:{
    coaches(state){
      return state.coaches;
    },
    hasCoaches(state){
      return state.coaches && state.coaches.length > 0;
    },
    isCoach(_,getter,_2,rootGetters){
      const coaches = getter.coaches;
      const userId = rootGetters.getUserId;

      return coaches.some(el => el.id === userId)
      // const findId = coaches.find(el => el.id === userId);
      // if(findId >= 0){
      //   return true;
      // }else{
      //   return false;
      // }
    },
    shouldUpdate(state){
      const lastFetch = state.lastFetch;
      if(!lastFetch){
        return true;
      }

      const currentTime = new Date().getTime();
      return (currentTime - lastFetch) / 1000 > 60;
    }
  },
};

export default coachesModule;