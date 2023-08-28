import { ChangeEvent } from "react";

const KeywordCheckbox = ({
  keyword,
  isChecked,
  onChange,
}: {
  keyword: string;
  isChecked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div key={keyword}>
    <input
      type="checkbox"
      id={keyword}
      value={keyword}
      onChange={onChange}
      className="hidden peer"
      checked={isChecked}
    />
    <label
      htmlFor={keyword}
      className="badge badge-outline border-gray-300 peer-checked:bg-slate-700 peer-checked:text-white p-3 m-1 text-xs whitespace-nowrap"
    >
      {keyword}
    </label>
  </div>
);

export default KeywordCheckbox;
