import { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board/Board";
function App() {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    const handleResize = () => {
        setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
        });
      }
    useEffect(() => {
      window.addEventListener("resize", handleResize, false);
    }, []);
    return (
        <div className="App">
            <header className="App-header static">
                <div className="bg-dark"></div>
                <div className="bg-light"></div>
                <div className="bg-mark"></div>
                <Board
                    originX={window.innerWidth / 4}
                    originY={0}
                    width={window.innerHeight}
                    squareWidth={window.innerHeight/8}
                ></Board>
            </header>
        </div>
    );
}

export default App;
