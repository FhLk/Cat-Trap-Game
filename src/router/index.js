import { createRouter, createWebHistory } from 'vue-router'
import Menu from '../views/Menu.vue'
import Game from '../views/Game.vue'
const history = createWebHistory()
const routes = [
    {
        path:"/",
        name:"Home",
        component: Menu
    },
    {
        path:"/game",
        name:"Game",
        component: Game
    }

]
const router = createRouter({ history, routes })
export default router