import React from 'react'
import Navbar from "@/../components/navigation/navbar";

export const Rootlayout = ({children}:{children: React.ReactNode}) => {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
};
export default Rootlayout;