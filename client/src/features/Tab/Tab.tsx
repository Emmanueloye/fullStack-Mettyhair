import TabBtns from './TabBtns';

const Tab = ({
  children,
  btnLabels,
}: {
  children: React.ReactNode;
  btnLabels: string[];
}) => {
  return (
    <div style={{ marginTop: '6rem' }}>
      <TabBtns btnLabels={btnLabels} />

      {children}
    </div>
  );
};

export default Tab;
