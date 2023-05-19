<template>
  <div>
    <base-dialog :show="!!error" title="에러가 발생했습니다." @close="handleClose">
      <p>{{ error }}</p>
    </base-dialog>
    <section>
      <base-card>
        <header>
          <h2>Request Received</h2>
        </header>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasRequest && !isLoading">
          <RequestItem v-for="req in request" 
          :key="req.id"
          req.coachId
          :email="req.userEmail"
          :message="req.message" 
          ></RequestItem>
        </ul>
        <h3 v-else>아직 리퀘스트가 없습니다.</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import RequestItem from '../../components/requests/RequestItem.vue';

export default {
  components:{
    RequestItem,
  },
  data(){
    return {
      isLoading: false,
      error: null,
    }
  },
  computed:{
    request(){
      return this.$store.getters['requests/getRequest'];
    },
    hasRequest(){
      return this.$store.getters['requests/getHasRequest'];
    }
  },
  methods:{
    async loadRequests(){
      this.isLoading = true;
      this.error = null;
      try{
        await this.$store.dispatch('requests/fetchRequests');
      }catch(error){
        this.error = error.message || '통신에 실패했습니다.';
      }
      this.isLoading = false;
    },
    handleClose(){
      this.error = null;
    },
  },
  created(){
    this.loadRequests();
  }
}
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>