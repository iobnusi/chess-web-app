import { Coords } from "../Piece/piece_util";
import { BoardState } from "./board_util";

export function movePiece(args: {
    state: BoardState;
    current: Coords;
    target: Coords;
}): BoardState {
    const pieceAtCurrent = args.state[args.current.y][args.current.x];
    if (pieceAtCurrent === "" || pieceAtCurrent.length !== 2)
        throw new Error("Invalid Or Empty Piece String");
    args.state[args.current.y][args.current.x] = "";
    args.state[args.target.y][args.target.x] = pieceAtCurrent;
    return args.state;
}
