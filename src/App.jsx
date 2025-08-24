import { useState, useCallback, useEffect, useRef } from "react";
import Bkg from "./components/Bkg.jsx"; // background component (for visuals)

// Main App component
function App() {
  // -------------------- STATES --------------------
  const [length, setLength] = useState(8); // password length (default 8)
  const [numberAllowed, setNumberAllowed] = useState(false); // toggle numbers
  const [charAllowed, setCharAllowed] = useState(false); // toggle special chars
  const [password, setPassword] = useState(""); // generated password

  // reference to password input (for copy functionality)
  const passwordRef = useRef(null);

  // -------------------- PASSWORD GENERATOR --------------------
  // useCallback: memoize function so it's recreated only when dependencies change
  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; // base: alphabets only

    if (numberAllowed) str += "0123456789"; // include numbers if enabled
    if (charAllowed) str += "!@#$%^&*-_+=[]{}~`"; // include special chars if enabled

    // randomly pick characters based on chosen length
    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }

    setPassword(pass); // update state with generated password
  }, [length, numberAllowed, charAllowed, setPassword]);

  // -------------------- COPY TO CLIPBOARD --------------------
  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select(); // select input text
    passwordRef.current?.setSelectionRange(0, 999); // select whole password
    window.navigator.clipboard.writeText(password); // copy to clipboard
  }, [password]);

  // -------------------- AUTO GENERATE ON CHANGE --------------------
  // Runs every time length/numberAllowed/charAllowed changes
  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  // -------------------- UI --------------------
  return (
    <div>
      <Bkg /> {/* background component */}
      {/* Card container */}
      <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-gray-800 text-cyan-600 font-sans ">
        <h1 className="text-white text-xl font-bold text-center my-3">
          Password Generator
        </h1>

        {/* Input + Copy button */}
        <div className="flex shadow rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            value={password} // display generated password
            className="outline-none w-full py-1 px-3"
            placeholder="Password"
            readOnly // prevent typing
            ref={passwordRef} // attach ref for copy functionality
          />
          <button
            onClick={copyPasswordToClipboard} // copy password on click
            className="outline-none bg-red-700 text-white px-3 py-0.5 shrink-0"
          >
            Copy
          </button>
        </div>

        {/* Controls: Length slider, Number toggle, Character toggle */}
        <div className="flex text-sm gap-x-2">
          {/* Slider for length */}
          <div className="flex items-center gap-x-1">
            <input
              type="range"
              min={6}
              max={32}
              value={length}
              className="cursor-pointer"
              onChange={(e) => {
                setLength(e.target.value); // update password length
              }}
            />
            <label>Length: {length}</label>
          </div>

          {/* Checkbox for numbers */}
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={numberAllowed}
              id="numberInput"
              onChange={() => {
                setNumberAllowed((prev) => !prev); // toggle numbers
              }}
            />
            <label htmlFor="numberInput">Numbers</label>
          </div>

          {/* Checkbox for special characters */}
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={charAllowed}
              id="characterInput"
              onChange={() => {
                setCharAllowed((prev) => !prev); // toggle special chars
              }}
            />
            <label htmlFor="characterInput">Characters</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
