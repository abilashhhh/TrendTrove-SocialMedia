import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { StoreType } from "../../Redux/Store/reduxStore";
import { getAllUsers } from "../../API/User/user";
import { FaSearch } from "react-icons/fa";
import ProfileSectionFriendsPage from "./ProfileSectionFriendsPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCrown } from "@fortawesome/free-solid-svg-icons";
import { useActiveSection } from "./ActiveSectionContext";

const FriendsMiddlePage: React.FC = () => {
  const currentUser = useSelector((state: StoreType) => state.userAuth.user);
  const [users, setUsers] = useState<User[]>([]);
  const [searchUsers, setSearchedUsers] = useState<string>('');
  const { activeSection, setActiveSection } = useActiveSection();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers.user);

        if (
          activeSection &&
          !allUsers.user.some(user => user.username === activeSection)
        ) {
          setActiveSection(allUsers.user[0].username);
        }
      } catch (error) {
        toast.error("Failed to load users");
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, [currentUser, activeSection, setActiveSection]);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchUsers.toLowerCase()) || 
    user.name.toLowerCase().includes(searchUsers.toLowerCase())
  );

  return (
    <>
      <ToastContainer />
      <main className="flex-1 pt-2 p-2 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-black dark:text-white h-full">
          <div className="flex flex-col md:flex-row gap-2 h-full overflow-auto no-scrollbar">
            <div className="w-full md:w-2/6 xl:w-1/6  flex pr-2 border-r-2 border-slate-300 dark:border-slate-800 flex-col text-black dark:text-white text-xl">
              <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center">
                <FaSearch className="w-8 h-8 bg-gray-200 dark:bg-gray-800 p-2 rounded-lg" />
                <input
                  type="text"
                  onChange={e => setSearchedUsers(e.target.value)}
                  placeholder="Search here.."
                  className="bg-gray-200 dark:bg-gray-800 text-white w-full p-2 rounded-lg mr-2 focus:outline-none"
                />
              </div>
              <div className="overflow-y-auto no-scrollbar text-black  dark:text-white text-xl p-2 space-y-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div key={user._id}>
                      <button
                        onClick={() => setActiveSection(user.username)}
                        className={`w-full rounded-lg p-4 transition duration-300 ease-in-out shadow-md flex items-center space-x-4  ${
                          activeSection === user.username
                            ? "bg-gray-400 dark:bg-slate-600"
                            : "bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-500"
                        }`}
                      >
                        <img
                          src={user.dp || "/default-profile.jpg"}
                          className="rounded-full w-12 h-12 object-cover"
                          alt={`${user.username}'s profile`}
                        />
                        <div className="flex-1 flex flex-col text-left">
                          <h3 className="font-semibold text-lg flex items-center space-x-2 gap-1">
                     
                            {user.username} {user.isPremium ? <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500" /> : ""}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{user.name}</p>
                        </div>
                      </button>
                      {activeSection === user.username && (
                        <div className="block sm:hidden mt-4">
                          <ProfileSectionFriendsPage userDetails={user} currentUser={currentUser} />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-300 no-scrollbar">No users found</p>
                )}
              </div>
            </div>
            <div className="w-full md:w-4/6 xl:w-5/6 overflow-auto no-scrollbar rounded-lg flex flex-col text-black dark:text-white text-xl">
              {activeSection ? (
                <div className="w-full overflow-auto no-scrollbar">
                  <ProfileSectionFriendsPage userDetails={users.find(user => user.username === activeSection)} currentUser={currentUser} />
                </div>
              ) : (
                <div className="relative flex flex-col items-center justify-center h-full p-4 text-center text-gray-600 dark:text-gray-300">
                  <div className="box-of-star1">
                    <div className="star star-position1"></div>
                    <div className="star star-position2"></div>
                    <div className="star star-position3"></div>
                    <div className="star star-position4"></div>
                    <div className="star star-position5"></div>
                    <div className="star star-position6"></div>
                    <div className="star star-position7"></div>
                  </div>
                  <div className="box-of-star2">
                    <div className="star star-position1"></div>
                    <div className="star star-position2"></div>
                    <div className="star star-position3"></div>
                    <div className="star star-position4"></div>
                    <div className="star star-position5"></div>
                    <div className="star star-position6"></div>
                    <div className="star star-position7"></div>
                  </div>
                  <div className="box-of-star3">
                    <div className="star star-position1"></div>
                    <div className="star star-position2"></div>
                    <div className="star star-position3"></div>
                    <div className="star star-position4"></div>
                    <div className="star star-position5"></div>
                    <div className="star star-position6"></div>
                    <div className="star star-position7"></div>
                  </div>
                  <div className="box-of-star4">
                    <div className="star star-position1"></div>
                    <div className="star star-position2"></div>
                    <div className="star star-position3"></div>
                    <div className="star star-position4"></div>
                    <div className="star star-position5"></div>
                    <div className="star star-position6"></div>
                    <div className="star star-position7"></div>
                  </div>
                  <h1 className="mt-4 text-lg font-semibold">Select a user to see details</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <style>{`
        @keyframes snow {
          0% { opacity: 0; transform: translateY(0px); }
          20% { opacity: 1; }
          100% { opacity: 1; transform: translateY(650px); }
        }

        @keyframes astronaut {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .box-of-star1, .box-of-star2, .box-of-star3, .box-of-star4 {
          width: 100%;
          position: absolute;
          z-index: 10;
          left: 0;
          top: 0;
          height: 700px;
        }

        .box-of-star1 { animation: snow 5s linear infinite; }
        .box-of-star2 { animation: snow 5s -1.64s linear infinite; }
        .box-of-star3 { animation: snow 5s -2.30s linear infinite; }
        .box-of-star4 { animation: snow 5s -3.30s linear infinite; }

        .star {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background-color: #FFF;
          position: absolute;
          opacity: 0.7;
        }

        .star:before {
          width: 100%;
          height: 100%;
          position: absolute;
          content: "";
          border-radius: 50%;
          background-color: #FFF;
          transform: scale(2.5);
          opacity: 0.2;
        }

        .star-position1 { top: 45%; left: 24%; animation-delay: 1.12s; }
        .star-position2 { top: 20%; left: 44%; animation-delay: 0.68s; }
        .star-position3 { top: 32%; left: 65%; animation-delay: 0.85s; }
        .star-position4 { top: 4%; left: 75%; animation-delay: 1.44s; }
        .star-position5 { top: 56%; left: 40%; animation-delay: 1.16s; }
        .star-position6 { top: 77%; left: 90%; animation-delay: 1.84s; }
        .star-position7 { top: 90%; left: 90%; animation-delay: 1.64s; }

        .astronaut {
          position: relative;
          width: 185px;
          height: 300px;
          animation: astronaut 4.5s infinite both alternate ease-in-out;
        }

        .astronaut div {
          position: absolute;
          background-color: #FFF;
        }

        .astronaut .head {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
        }

        .astronaut .arm {
          width: 30px;
          height: 90px;
          top: 100px;
          background-color: transparent;
        }

        .astronaut .arm-left { left: -30px; transform: rotate(10deg); }
        .astronaut .arm-right { right: -30px; transform: rotate(-10deg); }

        .astronaut .body {
          width: 100px;
          height: 140px;
          top: 115px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #2F4F4F;
          border-radius: 50% 50% 0 0;
        }

        .astronaut .panel {
          width: 60px;
          height: 30px;
          background-color: #00CED1;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
        }

        .astronaut .leg {
          width: 24px;
          height: 90px;
          top: 250px;
          background-color: #FFF;
        }

        .astronaut .leg-left { left: 20px; transform: rotate(15deg); }
        .astronaut .leg-right { right: 20px; transform: rotate(-15deg); }

        .astronaut .schoolbag {
          width: 60px;
          height: 90px;
          background-color: #2F4F4F;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default FriendsMiddlePage;
