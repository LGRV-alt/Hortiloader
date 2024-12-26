import PocketBase from "pocketbase";

// const url = `${import.meta.env.VITE_POCKETBASE}`;
const client = new PocketBase("https://hortiloader.pockethost.io");
client.autoCancellation(false);
export const isUserValid = client.authStore.isValid;
export async function getTasks() {
  return await client.collection("tasks").getFullList();
}

// function to update the record from the edit section
export async function updateTask(
  id,
  title,
  other,
  weekNumber,
  day,
  postcode,
  orderNumber,
  customerType,
  orderInfo,
  status,
  year
) {
  const data = {
    title: title,
    other: other,
    weekNumber: weekNumber,
    day: day,
    postcode: postcode,
    orderNumber: orderNumber,
    customerType: customerType,
    orderInfo: orderInfo,
    status: status,
    year: year,
  };
  await client.collection("tasks").update(id, data);
  // history.go(0);
}

export async function login(username, password) {
  try {
    await client.collection("users").authWithPassword(username, password);
    window.location.reload();
  } catch (error) {
    console.log(error);
    console.log(error.data);
    if (error.data.code) {
      alert("Invalid username or password");
    }
  }
}

export function signout() {
  client.authStore.clear();
  window.location.reload();
}
export async function signup(username, password) {
  const data = {
    username: username,
    password: password,
    passwordConfirm: password,
  };
  try {
    await client.collection("users").create(data);
    alert("User Created");
  } catch (error) {
    console.log("Error:", error);
    console.log(error.data);
    if (error.data.data.username.code) {
      alert("user already exist");
    }
  }
}

// ---------------------Brought Over----------------------

export async function deleteTask(id) {
  await client.collection("tasks").delete(id);
}

export async function taskStatus(id, title, status) {
  const data = {
    title: title,
    id: id,
    status: status,
  };
  await client.collection("tasks").update(id, data);
}

export async function createTask(
  title,
  day,
  postcode,
  orderNumber,
  customerType,
  other,
  weekNumber,
  orderInfo,
  status,
  year
) {
  const data = {
    title: title,
    day: day,
    postcode: postcode,
    orderNumber: orderNumber,
    customerType: customerType,
    user: client.authStore.model.id,
    other,
    weekNumber,
    orderInfo,
    status: status,
    year: year,
  };
  await client.collection("tasks").create(data);
}

export function getDateWeek(date) {
  const currentDate = typeof date === "object" ? date : new Date();
  const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
  const daysToNextMonday =
    januaryFirst.getDay() === 1 ? 0 : (7 - januaryFirst.getDay()) % 7;
  const nextMonday = new Date(
    currentDate.getFullYear(),
    0,
    januaryFirst.getDate() + daysToNextMonday
  );

  return currentDate < nextMonday
    ? 52
    : currentDate > nextMonday
    ? Math.ceil((currentDate - nextMonday) / (24 * 3600 * 1000) / 7)
    : 1;
}

