<template>
  <div class="container py-4">
    <h1>Мои бронирования</h1>


    <div v-if="reservations.length === 0" class="alert alert-info">
      Нет бронирований
    </div>

    <table v-else class="table table-striped">
      <thead>
        <tr>
          <th>Зал</th>
          <th>Дата и время</th>
          <th></th>
         </tr>
      </thead>
      <tbody>
        <tr v-for="item in reservations" :key="item.id">
          <td>{{ item.room_title }}</td>
          <td>{{ formatDate(item.reservation_date) }}</td>
          <td>
            <button class="btn btn-sm btn-danger" @click="cancel(item.id)">
              Отменить
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/api/api';

const reservations = ref([]);


onMounted(async () => {
  await loadReservations();
});

async function loadReservations() {
  try {
    const res = await api.getUserReservations();
    reservations.value = res.data || res || [];
  } catch (err) {
    console.error('Ошибка загрузки броней', err);
  } 
}

function formatDate(date) {
  return new Date(date).toLocaleString('ru-RU');
}

async function cancel(id) {
  if (!confirm('Отменить бронь?')) return;

  try {
    await api.cancelReservation(id);
    reservations.value = reservations.value.filter(r => r.id !== id);
  } catch (err) {
    alert('Ошибка отмены');
  }
}
</script>