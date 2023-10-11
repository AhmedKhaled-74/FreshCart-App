import { createContext, useState } from "react";

export let CounterContext = createContext();

export default function CounterContextProvider(props) {
  let [counter, setCounter] = useState(0);
  function increase() {
    if (counter < 99) {
      setCounter(counter + 1);
    } else {
      setCounter("Max");
    }
  }
  return (
    <CounterContext.Provider value={{ counter, increase }}>
      {props.children}
    </CounterContext.Provider>
  );
}
