import React, { useEffect, useState } from "react";
import {
  approvePremium,
  fetchAllPremiumAccountData,
  getAllUsersForAdmin,
  removePremium,
} from "../../API/Admin/admin";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import { PremiumAccountInterface } from "../../Types/userProfile";

const AdminPremiumManagementComponent: React.FC = () => {
  const [premiumAccounts, setPremiumAccounts] = useState<
    PremiumAccountInterface[]
  >([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [accountsPerPage] = useState(5);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchUserId, setSearchUserId] = useState("");
  const [foundUser, setFoundUser] = useState(null);

  const getPremiumAccountData = async () => {
    try {
      const response = await fetchAllPremiumAccountData();
      if (response) {
        setPremiumAccounts(response.premiumAccountRequests);
      } else {
        toast.error("Failed to fetch premium account data");
      }
    } catch (error) {
      console.error("Error fetching premium account data:", error);
      toast.error("An error occurred while fetching premium account data");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsersForAdmin();
        setUsers(allUsers.users);
        console.log(allUsers.users);
      } catch (error) {
        toast.error("Failed to load users");
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    getPremiumAccountData();
  }, []);

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleSearch = () => {
    const user = users.find(
      user =>
        user._id === searchUserId ||
        user.username === searchUserId ||
        user.name === searchUserId
    );
    if (user) {
      setFoundUser(user);
    } else {
      toast.error("User not found");
      setFoundUser(null);
    }
  };

  const handleApprovePremium = (userId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to approve this user's premium request.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await approvePremium(userId);
          Swal.fire('Approved!', 'The user has been approved as premium.', 'success');
          getPremiumAccountData();
          toast.success('User approved as premium successfully.');
        } catch (error) {
          toast.error('Failed to approve user as premium.');
        }
      }
    });
  };

  const handleRemovePremium = (userId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to remove this user's premium status.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await removePremium(userId);
          Swal.fire('Removed!', 'The user\'s premium status has been removed.', 'success');
          getPremiumAccountData();
          toast.success('User premium status removed successfully.');
        } catch (error) {
          toast.error('Failed to remove user premium status.');
        }
      }
    });
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

  const offset = currentPage * accountsPerPage;
  const currentAccounts = premiumAccounts.slice(
    offset,
    offset + accountsPerPage
  );
  const pageCount = Math.ceil(premiumAccounts.length / accountsPerPage);

  return (
    <main className="flex-1  overflow-auto bg-gray-800 dark:bg-gray-700 text-black dark:text-white">
      <div className="p-4  bg-gray-100 dark:bg-gray-900 text-black dark:text-white h-full overflow-y-auto no-scrollbar flex flex-col">
        <h1 className="text-center text-xl font-semibold mb-4">
          Premium Account Management
        </h1>
        {premiumAccounts.length >= 1 && <>        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search User"
            value={searchUserId}
            onChange={e => setSearchUserId(e.target.value)}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          />
          <button
            onClick={handleSearch}
            className="ml-2 px-4 py-2 rounded bg-blue-500 hover:bg-blue-700 text-white">
            Search
          </button>
        </div>
        {foundUser && (
          <div className="mb-4 p-4 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
            <h2 className="text-lg font-semibold mb-2">User Details</h2>
            <p>
              <strong>Name:</strong> {foundUser.name}
            </p>
            <p>
              <strong>Username:</strong> {foundUser.username}
            </p>
            <p>
              <strong>Email:</strong> {foundUser.email}
            </p>
            <p>
              <strong>Bio:</strong> {foundUser.bio || "N/A"}
            </p>
            <p>
              <strong>Private:</strong> {foundUser.isPrivate ? "Yes" : "No"}
            </p>
            <p>
              <strong>Suspended:</strong> {foundUser.isSuspended ? "Yes" : "No"}
            </p>
            <p>
              <strong>Google Login:</strong>{" "}
              {foundUser.isGoogleSignedIn ? "Yes" : "No"}
            </p>
            <p>
              <strong>Blocked:</strong> {foundUser.isBlocked ? "Yes" : "No"}
            </p>
            <img
              src={foundUser.dp}
              alt={`${foundUser.name}'s profile`}
              className="w-32 h-32 rounded-full mt-4"
            />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Is Premium</th>
                <th className="px-4 py-2">Premium Expires At</th>
                <th className="px-4 py-2">Payment Details</th>
                <th className="px-4 py-2">Is Admin Approved</th>
                <th className="px-4 py-2">Documents</th>
              </tr>
            </thead>
            <tbody>
              {currentAccounts.map(account => {
                const user = users.find(user => user._id === account.userId);
                return (
                  <tr
                    key={account._id}
                    className="bg-gray-100 dark:bg-gray-700">
                    <td className="border px-4 py-2">
                      {user ? (
                        <div>
                          <p>
                            <strong>UserId:</strong> {user._id}
                          </p>
                          <p>
                            <strong>Name:</strong> {user.name}
                          </p>
                          <p>
                            <strong>Username:</strong> {user.username}
                          </p>
                          <p>
                            <strong>Email:</strong> {user.email}
                          </p>
                        </div>
                      ) : (
                        "User details not found"
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {account.isPremium ? (
                        <div className="bg-slate-200 dark:bg-slate-800 p-2 rounded-md text-center gap-2 flex flex-col">
                          <p className="bg-green-500">Yes</p>
                        </div>
                      ) : (
                        <div className="bg-slate-200 dark:bg-slate-800 p-2 rounded-md text-center gap-2 flex flex-col">
                          <p className="bg-red-500">No</p>
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {account.premiumExpiresAt
                        ? new Date(
                            account.premiumExpiresAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="border px-4 py-2">
                      <p>Payment Id:</p>
                      <div className="bg-slate-200 dark:bg-slate-800 p-2 rounded-md text-center gap-2 flex flex-col">
                        {account.paymentDetails || "N/A"}
                      </div>
                      <p>
                        Created Date:{" "}
                        {new Date(account.createdAt).toLocaleString()}
                      </p>
                      <p>
                        Last Updated Date:{"  "}{" "}
                        {new Date(account.updatedAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="border px-4 py-2">
                      {account.premiumRequest.isAdminApproved ? (
                        <div className="bg-slate-200 dark:bg-slate-800 p-2 rounded-md text-center gap-2 flex flex-col">
                          Yes
                          <button className="bg-red-500 hover:bg-red-600  rounded-md" onClick={() => handleRemovePremium(account.userId)}>
                            Remove Premium
                          </button>
                        </div>
                      ) : (
                        <div className="bg-slate-200 dark:bg-slate-800 p-2 rounded-md text-center gap-2 flex flex-col">
                          No
                          <button className="bg-green-500 hover:bg-green-600  rounded-md" onClick={() => handleApprovePremium(account.userId)}>
                            Approve Premium
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {account.premiumRequest.documents.length > 0
                        ? account.premiumRequest.documents.map((doc, index) => (
                            <div key={index} className="mb-2">
                              <p>
                                <strong>Type:</strong> {doc.type}
                              </p>
                              {doc.image.map((img, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  src={img}
                                  alt={`Document ${index + 1}`}
                                  className="w-32 h-32 object-cover m-1 border border-gray-300 rounded cursor-pointer"
                                  onClick={() => openModal(img)}
                                />
                              ))}
                            </div>
                          ))
                        : "No documents"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
            className="flex justify-center mt-4"
            previousClassName="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-l-md hover:bg-gray-300 dark:hover:bg-gray-600"
            nextClassName="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-600"
            pageClassName="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            activeClassName="bg-gray-400 dark:bg-gray-600"
          />
        </div> </>
        }
        {premiumAccounts.length <= 0 && <div>No requests found</div>}
      </div>

      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={closeModal} />
      )}
    </main>
  );
};

export default AdminPremiumManagementComponent;
