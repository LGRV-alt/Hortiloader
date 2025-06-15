import pb from "./pbConnect";
import { emitRefetchTasks } from "./eventBus";

// client.autoCancellation(false);
export const isUserValid = pb.authStore.isValid;

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
  year,
  trollies,
  extras
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
    trollies: trollies,
    extras: extras,
  };
  await pb.collection("tasks").update(id, data);
  emitRefetchTasks();
  // history.go(0);
}

// export async function login(username, password) {
//   try {
//     await pb.collection("users").authWithPassword(username, password);
//     console.log("Logged in:", pb.authStore.model);
//   } catch (error) {
//     console.log(error);
//     if (error.data?.code) {
//       alert("Invalid username or password");
//     }
//   }
// }

// export async function login(username, password) {
//   try {
//     await pb.collection("users").authWithPassword(username, password);
//     return { success: true };
//   } catch (error) {
//     const errorCode = error?.data?.code || error?.status;

//     // Return specific error messages
//     if (errorCode === "invalid_username_or_password" || error.status === 400) {
//       return { success: false, message: "Incorrect username or password." };
//     }

//     return { success: false, message: "Unexpected error occurred." };
//   }
// }

// export async function login(username, password) {
//   try {
//     await pb.collection("users").authWithPassword(username, password);

//     // Check if email is verified
//     if (!pb.authStore.model?.verified) {
//       pb.authStore.clear(); // Prevent login session for unverified users
//       return {
//         success: false,
//         message: "Please verify your email before logging in.",
//       };
//     }

//     return { success: true };
//   } catch (error) {
//     console.log(error);
//     const errorCode = error?.data?.code || error?.status;

//     if (errorCode === "invalid_username_or_password" || error?.status === 400) {
//       return { success: false, message: "Incorrect username or password." };
//     }

//     // Check if the error is specifically due to unverified email
//     if (error?.data?.email?.code === "email_not_verified") {
//       return {
//         success: false,
//         message: "Please verify your email before logging in.",
//       };
//     }

//     return { success: false, message: "Unexpected error occurred." };
//   }
// }

export async function login(username, password) {
  try {
    await pb.collection("users").authWithPassword(username, password);

    // Manually check for verification
    if (!pb.authStore.model?.verified) {
      pb.authStore.clear();
      return {
        success: false,
        message: "Please verify your email before logging in.",
      };
    }

    return { success: true };
  } catch (error) {
    const status = error?.status;

    // 403 = Forbidden due to collection rule (e.g. email not verified)
    if (status === 403) {
      return {
        success: false,
        message: "Email not verified. Please check your inbox.",
      };
    }

    if (status === 400) {
      return { success: false, message: "Incorrect username or password." };
    }

    return { success: false, message: "Unexpected error occurred." };
  }
}

export function signout() {
  localStorage.removeItem("user_settings_cache");
  pb.authStore.clear();
  window.location.reload();
}
// export async function signup(username, password, email) {
//   const data = {
//     username: username,
//     password: password,
//     passwordConfirm: password,
//     email: email,
//   };
//   try {
//     await pb.collection("users").create(data);
//     alert("User Created");
//   } catch (error) {
//     console.log("Error:", error);
//     console.log(error.data);
//     if (error.data.data.username.code) {
//       alert("user already exist");
//     }
//   }
// }
export async function signup(username, password, email) {
  const data = {
    username,
    password,
    passwordConfirm: password,
    email,
  };

  try {
    await pb.collection("users").create(data);
    await pb.collection("users").requestVerification(email);
    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);

    let message = "Something went wrong. Please try again.";

    // Handle duplicate username/email error
    if (error?.data?.data?.username?.code === "validation_error") {
      message = "Username already exists.";
    } else if (error?.data?.data?.email?.code === "validation_error") {
      message = "Email is already in use.";
    }

    return { success: false, message };
  }
}

// ---------------------Brought Over----------------------

export async function deleteTask(id) {
  await pb.collection("tasks").delete(id);
  emitRefetchTasks();
}

export async function taskStatus(id, title, status) {
  const data = {
    title: title,
    id: id,
    status: status,
  };
  await pb.collection("tasks").update(id, data);
  emitRefetchTasks();
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
    user: pb.authStore.model.id,
    other,
    weekNumber,
    orderInfo,
    status: status,
    year: year,
  };
  await pb.collection("tasks").create(data);
  emitRefetchTasks();
}

export function getDateWeek(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return weekNo;
  // return [d.getUTCFullYear(), weekNo];
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
    2: [6, 7, 8, 9, 10, 11, 12],
    3: [13, 14, 15, 16, 17, 18, 19],
    4: [20, 21, 22, 23, 24, 25, 26],
    5: [27, 28, 29, 30, 31, 1, 2],
    6: [3, 4, 5, 6, 7, 8, 9],
    7: [10, 11, 12, 13, 14, 15, 16],
    8: [17, 18, 19, 20, 21, 22, 23],
    9: [24, 25, 26, 27, 28, 1, 2],
    10: [3, 4, 5, 6, 7, 8, 9],
    11: [10, 11, 12, 13, 14, 15, 16],
    12: [17, 18, 19, 20, 21, 22, 23],
    13: [24, 25, 26, 27, 28, 29, 30],
    14: [31, 1, 2, 3, 4, 5, 6],
    15: [7, 8, 9, 10, 11, 12, 13],
    16: [14, 15, 16, 17, 18, 19, 20],
    17: [21, 22, 23, 24, 25, 26, 27],
    18: [28, 29, 30, 1, 2, 3, 4],
    19: [5, 6, 7, 8, 9, 10, 11],
    20: [12, 13, 14, 15, 16, 17, 18],
    21: [19, 20, 21, 22, 23, 24, 25],
    22: [26, 27, 28, 29, 30, 31, 1],
    23: [2, 3, 4, 5, 6, 7, 8],
    24: [9, 10, 11, 12, 13, 14, 15],
    25: [16, 17, 18, 19, 20, 21, 22],
    26: [23, 24, 25, 26, 27, 28, 29],
    27: [30, 1, 2, 3, 4, 5, 6],
    28: [7, 8, 9, 10, 11, 12, 13],
    29: [14, 15, 16, 17, 18, 19, 20],
    30: [21, 22, 23, 24, 25, 26, 27],
    31: [28, 29, 30, 31, 1, 2, 3],
    32: [4, 5, 6, 7, 8, 9, 10],
    33: [11, 12, 13, 14, 15, 16, 17],
    34: [18, 19, 20, 21, 22, 23, 24],
    35: [25, 26, 27, 28, 29, 30, 31],
    36: [1, 2, 3, 4, 5, 6, 7],
    37: [8, 9, 10, 11, 12, 13, 14],
    38: [15, 16, 17, 18, 19, 20, 21],
    39: [22, 23, 24, 25, 26, 27, 28],
    40: [29, 30, 1, 2, 3, 4, 5],
    41: [6, 7, 8, 9, 10, 11, 12],
    42: [13, 14, 15, 16, 17, 18, 19],
    43: [20, 21, 22, 23, 24, 25, 26],
    44: [27, 28, 29, 30, 31, 1, 2],
    45: [3, 4, 5, 6, 7, 8, 9],
    46: [10, 11, 12, 13, 14, 15, 16],
    47: [17, 18, 19, 20, 21, 22, 23],
    48: [24, 25, 26, 27, 28, 29, 30],
    49: [1, 2, 3, 4, 5, 6, 7],
    50: [8, 9, 10, 11, 12, 13, 14],
    51: [15, 16, 17, 18, 19, 20, 21],
    52: [22, 23, 24, 25, 26, 27, 28],
  },
};
