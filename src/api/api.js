// src/api/api.js
const BASE_URL = "https://webcomp.bsu.ru";

// Базовый запрос с обработкой ошибок
async function request(url, options = {}) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export const api = {
  // Авторизация
  async login(email, password, deviceName) {
    const a = await fetch("https://webcomp.bsu.ru/sanctum/token", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
        device_name: deviceName,
      }),
    });
    return a.text();
  },
  // Получение списка залов
  async getRooms() {
    return request("/api/2026/finals/campus/getrooms");
  },

  // Получение конкретного зала
  async getRoom(roomId) {
    return request(`/api/2026/finals/campus/getroom/${roomId}`);
  },

  // Бронирование зала
  async bookRoom(roomId, reserveTime) {
    return request("/api/2026/finals/campus/bookroom", {
      method: "POST",
      body: JSON.stringify({
        room_id: roomId,
        reserve_time: reserveTime,
      }),
    });
  },

  // Получить брони пользователя
  async getUserReservations() {
    return request("/api/2026/finals/campus/userreservations");
  },

  // Отмена брони
  async cancelReservation(reservationId) {
    return request(`/api/2026/finals/campus/cancelreserve/${reservationId}`, {
      method: "GET",
    });
  },

  // Получить список групп
  async getGroups() {
    return request("/api/2026/finals/schedule/getgroups");
  },

  // Получить расписание для группы
  async getSchedule(group, startDate, endDate) {
    return request("/api/2026/finals/schedule/schedule", {
      method: "POST",
      body: JSON.stringify({
        group: group,
        start_date: startDate,
        end_date: endDate,
      }),
    });
  },

  // Получить всё расписание
  async getAllSchedule() {
    return request("/api/2026/finals/schedule/allschedule");
  },

  // Получить всех преподавателей
  async getTeachers() {
    return request("/api/2026/finals/schedule/getteachers");
  },

  // Получить список аудиторий
  async getRoomsList() {
    return request("/api/2026/finals/schedule/getrooms");
  },

  // Получить все оценки
  async getAllMarks() {
    return request("/api/2026/finals/schedule/allmarks");
  },

  // Получить оценки текущего пользователя
  async getUserMarks() {
    return request("/api/2026/finals/schedule/usermarks");
  },

  // Поставить оценку
  async setMark(scheduleItemId, mark) {
    return request("/api/2026/finals/schedule/setmark", {
      method: "POST",
      body: JSON.stringify({
        schedule_item_id: scheduleItemId,
        mark: mark,
      }),
    });
  },

  // Удалить оценку
  async deleteMark(scheduleItemId) {
    return request(`/api/2026/finals/schedule/deletemark/${scheduleItemId}`, {
      method: "GET",
    });
  },
};
