import DefaultLayout from '@/layouts/DefaultLayout.vue'
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
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
