const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    u => u.room === room && require.name === name
  );
  if (existingUser) return { error: "username is taken" };
  const user = { id, name, room };
  users.push(user);
  return { user };
};

const removeUser = id => {
  const index = users.find(u => u.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = id => users.find(u => u.id === id);

const getUsersInRoom = room => {
  return users.filter(u => u.room === room);
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
