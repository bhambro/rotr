'use client';

import { Turn } from "@/lib/types/turn";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { XYCoord, useDrag, useDrop } from "react-dnd";
import { useRotr, useRotrDispatch } from "./RotrContext";
import { Person } from "@/lib/types/person";
import DiscreteInput from "../ui/discreteInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export interface RotrTurnProps {
    turn: Turn
    index: number
    moveTurn: (dragIndex: number, hoverIndex: number) => void
    initialFocus?: boolean
}

interface DragItem {
    index: number
    id: number
}

export default function RotrTurn({ turn, index, moveTurn, initialFocus } : RotrTurnProps) {

    const ref = useRef<HTMLDivElement>(null);

    const [{ handlerId }, drop] = useDrop<DragItem, void, any>(() => ({
        accept: "turn",
        collect: monitor => ({
            handlerId: monitor.getHandlerId()
        }),
        hover(item, monitor) {
            if (!ref.current) return;

            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            moveTurn(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        }
    }));

    const [{ isDragging }, drag] = useDrag<DragItem, void, any>(() => ({
        type: "turn",
        item: () => ({ id: turn.id, index }),
        collect(monitor) {
            return { isDragging: monitor.isDragging() }
        }
    }));

    drag(drop(ref));

    const rotr = useRotr();
    const dispatch = useRotrDispatch();

    const person = rotr.people.find(x => x.id === turn.personId) as Person;

    const handleNameChanged = (name: string) => {
        dispatch({
            type: "person.update",
            data: { id: person.id, name }
        });
    };

    const handleTurnDelete = () => {
        dispatch({
            type: "turn.delete",
            data: { index }
        });
    };

    return (
        <div ref={ref}
            className={cn([
                "border border-slate-300 shadow-sm rounded-xl px-6 py-3 w-[44rem] flex gap-6 items-center cursor-move",
                isDragging ? "opacity-0" : "opacity-100"
            ])}>

            <div className="bg-slate-100 rounded-xl h-[50px] w-[50px] text-center flex items-center justify-center">
                <h2># {index + 1}</h2>
            </div>

            <DiscreteInput
                className="flex-grow h-[50px]"
                value={person.name}
                onChange={(e) => handleNameChanged(e.target.value)}
                initialFocus={initialFocus}
            />

            <a href="#" onClick={handleTurnDelete} className="hover:bg-slate-100 w-[25px] h-[25px] flex items-center justify-center rounded-sm">
                <FontAwesomeIcon icon={faTrashCan}/>
            </a>

        </div>
    )

}