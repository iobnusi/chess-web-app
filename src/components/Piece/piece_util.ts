import { BoardProps } from "../Board/Board";
import { BoardState } from "../Board/board_util";

const [minRow, minCol, maxRow, maxCol] = [0, 0, 7, 7];

export interface Coords {
    x: number;
    y: number;
}

export interface PieceAction {
    type: string;
    payload: {
        target: Coords;
    };
}

export enum PieceTypes {
    king = "k",
    queen = "q",
    bishop = "b",
    knight = "n",
    rook = "r",
    pawn = "p",
}

export enum PieceColor {
    dark = "d",
    light = "l",
}

export function calculateBoardCoordinateFromCursor(args: {
    mouseX: number;
    mouseY: number;
    boardProps: BoardProps;
}): Coords {
    let x = Math.floor(
        (args.mouseX - args.boardProps.originX) / args.boardProps.squareWidth
    );
    let y = Math.floor(
        (args.mouseY - args.boardProps.originY) / args.boardProps.squareWidth
    );
    return x < 0 || x > 7 || y < 0 || y > 7
        ? <Coords>{
              x: -1,
              y: -1,
          }
        : <Coords>{
              x: x,
              y: y,
          };
}

export function calculateMouseCoordinateFromBoardCoordinate(args: {
    boardCoords: Coords;
    boardProps: BoardProps;
}): Coords {
    return <Coords>{
        x: args.boardCoords.x * args.boardProps.squareWidth,
        y: args.boardCoords.y * args.boardProps.squareWidth,
    };
}

export function convertPieceTypeToSpritePosition(type: PieceTypes): string {
    switch (type) {
        case PieceTypes.king:
            return "0%";
        case PieceTypes.queen:
            return "20%";
        case PieceTypes.bishop:
            return "40%";
        case PieceTypes.knight:
            return "60%";
        case PieceTypes.rook:
            return "80%";
        case PieceTypes.pawn:
            return "100%";
    }
}

export function getAllCoordsFromPieceActions(
    pieceActions: PieceAction[]
): Coords[] {
    let coords: Coords[] = [];
    for (let pieceAction of pieceActions) {
        coords.push(pieceAction.payload.target);
    }
    return coords;
}

export function generateActions(args: {
    boardState: BoardState;
    currentCoords: Coords;
    pieceType: PieceTypes;
    pieceColor: PieceColor;
}): PieceAction[] {
    let actions: PieceAction[] = [];
    switch (args.pieceType) {
        case PieceTypes.pawn:
            /* cases
        - move two on first move 
        - move one otherwise
        - cant move if dark or light piece is one square in front
        - can take diagonally if dark piece exists on that square
        - cant move if pinned to king
        - en passent
        - promote to any other piece if reach the other side of board
      */
            break;
        case PieceTypes.bishop:
            /* cases
        - move diagonally from current position (DONE)
        - cant move past pieces in its move path (DONE)
        - can take opposing pieces in its move path (DONE)
        - cant move if pinned to king
      */
            actions = generateBishopActions({
                currentCoords: args.currentCoords,
                boardState: args.boardState,
                color: args.pieceColor,
            });
            break;
        case PieceTypes.king:
            /* cases
        - can move one square from its current position
        - cant move to squares where it can be in check
        - if in check, has to find all the possible moves where king will not be in check
       */
            break;
        case PieceTypes.knight:
            /* cases
        - move in an "L" shape (DONE)
        - cant move to designated squares if ally pieces are there (DONE)
        - can take opposing pieces in designated squares (DONE)
        - cant move if pinned to king
      */
            actions = generateKnightActions({
                currentCoords: args.currentCoords,
                boardState: args.boardState,
                color: args.pieceColor,
            });
            break;
        case PieceTypes.queen:
            /* cases
        - can move to any square at its current position's row or column
        - can move diagonally from current position
        - cant move past pieces in its move path
        - can take opposing pieces in its move path
        - cant move if pinned to king
      */
            break;
        case PieceTypes.rook:
            /* cases
        - can move to any square at its current position's row or column
        - cant move past pieces in its move path
        - can take oppposing pieces in its move path
        - cant move if pinned to king
      */
            actions = generateRookActions({
                currentCoords: args.currentCoords,
                boardState: args.boardState,
                color: args.pieceColor,
            });
            break;
        default:
            throw new Error("Invalid Piece Type");
    }
    console.log("actions", actions);
    return actions;
}

