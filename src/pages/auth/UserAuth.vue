<template>
  <div>
    <base-dialog :show="!!error" title="에러가 발생했습니다..." @close="handleError">
      {{ error }}
    </base-dialog>
    <base-dialog :show="isLoading" fixed title="인증중....">
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control" >
          <input type="email" name="" id="email" v-model.trim="email"/>
          <label for="email">Email</label>
        </div>
        <div class="form-control" :class="{errors: !isValidForm}" >
          <input type="password" name="" id="password" v-model.trim="password" @focus="onfocusInput"/>
          <label for="password">Password</label>
        </div>
        <p v-if="!isValidForm">데이터를 잘못 입력하셨습니다. 비밀번호는 6자리 이상입니다.</p>
        <base-button>{{ switchSignUp }}</base-button>
        <base-button type="button" mode="flat" @click="switchSubmitForm">{{ switchLoginUp }}</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>

export default{
  data(){
    return {
      email: '',
      password: '',
      userState: 'login',
      isValidForm: true,
      isLoading: false,
      error: null,
    }
  },
  computed:{
    switchSignUp(){
      if(this.userState === 'login'){
        return '로그인 전송'
      }else{
        return '회원가입 전송'
      }

    },
    switchLoginUp(){
      if(this.userState === 'login'){
        return '회원가입 하러가기 '
      }else{
        return '로그인 하러가기'
      }
    },
  },
  methods:{
    async submitForm(){
      this.isValidForm = true;
      if(this.email === '' || this.password.length < 6){
        this.isValidForm = false;
        return;
      }
      this.isLoading = true;
      const actionData = {
        email:this.email,
        password: this.password,
      };
      try{
        if(this.userState === 'login'){
          await this.$store.dispatch('login',actionData)
        }
        else if(this.userState === 'sign'){
          await this.$store.dispatch('signup',actionData)
        }
        // const redirect = this.$route.query.redirect; 쿼리 파람이 없을때 coaches가 나와야함
        const redirectUrl = '/' + (this.$route.query.redirect || 'coaches');
        this.$router.replace(redirectUrl);
      }catch(error){
        // console.log(error.response.data.error.message);
        let curError = error.response.data.error.message;
        if(curError === 'EMAIL_NOT_FOUND'){
          this.error = '아이디를 찾을 수 없습니다. 다시 입력해주세요.';
        }
        else if(curError === 'EMAIL_EXISTS'){
          this.error = '중복된 아이디 입니다 다시 입력해주세요'
        }
      }
      this.isLoading = false;
    },
    switchSubmitForm(){
      if(this.userState === 'login'){
        this.userState = 'sign';
      }else{
        this.userState = 'login';
      }
    },
    handleError(){
      this.error = null;
    },
    onfocusInput(){
      this.isValidForm = true
    }
  }
}
</script>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

.form-control.errors input {
  border: 1px solid red;
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