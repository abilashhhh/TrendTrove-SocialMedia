import React, { useEffect, useState } from "react";
import {
  changePassword,
  changePassword2,
  deleteAccount,
  getUserProgressInPremiumaccount,
  handledocSupport,
  makepayment,
  passwordCheck,
  premiumAccount,
  setPrivateAccount,
  setPublicAccount,
  suspendAccount,
} from "../../API/Profile/profile";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import {
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validations";
import { useNavigate } from "react-router-dom";
import useUserDetails from "../../Hooks/useUserDetails";
import upload from "../../utils/cloudinary";
import { DocumentSupportTypes } from "../../Types/userProfile";
import ReCAPTCHA from "react-google-recaptcha";

// Main Settings Page Component
const SettingsMiddlePage = () => {
  const [activeSection, setActiveSection] = useState("PremiumAccount");
  const currentUser = useUserDetails();
  const navigate = useNavigate();
  return (
    <>
      <ToastContainer />
      <main className="flex-1 min-h-full    bg-gray-100 dark:bg-gray-900 text-black dark:text-white no-scrollbar">
        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-900 text-black dark:text-white h-full overflow-y-auto overflow-x-auto  no-scrollbar">
          <div className="flex flex-col md:flex-row gap-4 h-full overflow-x-auto">
            <div className="w-full md:w-1/5 overflow-x-auto  flex flex-col text-black dark:text-white text-l border-r-2  border-slate-200 dark:border-slate-800">
              <div className="p-4 space-y-4 overflow-x-auto">
                <h1 className="text-xl font-semibold underline text-center mb-4">
                  Settings
                </h1>
                {!currentUser.isGoogleSignedIn && (
                  <button
                    onClick={() => setActiveSection("ChangePassword")}
                    className="bg-gray-200 dark:bg-slate-800 w-full rounded p-3 hover:bg-gray-300 dark:hover:bg-slate-700">
                    Change Password
                  </button>
                )}
                {currentUser.isGoogleSignedIn && (
                  <button
                    onClick={() => setActiveSection("ChangePassword2")}
                    className="bg-gray-200 dark:bg-slate-800 w-full rounded p-3 hover:bg-gray-300 dark:hover:bg-slate-700">
                    Change Password
                  </button>
                )}
                <button
                  onClick={() => setActiveSection("DeleteAccount")}
                  className="bg-gray-200 dark:bg-slate-800 w-full rounded p-3 hover:bg-gray-300 dark:hover:bg-slate-700">
                  Delete Account
                </button>
                <button
                  onClick={() => setActiveSection("SuspendAccount")}
                  className="bg-gray-200 dark:bg-slate-800 w-full rounded p-3 hover:bg-gray-300 dark:hover:bg-slate-700">
                  Suspend Account
                </button>
                <button
                  onClick={() => setActiveSection("PrivateAccount")}
                  className="bg-gray-200 dark:bg-slate-800 w-full rounded p-3 hover:bg-gray-300 dark:hover:bg-slate-700">
                  Change to private account
                </button>
                <button
                  onClick={() => setActiveSection("PremiumAccount")}
                  className="bg-gray-200 dark:bg-slate-800 w-full rounded p-3 hover:bg-gray-300 dark:hover:bg-slate-700">
                  Premium account
                </button>
              </div>
            </div>
            <div className="w-full md:w-4/5 bg-gray-100 dark:bg-slate-900 rounded-lg flex text-black dark:text-white text-xl h-full overflow-auto no-scrollbar">
              <div className="p-4 w-full">
                {activeSection === "ChangePassword" && (
                  <ChangePassword currentUser={currentUser} />
                )}
                {activeSection === "ChangePassword2" && (
                  <ChangePassword2 currentUser={currentUser} />
                )}
                {activeSection === "DeleteAccount" && (
                  <DeleteAccount currentUser={currentUser} />
                )}
                {activeSection === "SuspendAccount" && (
                  <SuspendAccount currentUser={currentUser} />
                )}
                {activeSection === "PrivateAccount" && (
                  <PrivateAccount currentUser={currentUser} />
                )}
                {activeSection === "PremiumAccount" && (
                  <PremiumAccount currentUser={currentUser} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

// Change Password Component
const ChangePassword = ({ currentUser }) => {
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();
  const handleChangePassword = async e => {
    e.preventDefault();

    // Validate passwords
    const passwordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(confirmNewPassword);

    if (passwordError || confirmPasswordError) {
      toast.error(passwordError || confirmPasswordError);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const userInfo = { _id: currentUser._id, currentPassword, newPassword };
    console.log("userinfo :", userInfo);

    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to change your password?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const changeResult = await changePassword(userInfo);
          if (changeResult.status === "success") {
            toast.success("Password updated successfully");
            setTimeout(() => {
              navigate("/home");
            }, 3000);
          } else {
            toast.error(`Failed to update password: ${changeResult.message}`);
            return;
          }
        } catch (error) {
          toast.error(
            "Failed to update password, Check all fields and try again"
          );
        }
      }
    });
  };

  return (
    <div className="p-2">
      <h2 className="text-2xl mb-6 underline">Change Password</h2>
      <form className="space-y-4" onSubmit={handleChangePassword}>
        <div>
          <label className="block text-sm">Current Password</label>
          <input
            type="password"
            placeholder="Enter current password here.."
            className="w-full font-thin size-8 m-2 p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">New Password</label>
          <input
            type="password"
            placeholder="Enter new password here.."
            className="w-full font-thin size-8 m-2 p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm new password here.."
            className="w-full font-thin size-8 m-2 p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 dark:bg-blue-700 rounded p-2 hover:bg-blue-400 dark:hover:bg-blue-600">
          Update Password
        </button>
      </form>
    </div>
  );
};

// Change Password Component
const ChangePassword2 = ({ currentUser }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();
  const handleChangePassword = async e => {
    e.preventDefault();

    // Validate passwords
    const passwordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(confirmNewPassword);

    if (passwordError || confirmPasswordError) {
      toast.error(passwordError || confirmPasswordError);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const userInfo = { _id: currentUser._id, newPassword };
    console.log("userinfo :", userInfo);

    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to change your password?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const changeResult = await changePassword2(userInfo);
          if (changeResult.status === "success") {
            toast.success("Password updated successfully");
            setTimeout(() => {
              navigate("/home");
            }, 3000);
          } else {
            toast.error(`Failed to update password: ${changeResult.message}`);
            return;
          }
        } catch (error) {
          toast.error(
            "Failed to update password, Check all fields and try again"
          );
        }
      }
    });
  };

  return (
    <div className="p-2">
      <h2 className="text-2xl mb-6 underline">Change Password</h2>
      <form className="space-y-4" onSubmit={handleChangePassword}>
         
        <div>
          <label className="block text-sm">New Password</label>
          <input
            type="password"
            placeholder="Enter new password here.."
            className="w-full font-thin size-8 m-2 p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm new password here.."
            className="w-full font-thin size-8 m-2 p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 dark:bg-blue-700 rounded p-2 hover:bg-blue-400 dark:hover:bg-blue-600">
          Update Password
        </button>
      </form>
    </div>
  );
};

