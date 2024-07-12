import { useEffect, useState } from "react";
import Search from "../search/Search";
import Pagination from "./pagination/Pagination";
import UserList from "./user-list/UserList";
import UserCreateForm from "./user-create-form/UserCreateForm";
import UserDetails from "./user-details/UserDetails";
import UserDelete from "./user-delete/UserDelete";

const baseUrl = "http://localhost:3030/jsonstore";

export default function UserSection() {
  const [users, setUsers] = useState([]);
  const [showCreateForm, setCreateForm] = useState(false);
  const [showUserDetailsById, setDetailsPopup] = useState(null);
  const [showDeletePopup, setDeletePopup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function fetchUsers() {
      const response = await fetch(`${baseUrl}/users`);
      const users = await response.json();
      setIsLoading(false);
      setUsers(Object.values(users));
    })();
  }, []);

  const showCreateFormHandler = () => {
    setCreateForm(true);
  };

  const closeCreateFormHandler = () => {
    setCreateForm(false);
  };

  const addUserHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData);

    const respone = await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const user = await respone.json();
    setUsers((oldUsers) => [...oldUsers, user]);
    setCreateForm(false);
    setIsLoading(falsae);
  };

  //DETAILS POPUP

  const detailPopupHandler = (userId) => {
    setDetailsPopup(userId);
  };

  const closePopupHandler = () => {
    setDetailsPopup(false);
  };

  //DELETE POPUP

  const onDeleteHandler = (userId) => {
    setDeletePopup(userId);
  };

  const closeDeletePopupHandler = () => {
    setDeletePopup(false);
  };

  const deleteHandler = async () => {
    await fetch(`${baseUrl}/users/${showDeletePopup}`, { method: "DELETE" });
    setUsers((oldUsers) =>
      oldUsers.filter((user) => user._id !== showDeletePopup)
    );
    setDeletePopup(false);
  };

  return (
    <section className="card users-container">
      <Search />
      <UserList
        users={users}
        onDetails={detailPopupHandler}
        onDelete={onDeleteHandler}
      />
      <button className="btn-add btn" onClick={showCreateFormHandler}>
        Add new user
      </button>
      {showCreateForm && (
        <UserCreateForm
          onClose={closeCreateFormHandler}
          onSave={addUserHandler}
        />
      )}
      {showUserDetailsById && (
        <UserDetails
          onClose={closePopupHandler}
          user={users.find((user) => user._id === showUserDetailsById)}
        />
      )}

      {showDeletePopup && (
        <UserDelete
          closeDelete={closeDeletePopupHandler}
          onDelete={deleteHandler}
        />
      )}

      <Pagination />
    </section>
  );
}
