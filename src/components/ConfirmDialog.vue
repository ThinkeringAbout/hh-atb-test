<template>
  <q-dialog v-model="isConfirmOpen" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">{{ dialogText }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          @click="$emit('cancelClick')"
          flat
          label="Отмена"
          color="primary"
        />
        <q-btn @click="$emit('deleteClick')" flat label="Ок" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ConfirmDialog",

  props: ["isOpen", "dialogText"],

  emits: ["deleteClick", "cancelClick"],

  data() {
    return {
      isConfirmOpen: this.$props.isOpen,
    };
  },

  watch: {
    isOpen(newValue: boolean) {
      this.isConfirmOpen = newValue;
    },
  },
});
</script>
