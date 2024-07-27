import PocketBase from "pocketbase";
const pb = new PocketBase("https://hortiloader.pockethost.io");

export async function createTask(title, description) {
  const data = {
    title: title,
    description: description,
  };
  await pb.collection("tasks").create(data);
  window.location.reload();
}

export async function deleteTask(id) {
  let confirm = window.confirm("Are you sure you want to delete this task?");
  if (!confirm) {
    return;
  }
  await pb.collection("tasks").delete(id);
  window.location.reload();
}
