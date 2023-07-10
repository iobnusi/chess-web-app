import { Coords } from "../Piece/piece_util";
import { BoardState, maxPieceStringLength } from "./board_util";

export function movePiece(args: {
    state: BoardState;
    current: Coords;
    target: Coords;
}): BoardState {
    // replace function is used to turn the pawn jump state to false
    const pieceAtCurrent = args.state[args.current.y][args.current.x].replace("*","");
    if (pieceAtCurrent === "" || pieceAtCurrent.length > maxPieceStringLength)
        throw new Error("Invalid Or Empty Piece String");
    args.state[args.current.y][args.current.x] = "";
    args.state[args.target.y][args.target.x] = pieceAtCurrent;
    return args.state;
}   

export function promotePawn(args: {
    state: BoardState;
    current: Coords;
    target: Coords;
}): BoardState {
    const pawnAtCurrent = args.state[args.current.y][args.current.x]
    if (pawnAtCurrent === "" || pawnAtCurrent.length > maxPieceStringLength)
        throw new Error("Invalid Or Empty Piece String");
    args.state[args.current.y][args.current.x] = "";
    args.state[args.target.y][args.target.x] = `${pawnAtCurrent.charAt(0)}q`;
    return args.state
}