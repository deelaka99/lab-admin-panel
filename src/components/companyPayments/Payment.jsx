import { React, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { set, ref, onValue } from "firebase/database";
import CompanyLogo from "../../assets/images/company_logo.png";

function Payment() {
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split("T")[0]; // Get date as a string
  const currentTimeString = currentDate.toTimeString().split(" ")[0]; // Get time as a string
  const paymentTime = currentTimeString;
  const paymentYear = currentDate.getFullYear();

  const [showAddedSuccessModal, setShowAddedSuccessModal] = useState(false);
  const [showAddedUnsuccessModal, setShowAddedUnsuccessModal] = useState(false);
  //variable state
  const [operatorName, setOperatorName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState(1500);
  const [loading, setLoading] = useState(false);

  //error states
  const [operatorNameError, setOperatorNameError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [monthError, setMonthError] = useState("");
  const [paymentMethodError, setPaymentMethodError] = useState("");
  const labUid = auth.currentUser.uid;

  useEffect(() => {
    if (labUid) {
      const labOpRef = ref(db, `labs/${labUid}`);
      const unsubscribe = onValue(labOpRef, (snapshot) => {
        if (snapshot.exists()) {
          const labOpData = snapshot.val();
          setOperatorName(labOpData.LabName);
        }
      });

      // Unsubscribe from the onValue listener when the component unmounts
      return () => {
        unsubscribe();
      };
    }
  }, []);

  //write
  const writeToDatabase = () => {
    //validation checks
    let isValid = true;

    if (!operatorName) {
      setOperatorNameError("Operator name is required");
      isValid = false;
    }

    if (!amount) {
      setAmountError("Amount is required");
      isValid = false;
    }

    if (!month) {
      setMonthError("Payment month is required");
      isValid = false;
    }

    if (!paymentMethod) {
      setPaymentMethodError("Payment method is required");
      isValid = false;
    }

    if (!isValid) {
      setShowAddedUnsuccessModal(true);
      return; //not proceed if there are validation errors
    } else {
      //writting data to the firebase
      try {
        setLoading(true); // Set loading state to true
        set(ref(db, `payments/labPayments/${labUid}/${month}_${paymentYear}`), {
          operatorName,
          paymentDate: currentDateString,
          paymentTime: currentTimeString,
          month: `${month}_${paymentYear}`,
          paymentMethod,
          amount,
          labUid,
        });
        setLoading(false);
        setShowAddedSuccessModal(true);
      } catch (error) {
        setShowAddedUnsuccessModal(true);
        console.log("Error adding Payment record: ", error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full ">
      <div className="h-full w-full flex items-center justify-center">
        <div className="border-2 border-ternary-blue bg-primary-blue bg-opacity-50 dark:bg-dark-primary dark:border-dark-ternary h-5/6 w-11/12 rounded-xl flex flex-col">
          <div className="h-full w-full p-2 text-white">
            {/* row contaqiner 1 */}
            <div className="dark:bg-gradient-to-r dark:from-primary-blue dark:to-secondary-blue bg-gradient-to-r from-gray1 to-gray2 shadow border border-ternary-blue dark:border-gray2  rounded-lg w-full h-2/4 p-5">
              <div className="flex w-full h-full">
                <div className="flex items-center justify-center h-full w-1/5 p-1">
                  <div className=" bg-primary-blue bg-opacity-70 border-2 shadow flex items-center justify-center h-full w-full rounded">
                    <img
                      src={CompanyLogo}
                      alt="companyLogo"
                      className="h-[90px] w-[90px]"
                    />
                  </div>
                </div>
                <div className="h-full w-4/5 p-3">
                  <div className="flex items-center justify-center rounded border-2 h-full w-full">
                    <p className="font-inter text-2xl">
                      {month
                        ? `You're going to pay for ${month} of ${paymentYear}!`
                        : "Select Month to Pay!"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* row contaqiner 2 */}
            <div className="w-full h-1/4">
              {/* row 1 */}
              <div className="flex w-full h-2/4">
                <div className="w-1/2 h-full">
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex items-center h-full w-2/6 pl-3">
                      Opeator
                    </div>
                    <div className="flex items-center justify-center h-full w-4/6">
                      <div className="h-full w-full p-2">
                        <input
                          type="text"
                          placeholder="Enter operator name"
                          className={`${
                            operatorNameError === ""
                              ? "bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary"
                              : "border-white bg-red-2 text-white"
                          } w-full h-full rounded-full text-white dark:text-gray1 border-secondary-blue border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1`}
                          value={operatorName}
                          onChange={(e) => {
                            setOperatorName(e.target.value);
                            setOperatorNameError("");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 h-full">
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex items-center h-full w-2/6 pl-3">
                      Payment method
                    </div>
                    <div className="flex items-center justify-center h-full w-4/6">
                      <div className="h-full w-full p-2">
                        {/* Dropdown for Value type */}
                        <select
                          value={paymentMethod}
                          placeholder="Enter the payment method"
                          onChange={(e) => {
                            setPaymentMethod(e.target.value);
                          }}
                          className="bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary
                          w-full h-full rounded-full text-white dark:text-gray1 border-2 pl-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                        >
                          <option>-Select Payment method-</option>
                          <option
                            className="text-primary-blue"
                            value="American Express"
                          >
                            American Express
                          </option>
                          <option
                            className="text-primary-blue"
                            value="Credit card"
                          >
                            Credit card
                          </option>
                          <option
                            className="text-primary-blue"
                            value="Debit card"
                          >
                            Debit card
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* row 2 */}
              <div className="flex w-full h-2/4">
                <div className="w-1/2 h-full">
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex items-center h-full w-2/6 pl-3">
                      Month
                    </div>
                    <div className="flex items-center justify-center h-full w-4/6">
                      <div className="h-full w-full p-2">
                        {/* Dropdown for Value type */}
                        <select
                          value={
                            month === "-Select Payment month-"
                              ? setMonth("")
                              : month
                          }
                          placeholder="Enter the payment method"
                          onChange={(e) => {
                            setMonth(e.target.value);
                          }}
                          className="bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary
                          w-full h-full rounded-full text-white dark:text-gray1 border-2 pl-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                        >
                          <option>-Select Payment month-</option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const monthIndex = i + 1; // Months are 1-based (January is 1)
                            return (
                              <option
                                key={monthIndex}
                                value={
                                  monthIndex === 1
                                    ? "January"
                                    : monthIndex === 2
                                    ? "February"
                                    : monthIndex === 3
                                    ? "March"
                                    : monthIndex === 4
                                    ? "April"
                                    : monthIndex === 5
                                    ? "May"
                                    : monthIndex === 6
                                    ? "June"
                                    : monthIndex === 7
                                    ? "July"
                                    : monthIndex === 8
                                    ? "Aughust"
                                    : monthIndex === 9
                                    ? "September"
                                    : monthIndex === 10
                                    ? "October"
                                    : monthIndex === 11
                                    ? "November"
                                    : "December"
                                }
                                className="text-primary-blue"
                              >
                                {new Date(
                                  currentDate.getFullYear(),
                                  i,
                                  1
                                ).toLocaleString(undefined, { month: "long" })}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 h-full">
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex items-center h-full w-2/6 pl-3">
                      Amount (Rs.)
                    </div>
                    <div className="flex items-center justify-center h-full w-4/6">
                      <div className="h-full w-full p-2">
                        <input
                          type="text"
                          placeholder="Enter the payment amount"
                          className="bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary
                               w-full h-full rounded-full text-white dark:text-gray1 border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                          value={amount}
                          onChange={(e) => {
                            setAmount(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* row contaqiner 3 */}
            <div className="w-full h-1/4">
              <div className="h-full w-full flex justify-center items-center">
                <div className="h-full w-3/5 p-2"></div>
                <div className="h-4/5 w-2/5 p-5 flex items-center justify-center">
                  <button
                    className="bg-secondary-blue hover:opacity-90 dark:bg-dark-ternary h-full w-full rounded-md text-xl shadow-xl text-white"
                    onClick={writeToDatabase}
                  >
                    Click Here to Pay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/**Success notification modal */}
      {showAddedSuccessModal ? (
        <div>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-white">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="p-5 rounded-lg shadow-lg relative flex flex-col w-full bg-green border-2 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-2 rounded-t">
                  <h3 className="text-sm">Notification</h3>
                  <button
                    className="ml-auto bg-red rounded-sm border-0 text-lg font-semibold drop-shadow-md active:bg-white"
                    onClick={() => setShowAddedSuccessModal(false)}
                  >
                    <span className=" drop-shadow-lg shadow-black h-6 w-6 text-white flex items-center justify-center active:text-dark-ternary">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex flex-col">
                  <h3 className="text-2xl font-semibold">
                    Payment Record Added Successfully ! 😎
                  </h3>
                </div>
                {/*footer*/}
              </div>
            </div>
          </div>
          <div className="rounded-lg opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}

      {/**Unsuccess notification modal */}
      {showAddedUnsuccessModal ? (
        <div>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-white">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="p-5 rounded-lg shadow-lg relative flex flex-col w-full bg-red border-2 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-2 rounded-t">
                  <h3 className="text-sm">Notification</h3>
                  <button
                    className="ml-auto bg-red-1 rounded-sm border-0 text-lg font-semibold drop-shadow-md active:bg-white"
                    onClick={() => setShowAddedUnsuccessModal(false)}
                  >
                    <span className=" drop-shadow-lg shadow-black h-6 w-6 text-white flex items-center justify-center active:text-dark-ternary">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex flex-col">
                  <h3 className="text-center text-2xl font-semibold">
                    Payment Record Added Unsuccessfully ! 😢
                  </h3>
                  {amountError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {amountError} -
                    </p>
                  )}
                  {operatorNameError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {operatorNameError} -
                    </p>
                  )}
                  {monthError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {monthError} -
                    </p>
                  )}
                  {paymentMethodError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {paymentMethodError} -
                    </p>
                  )}
                </div>
                {/*footer*/}
              </div>
            </div>
          </div>
          <div className="rounded-lg opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}

      {loading ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-primary-blue dark:text-white">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-blue dark:border-white"></div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}

export default Payment;
