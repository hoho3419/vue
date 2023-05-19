<template>
  <section>
    <base-card>
      <h2>Register as a coach now!</h2>
      <CoachForm @save-data="saveCoach"></CoachForm>
    </base-card>
  </section>
</template>

<script>
import CoachForm from '../../components/coaches/CoachForm.vue';
export default {
  components:{
    CoachForm,
  },
  data(){
    return {

    }
  },
  methods:{
    saveCoach(formData){
      this.$store.dispatch('coaches/registerCoach',formData);
      // this.$router.push('/coaches') 뒤로 돌아갈 수 있게 하는것 
      this.$router.replace('/coaches'); // 뒤로 돌아갈 수 없음.
    }
  }
}
</script>