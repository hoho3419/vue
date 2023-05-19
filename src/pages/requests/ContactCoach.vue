<template>
  <form @submit.prevent="submitMessage" >
    <div class="form-control">
      <label for="email">Your E-Mail</label>
      <input type="email" name="" id="email" v-model.trim="email">
    </div>
    <div class="form-control">
      <label for="message">Message</label>
      <textarea name="" id="message" rows="5" v-model.trim="message"></textarea>
    </div>
    <p v-if="!formIsValid">입력값들이 조건에 충족하지 못했습니다. 다시 입력해주세요.</p>
    <div class="actions">
      <base-button>Send Message</base-button>
    </div>
  </form>
</template>

<script>
export default {
  data(){
    return {
      email: '',
      message: '',
      formIsValid: true,
      isLoading: false,
      error: null,
    }
  },
  methods:{
    async submitMessage(){
      this.formIsValid = true;
      if(this.email === '' || this.message === '' || !this.email.includes('@')){
        this.formIsValid = false;
        return;
      }
      this.isLoading = true;
      try{
        await this.$store.dispatch('requests/addContact',{
          coachId: this.$route.params.id,
          email: this.email,
          message: this.message,
        });
      }catch(error){
        this.error = error.message + '서버와의 통신이 잘못되었습니다.';
      }
      this.isLoading = false;
      this.$router.replace('/coaches');
    }
  }
}
</script>

<style scoped>
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.errors {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}
</style>