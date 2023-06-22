import "./App.css";
import Board from "./components/Board/Board";
function App() {
    return (
        <div className="App">
            <header className="App-header static">
                <div className="bg-dark"></div>
                <div className="bg-light"></div>
                <div className="bg-mark"></div>
                <Board
                    originX={window.innerWidth / 4}
                    originY={(window.innerHeight - 880) / 2}
                    squareWidth={110}
                ></Board>
            </header>
        </div>
    );
}

export default App;
