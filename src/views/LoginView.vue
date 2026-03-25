<template>
    <div class="login-page">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <div class="card mt-5">
                        <div class="card-body p-4">
                            <h3 class="card-title text-center mb-4">Вход в систему</h3>

                            <form @submit.prevent="handleLogin">
                                <div class="mb-3">
                                    <label for="email" class="form-label">Электронная почта</label>
                                    <input v-model="email" type="email" class="form-control" id="email"
                                        placeholder="example@mail.ru" required />
                                </div>

                                <div class="mb-3">
                                    <label for="password" class="form-label">Пароль</label>
                                    <input v-model="password" type="password" class="form-control" id="password"
                                        placeholder="Введите пароль" required />
                                </div>

                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="remember" v-model="remember">
                                    <label class="form-check-label" for="remember">Запомнить меня</label>
                                </div>

                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary" >
                                        Войти
                                    </button>
                                </div>

                                <div class="text-center mt-3">
                                    <a href="#" class="text-decoration-none">Забыли пароль?</a>
                                </div>
                            </form>

                            <hr class="my-4">


                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

let email = ref('')
let password = ref('')
let remember = ref(false)

let auth = useAuthStore()
let router = useRouter()


async function handleLogin() {
    let success = await auth.login(email.value, password.value, 'crashSystem')

    if (success) {
        router.push('/')
    } else {
        alert('Ошибка входа')
    }
}
</script>

<style scoped>
.login-page {
    background: #f8f9fa;
    min-height: 100vh;
}

.card {
    border: none;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.card-title {
    color: #333;
    font-weight: 500;
}

.btn-primary {
    background: #007bff;
    border: none;
    padding: 10px;
}

.btn-primary:hover {
    background: #0056b3;
}

.form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>