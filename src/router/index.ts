import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SalaryCompositionPage from '@/views/salary_composition/SalaryCompositionPage.vue'
import Test from '@/views/Test.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'SalaryCompositionList',
        component: SalaryCompositionPage,
      },
      {
        path: 'test',
        name: 'test',
        component: Test,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
