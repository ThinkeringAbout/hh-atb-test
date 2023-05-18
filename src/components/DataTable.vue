<template>
  <div class="q-pa-md">
    <q-btn
      @click="onAddClickHandler"
      label="Добавить запись"
      color="primary"
      class="q-mb-md button"
    ></q-btn>
    <q-table
      title="Анкеты"
      :rows="sortedRows"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="lastName" :props="props">
            {{ props.row.lastName }}
          </q-td>
          <q-td key="firstName" :props="props">
            {{ props.row.firstName }}
          </q-td>
          <q-td key="middleName" :props="props">
            {{ props.row.middleName }}
          </q-td>
          <q-td key="birthDate" :props="props">
            {{ props.row.birthDate }}
          </q-td>
          <q-td key="description" :props="props">
            {{ props.row.description }}
          </q-td>
          <q-td key="buttons" :props="props" class="button-group">
            <q-btn
              @click="onEditClickHandler(props.row)"
              color="primary"
              icon="img:src/assets/edit.svg"
            />
            <q-btn
              @click="onDeleteClickHandler(props.row.id)"
              color="negative"
              class="q-ml-md"
              icon="img:src/assets/delete.svg"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <confirm-dialog
      :dialog-text="'Запись будет удалена. Уверены?'"
      :is-open="isConfirmOpen"
      @cancel-click="closeConfirmDialog"
      @delete-click="onDeleteConfirmHandler"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ConfirmDialog from "./ConfirmDialog.vue";
import UserData from "../types/UserData";
import { QTableColumn } from "quasar";

export default defineComponent({
  name: "DataTable",

  components: { ConfirmDialog },

  data() {
    return {
      isConfirmOpen: false,
      idToDelete: "",

      columns: [
        {
          name: "lastName",
          align: "center",
          label: "Фамилия",
          field: (row: UserData) => row.lastName,
        },
        {
          name: "firstName",
          align: "center",
          label: "Имя",
          field: (row: UserData) => row.firstName,
        },
        {
          name: "middleName",
          align: "center",
          label: "Отчество",
          field: (row: UserData) => row.middleName,
        },
        {
          name: "birthDate",
          align: "center",
          label: "Дата рождения",
          field: (row: UserData) => row.birthDate,
        },
        {
          name: "description",
          align: "center",
          label: "Описание",
          style: "max-width: 200px; text-overflow: ellipsis; overflow: hidden",
          field: (row: UserData) => row.description,
        },
        {
          name: "buttons",
          align: "center",
          label: "Действия",
        },
      ] as QTableColumn[],

      rows: [] as UserData[],
    };
  },

  methods: {
    onEditClickHandler(row: UserData) {
      this.$router.push({
        path: "/edit",
        query: { user: JSON.stringify(row) },
      });
    },

    onDeleteClickHandler(id: string) {
      this.idToDelete = id;
      this.isConfirmOpen = true;
    },

    onAddClickHandler() {
      this.$router.push("/edit");
    },

    onDeleteConfirmHandler() {
      localStorage.removeItem(this.idToDelete);
      this.rows = this.rows.filter((item) => item.id !== this.idToDelete);
      this.idToDelete = "";
      this.closeConfirmDialog();
    },

    closeConfirmDialog() {
      this.isConfirmOpen = false;
    },
  },

  computed: {
    sortedRows() {
      //@ts-ignore
      return this.rows.toSorted((a: UserData, b: UserData) =>
        a.lastName.localeCompare(b.lastName)
      );
    },
  },

  mounted() {
    for (let key in localStorage) {
      if (!localStorage.hasOwnProperty(key)) {
        continue;
      }

      if (localStorage.getItem(key)) {
        const userObject: UserData = {
          ...JSON.parse(localStorage.getItem(key) as string),
          id: key,
        };
        this.rows.push(userObject);
      }
    }
  },
});
</script>
