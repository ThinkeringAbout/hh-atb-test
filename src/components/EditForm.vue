<template>
  <q-form
    ref="form"
    @submit.stop.prevent="onSubmitHandler"
    class="fixed-center form"
  >
    <div style="max-width: 400px">
      <q-input
        lazy-rules="ondemand"
        ref="firstNameRef"
        :rules="[
          (value) => validateInputMax(value),
          (value) => validateInputMin(value),
        ]"
        v-model="form.data.fullName"
        label="ФИО (Отчество - при наличии)"
      />
      <q-input
        lazy-rules="ondemand"
        ref="birthDateRef"
        v-model="form.data.birthDate"
        label="Дата рождения (YYYY-MM-DD)"
        mask="####-##-##"
        :rules="[(value) => validateBirthDate(value)]"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="form.data.birthDate" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        label="Описание"
        maxlength="100"
        autogrow
        v-model="form.data.description"
        type="textarea"
      />
    </div>
    <div class="q-mt-md row justify-center q-gutter-xl">
      <q-btn
        type="submit"
        :label="$route.query.user ? 'Сохранить' : 'Добавить'"
        class="q-mt-md button"
        color="primary"
      />
      <q-btn
        :label="$route.query.user ? 'Отмена' : 'Назад'"
        class="q-mt-md q-ml-md button"
        @click="onBackClickHandler"
        color="negative"
      />
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { v4 as uuidv4 } from "uuid";

import UserForm from "../types/UserForm";
import UserData from "../types/UserData";
import { QForm } from "quasar";

export default defineComponent({
  name: "EditForm",

  data() {
    return {
      form: {
        id: uuidv4(),
        data: {
          fullName: "",
          firstName: "",
          lastName: "",
          middleName: "",
          birthDate: "",
          description: "",
        } as UserData,
      },
      warning: "Обязательное поле",
    };
  },

  methods: {
    validateBirthDate(birthDate: string) {
      const RegTest = /^-?[\d]+\-[0-1]\d\-[0-3]\d$/.test(birthDate);
      const date = new Date(birthDate);
      const MonthTest = date.getMonth() < 12;
      const DayTest = date.getDay() < 31;

      return (RegTest && MonthTest && DayTest) || this.warning;
    },

    validateInputMin(text: string) {
      return (
        (text.split(" ").length > 1 && this.form.data.firstName.length > 0) ||
        this.warning
      );
    },

    validateInputMax(text: string) {
      return text.split(" ").length < 4 || "Неправильный формат";
    },

    onSubmitHandler() {
      (this.$refs.form as QForm).validate();
      this.addUser(this.form);
      this.clearForm();
      this.$router.push("/");
    },

    addUser(user: UserForm) {
      localStorage.setItem(user.id, JSON.stringify(user.data));
    },

    clearForm() {
      this.form.data.fullName = "";
      this.form.data.birthDate = "";
      this.form.id = uuidv4();
    },

    fillForm(user: UserData) {
      this.form.data.fullName = user.fullName;
      this.form.data.birthDate = user.birthDate;
      this.form.data.description = user.description;
      this.form.id = user.id;
    },

    onBackClickHandler() {
      this.$router.push("/");
    },
  },

  watch: {
    "form.data.fullName"(newValue: string) {
      const array = newValue.split(" ");
      this.form.data.lastName = array.at(0) as string;
      this.form.data.firstName = array.at(1) as string;
      this.form.data.middleName = array.at(2) as string;
    },
  },

  mounted() {
    if (this.$route.query.user) {
      this.fillForm(JSON.parse(this.$route.query.user as string));
    }
  },
});
</script>

<style scoped lang="scss">
.button {
  color: #fff;
  text-transform: none;
}

.form {
  width: 300px;
  @media screen and (max-width: 500px) {
    width: 90%;
  }
}
</style>
