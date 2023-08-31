import React, { useState } from 'react';

interface BodyShapeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BodyShapeModal =  ({ isOpen, onClose }: BodyShapeModalProps) => {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
            <div className="bg-white p-4 rounded-md">
                <h2 className="text-lg font-bold mb-4">키・몸무게</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <label>
                        키(cm):
                        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                    </label>
                    <label>
                        몸무게(kg):
                        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </label>
                    <button onClick={onClose}>적용하기</button>
                </form>
            </div>
        </div>
    );
};
export default BodyShapeModal;