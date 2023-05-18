import { createRouter, createWebHistory } from 'vue-router'
import DataTable from './components/DataTable.vue'
import EditForm from './components/EditForm.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path:'/', name:'DataTable', component: DataTable},
        {path:'/edit', name: 'EditForm', component: EditForm}
    ]
})

export default router