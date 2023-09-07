import React, { useState } from 'react';
import { GrClose } from "react-icons/gr";
import { IoRefreshOutline } from "react-icons/io5";
import { AiOutlineCaretDown } from "react-icons/ai";
interface BodyShapeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BodyShapeModal =  ({ isOpen, onClose }: BodyShapeModalProps) => {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [isHeightDropdownOpen, setIsHeightDropdownOpen] = useState(false);
    const [isWeightDropdownOpen, setIsWeightDropdownOpen] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-filter">
            <div className="bg-white p-4 rounded-md w-[450px] h-[350px]">
                <div className="flex items-center justify-between">
                    <GrClose className="w-[20px] h-[20px] cursor-pointer" onClick={onClose}/>
                    <IoRefreshOutline className="w-[24px] h-[24px] cursor-pointer" />
                </div>
                <p className="text-lg font-bold text-center mb-4">키・몸무게</p>
                <form onSubmit={(e) => e.preventDefault()} className='m-3'>
                    <div
                    className="h-[50px] pl-3 text-sm flex items-center border border-gray-200 relative"
                    onClick={() => setIsHeightDropdownOpen(!isHeightDropdownOpen)}>
                        키
                        <input
                        readOnly
                        value={`${height}cm`} 
                        className='cursor-pointer mr-auto pl-4 flex items-center font-semibold outline-none'
                        />
                        <AiOutlineCaretDown className="mr-4 w-[16px] h-[16px] text-gray-700" />
                        {isHeightDropdownOpen && (
                            <ul 
                            className='absolute top-full w-full right-[-1px] z-30 text-center text-sm bg-white border border-gray-200 overflow-auto' 
                            style={{ width: '394px', maxHeight: '217px', boxSizing: 'border-box' }}>
                                {Array.from({length: 121}, (_, i) => i+100).map((value) =>
                                    (<li 
                                        key={value} 
                                        onClick={() => {
                                            setHeight(value.toString());
                                            setIsHeightDropdownOpen(false);
                                    }}
                                        className='p-2 cursor-pointer'>
                                        {value}cm
                                    </li>)
                                )}
                            </ul>
                        )}
                    </div>
                    <div
                    className="h-[50px] mt-2 pl-3 text-sm flex items-center border border-gray-200 relative"
                    onClick={() => setIsWeightDropdownOpen(!isWeightDropdownOpen)}>
                        몸무게
                        <input
                        readOnly
                        value={`${weight}kg`} 
                        className='cursor-pointer mr-auto pl-4 flex items-center font-semibold outline-none'
                        />
                        <AiOutlineCaretDown className="mr-4 w-[16px] h-[16px] text-gray-700" />
                        {isWeightDropdownOpen && (
                            <ul 
                            className='absolute top-full w-full right-[-1px] z-30 text-center text-sm bg-white border border-gray-200 overflow-auto' 
                            style={{ width: '394px', maxHeight: '159px', boxSizing: 'border-box' }}>
                                {Array.from({length: 121}, (_, i) => i+30).map((value) =>
                                    (<li 
                                        key={value} 
                                        onClick={() => {
                                            setWeight(value.toString());
                                            setIsWeightDropdownOpen(false);
                                    }}
                                        className='p-2 cursor-pointer'>
                                        {value}kg
                                    </li>)
                                )}
                            </ul>
                        )}
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-gray-400">마이 사이즈</p>
                    </div>
                    <div className="mt-10 p-4 flex items-center justify-center border bg-gray-900">
                        <button 
                         onClick={onClose}
                         className="text-white text-sm">
                            적용하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default BodyShapeModal;