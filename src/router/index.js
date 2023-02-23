import { createRouter, createWebHistory } from 'vue-router'
import Menu from '../views/Menu.vue'
import Game from '../views/Game.vue'
import NotFound from '../views/NotFoundPage.vue'
const history = createWebHistory()
const routes = [
    {
        path:"/",
        name:"Home",
        component: Menu
    },
    {
        path:"/game-level:level",
        name:"Game",
        component: Game,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: NotFound
      },

]
const router = createRouter({ history, routes })
export default router