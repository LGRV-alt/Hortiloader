import PocketBase from "pocketbase";

const pb = new PocketBase("https://hortiloader.pockethost.io");
export default pb;

export async function createTask(
  title,
  day,
  postcode,
  orderNumber,
  customerType
) {
  const data = {
    title: title,
    day: day,
    postcode: postcode,
    orderNumber: orderNumber,
    customerType: customerType,
    user: pb.authStore.model.id,
  };
  await pb.collection("tasks").create(data);

  //   window.location.reload();
  history.go(0);
}

export async function deleteTask(id) {
  let confirm = window.confirm("Are you sure you want to delete this task?");
  if (!confirm) {
    return;
  }
  await pb.collection("tasks").delete(id);
  window.location.reload();
}

export async function taskStatus(id, title, status) {
  const data = {
    title: title,
    id: id,
    status: status,
    user: pb.authStore.model.id,
  };
  await pb.collection("tasks").update(id, data);

  history.go(0);
}

export const isUserValid = pb.authStore.isValid;

export async function login(username, password) {
  await pb.collection("tasks").authWithPassword(username, password);
}

export function signout() {
  pb.authStore.clear();
}

export async function signup(username, password) {
  const data = {
    username: username,
    password: password,
    passowrdConfirm: password,
  };
  await pb.collection("tasks").create(data);
}
