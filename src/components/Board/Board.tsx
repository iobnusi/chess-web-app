import { useState } from "react";
import Piece from "../Piece/Piece";
import {
    Coords,
    PieceAction,
    PieceColor,
    PieceTypes,
    getAllCoordsFromPieceActions,
} from "../Piece/piece_util";
import Square from "../Square";
import { movePiece } from "./board_state_util";
import {
    BoardRowState,
    BoardState,
    initialBoardState,
    initialSquareGrid,
    parseCoordsToSquareId,
} from "./board_util";

export interface BoardProps {
    originX: number;
    originY: number;
    squareWidth: number;
}

function Board(props: BoardProps) {
    const numOfSquaresPerRow = 8;
    const [boardState, setBoardState] = useState(initialBoardState);
    const [squareGrid, setSquareGrid] = useState(initialSquareGrid);

    function movePieceCallback(args: {
        action: PieceAction;
        currentPosition: Coords;
    }) {
        let cacheBoardState: string[][] = boardState.map((arr) => arr.slice());

        // update board on piece move
        if (args.action.type === "move" || args.action.type === "take") {
            cacheBoardState = movePiece({
                current: args.currentPosition,
                target: args.action.payload.target,
                state: cacheBoardState as BoardState,
            });
        } else if (args.action.type === "check") {
            //TODO
        } else if (args.action.type === "promote") {
            //TODO
        }

        setBoardState(cacheBoardState as BoardState);
        console.log("updated board state", cacheBoardState);
    }

    function markSquare(squareList: number[]) {
        let cacheSquareGrid = [
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "light",
            "dark",
            "light",
        ];
        for (let square of squareList) {
            cacheSquareGrid[square] = "mark";
        }
        console.log("squares", squareList);
        setSquareGrid(cacheSquareGrid);
    }

    function clickPieceCallback(pieceActions: PieceAction[]) {
        // get all the possible target coords from pieceActions
        let possibleCoords: Coords[] =
            getAllCoordsFromPieceActions(pieceActions);
        console.log("valid coords", possibleCoords);
        markSquare(parseCoordsToSquareId(possibleCoords));
    }

    return (
        <div
            key="chessBoard"
            style={{
                position: "absolute",
                left: props.originX,
                top: props.originY,
                width: props.squareWidth * numOfSquaresPerRow,
            }}
            className={"aspect-square"}
        >
            <div className="aspect-square grid grid-cols-8 z-0">
                {squareGrid?.map((color, i) => {
                    return <Square id={i} color={color}></Square>;
                })}
            </div>
            {boardState.map((rowState: BoardRowState, rowIndex: number) => {
                return rowState.map((state: string, colIndex: number) => {
                    if (state === "") return;
                    else
                        return (
                            <Piece
                                id={`${state.charAt(1)}${colIndex}${rowIndex}`}
                                currentCoords={{
                                    x: colIndex,
                                    y: rowIndex,
                                }}
                                color={state.charAt(0) as PieceColor}
                                type={state.charAt(1) as PieceTypes}
                                boardProps={props}
                                boardState={boardState}
                                moveCallback={movePieceCallback}
                                clickCallback={clickPieceCallback}
                            ></Piece>
                        );
                });
            })}
        </div>
    );
}

export default Board;