function generateBishopActions(args: {
    currentCoords: Coords;
    boardState: BoardState;
    color: PieceColor;
}): PieceAction[] {
    let cacheCurrentPosition: Coords = {
        x: args.currentCoords.x,
        y: args.currentCoords.y,
    };
    let actions: PieceAction[] = [];
    let arr: boolean[] = [true, true, true, true];
    let counter = 1;
    while (arr[0] || arr[1] || arr[2] || arr[3]) {
        for (let i = 0; i < arr.length; i++) {
            if (i === 0 && arr[i]) {
                if (
                    cacheCurrentPosition.x - counter < minCol ||
                    cacheCurrentPosition.y - counter < minRow
                ) {
                    arr[0] = false;
                } else if (
                    args.boardState[cacheCurrentPosition.y - counter][
                        cacheCurrentPosition.x - counter
                    ] === ""
                ) {
                    actions.push({
                        type: "move",
                        payload: {
                            target: {
                                x: cacheCurrentPosition.x - counter,
                                y: cacheCurrentPosition.y - counter,
                            },
                        },
                    });
                } else if (
                    args.boardState[cacheCurrentPosition.y - counter][
                        cacheCurrentPosition.x - counter
                    ].charAt(0) !== args.color
                ) {
                    actions.push({
                        type: "take",
                        payload: {
                            target: {
                                x: cacheCurrentPosition.x - counter,
                                y: cacheCurrentPosition.y - counter,
                            },
                        },
                    });
                    arr[0] = false;
                } else if (
                    args.boardState[cacheCurrentPosition.y - counter][
                        cacheCurrentPosition.x - counter
                    ].charAt(0) === args.color
                ) {
                    arr[0] = false;
                }
            } else if (i === 1 && arr[i]) {
                if (
                    cacheCurrentPosition.x + counter > maxCol ||
                    cacheCurrentPosition.y - counter < minRow
                ) {
                    arr[1] = false;
                } else if (
                    args.boardState[cacheCurrentPosition.y - counter][
                        cacheCurrentPosition.x + counter
                    ] === ""
                ) {
                    actions.push({
                        type: "move",
                        payload: {
                            target: {
                                x: cacheCurrentPosition.x + counter,
                                y: cacheCurrentPosition.y - counter,
                            },
                        },
                    });
                } else if (
                    args.boardState[cacheCurrentPosition.y - counter][
                        cacheCurrentPosition.x + counter
                    ].charAt(0) !== args.color
                ) {
                    actions.push({
                        type: "take",
                        payload: {
                            target: {
                                x: cacheCurrentPosition.x + counter,
                                y: cacheCurrentPosition.y - counter,
                            },
                        },
                    });
                    arr[1] = false;
                } else if (
                    args.boardState[cacheCurrentPosition.y - counter][
                        cacheCurrentPosition.x + counter
                    ].charAt(0) === args.color
                ) {
                    arr[1] = false;
                }
            } else if (i === 2 && arr[i]) {
                if (
                    cacheCurrentPosition.x + counter > maxCol ||
                    cacheCurrentPosition.y + counter > maxRow
                ) {
                    arr[2] = false;
                } else if (
                    args.boardState[cacheCurrentPosition.y + counter][
                        cacheCurrentPosition.x + counter
                    ] === ""
                ) {
                    actions.push({
                        type: "move",
                        payload: {
                            target: {
                                x: cacheCurrentPosition.x + counter,
                                y: cacheCurrentPosition.y + counter,
                            },
                        },
                    });
                } else if (
                    args.boardState[cacheCurrentPosition.y + counter][
                        cacheCurrentPosition.x + counter
                    ].charAt(0) !== args.color
                ) {
                    actions.push({
                        type: "take",
                        payload: {
                            target: {
                                x: cacheCurrentPosition.x + counter,
                                y: cacheCurrentPosition.y + counter,
                            },
                        },
                    });
                    arr[2] = false;
                } else if (
                    args.boardState[cacheCurrentPosition.y + counter][
                        cacheCurrentPosition.x + counter
                    ].charAt(0) === args.color
                ) {
                    arr[2] = false;
                }
            } else if (i === 3 && arr[i]) {
                if (
                    cacheCurrentPosition.x - counter < minCol ||
                    cacheCurrentPosition.y + counter > maxRow
                ) {
                    arr[3] = false;
                } else if (
                    args.boardState[cacheCurrentPosition.y + counter][
                        cacheCurrentPosition.x - counter
                    ] === ""
                ) {
                    actions.push({
                        type: "move",
                        payload: {
                            target: {
                                x: cacheCurrentPosition.x - counter,
                                y: cacheCurrentPosition.y + counter,
                            },
                        },
                    });
                } else if (
                    args.boardState[cacheCurrentPosition.y + counter][
                        cacheCurrentPosition.x - counter
                    ].charAt(0) !== args.color
                ) {
                    actions.push({
                        type: "take",
                        payload: {
                            target: {
                                x: cacheCurrentPosition.x - counter,
                                y: cacheCurrentPosition.y + counter,
                            },
                        },
                    });
                    arr[3] = false;
                } else if (
                    args.boardState[cacheCurrentPosition.y + counter][
                        cacheCurrentPosition.x - counter
                    ].charAt(0) === args.color
                ) {
                    arr[3] = false;
                }
            }
        }
        counter++;
    }
    return actions;
}

