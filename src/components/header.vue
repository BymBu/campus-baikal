<template>
    <header>
        <div class="header-area ">
            <div class="header-top_area">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="header_top_wrap d-flex justify-content-between align-items-center">
                                <div class="text_wrap">
                                    <p><span>+7 (3012) 123-456</span> <span>info@campusbaikal.ru</span></p>
                                </div>
                                <div class="text_wrap">
                                    <p v-if="!auth.isAuthenticated">
                                        <RouterLink to="/login"><i class="ti-user"></i> Авторизация</RouterLink>
                                        <RouterLink to="/register">Регистрация</RouterLink>
                                    </p>
                                    <p v-else>
                                        <span>Привет, {{ auth.user?.email || 'Пользователь' }}</span>
                                        <a href="#" @click.prevent="logout">Выйти</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="sticky-header" class="main-header-area">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="header_wrap d-flex justify-content-between align-items-center">
                                <div class="header_left">

                                </div>
                                <div class="header_right d-flex align-items-center">
                                    <div class="main-menu  d-none d-lg-block">
                                        <nav>
                                            <ul id="navigation">
                                                <li>
                                                    <RouterLink to="/">Главная</RouterLink>
                                                </li>
                                                <li>
                                                    <RouterLink to="/news">Новости</RouterLink>
                                                </li>
                                                <li>
                                                    <RouterLink to="/lobby">Залы кампуса</RouterLink>
                                                </li>
                                                <li>
                                                    <RouterLink to="/schedule">Расписание</RouterLink>
                                                </li>
                                                <li>
                                                    <RouterLink to="/schedule-search">Поиск</RouterLink>
                                                </li>
                                                <li>
                                                    <RouterLink to="/rating">Рейтинг</RouterLink>
                                                </li>
                                                <li v-if="auth.isAuthenticated">
                                                    <RouterLink to="/profile/reservations">Мои брони</RouterLink>
                                                </li>
                                                <li><a href="#">О нас</a></li>
                                            </ul>
                                        </nav>
                                    </div>
                                    <!-- <div class="Appointment">
                                        <div class="book_btn d-none d-lg-block">
                                            <a data-scroll-nav='1' href="#">Подать заявку</a>
                                        </div>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="mobile_menu d-block d-lg-none"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

let auth = useAuthStore()
let router = useRouter()

function logout() {
    auth.logout()
    router.push('/')
}
</script>