const DeleteAccount = ({ currentUser }) => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: "Enter your password",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
        autocomplete: "off",
        spellcheck: "false",
      },
      showCancelButton: true,
      confirmButtonText: "Delete Account",
      showLoaderOnConfirm: true,
      preConfirm: async password => {
        try {
          const deleteAccountResult = await deleteAccount(
            currentUser._id,
            password
          );
          if (deleteAccountResult.status === "success") {
            return deleteAccountResult;
          } else {
            Swal.showValidationMessage(`Check your current password`);
            Swal.showValidationMessage(
              `Failed to delete account: ${deleteAccountResult.message}`
            );
          }
        } catch (error) {
          Swal.showValidationMessage(`Check your current password`);
          Swal.showValidationMessage(`Failed to delete account. Try again`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async result => {
      if (result.isConfirmed) {
        toast.success("Account deleted successfully");
        toast.error("Logging out...");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Delete Account</h2>
      <p>
        Are you sure you want to delete your account? This action cannot be
        undone.
      </p>
      <button
        className="bg-red-500 dark:bg-red-700 rounded p-2 mt-4 hover:bg-red-400 dark:hover:bg-red-600"
        onClick={handleDeleteAccount}>
        Delete My Account
      </button>
    </div>
  );
};

const SuspendAccount = ({ currentUser }) => {
  const navigate = useNavigate();
  const handleSuspendAccount = async () => {
    Swal.fire({
      title: "Enter your password",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
        autocomplete: "off",
        spellcheck: "false",
      },
      showCancelButton: true,
      confirmButtonText: "Suspend Account",
      showLoaderOnConfirm: true,
      preConfirm: async password => {
        try {
          const suspendAccountResult = await suspendAccount(
            currentUser._id,
            password
          );
          if (suspendAccountResult.status === "success") {
            toast.error("Logging out...");
            setTimeout(() => {
              navigate("/");
            }, 3000);
            return suspendAccountResult;
          } else {
            Swal.showValidationMessage(`Check your current password`);
            Swal.showValidationMessage(
              `Failed to suspend account: ${suspendAccountResult.message}`
            );
          }
        } catch (error) {
          Swal.showValidationMessage(`Check your current password`);
          Swal.showValidationMessage(`Failed to suspend account. Try again`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(result => {
      if (result.isConfirmed) {
        toast.success("Account suspended successfully");
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Suspend Account</h2>
      <p>
        Are you sure you want to suspend your account? You can reactivate it
        later.
      </p>
      <button
        className="bg-yellow-500 dark:bg-yellow-700 rounded p-2 mt-4 hover:bg-yellow-400 dark:hover:bg-yellow-600"
        onClick={handleSuspendAccount}>
        Suspend My Account
      </button>
    </div>
  );
};


const PrivateAccount = ({ currentUser }) => {
  const navigate = useNavigate();

  const handlePrivateAccount = async () => {
    Swal.fire({
      title: "Enter your password",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
        autocomplete: "off",
        spellcheck: "false",
      },
      showCancelButton: true,
      confirmButtonText: "Change to private account",
      showLoaderOnConfirm: true,
      preConfirm: async password => {
        try {
          const privateAccountResult = await setPrivateAccount(
            currentUser._id,
            password
          );

          if (privateAccountResult.status === "success") {
            toast.success("Account set to private successfully");
            // Additional actions after setting the account to private
          } else {
            Swal.showValidationMessage(`Failed to set account to private: ${privateAccountResult.message}`);
          }
        } catch (error) {
          Swal.showValidationMessage(`Failed to set account to private. Try again`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(result => {
      if (result.isConfirmed) {
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      }
    });
  };

  const handlePublicAccount = async () => {
    Swal.fire({
      title: "Enter your password",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
        autocomplete: "off",
        spellcheck: "false",
      },
      showCancelButton: true,
      confirmButtonText: "Change to public account",
      showLoaderOnConfirm: true,
      preConfirm: async password => {
        try {
          const publicAccountResult = await setPublicAccount(
            currentUser._id,
            password
          );

          if (publicAccountResult.status === "success") {
            toast.success("Account set to public successfully");
            // Additional actions after setting the account to public
          } else {
            Swal.showValidationMessage(`Failed to set account to public: ${publicAccountResult.message}`);
          }
        } catch (error) {
          Swal.showValidationMessage(`Failed to set account to public. Try again`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(result => {
      if (result.isConfirmed) {
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Account Privacy</h2>
      {!currentUser.isPrivate && (
        <div>
          <p>Are you sure you want to set your account to private?</p>
          <button
            className="bg-purple-500 dark:bg-purple-700 rounded p-2 mt-4 hover:bg-purple-400 dark:hover:bg-purple-600"
            onClick={handlePrivateAccount}
          >
            Set Account to Private
          </button>
        </div>
      )}
      {currentUser.isPrivate && (
        <div>
          <p>Are you sure you want to set your account to public?</p>
          <button
            className="bg-purple-500 dark:bg-purple-700 rounded p-2 mt-4 hover:bg-purple-400 dark:hover:bg-purple-600"
            onClick={handlePublicAccount}
          >
            Set Account to Public
          </button>
        </div>
      )}
    </div>
  );
};



interface Props {
  currentUser: { _id: string; name: string; email: string };
}

const PremiumAccount: React.FC<Props> = ({ currentUser }) => {
  const navigate = useNavigate();
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [documentsSubmitted, setdocumentsSubmitted] = useState(false);
  const [adminApproved, setAdminApproved] = useState(false);
  const [hasExpired, setHasExpired] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [progress, setProgress] = useState();
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      if(!recaptchaValue) {
        toast.error("Please complete the ReCAPTCHA verification.");
      return;
        
      }
      const paymentResponse = await makepayment();
      console.log("payment resp : ", paymentResponse);
      if (paymentResponse?.status === "success") {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_ID_KEY,
          amount: paymentResponse.order.amount,
          currency: paymentResponse.order.currency,
          name: "TrendTrove",
          description: "Premium Account Payment",
          order_id: paymentResponse.order.id,
          handler: async (response: any) => {
            try {
              const res = await premiumAccount(
                currentUser._id,
                response.razorpay_payment_id
              );
              if (res.status === "success") {
                toast.success("Payment Successful.");
                toast.success("Proceed to upload the documents.");
                setPaymentDone(true);
              }
            } catch (error) {
              toast.error(
                "Failed to update account status. Please contact support."
              );
            }
          },
          prefill: {
            name: currentUser.name,
            email: currentUser.email,
          },
          notes: {
            address: "TrendTrove",
          },
          theme: {
            color: "#666666",
          },
        };
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error) {
      toast.error("Failed to initiate payment");
    }
  };
  const onChange = (value: string | null) => {
    console.log("Captcha value:", value);
    setRecaptchaValue(value);
  };

  const handlePremiumAccount = async () => {
    const { value: password } = await Swal.fire({
      title: "Enter your password",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
        autocomplete: "off",
        spellcheck: "false",
      },
      showCancelButton: true,
      confirmButtonText: "Verify Password",
    });

    if (password) {
      try {
        const verifyPasswordResult = await passwordCheck(
          currentUser._id,
          password
        );
        if (verifyPasswordResult.status === "success") {
          toast.success("Password verification successful");
          setPasswordVerified(true);
        } else {
          toast.error("Failed to verify password, try again");
        }
      } catch (error) {
        toast.error("Failed to verify password. Try again");
      }
    }
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setIsUploading(true);
    try {
      const urls = await Promise.all(
        files.map(async file => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          return new Promise<string>((resolve, reject) => {
            reader.onloadend = async () => {
              try {
                const imgData = reader.result as string;
                const response = await upload(
                  imgData,
                  err => toast.error(err),
                  "premiumAccountDocuments",
                  "image"
                );
                if (response?.url) {
                  resolve(response.url);
                } else {
                  reject("Failed to upload image");
                }
              } catch (error) {
                reject(error);
              }
            };
          });
        })
      );
      setImages(prevImages => [...prevImages, ...urls]);
      toast.success("Images uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload images");
      console.log("Error uploading images: ", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDocumentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: DocumentSupportTypes = {
      userId: currentUser._id,
      documentType,
      images,
    };
    try {
      const response = await handledocSupport(payload);
      console.log("Documents submitted for handleDocSupport : ", payload);
      if (response.status === "success") {
        toast.success("Documents submitted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        toast.error("Failed to submit documents");
      }
    } catch (error) {
      toast.error("Failed to submit documents");
    }
  };

  const userProgressInPremiumaccount = async () => {
    console.log("userProgressInPremiumaccount ran");
    const progress = await getUserProgressInPremiumaccount();
    setProgress(progress);
    console.log("Progress :", progress.result);

    if (progress.result.hasExpired) {
      setAdminApproved(false);
      setPasswordVerified(false);
      setPaymentDone(false);
      setdocumentsSubmitted(false);
      setHasExpired(true);
    } else if (
      progress.result.premiumRequest.isAdminApproved &&
      !progress.result.hasExpired
    ) {
      setAdminApproved(true);
      setPasswordVerified(true);
      setPaymentDone(true);
      setdocumentsSubmitted(true);
      setHasExpired(false);

      
    } else if (
      progress.result.paymentDetails &&
      progress.result.premiumRequest.documents.length! <= 0
    ) {
      setPasswordVerified(true);
      setPaymentDone(true);
      setHasExpired(false);

    } else if (progress.result.premiumRequest.isRequested) {
      setPasswordVerified(true);
      setPaymentDone(true);
      setdocumentsSubmitted(true);
      setHasExpired(false);

    }
  };

  useEffect(() => {
    userProgressInPremiumaccount();
  }, [currentUser._id]);

  return (
    <div >
      <ToastContainer />
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4  items-center text-center">
        Set Account to Premium
      </h2>
      {!passwordVerified && (
        <div>
          <p>Are you sure you want to set your account to premium?</p>
          <p>Confirm your password and proceed to payment</p>
          <button
            className="bg-blue-500 dark:bg-blue-700 rounded p-2 mt-4 hover:bg-blue-400 dark:hover:bg-blue-600"
            onClick={handlePremiumAccount}>
            Switch to Premium Account
          </button>
        </div>
      )}
      {passwordVerified && !paymentDone && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Upgrade to a verified account and enjoy exclusive benefits designed
            to enhance your experience.
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
            <li>Exclusive access to premium features and tools.</li>
            <li>Enhanced security and account protection.</li>
            <li>Priority customer support and assistance.</li>
            <li>Increased visibility and credibility within the community.</li>
            <li>Ad-free browsing experience.</li>
          </ul>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Amount
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Rs500 per month</p>
          </div>
          <div>
          </div>
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={onChange}
            />
            <div>
            <button
              className="bg-blue-500 dark:bg-blue-700 text-white rounded p-2 mt-4 hover:bg-blue-400 dark:hover:bg-blue-600"
              onClick={handlePayment}>
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
      {paymentDone && !documentsSubmitted && (
        <div>
          <form onSubmit={handleDocumentSubmit}>
            <div className="mb-4">
              <div className="p-5 mx-auto my-5 rounded-lg bg-slate-100 dark:bg-slate-800 text-black dark:text-white text-center text-lg font-bold max-w-md shadow-lg">
                Payment completed successfully
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Upload documents to get premium account
              </h2>
              <label className="block text-sm font-small text-gray-700 dark:text-gray-300">
                Type of Document
              </label>
              <select
                value={documentType}
                onChange={e => setDocumentType(e.target.value)}
                className="mt-1 block w-4/5 rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                required>
                <option value="" disabled>
                  Select a document type
                </option>
                <option value="passport">Passport</option>
                <option value="driver_license">Driver's License</option>
                <option value="national_id">National ID</option>
                <option value="voter_id">Voter ID</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              {images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Uploaded document ${index + 1}`}
                    className="mb-4"
                  />
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload Documents
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAddImage}
                className="mt-1 block w-4/5 rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                required
              />
            </div>
            {!isUploading && (
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Submit documents
              </button>
            )}
          </form>
        </div>
      )}

      {documentsSubmitted && !adminApproved && (
        <div>
          <div className="p-5 mx-auto my-5 rounded-lg bg-slate-100 dark:bg-slate-800 text-black dark:text-white text-center text-lg font-bold max-w-md shadow-lg">
            Payment completed successfully
          </div>
          <div className="p-5 mx-auto my-5 rounded-lg bg-slate-100 dark:bg-slate-800 text-black dark:text-white text-center text-lg font-bold max-w-md shadow-lg">
            Documents submitted successfully, admin will verify and process your
            request.
          </div>
        </div>
      )}
      {adminApproved && !hasExpired && (
        <div>
          <div className="p-5 mx-auto my-5 rounded-lg bg-slate-100 dark:bg-slate-800 text-black dark:text-white text-center text-lg font-bold max-w-md shadow-lg">
            Congratulations
          </div>
          <div className="p-5 mx-auto my-5 rounded-lg bg-slate-100 dark:bg-slate-800 text-black dark:text-white text-center text-lg font-bold max-w-md shadow-lg">
            You are an premium account holder now
          </div>
          <div className="p-5 mx-auto my-5 rounded-lg bg-slate-100 dark:bg-slate-800 text-black dark:text-white text-center text-lg font-bold max-w-md shadow-lg">
            <h3>
              Premium account valid till{" "}
              {new Date(
                progress?.result?.premiumExpiresAt
              ).toLocaleDateString()}
            </h3>
          </div>
        </div>
      )}
      {hasExpired && (
        <div>
          <div className="p-5 mx-auto my-5 rounded-lg bg-slate-100 dark:bg-slate-800 text-black dark:text-white text-center text-lg font-bold max-w-md shadow-lg">
            Premium account expired
          </div>
          
          <div className="p-5 mx-auto my-5 rounded-lg bg-slate-100 dark:bg-slate-800 text-black dark:text-white text-center text-lg font-bold max-w-md shadow-lg">
            <h3>
              Premium account expired on {" "}
              {new Date(
                progress?.result?.premiumExpiresAt
              ).toLocaleDateString()}
            </h3>
          </div>
          <div className="p-5 mx-auto my-5 rounded-lg bg-slate-100 dark:bg-slate-800 text-black dark:text-white text-center text-lg font-bold max-w-md shadow-lg">
            Proceeed to payment to get premium features again 
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsMiddlePage;
