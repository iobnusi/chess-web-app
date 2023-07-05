import { Coords, PieceColor, PieceTypes } from "../Piece/piece_util";

export type BoardState = [
    BoardRowState,
    BoardRowState,
    BoardRowState,
    BoardRowState,
    BoardRowState,
    BoardRowState,
    BoardRowState,
    BoardRowState
];

export type BoardRowState = [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
];

export const initialBoardState: BoardState = [
    ["dr", "dn", "db", "dq", "dk", "db", "dn", "dr"],
    ["dp", "dp", "dp", "dp", "dp", "dp", "dp", "dp"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["lp", "lp", "lp", "lp", "lp", "lp", "lp", "lp"],
    ["lr", "ln", "lb", "lq", "lk", "lb", "ln", "lr"],
];

export const emptyBoardState: BoardState = [
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
]

export const initialSquareGrid = [
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

export const numOfSquaresPerRow = 8

export function parsePieceStringToPieceTypeAndColor(piece: string): {
    color: PieceColor;
    type: PieceTypes;
} {
    if (piece === "" || piece.length !== 2) {
        throw new Error("Invalid Or Empty Piece String");
    }
    return {
        color: <PieceColor>piece.charAt(0),
        type: <PieceTypes>piece.charAt(1),
    };
}

export function parseCoordsToSquareId(coordsList: Coords[]): number[] {
    let res: number[] = [];
    for (let coords of coordsList) {
        res.push(coords.x + coords.y * 8);
    }
    return res;
}