function generateKnightActions(args: {
    currentCoords: Coords;
    boardState: BoardState;
    color: PieceColor;
}): PieceAction[] {
    let actions: PieceAction[] = [];
    let cacheCurrentPosition: Coords = {
        x: args.currentCoords.x,
        y: args.currentCoords.y,
    };
    let possibleMoves: Coords[] = getPossibleKnightMoves(cacheCurrentPosition);
    for (let possibleMove of possibleMoves) {
        if (args.boardState[possibleMove.y][possibleMove.x] !== "") {
            if (
                args.boardState[possibleMove.y][possibleMove.x].charAt(0) ===
                args.color
            ) {
                continue;
            } else {
                actions.push({
                    type: "take",
                    payload: {
                        target: possibleMove,
                    },
                });
            }
        } else {
            actions.push({
                type: "move",
                payload: {
                    target: possibleMove,
                },
            });
        }
    }
    return actions;
}

function getPossibleKnightMoves(pos: Coords): Coords[] {
    let posChecks: boolean[] = [
        pos.x - 1 >= minCol && pos.y - 2 >= minRow,
        pos.x - 2 >= minCol && pos.y - 1 >= minRow,
        pos.x + 1 <= maxCol && pos.y - 2 >= minRow,
        pos.x + 2 <= maxCol && pos.y - 1 >= minRow,
        pos.x + 1 <= maxCol && pos.y + 2 <= maxRow,
        pos.x + 2 <= maxCol && pos.y + 1 <= maxRow,
        pos.x - 1 >= minCol && pos.y + 2 <= maxRow,
        pos.x - 2 >= minCol && pos.y + 1 <= maxRow,
    ];
    const allMoves = [
        {
            x: pos.x - 1, // i=3, i=6
            y: pos.y - 2,
        },
        {
            x: pos.x - 2, // i=
            y: pos.y - 1,
        },
        {
            x: pos.x + 1,
            y: pos.y - 2,
        },
        {
            x: pos.x + 2,
            y: pos.y - 1,
        },
        {
            x: pos.x + 1,
            y: pos.y + 2,
        },
        {
            x: pos.x + 2,
            y: pos.y + 1,
        },
        {
            x: pos.x - 1,
            y: pos.y + 2,
        },
        {
            x: pos.x - 2,
            y: pos.y + 1,
        },
    ];
    let cacheMoves: Coords[] = [];
    for (let i = 0; i < posChecks.length; i++) {
        if (posChecks[i]) cacheMoves = [...cacheMoves, allMoves[i]];
    }
    return cacheMoves;
}

function generateRookActions(args: {
    currentCoords: Coords;
    boardState: BoardState;
    color: PieceColor;
}): PieceAction[] {
    let actions: PieceAction[] = [];
    let cacheCurrentPosition: Coords = {
        x: args.currentCoords.x,
        y: args.currentCoords.y,
    };
    let possibleMoves: Coords[] = getPossibleRookMoves(cacheCurrentPosition);
    for (let possibleMove of possibleMoves) {
        actions.push({
            type: "move",
            payload: {
                target: possibleMove,
            },
        });
    }
    return actions;
}

function getPossibleRookMoves(pos: Coords): Coords[] {
    let moves: Coords[] = [];
    for (let row = 0; row <= maxRow; row++) {
        if (row === pos.y) continue;
        moves = [
            ...moves,
            <Coords>{
                x: pos.x,
                y: row,
            },
        ];
    }
    for (let col = 0; col <= maxCol; col++) {
        if (col === pos.x) continue;
        moves = [
            ...moves,
            <Coords>{
                x: col,
                y: pos.y,
            },
        ];
    }

    return moves;
}
