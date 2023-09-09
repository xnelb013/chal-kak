interface ModifyButtonProps {
  moveToModifyPage: () => void;
}

const ModifyButton = ({ moveToModifyPage }: ModifyButtonProps): JSX.Element => {
  return (
    <>
      <button
        className="btn-neutral ml-4 bg-[#efefef] w-[125px] font-medium rounded-lg text-black"
        onClick={moveToModifyPage}
      >
        프로필 관리
      </button>
    </>
  );
};

export default ModifyButton;
