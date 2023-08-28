type DividerProps = {
  width: string;
};

const Divider: React.FC<DividerProps> = ({ width }) => {
  return <hr className={`${width} border-t-0 border-b border-gray-200 h-4`} />;
};

export default Divider;