export const daysOfWeek = {
  0: {
    1: [1, 2, 3, 4, 5, 6, 7],
    2: [8, 9, 10, 11, 12, 13, 14],
    3: [15, 16, 17, 18, 19, 20, 21],
    4: [22, 23, 24, 25, 26, 27, 28],
    5: [29, 30, 31, 1, 2, 3, 4],
    6: [5, 6, 7, 8, 9, 10, 11],
    7: [12, 13, 14, 15, 16, 17, 18],
    8: [19, 20, 21, 22, 23, 24, 25],
    9: [26, 27, 28, 29, 1, 2, 3],
    10: [4, 5, 6, 7, 8, 9, 10],
    11: [11, 12, 13, 14, 15, 16, 17],
    12: [18, 19, 20, 21, 22, 23, 24],
    13: [25, 26, 27, 28, 29, 30, 31],
    14: [1, 2, 3, 4, 5, 6, 7],
    15: [8, 9, 10, 11, 12, 13, 14],
    16: [15, 16, 17, 18, 19, 20, 21],
    17: [22, 23, 24, 25, 26, 27, 28],
    18: [29, 30, 1, 2, 3, 4, 5],
    19: [6, 7, 8, 9, 10, 11, 12],
    20: [13, 14, 15, 16, 17, 18, 19],
    21: [20, 21, 22, 23, 24, 25, 26],
    22: [27, 28, 29, 30, 31, 1, 2],
    23: [3, 4, 5, 6, 7, 8, 9],
    24: [10, 11, 12, 13, 14, 15, 16],
    25: [17, 18, 19, 20, 21, 22, 23],
    26: [24, 25, 26, 27, 28, 29, 30],
    27: [1, 2, 3, 4, 5, 6, 7],
    28: [8, 9, 10, 11, 12, 13, 14],
    29: [15, 16, 17, 18, 19, 20, 21],
    30: [22, 23, 24, 25, 26, 27, 28],
    31: [29, 30, 31, 1, 2, 3, 4],
    32: [5, 6, 7, 8, 9, 10, 11],
    33: [12, 13, 14, 15, 16, 17, 18],
    34: [19, 20, 21, 22, 23, 24, 25],
    35: [26, 27, 28, 29, 30, 31, 1],
    36: [2, 3, 4, 5, 6, 7, 8],
    37: [9, 10, 11, 12, 13, 14, 15],
    38: [16, 17, 18, 19, 20, 21, 22],
    39: [23, 24, 25, 26, 27, 28, 29],
    40: [30, 1, 2, 3, 4, 5, 6],
    41: [7, 8, 9, 10, 11, 12, 13],
    42: [14, 15, 16, 17, 18, 19, 20],
    43: [21, 22, 23, 24, 25, 26, 27],
    44: [28, 29, 30, 31, 1, 2, 3],
    45: [4, 5, 6, 7, 8, 9, 10],
    46: [11, 12, 13, 14, 15, 16, 17],
    47: [18, 19, 20, 21, 22, 23, 24],
    48: [25, 26, 27, 28, 29, 30, 1],
    49: [2, 3, 4, 5, 6, 7, 8],
    50: [9, 10, 11, 12, 13, 14, 15],
    51: [16, 17, 18, 19, 20, 21, 22],
    52: [23, 24, 25, 26, 27, 28, 29],
  },
  2025: {
    1: [30, 31, 1, 2, 3, 4, 5],
    2: [8, 9, 10, 11, 12, 13, 14],
    3: [15, 16, 17, 18, 19, 20, 21],
    4: [22, 23, 24, 25, 26, 27, 28],
    5: [29, 30, 31, 1, 2, 3, 4],
    6: [5, 6, 7, 8, 9, 10, 11],
    7: [12, 13, 14, 15, 16, 17, 18],
    8: [19, 20, 21, 22, 23, 24, 25],
    9: [26, 27, 28, 29, 1, 2, 3],
    10: [4, 5, 6, 7, 8, 9, 10],
    11: [11, 12, 13, 14, 15, 16, 17],
    12: [18, 19, 20, 21, 22, 23, 24],
    13: [25, 26, 27, 28, 29, 30, 31],
    14: [1, 2, 3, 4, 5, 6, 7],
    15: [8, 9, 10, 11, 12, 13, 14],
    16: [15, 16, 17, 18, 19, 20, 21],
    17: [22, 23, 24, 25, 26, 27, 28],
    18: [29, 30, 1, 2, 3, 4, 5],
    19: [6, 7, 8, 9, 10, 11, 12],
    20: [13, 14, 15, 16, 17, 18, 19],
    21: [20, 21, 22, 23, 24, 25, 26],
    22: [27, 28, 29, 30, 31, 1, 2],
    23: [3, 4, 5, 6, 7, 8, 9],
    24: [10, 11, 12, 13, 14, 15, 16],
    25: [17, 18, 19, 20, 21, 22, 23],
    26: [24, 25, 26, 27, 28, 29, 30],
    27: [1, 2, 3, 4, 5, 6, 7],
    28: [8, 9, 10, 11, 12, 13, 14],
    29: [15, 16, 17, 18, 19, 20, 21],
    30: [22, 23, 24, 25, 26, 27, 28],
    31: [29, 30, 31, 1, 2, 3, 4],
    32: [5, 6, 7, 8, 9, 10, 11],
    33: [12, 13, 14, 15, 16, 17, 18],
    34: [19, 20, 21, 22, 23, 24, 25],
    35: [26, 27, 28, 29, 30, 31, 1],
    36: [2, 3, 4, 5, 6, 7, 8],
    37: [9, 10, 11, 12, 13, 14, 15],
    38: [16, 17, 18, 19, 20, 21, 22],
    39: [23, 24, 25, 26, 27, 28, 29],
    40: [30, 1, 2, 3, 4, 5, 6],
    41: [7, 8, 9, 10, 11, 12, 13],
    42: [14, 15, 16, 17, 18, 19, 20],
    43: [21, 22, 23, 24, 25, 26, 27],
    44: [28, 29, 30, 31, 1, 2, 3],
    45: [4, 5, 6, 7, 8, 9, 10],
    46: [11, 12, 13, 14, 15, 16, 17],
    47: [18, 19, 20, 21, 22, 23, 24],
    48: [25, 26, 27, 28, 29, 30, 1],
    49: [2, 3, 4, 5, 6, 7, 8],
    50: [9, 10, 11, 12, 13, 14, 15],
    51: [16, 17, 18, 19, 20, 21, 22],
    52: [23, 24, 25, 26, 27, 28, 29],
  },
};
