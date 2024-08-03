import PocketBase from "pocketbase";

const pb = new PocketBase("https://hortiloader.pockethost.io");

export async function createTask(title, day, postcode, orderNumber) {
  const data = {
    title: title,
    day: day,
    postcode: postcode,
    orderNumber: orderNumber,
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
  const data = { title: title, id: id, status: status };
  await pb.collection("tasks").update(id, data);
  window.location.reload();
}
