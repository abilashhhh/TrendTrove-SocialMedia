import React from "react";
import CONSTANTS from "../Constants/common";

function ErrorPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <img
        src={CONSTANTS.ERROR_NOTFOUND}
        alt="404 error svg"
        className="max-w-full max-h-full"
      />
    </div>
  );
}

export default ErrorPage;
