import React from 'react';
import { TfiArrowLeft } from "react-icons/tfi";
import { VscClose } from "react-icons/vsc";

const Search = () => {

    return (
        <div className="absoulte top-0 mx-auto bg-white">
            <div className="flex flex-col p-6">
                <form className="flex items-center w-[650px]">
                    <div>
                        <TfiArrowLeft className="w-[20px] h-[20px]"/>
                    </div>
                    <input
                        type='text'
                        placeholder='검색어를 입력하세요.'
                        className='border border-gray-100 bg-gray-100 ml-3 px-3 py-2 w-full mr-2'
                    />
                    <div>
                        <VscClose className="w-[20px] h-[20px] text-gray-600" />
                    </div>
                    <button
                        type="submit">
                    </button>
                </form>
                <div className='mt-6 pb-6'>
                    <p className='text-sm text-gray-600'>계정</p>
                    <ul className='mt-4 ml-4 pb-2'>
                        <li className='pb-2'>
                            sohyun
                        </li>
                        <li className='pb-2'>
                            eunseok
                        </li>
                        <li className='pb-2'>
                            jongjin
                        </li>
                    </ul>
                </div>
                <div className='mt-6 pb-6'>
                    <p className='text-sm text-gray-600'>피드</p>
                    <ul className='mt-4 ml-4 pb-2'>
                        <li className='pb-2'>
                            sohyun
                        </li>
                        <li className='pb-2'>
                            eunseok
                        </li>
                        <li className='pb-2'>
                            jongjin
                        </li>
                    </ul>
                </div>
                <div className='mt-6 pb-6'>
                    <p className='text-sm text-gray-600'>태그</p>
                    <ul className='mt-4 ml-4 pb-2'>
                        <li className='pb-2'>
                            sohyun
                        </li>
                        <li className='pb-2'>
                            eunseok
                        </li>
                        <li className='pb-2'>
                            jongjin
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
};

export default Search;