<template>
  <div>
    <base-dialog :show="!!error" title="에러가 발생했습니다." @close="handleClose">
      <p>{{ error }}</p>
    </base-dialog>
    <section>
      <CoachFilter @change-filter="setFilters"></CoachFilter>
    </section>
    <section>
      <base-card>
        <div class="controls">
          <base-button mode="outline" @click="loadCoaches(true)">Refresh</base-button>
          <base-button :link="true" to="/register" v-if="!isCoach && !isLoading && isLoggedIn">Register as Coach</base-button>
          <base-button :link="true" to="/auth?redirect=register" v-if="!isLoggedIn">Login 하고 코치 등록하러 가기</base-button>
        </div>
        <div v-if="isLoading">
          <BaseSpinner></BaseSpinner>
        </div>
        <ul v-else-if="hasCoaches">
          <CoachItem v-for="coach in filteredCoaches" 
          :key="coach.id" 
          :id="coach.id"
          :first-name="coach.firstName"
          :last-name="coach.lastName"
          :areas="coach.areas"
          :rate="coach.hourlyRate"
          >
            {{ coach.firstName }}
          </CoachItem>
        </ul>
        <h2 v-else>No Coaches found..</h2>
      </base-card>
    </section>
  </div>
</template>

<script>
import CoachItem from '../../components/coaches/CoachItem.vue';
import CoachFilter from '../../components/coaches/CoachFilter.vue';

export default {
  components:{
    CoachItem,
    CoachFilter,
  },
  data(){
    return {
      isLoading: false,
      error: null,
      activeFilter: {
        frontend: true,
        backend: true,
        career: true,
      },
    }
  },
  computed:{
    filteredCoaches(){
      const coaches =  this.$store.getters['coaches/coaches'];
      return coaches.filter(coach =>{
        if(this.activeFilter.frontend && coach.areas.includes('frontend')){
          return true;
        }
        if(this.activeFilter.backend && coach.areas.includes('backend')){
          return true;
        }
        if(this.activeFilter.career && coach.areas.includes('career')){
          return true;
        }
        return false;
      })
    },
    hasCoaches(){
      return !this.isLoading &&  this.$store.getters['coaches/hasCoaches'];
    },
    isCoach(){
      return this.$store.getters['coaches/isCoach'];
    },
    isLoggedIn(){
      return this.$store.getters.isAthentication;
    }
  },
  methods:{
    setFilters(updatedFilter){
      this.activeFilter = updatedFilter;
    },
    async loadCoaches(refresh = false){
      this.isLoading = true;
      try{
        await this.$store.dispatch('coaches/loadCoaches',{forceRefresh: refresh});
      }catch(error){
        console.log(error);
        this.error = error.message || "아마 에러가 난듯";
      }
      this.isLoading = false;
    },
    handleClose(){
      this.error = null;      
    }
  },
  created(){
    this.loadCoaches();
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>