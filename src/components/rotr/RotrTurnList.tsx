'use client';

import { useCallback, useState } from "react";
import { useRotr, useRotrDispatch } from "./RotrContext";
import { Turn } from "@/lib/types/turn";
import RotrTurn from "./RotrTurn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPlus, faShuffle } from "@fortawesome/free-solid-svg-icons";
import ScheduleDrawer from "./ScheduleDrawer";
import { Button } from "../ui/button";


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

    const handleShuffle = () => {
        dispatch({
            type: "turns.shuffle"
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

    const scheduleButton = (
        <Button variant="secondary" size="lg" className="w-full">
            <h3>
                <FontAwesomeIcon icon={faClock} />
                <span className="ms-2">{rotr.schedule ? "Edit" : "Add"} schedule</span>
            </h3>
        </Button>);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col gap-3">
                {rotr.turns.map((turn, index) => renderTurn(turn, index, turnInitialFocus))}

                <Button variant="secondary" size="lg" className="mt-3" onClick={handleNewPerson}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span className="ms-2">Add Person</span>
                </Button>

                {rotr.turns.length === 0 && (
                    <div className="text-sm w-[44rem] text-center">Add a person to get started</div>
                )}

                {rotr.turns.length > 1 && (
                    <div className="flex justify-between gap-5 mt-2">
                        <ScheduleDrawer button={scheduleButton} />
                        <Button variant="secondary" size="lg" className="w-full" onClick={handleShuffle}>
                            <FontAwesomeIcon icon={faShuffle} />
                            <span className="ms-2">Shuffle</span>
                        </Button>
                    </div>
                )}

            </div>
        </DndProvider>
    )

}