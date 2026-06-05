import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SalaryCompositionAdd from '@/views/salary_composition/SalaryCompositionAdd.vue'
import SalaryCompositionList from '@/views/salary_composition/SalaryCompositionList.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'SalaryCompositionList',
        component: SalaryCompositionList,
      },
      {
        path: 'add',
        name: 'SalaryCompositionAdd',
        component: SalaryCompositionAdd,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
