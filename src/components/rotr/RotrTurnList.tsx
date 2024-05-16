'use client';

import { useCallback, useState } from "react";
import { useRotr, useRotrDispatch } from "./RotrContext";
import { Turn } from "@/lib/types/turn";
import RotrTurn from "./RotrTurn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import RowButton from "../RowButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";


export default function RotrTurnList() {

    const rotr = useRotr();
    const dispatch = useRotrDispatch();

    const [turnInitialFocus, setTurnInitialFocus] = useState(false);

    const handleMoveTurn = useCallback((dragIndex: number, hoverIndex: number) => {
        dispatch({
            type: "turn.move",
            data: { dragIndex, hoverIndex }
        })
    }, []);

    const handleNewPerson = () => {
        setTurnInitialFocus(true);
        dispatch({
            type: "person.add"
        })
    };

    const renderTurn = useCallback(
        (turn: Turn, index: number, initialFocus: boolean) => {
            return (
                <RotrTurn
                    key={turn.id}
                    turn={turn}
                    index={index}
                    moveTurn={handleMoveTurn}
                    initialFocus={initialFocus}
                />
            )
        }, []
    );

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col gap-3">
                {rotr.turns.map((turn, index) => renderTurn(turn, index, turnInitialFocus))}

                <RowButton onClick={handleNewPerson} className="mt-3">
                    <FontAwesomeIcon icon={faPlus} />
                    <span className="ms-2">Add Person</span>
                </RowButton>

                {rotr.turns.length === 0 && (
                    <div className="text-sm w-[44rem] text-center">Add a person to get started</div>
                )}


            </div>
        </DndProvider>
    )

}