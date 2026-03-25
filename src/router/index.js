import GroupScheduleView from "@/views/GroupScheduleView.vue";
import HomeView from "@/views/HomeView.vue";
import LobbyDetailView from "@/views/LobbyDetailView.vue";
import LobbyView from "@/views/LobbyView.vue";
import LoginView from "@/views/LoginView.vue";
import MyReservation from "@/views/MyReservation.vue";
import NewsList from "@/views/NewsList.vue";
import RatingView from "@/views/RatingView.vue";
import ScheduleSearchView from "@/views/ScheduleSearchView.vue";
import SheduleView from "@/views/SheduleView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HomeView,
    },
    {
      path: "/news",
      component: NewsList,
    },
    {
      path: "/lobby",
      component: LobbyView,
    },
    {
      path: "/lobby/:id",
      component: LobbyDetailView,
    },
    {
      path: "/login",
      component: LoginView,
    },
    {
      path: "/profile/reservations",
      component: MyReservation,
    },
    {
      path: "/schedule",
      component: SheduleView,
    },
    {
      path: "/schedule/:group",
      component: GroupScheduleView,
    },
    {
      path: "/schedule-search",
      component: ScheduleSearchView,
    },
    {
      path: "/rating",
      component: RatingView,
    },
  ],
});

export default router;
