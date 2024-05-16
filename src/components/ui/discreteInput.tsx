'use client';

import { useEffect, useRef } from "react";
import React from "react";

export interface DiscreteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    initialFocus?: boolean
}

export default function DiscreteInput({ value, onChange, className, initialFocus } : DiscreteInputProps) {

    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialFocus && ref.current)
            ref.current.focus();
    }, []);

    return (
        <div className={"bg-primary hover:bg-primary/70 rounded-xl shadow-inner " + className}>
            <input 
                type="text" 
                value={value} 
                onChange={onChange} 
                className="w-full h-full rounded-xl bg-transparent px-4 ring-offset-primary"
                ref={ref}
            />
        </div>
    )

}
