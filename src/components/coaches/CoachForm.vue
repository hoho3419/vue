<template>
  <form @submit.prevent="submitForm">
    <div class="form-control" :class="{invalid: !firstName.isValid}" >
      <label for="firstname">Firstname</label>
      <input type="text" id="firstname" v-model.trim="firstName.val" @blur="checkText('firstName')" @focus="clearValidity('firstName')"/>
      <p v-if="!firstName.isValid">이름은 비울 수 없습니다.</p>
    </div>
    <div class="form-control"  :class="{invalid: !lastName.isValid}">
      <label for="lastname">Lastname</label>
      <input type="text" id="lastname" v-model.trim="lastName.val" @blur="checkText('lastName')" @focus="clearValidity('lastName')"/>
      <p v-if="!lastName.isValid">이름은 비울 수 없습니다.</p>
    </div>
    <div class="form-control"  :class="{invalid: !description.isValid}">
      <label for="description">Description</label>
      <textarea name="description" id="description" rows="5" v-model.trim="description.val" @blur="checkText('description')"  @focus="clearValidity('description')"></textarea>
      <p v-if="!description.isValid">소개 칸은 비울 수 없습니다.</p>
    </div>
    <div class="form-control"  :class="{invalid: !hourlyRate.isValid}">
      <label for="rate">Houly Rate</label>
      <input type="number" id="rate" v-model.number="hourlyRate.val" @blur="checkRate('hourlyRate')" @focus="clearValidity('hourlyRate')"/>
      <p v-if="!hourlyRate.isValid">가격은 비울 수 없습니다.</p>
    </div>
    <div class="form-control" :class="{invalid: !areas.isValid}">
      <h3>Areas of Expertise</h3>
      <div>
        <input type="checkbox" id="frontend" value="frontend" v-model="areas.val" @blur="checkArea('areas')" @focus="clearValidity('areas')">
        <label for="frontend">Frontend Development</label>
      </div>
      <div>
        <input type="checkbox" id="backend" value="backend" v-model="areas.val" @blur="checkArea('areas')" @focus="clearValidity('areas')">
        <label for="backend">Backend Development</label>
      </div>
      <div>
        <input type="checkbox" id="career" value="career" v-model="areas.val" @blur="checkArea('areas')" @focus="clearValidity('areas')">
        <label for="career">Career Advisory</label>
      </div>
      <p v-if="!areas.isValid">아무것도 선택하지 않을 순 없습니다.</p>
    </div>
    <p v-if="!formIsValid">양식을 다시 입력해주세요</p>
    <base-button>Register</base-button>
  </form>
</template>

<script>
export default{
  emits: ['save-data'],
  data(){
    return {
      firstName: {
        val: '',
        isValid: true
      },
      lastName: {
        val: '',
        isValid: true
      },
      areas: {
        val: [],
        isValid: true
      },
      description: {
        val: '',
        isValid: true
      },
      hourlyRate: {
        val: null,
        isValid: true
      },
      formIsValid: true,
    }
  },
  computed:{
    
  },
  methods:{
    clearValidity(input){
      this[input].isValid = true;
    },
    checkText(input){
      if(this[input].val === ''){
        this[input].isValid = false;
      }
    },
    checkArea(input){
      if(this[input].val.length <= 0){
        this[input].isValid = false;
      }
    },
    checkRate(input){
      if(!this[input].val || this.hourlyRate <= 0){
        this[input].isValid = false;
      }
    },
    validateForm(){
      if(this.firstName.val === ''){
        this.firstName.isValid = false;
        this.formIsValid = false;
      }
      if(this.lastName.val === ''){
        this.lastName.isValid = false;
        this.formIsValid = false;
      }
      if(this.description.val === ''){
        this.description.isValid = false;
        this.formIsValid = false;
      }
      if(this.areas.val.length <= 0){
        this.areas.isValid = false;
        this.formIsValid = false;
      }
      if(!this.hourlyRate || this.hourlyRate <= 0){
        this.hourlyRate.isValid = false;
        this.formIsValid = false;
      }
    },
    submitForm(){
      this.validateForm();
      if(!this.formIsValid){
        return;
      }

      const formData = {
        first: this.firstName.val,
        last: this.lastName.val,
        desc: this.description.val,
        rate: this.hourlyRate.val,
        areas: this.areas.val,
      }
      this.$emit('save-data',formData);
      // if(this.firstName === '' || this.lastName === '' || this.description === '' || this.hourlyRate === null){

      // }
    }
  }
}
</script>

<style scoped>
.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input[type='checkbox'] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

input,
textarea {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
}

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}

input[type='checkbox'] {
  display: inline;
  width: auto;
  border: none;
}

input[type='checkbox']:focus {
  outline: #3d008d solid 1px;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invalid label {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}
</style>