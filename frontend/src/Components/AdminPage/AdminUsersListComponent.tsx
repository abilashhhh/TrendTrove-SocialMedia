import React, { useEffect, useState } from "react";
import {
  getAllUsersForAdmin,
  blockUser,
  unblockUser,
} from "../../API/Admin/admin";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

const AdminUsersListComponent = () => {
  const [users, setUsers] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const itemsPerPage = 5; // Set the number of items per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsersForAdmin();
        setUsers(allUsers.users);
        setPageCount(Math.ceil(allUsers.users.length / itemsPerPage));
        setCurrentItems(allUsers.users.slice(0, itemsPerPage));
      } catch (error) {
        toast.error("Failed to load users");
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(users.slice(itemOffset, endOffset));
  }, [itemOffset, users]);

  const handlePageClick = event => {
    const newOffset = (event.selected * itemsPerPage) % users.length;
    setItemOffset(newOffset);
  };

  const handleBlockUser = async userId => {
    try {
      await blockUser(userId);
      toast.success("User blocked successfully");
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isBlocked: true } : user
        )
      );
    } catch (error) {
      toast.error("Failed to block user");
      console.error("Failed to block user", error);
    }
  };

  const handleUnblockUser = async userId => {
    try {
      await unblockUser(userId);
      toast.success("User unblocked successfully");
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isBlocked: false } : user
        )
      );
    } catch (error) {
      toast.error("Failed to unblock user");
      console.error("Failed to unblock user", error);
    }
  };

  const confirmBlockUnblock = (userId, isBlocked) => {
    Swal.fire({
      title: isBlocked ? "Unblock User?" : "Block User?",
      text: `Are you sure you want to ${
        isBlocked ? "unblock" : "block"
      } this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isBlocked ? "Yes, unblock" : "Yes, block",
    }).then(result => {
      if (result.isConfirmed) {
        if (isBlocked) {
          handleUnblockUser(userId);
        } else {
          handleBlockUser(userId);
        }
      }
    });
  };

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const ImageModal: React.FC<{ imageUrl: string; onClose: () => void }> = ({
    imageUrl,
    onClose,
  }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-4 rounded-lg max-w-4xl w-full">
          <img src={imageUrl} alt="Large Image" className="max-w-full h-auto" />
          <button
            onClick={onClose}
            className="block mt-4 mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1  overflow-auto bg-gray-800 dark:bg-gray-700 text-black dark:text-white">
      <div className="p-4  bg-gray-100 dark:bg-gray-900 text-black dark:text-white h-full overflow-y-auto no-scrollbar flex flex-col">
        <h1 className="text-center text-xl font-semibold mb-4">Users List</h1>
        <div className="overflow-x-auto">
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  UserProfile
                </th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  Name
                </th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  Email
                </th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  Username
                </th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  Bio
                </th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  Private
                </th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  Suspended
                </th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  Google Login
                </th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  Blocked
                </th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(user => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-200 dark:hover:bg-gray-700">
                  <td className="p-2 flex justify-center items-center border border-gray-300 dark:border-gray-600">
                    <img
                      src={user.dp}
                      alt={`${user.name}`}
                      className="w-10 h-10 rounded-full cursor-pointer"
                      onClick={() => openModal(user.dp)}
                    />
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-600">
                    {user.name}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-600">
                    {user.email}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-600">
                    {user.username}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-600">
                    {user.bio || "N/A"}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-600">
                    {user.isPrivate ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-600">
                    {user.isSuspended ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-600">
                    {user.isGoogleSignedIn ? "Yes" : "No"}
                  </td>
                  <td className="p-2  border border-gray-300 dark:border-gray-600">
                    {user.isBlocked ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-600 justify-center items-center ">
                    <button
                      onClick={() =>
                        confirmBlockUnblock(user._id, user.isBlocked)
                      }
                      className={`px-4 py-2 rounded justify-center items-center  ${
                        user.isBlocked
                          ? "bg-green-500 hover:bg-green-700"
                          : "bg-red-500 hover:bg-red-700"
                      } text-white`}>
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>
      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={closeModal} />
      )}
    </main>
  );
};

export default AdminUsersListComponent;
