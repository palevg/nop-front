import React from "react";
import cl from './MyModal.module.css';

const MyModal = ({ children, visible, setVisible }) => {
  const rootClasses = [cl.myModal];

  if (visible) {
    rootClasses.push(cl.active);
  }

  return (    // модальне вікно зникає при натисканні не на нього, а stopPropagation забороняє виконати setVisible(false) на самому вікні
    <div className={rootClasses.join(' ')} onClick={() => setVisible(false)}>
      <div className={cl.myModalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default MyModal;