'use client';

import React, { useContext } from "react";
import { Dispatch, createContext } from "react";
import { Turn } from "@/lib/types/turn";
import { Person } from "@/lib/types/person";
import { useImmerReducer } from "use-immer";

type RotrData = {
    people: Person[]
    turns: Turn[]
    generated: boolean
}

type RotrAction = {
    type: string
    data?: any
}

const initialState : RotrData = {
    people: [],
    turns: [],
    generated: false
};

const RotrContext = createContext<RotrData>(initialState);
const RotrDispatchContext = React.createContext<Dispatch<RotrAction>>({} as Dispatch<RotrAction>)

export function RotrProvider({ children } : { children: React.ReactNode }) {
    

    const [data, dispatch] = useImmerReducer<RotrData, RotrAction>(
        (draft, action) => {

            switch (action.type) {

                case "turn.move": {

                    const { dragIndex, hoverIndex } : { dragIndex: number, hoverIndex: number } = action.data;

                    const dragItem = Object.assign(draft.turns[dragIndex]);
                    draft.turns.splice(dragIndex, 1);
                    draft.turns.splice(hoverIndex, 0, dragItem);

                    break;
                }

                case "turn.delete": {
                    const { index } : { index: number } = action.data;
                    draft.turns.splice(index, 1);
                    break;
                }

                case "person.add": {

                    const person : Person = {
                        id: getNextId(draft.people),
                        name: ""
                    };

                    const turn : Turn = {
                        id: getNextId(draft.turns),
                        personId: person.id
                    };

                    draft.people.push(person);
                    draft.turns.push(turn);

                    break;
                }

                case "person.update": {
                    
                    const { id, name } : { id: number, name: string } = action.data;

                    let person = draft.people.find(x => x.id === id);

                    if (person)
                        person.name = name;

                    break;
                }

            }

        }, 
        initialState
    );

    return (
        <RotrContext.Provider value={data}>
            <RotrDispatchContext.Provider value={dispatch}>
                {children}
            </RotrDispatchContext.Provider>
        </RotrContext.Provider>
    );
}

function getNextId(datas: {id:number}[]) : number {
    return datas.length > 0 ? Math.max(...datas.map(x => x.id)) + 1 : 1;
}

export function useRotr() {
    return useContext(RotrContext);
}

export function useRotrDispatch() {
    return useContext(RotrDispatchContext);
}