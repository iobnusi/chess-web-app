import React, { useEffect, useState } from "react";
import { BoardProps } from "../Board/Board";
import { BoardState } from "../Board/board_util";
import {
    Coords,
    PieceAction,
    PieceColor,
    PieceTypes,
    calculateBoardCoordinateFromCursor,
    calculateMouseCoordinateFromBoardCoordinate,
    convertPieceTypeToSpritePosition,
    generateActions,
    getAllCoordsFromPieceActions,
} from "./piece_util";

interface PieceProps {
    className?: string;
    id: string;
    currentCoords: Coords;
    type: PieceTypes;
    color: PieceColor;
    boardProps: BoardProps;
    boardState: BoardState;
    moveCallback: (args: {
        action: PieceAction;
        currentPosition: Coords;
    }) => void;
    clickCallback: (pieceActions: PieceAction[]) => void;
}

function Piece(props: PieceProps) {
    const [screenCoords, setScreenCoords] = useState<Coords>({
        x: props.currentCoords.x * props.boardProps.squareWidth,
        y: props.currentCoords.y * props.boardProps.squareWidth,
    });
    const [currentBoardCoords, setCurrentBoardCoords] = useState<Coords>({
        x: props.currentCoords.x,
        y: props.currentCoords.y,
    });
    const pieceWidth = props.boardProps.squareWidth;

    useEffect(() => {
        setScreenCoords(
            calculateMouseCoordinateFromBoardCoordinate({
                boardCoords: currentBoardCoords,
                boardProps: props.boardProps,
            })
        );
    }, [currentBoardCoords]);

    useEffect(() => {
        setCurrentBoardCoords({
            x: props.currentCoords.x,
            y: props.currentCoords.y,
        });
    }, [props.currentCoords.x, props.currentCoords.y]);

    function handleDragStart(event: React.DragEvent<HTMLDivElement>) {
        setScreenCoords({
            x:
                event.clientX -
                props.boardProps.originX -
                props.boardProps.squareWidth / 2,
            y:
                event.clientY -
                props.boardProps.originY -
                props.boardProps.squareWidth / 2,
        });
    }

    function handleDrag(event: React.DragEvent<HTMLDivElement>) {
        setScreenCoords({
            x:
                event.clientX -
                props.boardProps.originX -
                props.boardProps.squareWidth / 2,
            y:
                event.clientY -
                props.boardProps.originY -
                props.boardProps.squareWidth / 2,
        });
    }

    function handleDragEnd(event: React.DragEvent<HTMLDivElement>) {
        let newCoords: Coords = calculateBoardCoordinateFromCursor({
            mouseX: event.clientX,
            mouseY: event.clientY,
            boardProps: props.boardProps,
        });
        const validActions: PieceAction[] = generateActions({
            boardState: props.boardState,
            currentCoords: currentBoardCoords,
            pieceColor: props.color,
            pieceType: props.type,
        });
        const validMoves: Coords[] =
            props.type === PieceTypes.bishop
                ? getAllCoordsFromPieceActions(validActions)
                : [newCoords];
        console.log("valid actions", validActions);
        console.log("valid movves", validMoves);
        // find newCoords in validMoves, is -1 if newCoords cannot be found
        let newCoordsIndexInValidMoves = validMoves.findIndex(
            (pieceAction) =>
                pieceAction.x === newCoords.x && pieceAction.y === newCoords.y
        );
        console.log(
            "new coords is valid ? ",
            newCoordsIndexInValidMoves !== -1
        );
        if (newCoordsIndexInValidMoves !== -1) {
            console.log("move valid, updating board state");
            props.moveCallback({
                action:
                    props.type === PieceTypes.bishop
                        ? validActions[newCoordsIndexInValidMoves]
                        : {
                              type: "move",
                              payload: {
                                  target: newCoords,
                              },
                          },
                currentPosition: {
                    x: currentBoardCoords.x,
                    y: currentBoardCoords.y,
                },
            });
        } else {
            console.log("moving invalid moving back to current coords");
            setScreenCoords(
                calculateMouseCoordinateFromBoardCoordinate({
                    boardCoords: currentBoardCoords,
                    boardProps: props.boardProps,
                })
            );
        }
    }

    return (
        <div
            key={props.id}
            className={`aspect-square overflow-hidden ${props.className}`}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onClick={() => {
                props.clickCallback(
                    generateActions({
                        boardState: props.boardState,
                        currentCoords: currentBoardCoords,
                        pieceColor: props.color,
                        pieceType: props.type,
                    })
                );
            }}
            style={{
                position: "absolute",
                left: screenCoords.x,
                top: screenCoords.y,
                width: pieceWidth,
                backgroundImage:
                    "url('https://www.pngmart.com/files/16/Battle-Chess-Pieces-PNG-File.png)')",
                backgroundSize: "660px 220px",
                backgroundPosition: `${convertPieceTypeToSpritePosition(
                    props.type
                )} ${props.color === PieceColor.dark ? "bottom" : "top"}`,
            }}
        ></div>
    );
}

export default Piece;
